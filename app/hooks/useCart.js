"use client";
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/utils';

const CART_STORAGE_KEY = 'sokoafrica_cart';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get(CART_STORAGE_KEY) || [];
    setCart(savedCart);
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      storage.set(CART_STORAGE_KEY, cart);
    }
  }, [cart, isLoading]);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1, selectedVariant = null) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(
        item => item.id === product.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // New item, add to cart
        return [...currentCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          selectedVariant,
          addedAt: new Date().toISOString(),
        }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId, selectedVariant = null) => {
    setCart(currentCart =>
      currentCart.filter(item => 
        !(item.id === productId && 
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant))
      )
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity, selectedVariant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item => {
        if (item.id === productId && 
            JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Get cart item count
  const getItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace('$', '')) 
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  // Check if item is in cart
  const isInCart = useCallback((productId, selectedVariant = null) => {
    return cart.some(item => 
      item.id === productId && 
      JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
    );
  }, [cart]);

  // Get specific cart item
  const getCartItem = useCallback((productId, selectedVariant = null) => {
    return cart.find(item => 
      item.id === productId && 
      JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
    );
  }, [cart]);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getCartTotal,
    isInCart,
    getCartItem,
    isEmpty: cart.length === 0,
    itemCount: getItemCount(),
    total: getCartTotal(),
  };
}
