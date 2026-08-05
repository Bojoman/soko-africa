'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ProductImageUploader from '../../components/products/ProductImageUploader';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { FormAlert } from '../../components/forms/FormAlert';
import { productsApi, sellersApi } from '../../lib/api';

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'coffee',
  stock: '0',
  status: 'PUBLISHED',
  sellerId: '',
  imageUrls: []
};

export default function AdminProductsPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    sellersApi
      .list({ limit: '100' })
      .then((data) => {
        if (!active) return;
        const approved = data.sellers || [];
        setSellers(approved);
        setForm((current) => ({
          ...current,
          sellerId: current.sellerId || approved[0]?.id || ''
        }));
      })
      .catch(() => {
        if (active) setError('Could not load approved sellers.');
      })
      .finally(() => {
        if (active) setLoadingSellers(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.sellerId) {
      setError('Choose an approved seller for this product.');
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
    try {
      const product = await productsApi.create({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        stock: parseInt(form.stock, 10) || 0,
        status: form.status,
        sellerId: form.sellerId,
        imageUrls: form.imageUrls
      });
      setSuccess(`“${product.name}” was created successfully.`);
      setForm((current) => ({
        ...INITIAL_FORM,
        sellerId: current.sellerId
      }));
    } catch (err) {
      setError(err.message || 'Could not create product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-8">
          <Link
            href="/admin/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-soko-dark-teal hover:text-soko-orange"
          >
            <ArrowLeft size={16} />
            Admin dashboard
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-lg bg-orange-100 p-2 text-soko-orange">
                <PackagePlus size={24} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-soko-dark-teal">Add product</h1>
                <p className="text-sm text-gray-500">
                  Create a listing on behalf of an approved seller.
                </p>
              </div>
            </div>

            <FormAlert message={error} type="error" />
            <FormAlert message={success} type="success" />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium">Seller *</label>
                <select
                  required
                  disabled={loadingSellers}
                  value={form.sellerId}
                  onChange={(event) => update('sellerId', event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soko-orange"
                >
                  <option value="">
                    {loadingSellers ? 'Loading sellers…' : 'Choose an approved seller'}
                  </option>
                  {sellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.shopName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Name *</label>
                <input
                  required
                  maxLength={200}
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soko-orange"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description *</label>
                <textarea
                  required
                  maxLength={5000}
                  rows={4}
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soko-orange"
                />
              </div>

              <ProductImageUploader
                value={form.imageUrls}
                onChange={(imageUrls) => update('imageUrls', imageUrls)}
                onUploadingChange={setUploadingImages}
                disabled={saving}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Price (USD) *</label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    max="999999999.99"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => update('price', event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soko-orange"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    min="0"
                    max="999999"
                    value={form.stock}
                    onChange={(event) => update('stock', event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-soko-orange"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <select
                    value={form.category}
                    onChange={(event) => update('category', event.target.value)}
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
                  <label className="mb-1 block text-sm font-medium">Status</label>
                  <select
                    value={form.status}
                    onChange={(event) => update('status', event.target.value)}
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
                disabled={saving || uploadingImages || loadingSellers || !sellers.length}
                className="w-full rounded-xl bg-soko-orange py-3 font-bold text-white hover:bg-soko-dark-red disabled:opacity-60"
              >
                {uploadingImages
                  ? 'Uploading images…'
                  : saving
                    ? 'Creating…'
                    : 'Create product'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
