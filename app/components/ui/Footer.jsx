"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Get to Know Us",
      links: [
        { name: "About SokoAfrica", href: "/about" },
        { name: "Policies", href: "/policies" },
        { name: "Help Centre", href: "/help" },
        { name: "Privacy Settings", href: "/privacy-settings" },
        { name: "Careers", href: "/careers" },
        { name: "Sustainability", href: "/sustainability" },
      ]
    },
    {
      title: "Make Money with SokoAfrica",
      links: [
        { name: "Sell Products on SokoAfrica", href: "/sell" },
        { name: "Sell on Soko Africa Business (B2B)", href: "/business" },
        { name: "Partner with Us", href: "/partner" },
        { name: "Nyamazone Suppliers", href: "/suppliers" },
        { name: "Affiliate Program", href: "/affiliates" },
      ]
    },
    {
      title: "Let Us Help You",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Your Account", href: "/account" },
        { name: "Returns & Replacements", href: "/returns" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Contact Us", href: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <section className="border-b border-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected with Africa</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get exclusive deals, new product launches, and stories from African artisans delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
            <button 
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4">
            Join 50,000+ customers who love authentic African products
          </p>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <Link href="/" className="text-2xl font-bold text-orange-600 mb-4 block">
                SOKO<span className="text-green-600">AFRICA</span>
              </Link>
              <p className="text-gray-400 mb-4">
                Connecting Africa&apos;s finest products with the world through trusted sourcing and quality delivery.
              </p>
              <div className="flex space-x-4">
                <Link href="/mobile-app" className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm transition-colors">
                  Download App
                </Link>
              </div>
              
              {/* Social Media */}
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.5 13.5 3.5 12c0-1.5.743-2.814 1.621-3.691.88-.807 2.031-1.297 3.328-1.297 1.297 0 2.448.49 3.328 1.297C12.655 9.186 13.5 10.5 13.5 12c0 1.5-.845 2.814-1.723 3.691-.88.807-2.031 1.297-3.328 1.297zm7.072 0c-1.297 0-2.448-.49-3.328-1.297C11.315 14.814 10.5 13.5 10.5 12c0-1.5.815-2.814 1.693-3.691.88-.807 2.031-1.297 3.328-1.297 1.297 0 2.448.49 3.328 1.297C19.727 9.186 20.5 10.5 20.5 12c0 1.5-.773 2.814-1.651 3.691-.88.807-2.031 1.297-3.328 1.297z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {currentYear} SokoAfrica. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
