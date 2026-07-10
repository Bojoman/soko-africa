"use client";
import React, { use, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import ProductCard from '../../components/ui/ProductCard';
import WriteReviewModal from '../../components/ui/WriteReviewModal';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { get, post } from '../../lib/api';
import {
  formatMoney,
  getPrimaryCategoryLabel,
  getProductCardImage,
  getSellerLabel,
  PLACEHOLDER_PRODUCT_IMAGE,
  toProductPath
} from '../../lib/product-utils';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  Share2,
  Shield,
  ShoppingCart,
  Snowflake,
  Star,
  Truck,
  Zap
} from 'lucide-react';

function mapReviewFromApi(r) {
  return {
    id: r.id,
    name: r.author || 'Customer',
    rating: r.rating,
    verified: Boolean(r.verifiedPurchase),
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    title: r.title || '',
    comment: r.body
  };
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function normalizeProduct(api) {
  if (!api) return null;
  const images = (api.images || [])
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === 'string') return { url: entry, alt: api.name };
      if (entry.url) return { url: entry.url, alt: entry.alt || api.name };
      return null;
    })
    .filter(Boolean);

  if (images.length === 0) {
    images.push({ url: getProductCardImage(api), alt: api.name });
  }

  const priceNum = Number(api.price);
  const primaryCategoryLabel = getPrimaryCategoryLabel(api);
  const primaryCategorySlug =
    api.categories?.find((c) => c.isPrimary)?.slug ||
    api.categories?.[0]?.slug ||
    api.category ||
    null;

  return {
    ...api,
    images,
    price: Number.isFinite(priceNum) ? priceNum : 0,
    primaryCategoryLabel,
    primaryCategorySlug,
    sellerName:
      api.seller?.shopName ||
      api.sellerDisplayName ||
      getSellerLabel(api) ||
      'Verified seller',
    sellerLocation: api.seller?.location || '',
    sellerVerified: api.seller?.verificationStatus === 'APPROVED'
  };
}

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(resolvedParams.id)}`
        );
        if (!res.ok) {
          if (!cancelled) {
            setProduct(null);
            setNotFound(true);
          }
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setProduct(normalizeProduct(data));
        setSelectedImage(0);
        setQuantity(1);
      } catch {
        if (!cancelled) {
          setProduct(null);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  // Fetch reviews
  useEffect(() => {
    let cancelled = false;
    const id = resolvedParams.id;
    if (!id) return;
    (async () => {
      try {
        const r = await get(`/reviews/${encodeURIComponent(id)}`);
        if (!cancelled) setReviews((r.reviews || []).map(mapReviewFromApi));
      } catch {
        if (!cancelled) setReviews([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  // Fetch related products
  useEffect(() => {
    let cancelled = false;
    if (!product?.primaryCategorySlug) {
      setRelatedProducts([]);
      return;
    }
    (async () => {
      try {
        const params = new URLSearchParams({
          branchSlug: product.primaryCategorySlug,
          limit: '8'
        });
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('related failed');
        const data = await res.json();
        if (cancelled) return;
        const filtered = (data.products || []).filter((p) => p.id !== product.id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch {
        if (!cancelled) setRelatedProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.primaryCategorySlug]);

  const totalRating = useMemo(() => {
    if (!reviews.length) return null;
    return (
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    );
  }, [reviews]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || PLACEHOLDER_PRODUCT_IMAGE,
        slug: product.slug,
        seller: product.sellerName,
        category: product.primaryCategoryLabel,
        currency: product.currency
      },
      quantity,
      null
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    await toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      slug: product.slug
    });
  };

  const handleShare = async () => {
    if (typeof window === 'undefined' || !product) return;
    const url = `${window.location.origin}${toProductPath(product)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // ignore share cancellation
    }
  };

  const handleSubmitReview = async (newReview) => {
    const data = await post(
      `/reviews/${encodeURIComponent(resolvedParams.id)}`,
      {
        rating: newReview.rating,
        title: newReview.title,
        body: newReview.comment
      }
    );
    if (data.review) {
      setReviews((prev) => [mapReviewFromApi(data.review), ...prev]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-gray-200" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 rounded-xl bg-gray-200" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-9 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
              <div className="h-24 w-full bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-extrabold text-soko-dark-teal mb-3">
            Product not found
          </h1>
          <p className="text-gray-500 mb-8">
            The product you’re looking for may have been removed or is no longer
            available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
            >
              Browse products
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center px-5 py-2.5 rounded-xl border-2 border-soko-dark-teal text-soko-dark-teal hover:bg-soko-dark-teal hover:text-white font-bold transition-colors"
            >
              Explore categories
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const mainImage = product.images[selectedImage] || product.images[0];
  const inCart = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-soko-orange">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/products" className="hover:text-soko-orange">
            Products
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-soko-dark-teal font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Gallery */}
          <section className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  unoptimized={isHttpUrl(mainImage.url)}
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage((i) =>
                          i === 0 ? product.images.length - 1 : i - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full border border-gray-200 text-soko-dark-teal shadow-sm"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage((i) =>
                          i === product.images.length - 1 ? 0 : i + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full border border-gray-200 text-soko-dark-teal shadow-sm"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                {product.requiresColdChain && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-soko-bright-cyan/95 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    <Snowflake size={14} /> Cold chain
                  </span>
                )}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-soko-orange'
                        : 'border-gray-200 hover:border-soko-dark-teal/40'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={isHttpUrl(img.url)}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-soko-cream/60 text-soko-dark-teal text-xs font-bold uppercase tracking-wider">
                {product.primaryCategoryLabel}
              </span>
              {product.sellerVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-soko-dark-teal leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500">
              by{' '}
              <span className="font-semibold text-soko-dark-teal">
                {product.sellerName}
              </span>
              {product.sellerLocation && (
                <span className="text-gray-400"> · {product.sellerLocation}</span>
              )}
            </p>

            {totalRating != null && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(totalRating)
                          ? 'text-soko-orange fill-current'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold text-soko-dark-teal">
                  {totalRating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <div>
              <span className="text-4xl font-extrabold text-soko-dark-teal">
                {formatMoney(product.price, product.currency)}
              </span>
              <span className="ml-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">
                {product.currency || 'USD'}
              </span>
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t.id || t.slug || t.name}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-soko-cream/50 text-soko-dark-teal text-xs font-semibold"
                  >
                    {t.name || t.slug}
                  </span>
                ))}
              </div>
            )}

            {product.requiresColdChain && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-soko-bright-cyan/10 border border-soko-bright-cyan/30">
                <Snowflake size={18} className="text-soko-bright-cyan mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-soko-dark-teal">
                    Cold-chain shipping
                  </p>
                  <p className="text-xs text-gray-600">
                    This item ships under temperature control to preserve freshness.
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-soko-dark-teal uppercase tracking-wider">
                Qty
              </span>
              <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-soko-cream/40 text-soko-dark-teal"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-soko-dark-teal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="p-2 hover:bg-soko-cream/40 text-soko-dark-teal"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
              >
                <ShoppingCart size={18} />
                {inCart ? 'Update cart' : 'Add to cart'}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="inline-flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-soko-dark-teal text-soko-dark-teal hover:bg-soko-dark-teal hover:text-white font-bold transition-colors"
              >
                <Zap size={18} />
                Buy now
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 transition-colors ${
                  wishlisted
                    ? 'border-soko-dark-red bg-soko-dark-red/10 text-soko-dark-red'
                    : 'border-gray-200 text-gray-500 hover:border-soko-dark-red hover:text-soko-dark-red'
                }`}
              >
                <Heart size={18} className={wishlisted ? 'fill-current' : ''} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-soko-dark-teal hover:text-soko-dark-teal transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust block */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-soko-orange mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-soko-dark-teal">Fast shipping</p>
                  <p className="text-[11px] text-gray-500">
                    Free over $50
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-soko-dark-teal">Secure</p>
                  <p className="text-[11px] text-gray-500">Buyer protection</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCcw
                  size={16}
                  className="text-soko-bright-cyan mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-soko-dark-teal">Returns</p>
                  <p className="text-[11px] text-gray-500">30-day window</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Reviews */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-soko-dark-teal">
              Customer reviews
            </h2>
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold text-sm transition-colors"
            >
              Write a review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl text-center py-12 px-6">
              <Star size={44} className="mx-auto text-gray-300 mb-3" />
              <h3 className="font-bold text-soko-dark-teal mb-1">No reviews yet</h3>
              <p className="text-sm text-gray-500">
                Be the first to share your experience with this product.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6"
                >
                  <header className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-soko-orange/20 text-soko-orange font-bold flex items-center justify-center">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-soko-dark-teal">
                            {review.name}
                          </span>
                          {review.verified && (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < review.rating
                                    ? 'text-soko-orange fill-current'
                                    : 'text-gray-200'
                                }
                              />
                            ))}
                          </div>
                          {review.date && (
                            <span className="text-xs text-gray-400">
                              {review.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </header>
                  {review.title && (
                    <h4 className="font-semibold text-soko-dark-teal mb-1">
                      {review.title}
                    </h4>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-soko-dark-teal">
                  You might also like
                </h2>
                <p className="text-sm text-gray-500">
                  More from {product.primaryCategoryLabel.toLowerCase()}
                </p>
              </div>
              <Link
                href={`/search?category=${encodeURIComponent(
                  product.primaryCategorySlug || ''
                )}`}
                className="hidden sm:inline-flex items-center text-sm font-semibold text-soko-orange hover:text-soko-dark-red"
              >
                See all <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <WriteReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        product={product}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
