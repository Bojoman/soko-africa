"use client";

import { useMemo } from 'react';
import {
  MEASURE_UNITS,
  SALE_UNIT_GROUPS,
  UNITS,
  getUnit,
  isDiscrete,
  validateUnitSpec
} from '@soko/units';

import ProductImageUploader from './ProductImageUploader';
import { formatComparisonPrice, formatMoney } from '../../lib/product-utils';

export const EMPTY_PRODUCT_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'coffee',
  stock: '50',
  status: 'PUBLISHED',
  imageUrls: [],
  // Defaults reproduce the pre-units behaviour exactly: whole pieces, one at
  // a time, one minimum.
  saleUnit: 'PIECE',
  quantityStep: '1',
  minOrderQuantity: '1',
  maxOrderQuantity: '',
  netContentValue: '',
  netContentUnit: ''
};

const CATEGORIES = [
  'coffee',
  'tea',
  'spices',
  'textiles',
  'jewelry',
  'pears',
  'plums',
  'macadamia'
];

/** Form state -> the API payload shape. */
export function toProductPayload(form) {
  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    price: parseFloat(form.price),
    category: form.category,
    // Fractional now — a listing can hold 12.5 kg.
    stock: Number(form.stock) || 0,
    status: form.status,
    saleUnit: form.saleUnit,
    quantityStep: Number(form.quantityStep) || 1,
    minOrderQuantity: Number(form.minOrderQuantity) || 1,
    maxOrderQuantity: form.maxOrderQuantity === '' ? null : Number(form.maxOrderQuantity),
    netContentValue: form.netContentValue === '' ? null : Number(form.netContentValue),
    netContentUnit: form.netContentUnit === '' ? null : form.netContentUnit
  };
  if (form.imageUrls.length) payload.imageUrls = form.imageUrls;
  return payload;
}

/** An API product -> form state. */
export function toProductForm(product) {
  const imageUrls = (product.images || [])
    .map((image) => (typeof image === 'string' ? image : image?.url))
    .filter(Boolean);

  return {
    name: product.name,
    description: product.description || product.name,
    price: String(product.price),
    category: product.category || 'coffee',
    stock: String(product.stock ?? 0),
    status: product.status || 'PUBLISHED',
    imageUrls: imageUrls.length ? imageUrls : product.image ? [product.image] : [],
    saleUnit: product.saleUnit || 'PIECE',
    quantityStep: String(product.quantityStep ?? 1),
    minOrderQuantity: String(product.minOrderQuantity ?? 1),
    maxOrderQuantity:
      product.maxOrderQuantity == null ? '' : String(product.maxOrderQuantity),
    netContentValue:
      product.netContentValue == null ? '' : String(product.netContentValue),
    netContentUnit: product.netContentUnit || ''
  };
}

const inputClass =
  'w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-soko-orange focus:outline-none';

/**
 * Shared create/edit form for the seller and admin catalogs.
 *
 * Extracted from two near-identical copies — the unit fields below would
 * otherwise have had to be written and maintained twice.
 */
export default function ProductForm({
  form,
  setForm,
  onSubmit,
  saving,
  uploadingImages,
  setUploadingImages,
  editing,
  submitLabel,
  /** Extra fields rendered above the shared ones (admin's seller picker). */
  leadingFields = null
}) {
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const unit = getUnit(form.saleUnit);
  const discrete = isDiscrete(form.saleUnit);

  // Same validator the API runs, so the seller sees the problem before the
  // request rather than as an opaque 400.
  const unitErrors = useMemo(() => validateUnitSpec(toProductPayload(form)), [form]);
  const errorFor = (field) => unitErrors.find((e) => e.field === field)?.message;

  // Live preview of what a buyer will see, which is the quickest way for a
  // seller to notice they priced per crate when they meant per kilogram.
  const preview = useMemo(() => {
    const price = parseFloat(form.price);
    if (!Number.isFinite(price)) return null;
    const money = formatMoney(price, 'USD');
    const suffix = unit.omitLabel ? '' : ` /${unit.short}`;
    const comparison = formatComparisonPrice({
      ...toProductPayload(form),
      price,
      currency: 'USD'
    });
    return { headline: `${money}${suffix}`, comparison };
  }, [form, unit]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {leadingFields}

      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          className={inputClass}
        />
      </div>

      <ProductImageUploader
        value={form.imageUrls}
        onChange={(imageUrls) => set({ imageUrls })}
        onUploadingChange={setUploadingImages}
        disabled={saving}
      />

      {/* ---------------------------------------------------------------- */}
      {/* How the product is sold                                          */}
      {/* ---------------------------------------------------------------- */}
      <fieldset className="rounded-xl border border-gray-200 p-4 space-y-4">
        <legend className="px-1 text-sm font-bold text-soko-dark-teal">
          How you sell it
        </legend>

        <div>
          <label className="block text-sm font-medium mb-1">Sold by *</label>
          <select
            value={form.saleUnit}
            onChange={(e) => {
              const next = e.target.value;
              // Switching to a measure unit clears pack contents, which only
              // make sense on a countable unit ("a 2 kg crate", not "a
              // kilogram containing 2 kg").
              const nowDiscrete = isDiscrete(next);
              set({
                saleUnit: next,
                ...(nowDiscrete
                  ? { quantityStep: '1', minOrderQuantity: '1' }
                  : { netContentValue: '', netContentUnit: '' })
              });
            }}
            className={inputClass}
          >
            {SALE_UNIT_GROUPS.map((group) => (
              <optgroup key={group.kind} label={`${group.label} — ${group.hint}`}>
                {group.units.map((code) => (
                  <option key={code} value={code}>
                    {UNITS[code].singular}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {discrete
              ? `Buyers order whole ${unit.plural}. Your price is per ${unit.singular}.`
              : `Buyers can order part amounts. Your price is per ${unit.singular}.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Sold in steps of
            </label>
            <input
              type="number"
              min="0"
              step={discrete ? '1' : '0.001'}
              value={form.quantityStep}
              onChange={(e) => set({ quantityStep: e.target.value })}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-500">
              e.g. 0.5 to sell in half-{unit.plural}
            </p>
            {errorFor('quantityStep') && (
              <p className="mt-1 text-xs text-red-600">{errorFor('quantityStep')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum order</label>
            <input
              type="number"
              min="0"
              step={discrete ? '1' : '0.001'}
              value={form.minOrderQuantity}
              onChange={(e) => set({ minOrderQuantity: e.target.value })}
              className={inputClass}
            />
            {errorFor('minOrderQuantity') && (
              <p className="mt-1 text-xs text-red-600">
                {errorFor('minOrderQuantity')}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum per order <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            min="0"
            step={discrete ? '1' : '0.001'}
            value={form.maxOrderQuantity}
            onChange={(e) => set({ maxOrderQuantity: e.target.value })}
            placeholder="No limit"
            className={inputClass}
          />
          {errorFor('maxOrderQuantity') && (
            <p className="mt-1 text-xs text-red-600">{errorFor('maxOrderQuantity')}</p>
          )}
        </div>

        {/* Pack contents only apply to countable units. */}
        {discrete && (
          <div>
            <label className="block text-sm font-medium mb-1">
              What&apos;s in one {unit.singular}?{' '}
              <span className="text-gray-400">(optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                min="0"
                step="0.001"
                value={form.netContentValue}
                onChange={(e) => set({ netContentValue: e.target.value })}
                placeholder="e.g. 2"
                className={inputClass}
              />
              <select
                value={form.netContentUnit}
                onChange={(e) => set({ netContentUnit: e.target.value })}
                className={inputClass}
              >
                <option value="">—</option>
                {MEASURE_UNITS.map((code) => (
                  <option key={code} value={code}>
                    {UNITS[code].plural}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Lets shoppers compare your price against loose listings.
            </p>
            {(errorFor('netContentValue') || errorFor('netContentUnit')) && (
              <p className="mt-1 text-xs text-red-600">
                {errorFor('netContentValue') || errorFor('netContentUnit')}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Price per {unit.singular} (USD) *
          </label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(e) => set({ price: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock ({unit.plural})
          </label>
          <input
            type="number"
            min="0"
            step={discrete ? '1' : '0.001'}
            value={form.stock}
            onChange={(e) => set({ stock: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {preview && (
        <p className="text-sm text-gray-600">
          Shoppers will see{' '}
          <span className="font-bold text-soko-dark-teal">{preview.headline}</span>
          {preview.comparison && <> · {preview.comparison}</>}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set({ category: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => set({ status: e.target.value })}
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
        disabled={saving || uploadingImages || unitErrors.length > 0}
        className="w-full py-3 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red disabled:opacity-60"
      >
        {uploadingImages
          ? 'Uploading images…'
          : saving
            ? 'Saving…'
            : submitLabel || (editing ? 'Update product' : 'Create product')}
      </button>
    </form>
  );
}
