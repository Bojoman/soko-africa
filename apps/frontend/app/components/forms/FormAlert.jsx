"use client";
import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const FormAlert = ({ message, type = 'error' }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={cn(
        'mb-6 p-4 border rounded-lg flex items-center',
        isError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
      )}
    >
      {isError ? (
        <AlertCircle className="text-red-600 mr-2" size={20} />
      ) : (
        <CheckCircle className="text-green-600 mr-2" size={20} />
      )}
      <span className={cn(isError ? 'text-red-800' : 'text-green-800')}>
        {message}
      </span>
    </div>
  );
};
