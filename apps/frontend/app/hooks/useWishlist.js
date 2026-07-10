"use client";
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/utils';
import { getProductCardImage } from '../lib/product-utils';
import { get, apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const WISHLIST_STORAGE_KEY = 'sokoafrica_wishlist';

function normalizeFromServerItem(entry) {
  const p = entry.product;
  if (!p) return null;
  const price =
    p.price != null && !Number.isNaN(Number(p.price)) ? Number(p.price) : 0;
  return {
    id: p.id,
    name: p.name,
    price,
    currency: p.currency,
    slug: p.slug,
    image: getProductCardImage(p),
    seller: p.seller?.shopName || '',
    rating: p.rating,
    reviews: p.reviews,
    badge: p.badge,
    addedAt: entry.createdAt || new Date().toISOString()
  };
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadLocal = useCallback(() => {
    return storage.get(WISHLIST_STORAGE_KEY) || [];
  }, []);

  const persistLocal = useCallback((list) => {
    storage.set(WISHLIST_STORAGE_KEY, list);
  }, []);

  const refreshFromServer = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const data = await get('/wishlist');
      const items = (data.items || [])
        .map(normalizeFromServerItem)
        .filter(Boolean);
      setWishlist(items);
      return items;
    } catch {
      return null;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        const ok = await refreshFromServer();
        if (!cancelled && ok == null) {
          setWishlist(loadLocal());
        }
      } else {
        setWishlist(loadLocal());
      }
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadLocal, refreshFromServer, isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      persistLocal(wishlist);
    }
  }, [wishlist, isLoading, persistLocal, isAuthenticated]);

  const addToWishlist = useCallback(
    async (product) => {
      if (!product?.id) return;
      if (isAuthenticated) {
        try {
          const res = await apiClient(`/wishlist/${encodeURIComponent(product.id)}`, {
            method: 'POST'
          });
          if (res.ok) {
            await refreshFromServer();
            return;
          }
        } catch {
          /* fall through to local */
        }
      }
      setWishlist((current) => {
        if (current.some((item) => item.id === product.id)) return current;
        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || getProductCardImage(product),
            rating: product.rating,
            reviews: product.reviews,
            badge: product.badge,
            addedAt: new Date().toISOString()
          }
        ];
      });
    },
    [refreshFromServer, isAuthenticated]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          const res = await apiClient(
            `/wishlist/${encodeURIComponent(productId)}`,
            { method: 'DELETE' }
          );
          if (res.ok) {
            await refreshFromServer();
            return;
          }
        } catch {
          /* fall through */
        }
      }
      setWishlist((current) => current.filter((item) => item.id !== productId));
    },
    [refreshFromServer, isAuthenticated]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product?.id) return;
      const exists = wishlist.some((item) => item.id === product.id);
      if (exists) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(async () => {
    if (isAuthenticated) {
      for (const item of wishlist) {
        try {
          await apiClient(`/wishlist/${encodeURIComponent(item.id)}`, {
            method: 'DELETE'
          });
        } catch {
          /* ignore */
        }
      }
      await refreshFromServer();
    }
    setWishlist([]);
  }, [wishlist, refreshFromServer, isAuthenticated]);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  const getWishlistCount = useCallback(() => wishlist.length, [wishlist]);

  const moveToCart = useCallback(
    (productId, addToCartFunction) => {
      const item = wishlist.find((i) => i.id === productId);
      if (item && addToCartFunction) {
        addToCartFunction(item, 1);
        removeFromWishlist(productId);
      }
    },
    [wishlist, removeFromWishlist]
  );

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    isWishlisted: isInWishlist,
    getWishlistCount,
    moveToCart,
    isEmpty: wishlist.length === 0,
    count: getWishlistCount()
  };
}
