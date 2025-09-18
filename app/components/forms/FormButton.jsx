"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';

export const FormButton = ({ children, isLoading, className, ...props }) => {
  const { formState: { isSubmitting } } = useFormContext() || { formState: {} };
  const loading = isLoading || isSubmitting;

  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        'w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center',
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
};
