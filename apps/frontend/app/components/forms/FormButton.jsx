"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FormButton = ({ children, isLoading, className, ...props }) => {
  const formCtx = useFormContext();
  const isSubmitting = formCtx?.formState?.isSubmitting ?? false;
  const loading = isLoading || isSubmitting;

  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn('w-full bg-soko-orange hover:bg-soko-orange-red text-white font-semibold', className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        children
      )}
    </Button>
  );
};
