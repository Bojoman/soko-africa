"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Role permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.CUSTOMER]: [
    'view_products',
    'add_to_cart',
    'place_orders',
    'write_reviews',
    'manage_wishlist',
    'view_orders'
  ],
  [USER_ROLES.SELLER]: [
    'view_products',
    'add_to_cart',
    'place_orders',
    'write_reviews',
    'manage_wishlist',
    'view_orders',
    'manage_products',
    'view_sales',
    'manage_orders',
    'view_analytics'
  ],
  [USER_ROLES.MODERATOR]: [
    'view_products',
    'add_to_cart',
    'place_orders',
    'write_reviews',
    'manage_wishlist',
    'view_orders',
    'manage_products',
    'view_sales',
    'manage_orders',
    'view_analytics',
    'moderate_content',
    'manage_users',
    'view_reports'
  ],
  [USER_ROLES.ADMIN]: [
    'view_products',
    'add_to_cart',
    'place_orders',
    'write_reviews',
    'manage_wishlist',
    'view_orders',
    'manage_products',
    'view_sales',
    'manage_orders',
    'view_analytics',
    'moderate_content',
    'manage_users',
    'view_reports',
    'manage_system',
    'manage_roles',
    'view_all_data'
  ]
};

function clearLegacyAuthStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('soko_africa_user');
  localStorage.removeItem('soko_africa_token');
  localStorage.removeItem('soko_africa_refresh_token');
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        clearLegacyAuthStorage();
        const userData = await authApi.me();
        if (!cancelled) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authApi.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await authApi.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* still clear local session */
    } finally {
      clearLegacyAuthStorage();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const roleKey = String(user.role).toLowerCase();
    const userPermissions = ROLE_PERMISSIONS[roleKey] || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!user || !user.role || !role) return false;
    return user.role.toUpperCase() === String(role).toUpperCase();
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    const ur = String(user.role).toLowerCase();
    return roles.some((r) => String(r).toLowerCase() === ur);
  };

  const getUserPermissions = () => {
    if (!user || !user.role) return [];
    return ROLE_PERMISSIONS[String(user.role).toLowerCase()] || [];
  };

  const refreshUser = async () => {
    try {
      const profile = await authApi.me();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { address, city, postalCode, ...persisted } = profileData;
      const updated = await authApi.updateProfile(persisted);
      setUser(updated);
      return { success: true, user: updated };
    } catch (error) {
      return { success: false, error: error.message || 'Profile update failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    hasAnyRole,
    getUserPermissions,
    updateProfile,
    refreshUser,
    USER_ROLES,
    ROLE_PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
