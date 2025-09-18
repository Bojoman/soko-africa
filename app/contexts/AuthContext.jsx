"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('soko_africa_user');
        const storedToken = localStorage.getItem('soko_africa_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('soko_africa_user');
        localStorage.removeItem('soko_africa_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user: userData, token } = data;
        
        // Store user data and token
        localStorage.setItem('soko_africa_user', JSON.stringify(userData));
        localStorage.setItem('soko_africa_token', token);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const { user: newUser, token } = data;
        
        // Store user data and token
        localStorage.setItem('soko_africa_user', JSON.stringify(newUser));
        localStorage.setItem('soko_africa_token', token);
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true, user: newUser };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('soko_africa_user');
    localStorage.removeItem('soko_africa_token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Get user's permissions
  const getUserPermissions = () => {
    if (!user || !user.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('soko_africa_token');
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('soko_africa_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: data.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('soko_africa_token');
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('soko_africa_token', data.token);
        return { success: true, token: data.token };
      } else {
        // Token is invalid, logout user
        logout();
        return { success: false, error: 'Session expired' };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return { success: false, error: 'Session expired' };
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
    refreshToken,
    USER_ROLES,
    ROLE_PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
