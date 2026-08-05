'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import {
  formatProductPrice,
  getProductCardImage,
  getSellerLabel,
  PLACEHOLDER_PRODUCT_IMAGE,
  toProductPath
} from '../../lib/product-utils';

function SuggestionThumb({ product }) {
  const [src, setSrc] = useState(() => getProductCardImage(product));

  useEffect(() => {
    setSrc(getProductCardImage(product));
  }, [product]);

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="44px"
      className="object-cover"
      onError={() => setSrc(PLACEHOLDER_PRODUCT_IMAGE)}
    />
  );
}

export default function NavSearch({
  id,
  value,
  onChange,
  onSubmitSearch,
  placeholder = 'Search products, categories, sellers...',
  inputClassName = '',
  onNavigate
}) {
  const router = useRouter();
  const listboxId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { suggestions, isLoading, minQueryLength } = useSearchSuggestions(value);

  const q = String(value || '').trim();
  const showPanel = open && q.length >= minQueryLength;

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions, value]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const goToProduct = (product) => {
    setOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
    router.push(toProductPath(product));
  };

  const submitQuery = () => {
    setOpen(false);
    setActiveIndex(-1);
    onSubmitSearch?.(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToProduct(suggestions[activeIndex]);
      return;
    }
    submitQuery();
  };

  const handleKeyDown = (event) => {
    if (!showPanel && !['ArrowDown', 'Escape'].includes(event.key)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      if (!suggestions.length) return;
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!suggestions.length) return;
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }
  };

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      className="relative w-full"
      role="search"
      autoComplete="off"
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        enterKeyHint="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md bg-soko-orange p-1.5 text-white transition-colors hover:bg-soko-dark-red sm:p-2"
      >
        {isLoading && open ? (
          <Loader2 size={16} className="animate-spin sm:h-5 sm:w-5" />
        ) : (
          <Search size={16} className="sm:h-5 sm:w-5" />
        )}
      </button>

      {showPanel && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {isLoading && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              No matches for &ldquo;{q}&rdquo;
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((product, index) => {
                const active = index === activeIndex;
                return (
                  <li key={product.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      id={`${listboxId}-option-${index}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToProduct(product)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        active ? 'bg-soko-cream/70' : 'hover:bg-soko-cream/50'
                      }`}
                    >
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <SuggestionThumb product={product} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-soko-dark-teal">
                          {product.name}
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                          {getSellerLabel(product) ||
                            product.category ||
                            'Marketplace'}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-medium text-soko-orange">
                        {formatProductPrice(product)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {q && (
            <button
              type="button"
              onClick={submitQuery}
              className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm font-semibold text-soko-dark-teal hover:bg-soko-cream/40"
            >
              <Search size={14} className="text-soko-orange" />
              Search all results for &ldquo;{q}&rdquo;
            </button>
          )}
        </div>
      )}
    </form>
  );
}
