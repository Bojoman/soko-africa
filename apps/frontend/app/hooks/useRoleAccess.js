"use client";
import { useAuth } from '../contexts/AuthContext';

export const useRoleAccess = () => {
  const { user, hasRole, hasPermission, hasAnyRole, getUserPermissions } = useAuth();

  // Check if user can access seller features
  const canSell = hasAnyRole(['seller', 'admin', 'moderator']);
  
  // Check if user can access admin features
  const canAdmin = hasRole('admin');
  
  // Check if user can moderate content
  const canModerate = hasAnyRole(['moderator', 'admin']);
  
  // Check if user can manage products
  const canManageProducts = hasPermission('manage_products');
  
  // Check if user can view analytics
  const canViewAnalytics = hasPermission('view_analytics');
  
  // Check if user can manage users
  const canManageUsers = hasPermission('manage_users');
  
  // Check if user can view all data
  const canViewAllData = hasPermission('view_all_data');

  // Get user's role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      customer: 'Customer',
      seller: 'Seller',
      admin: 'Administrator',
      moderator: 'Moderator'
    };
    return roleNames[role] || role;
  };

  // Get user's role color
  const getRoleColor = (role) => {
    const roleColors = {
      customer: 'blue',
      seller: 'green',
      admin: 'red',
      moderator: 'purple'
    };
    return roleColors[role] || 'gray';
  };

  // Check if user has elevated permissions
  const hasElevatedPermissions = hasAnyRole(['admin', 'moderator']);

  return {
    user,
    canSell,
    canAdmin,
    canModerate,
    canManageProducts,
    canViewAnalytics,
    canManageUsers,
    canViewAllData,
    hasElevatedPermissions,
    getRoleDisplayName,
    getRoleColor,
    hasRole,
    hasPermission,
    hasAnyRole,
    getUserPermissions
  };
};
