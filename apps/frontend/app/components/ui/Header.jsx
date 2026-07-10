"use client";
import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';
import {
  Search,
  Menu,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  LogOut,
  Settings,
  Store,
  Shield,
  Phone,
  Globe
} from 'lucide-react';

// Subcomponent that uses `useSearchParams` so it can be wrapped in its own
// Suspense boundary. This prevents the whole page from bailing out of static
// rendering whenever the Header is rendered.
const HeaderSearchSync = ({ onChange }) => {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || '';
  useEffect(() => {
    onChange(initialQ);
  }, [initialQ, onChange]);
  return null;
};

const Header = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');

  const syncFromUrl = (q) => {
    setSearchTerm(q);
    setMobileSearchTerm(q);
  };

  const goToSearch = (term) => {
    const q = String(term || '').trim();
    // Whitespace-only inputs are treated as a no-op — don't bounce the user
    // to /search with an empty query. They can still navigate via the
    // "All Categories" / "/products" link if they want to browse.
    if (q.length === 0) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleDesktopSubmit = (e) => {
    e.preventDefault();
    goToSearch(searchTerm);
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    const q = String(mobileSearchTerm || '').trim();
    if (q.length === 0) return;
    if (isMenuOpen) setIsMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

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
      <Suspense fallback={null}>
        <HeaderSearchSync onChange={syncFromUrl} />
      </Suspense>
      {/* Top Bar */}
      <div className="bg-soko-dark-brown text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="flex items-center text-xs sm:text-sm">
              <MapPin size={12} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Deliver to Nairobi</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="flex items-center text-xs sm:text-sm">
              <Phone size={12} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">+254 700 123 456</span>
            </span>
            <span className="flex items-center text-xs sm:text-sm">
              <Globe size={12} className="mr-1 sm:mr-2" />
              Ship Globally
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-soko-bright-cyan">
              <Image
                src="/utility/logo_1.png"
                alt="SokoAfrica Logo"
                width={150}
                height={50}
                className="object-contain"
                style={{ width: '150px', height: 'auto' }}
              />
            </Link>

            {/* Categories Dropdown */}
            <nav className="hidden lg:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-soko-orange transition-colors">
                  <Menu size={20} />
                  <span>All Categories</span>
                  <ChevronDown size={16} />
                </button>

                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-soko-cream hover:text-soko-orange transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
            <form onSubmit={handleDesktopSubmit} className="relative w-full" role="search">
              <label htmlFor="header-search" className="sr-only">
                Search products
              </label>
              <input
                id="header-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, categories, sellers..."
                className="w-full pl-4 pr-12 py-2 sm:py-3 text-sm text-black placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-2 focus:ring-soko-orange/30 transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-soko-orange text-white p-1.5 sm:p-2 rounded-md hover:bg-soko-dark-red transition-colors"
              >
                <Search size={16} className="sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-soko-dark-brown hover:text-soko-orange transition-colors"
                >
                  <User size={20} className="sm:w-6 sm:h-6" />
                  <span className="hidden lg:block text-sm">
                    {user?.firstName || 'Account'}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
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
                  className="text-sm text-gray-700 hover:text-soko-orange transition-colors"
                >
                  Sign In
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/auth/register"
                  className="text-sm text-soko-orange hover:text-soko-dark-red font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              className="flex items-center space-x-1 text-gray-700 hover:text-soko-orange transition-colors relative"
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              <span className="hidden lg:block text-sm">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-soko-orange text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-soko-orange p-1"
              aria-label="Toggle navigation menu"
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
              <form onSubmit={handleMobileSubmit} className="relative" role="search">
                <label htmlFor="header-search-mobile" className="sr-only">
                  Search products
                </label>
                <input
                  id="header-search-mobile"
                  type="text"
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-3 text-sm text-black placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-2 focus:ring-soko-orange/30"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-soko-orange text-white p-2 rounded-md hover:bg-soko-dark-red"
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
                  className="block py-3 text-base text-gray-700 hover:text-soko-orange hover:bg-soko-cream/40 px-2 rounded transition-colors"
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
