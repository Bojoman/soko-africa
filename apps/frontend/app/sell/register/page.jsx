"use client";
import React from 'react';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import FarmerRegistrationForm from '../../components/farmer/FarmerRegistrationForm';

export default function FarmerRegisterPage() {
  return (
    <div className="min-h-screen bg-soko-cream/30">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="mb-4 text-sm">
          <Link href="/sell" className="text-soko-orange-red font-semibold hover:underline">
            Back to selling
          </Link>
        </p>
        <FarmerRegistrationForm />
      </main>
      <Footer />
    </div>
  );
}
