"use client";
import React from 'react';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { ArrowRight, LogIn, UserPlus, ShoppingCart, User, Heart, Package, BarChart2, Shield, AlertTriangle } from 'lucide-react';

export default function RoutesPage() {
  const routeSections = [
    {
      title: 'Public & Informational',
      routes: [
        { href: '/', name: 'Home Page', desc: 'The main landing page of Soko Africa.' },
        { href: '/about', name: 'About Us', desc: 'Information about the company.' },
        { href: '/categories', name: 'Categories', desc: 'Browse all product categories.' },
        { href: '/products/1', name: 'Product Details', desc: 'Example of a single product page.' },
        { href: '/contact', name: 'Contact Us', desc: 'Contact form and information.' },
        { href: '/help', name: 'Help/FAQ', desc: 'Frequently Asked Questions.' },
      ],
    },
    {
      title: 'Authentication Flow',
      icon: LogIn,
      routes: [
        { href: '/auth/login', name: 'Login', desc: 'User login page.' },
        { href: '/auth/register', name: 'Register', desc: 'New user registration.' },
        { href: '/auth/forgot-password', name: 'Forgot Password', desc: 'Password recovery flow.' },
      ],
    },
    {
      title: 'Customer Account',
      icon: User,
      routes: [
        { href: '/account', name: 'My Account', desc: 'User profile and settings.' },
        { href: '/orders', name: 'My Orders', desc: 'View order history.' },
        { href: '/wishlist', name: 'Wishlist', desc: 'View saved items.' },
        { href: '/cart', name: 'Shopping Cart', desc: 'View and manage cart items.' },
        { href: '/checkout', name: 'Checkout', desc: 'The checkout process.' },
      ],
    },
    {
      title: 'Seller Dashboard',
      icon: Package,
      routes: [
        { href: '/seller/dashboard', name: 'Dashboard', desc: 'Main dashboard for sellers.' },
        { href: '/seller/products', name: 'Products', desc: 'Manage product listings.' },
        { href: '/seller/analytics', name: 'Analytics', desc: 'View sales analytics.' },
      ],
    },
    {
      title: 'Admin Dashboard',
      icon: Shield,
      routes: [
        { href: '/admin/dashboard', name: 'Admin Dashboard', desc: 'Main dashboard for administrators.' },
      ],
    },
    {
      title: 'Utility & Edge Cases',
      icon: AlertTriangle,
      routes: [
        { href: '/this-page-does-not-exist', name: '404 Not Found', desc: 'Trigger the 404 page.' },
        { href: '/unauthorized', name: 'Unauthorized Access', desc: 'Page shown for access denied.' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Routes</h1>
          <p className="text-lg text-gray-600">A complete sitemap for navigating and reviewing the Soko Africa UI.</p>
        </div>

        <div className="space-y-12">
          {routeSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                {section.icon && <section.icon className="mr-3 text-orange-600" size={24} />}
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.routes.map((route) => (
                  <Link href={route.href} key={route.href} legacyBehavior>
                    <a className="block p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-orange-500 transition-all group">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 group-hover:text-orange-600">{route.name}</h3>
                        <ArrowRight className="text-gray-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" size={20} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{route.desc}</p>
                      <p className="text-xs text-orange-500 mt-2 font-mono">{route.href}</p>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
