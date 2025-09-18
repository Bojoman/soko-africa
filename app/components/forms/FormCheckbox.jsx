"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

export const FormCheckbox = ({ name, label, className, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="w-full">
      <label className="flex items-start">
        <input
          id={name}
          type="checkbox"
          className={cn(
            'mt-1 mr-3 rounded border-gray-300 text-orange-600 focus:ring-orange-500',
            error ? 'border-red-500' : '',
            className
          )}
          {...register(name)}
          {...props}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle size={16} className="mr-1" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};
