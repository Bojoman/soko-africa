"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi } from '../../lib/api';
import { FormAlert } from '../../components/forms/FormAlert';
import ProductImageUploader from '../../components/products/ProductImageUploader';
import { Plus, Search, Filter, Edit, Trash2, Eye, X } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'coffee',
  stock: '50',
  status: 'PUBLISHED',
  imageUrls: []
};

function statusUi(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'PUBLISHED') return { label: 'active', className: 'bg-green-100 text-green-800' };
  if (s === 'DRAFT') return { label: 'draft', className: 'bg-yellow-100 text-yellow-800' };
  return { label: 'inactive', className: 'bg-red-100 text-red-800' };
}

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const sellerId = user?.sellerProfile?.id;

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
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || product.name,
      price: String(product.price),
      category: product.category || 'coffee',
      stock: String(product.stock ?? 0),
      status: product.status || 'PUBLISHED',
      imageUrls: (product.images || []).map((image) => image.url).filter(Boolean)
    });
    setError('');
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!sellerId) {
      setError('Seller profile required');
      return;
    }
    if (uploadingImages) {
      setError('Please wait for the image upload to finish.');
      return;
    }
    if (!form.imageUrls.length) {
      setError('Add at least one product image.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock, 10) || 0,
        status: form.status,
        imageUrls: form.imageUrls
      };
      if (editing) {
        // An update must not carry sellerId: ownership is fixed at creation and
        // the update schema rejects the field outright.
        await productsApi.update(editing.id, payload);
      } else {
        await productsApi.create({ ...payload, sellerId });
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
              className="bg-soko-orange text-white px-4 py-2 rounded-lg flex items-center font-semibold hover:bg-soko-dark-red"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </button>
          </div>

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
                        <td className="p-4">${Number(product.price).toFixed(2)}</td>
                        <td className="p-4">{product.stock}</td>
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
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-soko-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-soko-orange focus:outline-none"
                  />
                </div>
                <ProductImageUploader
                  value={form.imageUrls}
                  onChange={(imageUrls) => setForm((current) => ({ ...current, imageUrls }))}
                  onUploadingChange={setUploadingImages}
                  disabled={saving}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (USD) *</label>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-soko-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-soko-orange focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      <option value="coffee">Coffee</option>
                      <option value="tea">Tea</option>
                      <option value="spices">Spices</option>
                      <option value="textiles">Textiles</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="pears">Pears</option>
                      <option value="plums">Plums</option>
                      <option value="macadamia">Macadamia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="w-full py-3 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red disabled:opacity-60"
                >
                  {uploadingImages
                    ? 'Uploading images…'
                    : saving
                      ? 'Saving…'
                      : editing
                        ? 'Update product'
                        : 'Create product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
