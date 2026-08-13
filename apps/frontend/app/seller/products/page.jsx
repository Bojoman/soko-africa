"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi } from '../../lib/api';
import { FormAlert } from '../../components/forms/FormAlert';
import ProductForm, {
  EMPTY_PRODUCT_FORM,
  toProductForm,
  toProductPayload
} from '../../components/products/ProductForm';
import {
  formatQuantity,
  formatUnitPrice
} from '../../lib/product-utils';
import { Plus, Search, Filter, Edit, Trash2, Eye, X } from 'lucide-react';

function statusUi(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'PUBLISHED') return { label: 'active', className: 'bg-green-100 text-green-800' };
  if (s === 'DRAFT') return { label: 'draft', className: 'bg-yellow-100 text-yellow-800' };
  return { label: 'inactive', className: 'bg-red-100 text-red-800' };
}

export default function SellerProductsPage() {
  const { user, hasRole, refreshUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const sellerId = user?.sellerProfile?.id;
  const needsShopSetup = hasRole('seller') && !sellerId;

  useEffect(() => {
    refreshUser();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.listMine();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const ui = statusUi(p.status).label;
    const matchStatus = statusFilter === 'all' || ui === statusFilter;
    return matchSearch && matchStatus;
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_PRODUCT_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm(toProductForm(product));
    setError('');
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (needsShopSetup) {
      setError('Complete your seller shop setup before listing products.');
      return;
    }
    if (uploadingImages) {
      setError('Please wait for the image upload to finish.');
      return;
    }
    if (!editing && !form.imageUrls.length) {
      setError('Add at least one product image.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = toProductPayload(form);
      if (editing) {
        await productsApi.update(editing.id, payload);
      } else {
        // sellerId is resolved server-side from the authenticated seller profile.
        await productsApi.create(payload);
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Remove "${product.name}" from your catalog?`)) return;
    try {
      await productsApi.remove(product.id);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-soko-dark-teal">My Products</h1>
              <p className="text-gray-500 text-sm mt-1">{user?.sellerProfile?.shopName}</p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              disabled={needsShopSetup}
              className="bg-soko-orange text-white px-4 py-2 rounded-lg flex items-center font-semibold hover:bg-soko-dark-red disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </button>
          </div>

          {needsShopSetup && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Your account shows as a seller, but your shop profile is not set up yet.{' '}
              <Link href="/sell?apply=true" className="font-semibold text-soko-orange hover:underline">
                Complete seller setup
              </Link>{' '}
              to list products and upload images.
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-soko-orange"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            {loading ? (
              <p className="p-6 text-gray-500">Loading products…</p>
            ) : filtered.length === 0 ? (
              <p className="p-6 text-gray-500">No products match your filters.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 text-left text-soko-dark-teal">Product</th>
                    <th className="p-4 text-left text-soko-dark-teal">Price</th>
                    <th className="p-4 text-left text-soko-dark-teal">Stock</th>
                    <th className="p-4 text-left text-soko-dark-teal">Sold by</th>
                    <th className="p-4 text-left text-soko-dark-teal">Status</th>
                    <th className="p-4 text-left text-soko-dark-teal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const st = statusUi(product.status);
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-soko-dark-teal">{product.name}</td>
                        {/* Was a hardcoded "$" on a marketplace that also
                            trades in KES; formatUnitPrice uses the listing's
                            own currency and adds the unit suffix. */}
                        <td className="p-4">{formatUnitPrice(product)}</td>
                        <td className="p-4">
                          {formatQuantity(product.stock, product, { force: true })}
                        </td>
                        <td className="p-4 capitalize text-gray-600">
                          {String(product.saleUnit || 'PIECE').toLowerCase()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${st.className}`}>{st.label}</span>
                        </td>
                        <td className="p-4 flex space-x-2">
                          <Link href={`/products/${product.slug || product.id}`} className="text-soko-orange p-1" title="View">
                            <Eye size={18} />
                          </Link>
                          <button type="button" onClick={() => openEdit(product)} className="text-soko-dark-teal p-1" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button type="button" onClick={() => handleDelete(product)} className="text-red-600 p-1" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
        <Footer />

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-soko-dark-teal">
                  {editing ? 'Edit product' : 'Add product'}
                </h2>
                <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <FormAlert message={error} type="error" />
              <ProductForm
                form={form}
                setForm={setForm}
                onSubmit={handleSave}
                saving={saving}
                uploadingImages={uploadingImages}
                setUploadingImages={setUploadingImages}
                editing={editing}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
