"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="text-red-600" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              You don't have permission to access this page. This area is restricted to users with the appropriate role or permissions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What can you do?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">If you're a customer:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Browse and purchase products</li>
                  <li>• Manage your orders and wishlist</li>
                  <li>• Write product reviews</li>
                  <li>• Update your profile</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">If you're a seller:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Manage your products</li>
                  <li>• View sales analytics</li>
                  <li>• Process orders</li>
                  <li>• Access seller dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Home className="mr-2" size={20} />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              If you believe this is an error, please{' '}
              <Link href="/contact" className="text-orange-600 hover:text-orange-700">
                contact support
              </Link>
              {' '}or{' '}
              <Link href="/auth/login" className="text-orange-600 hover:text-orange-700">
                try logging in again
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
