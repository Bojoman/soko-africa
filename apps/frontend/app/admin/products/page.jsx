'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ProductForm, {
  EMPTY_PRODUCT_FORM,
  toProductPayload
} from '../../components/products/ProductForm';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { FormAlert } from '../../components/forms/FormAlert';
import { productsApi, sellersApi } from '../../lib/api';

// Shares the seller form's shape (including the unit fields) and adds the
// admin-only seller picker.
const INITIAL_FORM = {
  ...EMPTY_PRODUCT_FORM,
  stock: '0',
  sellerId: ''
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
        ...toProductPayload(form),
        sellerId: form.sellerId
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

            <ProductForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              saving={saving}
              uploadingImages={uploadingImages}
              setUploadingImages={setUploadingImages}
              submitLabel="Create product"
              leadingFields={
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
              }
            />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
