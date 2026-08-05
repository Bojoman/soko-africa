'use client';

import Image from 'next/image';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadsApi } from '../../lib/api';

export const MAX_PRODUCT_IMAGES = 12;
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ProductImageUploader({
  value = [],
  onChange,
  onUploadingChange,
  disabled = false
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    setError('');
    if (!files.length) return;

    if (value.length + files.length > MAX_PRODUCT_IMAGES) {
      setError(`You can upload up to ${MAX_PRODUCT_IMAGES} images per product.`);
      return;
    }

    const invalidType = files.find((file) => !ALLOWED_TYPES.has(file.type));
    if (invalidType) {
      setError(`${invalidType.name}: only JPG, PNG, and WebP images are allowed.`);
      return;
    }

    const oversized = files.find((file) => file.size > MAX_PRODUCT_IMAGE_BYTES);
    if (oversized) {
      setError(`${oversized.name}: each image must be 5 MB or smaller.`);
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);
    try {
      const next = [...value];
      for (const file of files) {
        const uploaded = await uploadsApi.productImage(file);
        next.push(uploaded.url);
        onChange(next.slice());
      }
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  function removeImage(index) {
    onChange(value.filter((_, imageIndex) => imageIndex !== index));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium">Product images *</label>
        <span className="text-xs text-gray-500">
          {value.length}/{MAX_PRODUCT_IMAGES}
        </span>
      </div>

      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 30vw, 120px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled || uploading}
                aria-label={`Remove product image ${index + 1}`}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-red-600 disabled:opacity-50"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled || uploading || value.length >= MAX_PRODUCT_IMAGES}
        onChange={handleFiles}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading || value.length >= MAX_PRODUCT_IMAGES}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-5 text-sm font-semibold text-gray-600 transition hover:border-soko-orange hover:text-soko-orange disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <ImagePlus size={18} />
            Select product images
          </>
        )}
      </button>
      <p className="mt-1.5 text-xs text-gray-500">
        JPG, PNG, or WebP. Maximum 5 MB each and {MAX_PRODUCT_IMAGES} images.
        The first image is the main product image.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
