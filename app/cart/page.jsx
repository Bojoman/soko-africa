"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import FAQSection from '../components/ui/FAQSection';
import { 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus, 
  X, 
  ArrowRight,
  Shield,
  Truck,
  RefreshCcw,
  Tag,
  CreditCard
} from 'lucide-react';

export default function CartPage() {
  // Demo cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Ethiopian Coffee Beans",
      price: 24.99,
      originalPrice: 29.99,
      quantity: 2,
      image: "/hero/Black beans.png",
      category: "Beverages",
      inStock: true,
      seller: "Addis Coffee Co."
    },
    {
      id: 2,
      name: "Hand-woven Kente Cloth Scarf",
      price: 45.00,
      originalPrice: 55.00,
      quantity: 1,
      image: "/hero/Ankara fabric.png",
      category: "Fashion",
      inStock: true,
      seller: "Ghana Weavers Guild"
    },
    {
      id: 3,
      name: "Organic Shea Butter - Pure & Natural",
      price: 18.50,
      originalPrice: 22.00,
      quantity: 3,
      image: "/products/African bracelets.png",
      category: "Beauty & Wellness",
      inStock: true,
      seller: "Burkina Beauty"
    },
    {
      id: 4,
      name: "Tanzanian Black Tea Premium Blend",
      price: 16.75,
      originalPrice: 19.99,
      quantity: 1,
      image: "/hero/ndengu.png",
      category: "Beverages",
      inStock: false,
      seller: "Kilimanjaro Tea Co."
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center space-x-4 mb-4">
              <ShoppingCart size={32} />
              <h1 className="text-3xl lg:text-4xl font-bold">Shopping Cart</h1>
            </div>
            <p className="text-lg opacity-90">
              Review your selected items and proceed to checkout
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {cartItems.length > 0 ? (
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Your Items ({cartItems.length})
                      </h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={120}
                                height={120}
                                className="rounded-lg object-cover"
                              />
                              {!item.inStock && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">Out of Stock</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {item.name}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                    <span className="bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                                    <span>•</span>
                                    <span>by {item.seller}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-2xl font-bold text-orange-600">
                                      ${item.price.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                      ${item.originalPrice.toFixed(2)}
                                    </span>
                                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                      <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50"
                                        disabled={!item.inStock}
                                      >
                                        <Minus size={16} />
                                      </button>
                                      <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="p-2 text-gray-600 hover:text-orange-600 disabled:opacity-50"
                                        disabled={!item.inStock}
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                    
                                    <Link href="/wishlist">
                                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                                        <Heart size={20} />
                                        <span>Save for later</span>
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors mb-4"
                                  >
                                    <X size={20} />
                                  </button>
                                  <div className="text-xl font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: "Moringa Tea", price: 12.99, image: "/hero/yellow beans.png" },
                        { name: "African Honey", price: 15.50, image: "/products/mangoes.png" },
                        { name: "Boabab Oil", price: 22.00, image: "/products/African bracelets.png" },
                        { name: "Macadamia Nuts", price: 18.75, image: "/hero/ndengu.png" }
                      ].map((product, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="w-full h-20 object-cover rounded-md mb-2"
                          />
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-orange-600 font-semibold">${product.price}</p>
                          <button className="w-full mt-2 bg-orange-100 text-orange-600 text-sm py-1 rounded hover:bg-orange-200 transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm sticky top-6">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                          <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        
                        {savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>You save</span>
                            <span>-${savings.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <div className="text-right">
                            {shipping === 0 ? (
                              <span className="text-green-600 font-semibold">FREE</span>
                            ) : (
                              <span className="font-semibold">${shipping.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {shipping > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                          <p className="text-sm text-orange-800">
                            <span className="font-semibold">Free shipping</span> on orders over $75!
                            Add ${(75 - subtotal).toFixed(2)} more to qualify.
                          </p>
                        </div>
                      )}
                      
                      <Link href="/checkout">
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2">
                          <span>Proceed to Checkout</span>
                          <ArrowRight size={20} />
                        </button>
                      </Link>
                      
                      <div className="mt-6 space-y-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Shield className="text-green-500" size={16} />
                          <span>Secure checkout with SSL encryption</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="text-blue-500" size={16} />
                          <span>Fast shipping across Africa & globally</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RefreshCcw className="text-orange-500" size={16} />
                          <span>30-day return policy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty Cart
              <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
                  <ShoppingCart className="text-gray-400 mx-auto mb-4" size={64} />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                  <p className="text-gray-600 mb-6">
                    Discover amazing products from African artisans and producers
                  </p>
                  <Link href="/categories">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">Your payment information is encrypted and secure</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Truck className="text-blue-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Global Shipping</h3>
                <p className="text-gray-600">Fast and reliable delivery worldwide</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-orange-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Authentic Products</h3>
                <p className="text-gray-600">Genuine African products from verified sellers</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <FAQSection 
            userType="customer"
            title="Shopping Questions"
            subtitle="Common questions about your cart and checkout process"
            showContactCTA={false}
            className="max-w-6xl"
          />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}