"use client";
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallback = null,
  redirectTo = '/auth/login'
}) => {
  const { user, isAuthenticated, loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role requirement
      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/unauthorized');
        return;
      }

      // Check permission requirement
      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, isAuthenticated, loading, requiredRole, requiredPermission, router, redirectTo, hasRole, hasPermission]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Show fallback if not authenticated or doesn't meet requirements
  if (!isAuthenticated || 
      (requiredRole && !hasRole(requiredRole)) || 
      (requiredPermission && !hasPermission(requiredPermission))) {
    return fallback || null;
  }

  return children;
};

export default ProtectedRoute;
