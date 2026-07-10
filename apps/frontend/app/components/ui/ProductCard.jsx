"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import {
  getProductCardImage,
  formatProductPrice,
  getPrimaryCategoryLabel,
  getSellerLabel,
  toProductPath,
  getProductBadge,
  PLACEHOLDER_PRODUCT_IMAGE
} from '@/lib/product-utils';

const ProductCard = ({ 
  product,
  className = "text-orange-600",
  showWishlist = true,
  showAddToCart = true,
  imageSize = { width: 300, height: 400 } 
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => getProductCardImage(product));

  useEffect(() => {
    setImageSrc(getProductCardImage(product));
  }, [product]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist({
      id: product.id,
      name: product.name,
      price:
        typeof product.price === 'number'
          ? product.price
          : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0,
      image: getProductCardImage(product),
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge
    });
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(
        {
          id: product.id,
          name: product.name,
          price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0,
          image: getProductCardImage(product),
          slug: product.slug,
          seller: getSellerLabel(product),
          category: getPrimaryCategoryLabel(product),
          currency: product.currency
        },
        1,
        null
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) 
            ? "text-soko-orange fill-current" 
            : "text-soko-cream"
        }`}
      />
    ));
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (typeof price === 'number') return formatProductPrice({ price, currency: product.currency });
    return formatProductPrice(product);
  };

  const getPriceValue = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    return 0;
  };

  const badgeLabel = product.badge || getProductBadge(product);
  const categoryLabel = getPrimaryCategoryLabel(product);
  const sellerLabel = getSellerLabel(product);
  const productHref = toProductPath(product);

  const calculateDiscount = () => {
    if (!product.originalPrice) return 0;
    const original = getPriceValue(product.originalPrice);
    const current = getPriceValue(product.price);
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group",
      className
    )}>
      <Link href={productHref} className="block">
        {/* Image Section */}
        <div className="relative overflow-hidden aspect-4/5">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={typeof imageSrc === 'string' && imageSrc.startsWith('http')}
            onError={() => setImageSrc(PLACEHOLDER_PRODUCT_IMAGE)}
          />
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
          
          {/* Product Badge */}
          {badgeLabel && (
            <Badge className="absolute top-4 left-4 bg-soko-orange hover:bg-soko-orange text-white border-none px-3 py-1 rounded-full font-bold">
              {badgeLabel}
            </Badge>
          )}
          
          {/* Discount Badge */}
          {product.originalPrice && calculateDiscount() > 0 && (
            <Badge variant="destructive" className="absolute top-4 right-4 px-2 py-1 rounded-lg font-bold">
              -{calculateDiscount()}%
            </Badge>
          )}
          
          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={cn(
                "absolute bottom-4 right-4 p-2.5 rounded-full shadow-md transition-all duration-300",
                isWishlisted(product.id)
                  ? "bg-soko-dark-red text-white"
                  : "bg-white/90 text-soko-dark-red hover:bg-white"
              )}
              aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={18}
                className={isWishlisted(product.id) ? "fill-current" : ""}
              />
            </button>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          <div className="mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              {categoryLabel}
            </span>
          </div>
          
          <h3 className="font-bold text-base text-soko-dark-teal line-clamp-1 mb-1 group-hover:text-soko-orange transition-colors">
            {product.name}
          </h3>
          
          {sellerLabel && (
            <p className="text-xs text-gray-500 mb-3">
              by <span className="font-medium text-gray-700">{sellerLabel}</span>
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-soko-dark-teal">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                <Star size={12} className="text-soko-orange fill-current" />
                <span className="text-xs font-bold text-soko-dark-teal">{product.rating}</span>
              </div>
            )}
          </div>
          
          {showAddToCart && (
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full mt-4 bg-soko-dark-teal hover:bg-soko-dark-teal/90 text-white rounded-xl h-10 font-bold"
            >
              {isLoading ? "Adding..." : "Add to cart"}
            </Button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
