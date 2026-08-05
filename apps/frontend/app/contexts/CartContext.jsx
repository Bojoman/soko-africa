"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { storage } from '../lib/utils';
import { get, apiClient } from '../lib/api';
import { useAuth } from './AuthContext';
import { getProductCardImage } from '../lib/product-utils';
import {
  COUPON_STORAGE_KEY,
  clearGuestCart,
  isValidProductId,
  loadGuestCart,
  saveGuestCart,
  sanitizeGuestCartItem
} from '../lib/cart-storage';

const CartContext = createContext(null);

function normalizeServerItem(entry) {
  const variant = entry.variant;
  const product = variant?.product;
  if (!product) return null;

  const price =
    variant.price != null && !Number.isNaN(Number(variant.price))
      ? Number(variant.price)
      : Number(product.price) || 0;

  return {
    id: product.id,
    cartItemId: entry.id,
    variantId: variant.id,
    name: product.name,
    price,
    currency: product.currency,
    slug: product.slug,
    image: product.images?.[0]?.url || getProductCardImage(product),
    seller: product.seller?.shopName || '',
    category: product.category || 'Marketplace',
    quantity: entry.quantity,
    selectedVariant: null,
    addedAt: entry.createdAt || new Date().toISOString()
  };
}

function variantKey(selectedVariant) {
  return selectedVariant == null ? '' : JSON.stringify(selectedVariant);
}

function applyServerCart(data, setCart) {
  if (!data?.cart?.items) return false;
  const items = data.cart.items.map(normalizeServerItem).filter(Boolean);
  setCart(items);
  return true;
}

async function readApiError(res) {
  const body = await res.json().catch(() => ({}));
  return body?.message || `Request failed (${res.status})`;
}

function findCartLine(cart, productId, selectedVariant = null) {
  const key = variantKey(selectedVariant);
  return cart.find(
    (item) => item.id === productId && variantKey(item.selectedVariant) === key
  );
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedCoupon, setAppliedCouponState] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const prevAuthenticatedRef = useRef(undefined);
  const reconcileGenRef = useRef(0);
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const refreshFromServer = useCallback(async () => {
    try {
      const data = await get('/cart');
      const items = (data.cart?.items || [])
        .map(normalizeServerItem)
        .filter(Boolean);
      return items;
    } catch {
      return null;
    }
  }, []);

  const syncLocalToServer = useCallback(async (localItems) => {
    if (!localItems?.length) return;
    const payload = {
      items: localItems.map((item) => ({
        productId: item.id,
        quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1))
      }))
    };

    try {
      const res = await apiClient('/cart/sync', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) return;
    } catch {
      /* fall through to per-item */
    }

    for (const item of localItems) {
      if (!isValidProductId(item.id)) continue;
      try {
        await apiClient('/cart/items', {
          method: 'POST',
          body: JSON.stringify({
            productId: item.id,
            quantity: Math.max(1, Number(item.quantity) || 1)
          })
        });
      } catch {
        /* best effort */
      }
    }
  }, []);

  // Hydrate guest cart immediately on client (survives refresh before auth resolves)
  useEffect(() => {
    const saved = loadGuestCart();
    if (saved.length) setCart(saved);

    const savedCoupon = storage.get(COUPON_STORAGE_KEY);
    if (savedCoupon) setAppliedCouponState(savedCoupon);
  }, []);

  // Reconcile with server when auth state is known
  useEffect(() => {
    if (authLoading) return;

    const gen = ++reconcileGenRef.current;
    let cancelled = false;

    (async () => {
      setIsLoading(true);

      const wasAuthenticated = prevAuthenticatedRef.current;
      const justLoggedIn = wasAuthenticated === false && isAuthenticated;
      prevAuthenticatedRef.current = isAuthenticated;

      if (isAuthenticated) {
        const localSnapshot = loadGuestCart();
        let serverItems = await refreshFromServer();
        if (cancelled || gen !== reconcileGenRef.current) return;

        if (serverItems === null) {
          // Keep existing cart on transient errors (do not wipe on refresh)
          setIsLoading(false);
          return;
        }

        const serverIds = new Set(serverItems.map((i) => i.id));
        const localOnly = localSnapshot.filter((li) => !serverIds.has(li.id));

        if (justLoggedIn && localSnapshot.length > 0) {
          await syncLocalToServer(localSnapshot);
          if (cancelled || gen !== reconcileGenRef.current) return;
          const merged = await refreshFromServer();
          if (merged !== null) serverItems = merged;
        } else if (localOnly.length > 0) {
          await syncLocalToServer(localOnly);
          if (cancelled || gen !== reconcileGenRef.current) return;
          const merged = await refreshFromServer();
          if (merged !== null) serverItems = merged;
        }

        clearGuestCart();
        setCart(serverItems);
      } else {
        // Guest: prefer localStorage (includes items added while auth was loading)
        const local = loadGuestCart();
        if (local.length || !cartRef.current.length) {
          setCart(local);
        }
      }

      if (!cancelled && gen === reconcileGenRef.current) {
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, refreshFromServer, syncLocalToServer]);

  // Persist guest cart (including while auth is still resolving)
  useEffect(() => {
    if (isAuthenticated) return;
    saveGuestCart(cart);
  }, [cart, isAuthenticated]);

  const setAppliedCoupon = useCallback((coupon) => {
    setAppliedCouponState(coupon);
    if (coupon) storage.set(COUPON_STORAGE_KEY, coupon);
    else storage.remove(COUPON_STORAGE_KEY);
  }, []);

  const addToCart = useCallback(
    async (product, quantity = 1, selectedVariant = null) => {
      if (!isValidProductId(product?.id)) return;

      const qty = Math.max(1, Math.min(99, Number(quantity) || 1));
      const line = sanitizeGuestCartItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        seller: product.seller,
        category: product.category,
        currency: product.currency,
        quantity: qty,
        selectedVariant,
        addedAt: new Date().toISOString()
      });
      if (!line) return;

      if (isAuthenticated) {
        try {
          const res = await apiClient('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId: product.id, quantity: qty })
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            if (applyServerCart(data, setCart)) return;
            const items = await refreshFromServer();
            if (items !== null) setCart(items);
            return;
          }
          console.error('addToCart failed:', await readApiError(res));
          return;
        } catch (err) {
          console.error('addToCart failed:', err.message);
          return;
        }
      }

      setCart((current) => {
        const existing = findCartLine(current, line.id, selectedVariant);
        if (existing) {
          return current.map((item) =>
            item.id === line.id &&
            variantKey(item.selectedVariant) === variantKey(selectedVariant)
              ? { ...item, quantity: Math.min(99, item.quantity + qty) }
              : item
          );
        }
        return [...current, line];
      });
    },
    [isAuthenticated, refreshFromServer]
  );

  const removeFromCart = useCallback(
    async (productId, selectedVariant = null) => {
      if (isAuthenticated) {
        const item = findCartLine(cartRef.current, productId, selectedVariant);
        if (item?.cartItemId) {
          try {
            const res = await apiClient(`/cart/items/${item.cartItemId}`, {
              method: 'DELETE'
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
              if (applyServerCart(data, setCart)) return;
              setCart((current) =>
                current.filter((i) => i.cartItemId !== item.cartItemId)
              );
              return;
            }
            console.error('removeFromCart failed:', await readApiError(res));
            return;
          } catch (err) {
            console.error('removeFromCart failed:', err.message);
            return;
          }
        }
        return;
      }

      setCart((current) =>
        current.filter(
          (item) =>
            !(
              item.id === productId &&
              variantKey(item.selectedVariant) === variantKey(selectedVariant)
            )
        )
      );
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId, quantity, selectedVariant = null) => {
      const qty = Math.max(0, Math.min(99, Number(quantity) || 0));
      if (qty <= 0) {
        await removeFromCart(productId, selectedVariant);
        return;
      }

      if (isAuthenticated) {
        const item = findCartLine(cartRef.current, productId, selectedVariant);
        if (item?.cartItemId) {
          try {
            const res = await apiClient(`/cart/items/${item.cartItemId}`, {
              method: 'PATCH',
              body: JSON.stringify({ quantity: qty })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
              if (applyServerCart(data, setCart)) return;
              setCart((current) =>
                current.map((i) =>
                  i.cartItemId === item.cartItemId ? { ...i, quantity: qty } : i
                )
              );
              return;
            }
            console.error('updateQuantity failed:', await readApiError(res));
            return;
          } catch (err) {
            console.error('updateQuantity failed:', err.message);
            return;
          }
        }
        return;
      }

      setCart((current) =>
        current.map((item) => {
          if (
            item.id === productId &&
            variantKey(item.selectedVariant) === variantKey(selectedVariant)
          ) {
            return { ...item, quantity: qty };
          }
          return item;
        })
      );
    },
    [isAuthenticated, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated && cartRef.current.length) {
      const deletes = cartRef.current
        .filter((item) => item.cartItemId)
        .map((item) =>
          apiClient(`/cart/items/${item.cartItemId}`, { method: 'DELETE' }).catch(
            () => {}
          )
        );
      await Promise.all(deletes);
    }
    setCart([]);
    if (!isAuthenticated) clearGuestCart();
  }, [isAuthenticated]);

  const getItemCount = useCallback(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const getCartTotal = useCallback(
    () =>
      cart.reduce((total, item) => {
        const price =
          typeof item.price === 'string'
            ? parseFloat(item.price.replace('$', ''))
            : item.price;
        return total + (price || 0) * item.quantity;
      }, 0),
    [cart]
  );

  const isInCart = useCallback(
    (productId, selectedVariant = null) =>
      Boolean(findCartLine(cart, productId, selectedVariant)),
    [cart]
  );

  const getCartItem = useCallback(
    (productId, selectedVariant = null) =>
      findCartLine(cart, productId, selectedVariant),
    [cart]
  );

  const itemCount = useMemo(() => getItemCount(), [getItemCount]);
  const total = useMemo(() => getCartTotal(), [getCartTotal]);

  const value = useMemo(
    () => ({
      cart,
      isLoading: isLoading || authLoading,
      appliedCoupon,
      setAppliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getCartTotal,
      isInCart,
      getCartItem,
      isEmpty: cart.length === 0,
      itemCount,
      total
    }),
    [
      cart,
      isLoading,
      authLoading,
      appliedCoupon,
      setAppliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getCartTotal,
      isInCart,
      getCartItem,
      itemCount,
      total
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
