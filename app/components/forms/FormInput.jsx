"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

export const FormInput = ({ name, label, type = 'text', placeholder, icon: Icon, className, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full py-3 text-black placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            className
          )}
          {...register(name)}
          {...props}
        />
        {type === 'password' && props.togglePassword && (
          <button
            type="button"
            onClick={props.togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {props.showPassword ? <props.EyeOffIcon size={20} /> : <props.EyeIcon size={20} />}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle size={16} className="mr-1" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
};
