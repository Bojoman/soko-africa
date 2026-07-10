"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';

export const FormRadioGroup = ({ name, label, options, selectedValue, className, ...props }) => {
  const { register } = useFormContext();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors',
                isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                id={`${name}-${option.value}`}
                value={option.value}
                className="sr-only"
                {...register(name)}
                {...props}
              />
              <div className="flex items-center space-x-3">
                {option.icon && <option.icon className={cn(isSelected ? 'text-orange-600' : 'text-gray-400')} size={24} />}
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
