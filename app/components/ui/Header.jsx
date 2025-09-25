"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, ShoppingCart, User, MapPin, ChevronDown, LogOut, Settings, Store, Shield } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categories = [
    { name: 'All Categories', href: '/categories' },
    { name: 'About SokoAfrica', href: '/about' },
    { name: 'Nyamazone Meats', href: '/nyamazone' },
    { name: 'Partner with Us', href: '/partner' },
    { name: 'Become a Seller', href: '/sell' },
    { name: 'Browse Categories', href: '/categories' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="flex items-center text-xs sm:text-sm">
              <MapPin size={12} className="mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Deliver to Nairobi
              </span>
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm">📞 <span className="hidden sm:inline">+254 700 123 456</span></span>
            <span className="text-xs sm:text-sm">🌍 Ship Globally</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-soko-bright-cyan">
              SOKO<span className="text-soko-dark-red">AFRICA</span>
            </Link>
            
            {/* Categories Dropdown */}
            <nav className="hidden lg:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-soko-bright-cyan transition-colors">
                  <Menu size={20} />
                  <span>All Categories</span>
                  <ChevronDown size={16} />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* <Link href="/categories" className="text-gray-700 hover:text-orange-600 transition-colors">
                All Categories
              </Link> */}
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">
                About
              </Link>
              <Link href="/nyamazone" className="text-gray-700 hover:text-orange-600 transition-colors">
                Nyamazone
              </Link>
              <Link href="/partner" className="text-gray-700 hover:text-orange-600 transition-colors">
                Partner
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-orange-600 transition-colors">
                Sell
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
            <form className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2 sm:py-3 text-sm text-black placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-1.5 sm:p-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                <Search size={16} className="sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-soko-bright-cyan transition-colors"
                >
                  <User size={20} className="sm:w-6 sm:h-6" />
                  <span className="hidden lg:block text-sm">
                    {user?.firstName || 'Account'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role}
                        </p>
                      </div>
                      
                      <Link
                        href="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-soko-cream hover:text-soko-dark-red transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Account Dashboard
                      </Link>
                      
                      <Link
                        href="/account/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-soko-cream hover:text-soko-dark-red transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Profile Settings
                      </Link>
                      
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-soko-cream hover:text-soko-dark-red transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        My Orders
                      </Link>
                      
                      {hasRole('seller') && (
                        <Link
                          href="/seller/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-soko-cream hover:text-soko-dark-red transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Store size={16} className="mr-2" />
                          Seller Dashboard
                        </Link>
                      )}
                      
                      {hasRole('admin') && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-soko-cream hover:text-soko-dark-red transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Shield size={16} className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/auth/register"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <Link href="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors relative">
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              <span className="hidden lg:block text-sm">Cart</span>
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-orange-600 p-1"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 bg-white">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-3 text-sm text-black placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 rounded-md"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-1 px-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="block py-3 text-base text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
