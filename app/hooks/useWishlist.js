"use client";
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/utils';

const WISHLIST_STORAGE_KEY = 'sokoafrica_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = storage.get(WISHLIST_STORAGE_KEY) || [];
    setWishlist(savedWishlist);
    setIsLoading(false);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      storage.set(WISHLIST_STORAGE_KEY, wishlist);
    }
  }, [wishlist, isLoading]);

  // Add item to wishlist
  const addToWishlist = useCallback((product) => {
    setWishlist(currentWishlist => {
      const isAlreadyInWishlist = currentWishlist.some(item => item.id === product.id);
      
      if (isAlreadyInWishlist) {
        return currentWishlist;
      }

      return [...currentWishlist, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
        addedAt: new Date().toISOString(),
      }];
    });
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlist(currentWishlist =>
      currentWishlist.filter(item => item.id !== productId)
    );
  }, []);

  // Toggle item in wishlist
  const toggleWishlist = useCallback((product) => {
    setWishlist(currentWishlist => {
      const isInWishlist = currentWishlist.some(item => item.id === product.id);
      
      if (isInWishlist) {
        return currentWishlist.filter(item => item.id !== product.id);
      } else {
        return [...currentWishlist, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
          addedAt: new Date().toISOString(),
        }];
      }
    });
  }, []);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlist.length;
  }, [wishlist]);

  // Move item from wishlist to cart
  const moveToCart = useCallback((productId, addToCartFunction) => {
    const item = wishlist.find(item => item.id === productId);
    if (item && addToCartFunction) {
      addToCartFunction(item, 1);
      removeFromWishlist(productId);
    }
  }, [wishlist, removeFromWishlist]);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    isWishlisted: isInWishlist, // Add alias for backward compatibility
    getWishlistCount,
    moveToCart,
    isEmpty: wishlist.length === 0,
    count: getWishlistCount(),
  };
}
