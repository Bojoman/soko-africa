"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Heart, Share2, Download, LayoutGrid, List, ChevronDown, Star, Eye, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useFAQ } from '../hooks/useFAQ';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
import { useCart } from '../hooks/useCart';

// Mock Data based on the provided images
const initialWishlistItems = [
  {
    id: 1,
    category: 'Jewelry',
    name: 'Authentic Maasai Beaded Jewelry Set',
    rating: 4.9,
    reviews: 127,
    seller: 'Maasai Craft Collective',
    price: 89.99,
    originalPrice: 110.00,
    image: '/products/African bracelets.png',
    inStock: true,
  },
  {
    id: 2,
    category: 'Food & Beverages',
    name: 'Premium Ghanaian Cocoa Powder - Organic',
    rating: 4.8,
    reviews: 89,
    seller: 'by Ghana Cocoa Farms',
    price: 32.50,
    originalPrice: 38.99,
    image: '/hero/Black beans.png',
    inStock: true,
  },
  {
    id: 3,
    category: 'Home & Textiles',
    name: 'Handwoven Basotho Blanket - Traditional',
    rating: 5.0,
    reviews: 203,
    seller: 'by Lesotho Weavers',
    price: 125.00,
    originalPrice: 149.99,
    image: '/hero/ankara bucket hats.png',
    inStock: false,
  },
  {
    id: 4,
    category: 'Spices & Seasonings',
    name: 'Ethiopian Berbere Spice Blend Set',
    rating: 4.7,
    reviews: 156,
    seller: 'by Addis Spice Co.',
    price: 24.99,
    originalPrice: 29.99,
    image: '/hero/ndengu.png',
    inStock: true,
  },
  {
    id: 5,
    category: 'Beauty & Wellness',
    name: 'Moroccan Argan Oil - Pure & Certified',
    rating: 4.9,
    reviews: 342,
    seller: 'by Atlas Beauty',
    price: 45.00,
    originalPrice: 55.00,
    image: '/products/ankara earings.png',
    inStock: true,
  },
  {
    id: 6,
    category: 'Musical Instruments',
    name: 'Senegalese Djembe Drum - Handcrafted',
    rating: 4.8,
    reviews: 74,
    seller: 'by Dakar Drums',
    price: 189.99,
    originalPrice: 220.00,
    image: '/hero/massai wall art.png',
    inStock: true,
  },
];

const recentlyViewedItems = [
    { id: 1, name: 'Kenyan Tea', price: 14.99, image: '/hero/Ankara fabric.png' },
    { id: 2, name: 'Ankara Fabric', price: 28.50, image: '/hero/Ankara fabric.png' },
    { id: 3, name: 'Shea Butter', price: 19.99, image: '/products/mangoes.png' },
    { id: 4, name: 'Coffee Beans', price: 22.75, image: '/hero/Black beans.png' },
    { id: 5, name: 'Wooden Masks', price: 45.00, image: '/hero/massai wall art.png' },
    { id: 6, name: 'Baobab Oil', price: 32.99, image: '/products/mangoes in a farm.png' },
];

const WishlistHeader = ({ itemCount, totalSavings }) => (
  <div className="bg-gradient-to-r from-green-100 to-teal-50 p-6 md:p-8 rounded-lg mb-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="text-red-500" size={32} />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Wishlist</h1>
        </div>
        <p className="text-gray-600 ml-11">{itemCount} items saved • ${totalSavings.toFixed(2)} total savings available</p>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
          <Download size={20} className="text-gray-700" />
        </button>
        <button 
            onClick={() => console.log('Share wishlist')}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
            title="Share Wishlist"
        >
          <Share2 size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  </div>
);

const WishlistControls = ({ view, setView, sort, setSort, onAddAllToCart }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
            <span className="text-gray-600">View:</span>
            <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Grid View">
                <LayoutGrid size={20} />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`} title="List View">
                <List size={20} />
            </button>
            <div className="relative ml-2">
                <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-orange-500"
                >
                <option value="newest">Newest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={onAddAllToCart} className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Add All to Cart
                </button>
                <button onClick={() => router.push('/categories')} className="px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition">Continue Shopping</button>
            </div>
        </div>
    );
};

const WishlistProductCard = ({ item, onAddToCart, onRemove, view }) => {
  const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
  
  if (view === 'list') {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group border border-transparent hover:border-orange-300 transition-all duration-300 flex w-full">
            <div className="relative w-1/4">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">{discount}% OFF</div>
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between w-3/4">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{item.name}</h3>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="p-2 text-gray-400 hover:text-red-500" title="Remove from wishlist">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">by {item.seller}</p>
                    <div className="flex items-center space-x-1 text-sm mb-3">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-bold text-gray-700">{item.rating}</span>
                        <span className="text-gray-500">({item.reviews} reviews)</span>
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div className="flex items-baseline space-x-2">
                        <p className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</p>
                        {item.originalPrice && (
                            <p className="text-md text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
                        )}
                    </div>
                    <button 
                        onClick={() => onAddToCart(item)}
                        disabled={!item.inStock}
                        className={`py-2 px-6 rounded-lg font-semibold text-center transition flex items-center gap-2 ${
                            item.inStock 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <ShoppingCart size={18} />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group border border-transparent hover:border-orange-300 transition-all duration-300">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">{discount}% OFF</div>
        )}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-100" title="Add to wishlist again?">
                <Heart size={18} className="text-red-500" />
            </button>
        </div>
        {!item.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-bold bg-gray-700 bg-opacity-80 px-4 py-2 rounded-md">Out of Stock</span>
            </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{item.category}</p>
        <h3 className="font-semibold text-gray-800 text-md mb-2 h-12">{item.name}</h3>
        <div className="flex items-center space-x-1 text-sm mb-2">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-bold text-gray-700">{item.rating}</span>
            <span className="text-gray-500">({item.reviews} reviews)</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">by {item.seller}</p>
        <div className="flex items-baseline space-x-2 mb-4">
          <p className="text-xl font-bold text-orange-600">${item.price.toFixed(2)}</p>
          {item.originalPrice && (
            <p className="text-md text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
          )}
        </div>
        <button 
          disabled={!item.inStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-center transition ${
            item.inStock 
            ? 'bg-orange-600 text-white hover:bg-orange-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        <div className="flex justify-around items-center mt-3 text-gray-500">
            <button className="flex items-center space-x-1 hover:text-orange-600" onClick={() => console.log('Quick view:', item.name)}>
                <Eye size={16} />
                <span className="text-xs">Quick View</span>
            </button>
            <div className="border-l h-4 border-gray-300"></div>
            <button className="flex items-center space-x-1 hover:text-orange-600" onClick={() => console.log('Share item:', item.name)}>
                <Share2 size={16} />
                <span className="text-xs">Share</span>
            </button>
             <div className="border-l h-4 border-gray-300"></div>
            <button onClick={() => onRemove(item.id)} className="flex items-center space-x-1 hover:text-red-600" title="Remove from wishlist">
                <X size={16} />
                <span className="text-xs">Remove</span>
            </button>
        </div>
      </div>
    </div>
  );
};

const WishlistSummary = ({ items }) => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const potentialSavings = items.reduce((sum, item) => sum + (item.originalPrice ? item.originalPrice - item.price : 0), 0);
    const inStockItems = items.filter(item => item.inStock).length;
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Wishlist Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span>Total Items</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Total Value</span>
            <span className="font-semibold">${totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-green-600">
            <span>Potential Savings</span>
            <span className="font-semibold">${potentialSavings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>In Stock Items</span>
            <span className="font-semibold">{inStockItems}</span>
          </div>
        </div>
      </div>
    );
};
  
const RecentlyViewed = ({ onAddToWishlist }) => (
    <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recentlyViewedItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-lg transition-shadow">
                    <img src={item.image} alt={item.name} className="w-full h-24 object-cover mb-3 rounded-md" />
                    <h3 className="text-sm font-semibold text-gray-700 h-10">{item.name}</h3>
                    <p className="text-md font-bold text-gray-800 mb-3">${item.price.toFixed(2)}</p>
                    <button onClick={() => onAddToWishlist(item)} className="w-full text-xs flex items-center justify-center space-x-1 py-2 px-2 rounded-lg font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100 transition">
                        <Heart size={14} />
                        <span>Add to Wishlist</span>
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default function WishlistPage() {
    const [view, setView] = useState('grid');
    const [sort, setSort] = useState('newest');
    const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
    const { faqs } = useFAQ('customer');
    const { addToCart } = useCart();
  
    const handleRemoveFromWishlist = useCallback((itemId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
        // In a real app, you'd also make an API call here.
        console.log(`Removed item ${itemId} from wishlist.`);
    }, []);

    const handleAddToCart = useCallback((item) => {
        addToCart(item);
        console.log(`Added ${item.name} to cart.`);
    }, [addToCart]);

    const handleAddAllToCart = useCallback(() => {
        const inStockItems = wishlistItems.filter(item => item.inStock);
        inStockItems.forEach(item => addToCart(item));
        console.log(`Added ${inStockItems.length} in-stock items to cart.`);
    }, [wishlistItems, addToCart]);
    
    const handleAddToWishlist = useCallback((item) => {
        setWishlistItems(prev => {
            if (prev.find(i => i.id === item.id)) {
                console.log(`${item.name} is already in the wishlist.`);
                return prev;
            }
            console.log(`Added ${item.name} to wishlist.`);
            return [...prev, { ...item, seller: 'Soko-Africa', rating: 4.5, reviews: 0, originalPrice: item.price + 5, inStock: true, category: 'Miscellaneous' }];
        });
    }, []);

    const sortedWishlistItems = useMemo(() => {
        const sorted = [...wishlistItems];
        switch (sort) {
            case 'price-low-high':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
            default:
                // Assuming newer items have higher IDs
                sorted.sort((a, b) => b.id - a.id);
                break;
        }
        return sorted;
    }, [wishlistItems, sort]);

    const { totalSavings, itemCount } = useMemo(() => {
      const totalSavings = wishlistItems.reduce((acc, item) => acc + (item.originalPrice - item.price), 0);
      const itemCount = wishlistItems.length;
      return { totalSavings, itemCount };
    }, [wishlistItems]);
  
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white">
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WishlistHeader itemCount={itemCount} totalSavings={totalSavings} />
            <WishlistControls 
                view={view} 
                setView={setView} 
                sort={sort}
                setSort={setSort}
                onAddAllToCart={handleAddAllToCart}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className={`lg:col-span-3 grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {sortedWishlistItems.map(item => (
                  <WishlistProductCard 
                    key={item.id} 
                    item={item} 
                    onAddToCart={handleAddToCart}
                    onRemove={handleRemoveFromWishlist}
                    view={view}
                    />
                ))}
              </div>
              <div className="lg:col-span-1">
                  <WishlistSummary items={wishlistItems} />
              </div>
            </div>

            <RecentlyViewed onAddToWishlist={handleAddToWishlist} />
            <EnhancedFAQSection 
                faqs={faqs}
                title="Wishlist Questions"
                subtitle="Common questions about saving and managing your favorite products."
            />
          </main>
          
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }