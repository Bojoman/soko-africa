"use client";
import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import WriteReviewModal from '../../components/ui/WriteReviewModal';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
import useFAQ from '../hooks/useFAQ';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MessageCircle
} from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Sample product data - this will come from API
  const sampleProduct = {
    id: resolvedParams.id,
    name: 'Fresh Kenyan Avocadoes (6 pack)',
    price: 12.99,
    originalPrice: 15.99,
    images: [
      '/hero/avocado.png',
      '/products/avocados in the farm.png',
      '/products/mangoes.png',
      '/products/mangoes in a farm.png'
    ],
    rating: 4.8,
    reviews: 156,
    badge: 'Seasonal',
    category: 'agriculture',
    description: 'Premium quality Kenyan avocadoes, hand-picked from the fertile highlands. These creamy, buttery avocados are perfect for salads, smoothies, or simply enjoyed on their own. Grown using sustainable farming practices and shipped fresh to your door.',
    features: [
      'Premium quality from Kenyan highlands',
      'Hand-picked and carefully selected',
      'Sustainable farming practices',
      'Fresh delivery guarantee',
      'Perfect for salads and smoothies'
    ],
    specifications: {
      'Origin': 'Kenya',
      'Weight': '6 pieces (approx. 1.2kg)',
      'Storage': 'Store at room temperature until ripe',
      'Shelf Life': '5-7 days when ripe',
      'Certification': 'Organic Certified'
    },
    variants: [
      { id: 'small', name: 'Small Pack (3 pieces)', price: 8.99, stock: 10 },
      { id: 'medium', name: 'Medium Pack (6 pieces)', price: 12.99, stock: 25 },
      { id: 'large', name: 'Large Pack (12 pieces)', price: 22.99, stock: 15 }
    ],
    seller: {
      name: 'Kenya Fresh Produce Co.',
      rating: 4.9,
      reviews: 1247,
      verified: true,
      location: 'Nairobi, Kenya'
    },
    shipping: {
      free: 'Free shipping on orders over $50',
      standard: 'Standard delivery: 3-5 business days',
      express: 'Express delivery: 1-2 business days'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(sampleProduct);
      setSelectedVariant(sampleProduct.variants[1]); // Default to medium pack
      
      // Initialize sample reviews
      setReviews([
        {
          id: 1,
          name: 'Sarah Johnson',
          rating: 5,
          date: '2024-01-15',
          title: 'Absolutely perfect avocados!',
          comment: 'Amazing quality! The avocados were perfectly ripe and delicious. Will definitely order again.',
          verified: true,
          helpful: 12,
          wouldRecommend: true
        },
        {
          id: 2,
          name: 'Michael Chen',
          rating: 4,
          date: '2024-01-10',
          title: 'Great quality with minor issues',
          comment: 'Great product, fast shipping. One avocado was slightly overripe but overall very satisfied.',
          verified: true,
          helpful: 8,
          wouldRecommend: true
        },
        {
          id: 3,
          name: 'Emma Davis',
          rating: 5,
          date: '2024-01-08',
          title: 'Best avocados I\'ve ever had!',
          comment: 'These avocados are incredible! Perfect for my morning toast and smoothies. The taste is so much better than store-bought ones.',
          verified: false,
          helpful: 15,
          wouldRecommend: true
        }
      ]);
      
      setIsLoading(false);
    }, 300);
  }, [resolvedParams.id]);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      selectedVariant: selectedVariant
    };
    addToCart(productToAdd, quantity, selectedVariant);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSubmitReview = (newReview) => {
    // Add new review to the beginning of the list
    setReviews(prevReviews => [newReview, ...prevReviews]);
    
    // Automatically switch to reviews tab to show the new review
    setActiveTab('reviews');
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-gray-300 h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-gray-300 h-20 w-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-300 h-8 rounded"></div>
                <div className="bg-gray-300 h-6 rounded w-3/4"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                <div className="bg-gray-300 h-32 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/categories">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg">
              Continue Shopping
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-orange-600">Categories</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
                priority
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-orange-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-orange-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Sold by {product.seller.name}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-orange-600">
                {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                  {Math.round(((product.originalPrice - (selectedVariant ? selectedVariant.price : product.price)) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Size Options</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{variant.name}</div>
                          <div className="text-sm text-gray-600">
                            {variant.stock} in stock
                          </div>
                        </div>
                        <div className="font-semibold text-orange-600">
                          {formatPrice(variant.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id, selectedVariant)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {isInCart(product.id, selectedVariant) ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    isWishlisted(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={isWishlisted(product.id) ? 'fill-current' : ''} 
                  />
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Truck size={16} className="text-orange-600" />
                <span className="text-sm font-medium">{product.shipping.free}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-green-600" />
                <span className="text-sm">{product.shipping.standard}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'seller', label: 'Seller Info' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
                
                {/* Reviews Summary */}
                {reviews.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {renderStars(Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length))}
                        </div>
                        <div className="text-sm text-gray-600">{reviews.length} reviews</div>
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => {
                          const count = reviews.filter(r => r.rating === rating).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center space-x-3">
                              <span className="text-sm w-3">{rating}</span>
                              <Star className="text-yellow-400 fill-current" size={14} />
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 rounded-full h-2 transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Verified purchases:</span>
                          <span className="font-medium">
                            {reviews.filter(r => r.verified).length}/{reviews.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Would recommend:</span>
                          <span className="font-medium">
                            {Math.round((reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual Reviews */}
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <div className="font-medium">{review.name}</div>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          {review.wouldRecommend && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Recommends
                            </span>
                          )}
                        </div>
                        
                        {review.title && (
                          <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                        )}
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                        
                        {review.photos && review.photos.length > 0 && (
                          <div className="flex space-x-2 mb-4">
                            {review.photos.map((photo, photoIndex) => (
                              <Image
                                key={photoIndex}
                                src={photo.url}
                                alt={`Review photo ${photoIndex + 1}`}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <button className="flex items-center space-x-1 hover:text-orange-600 transition-colors">
                              <span>👍</span>
                              <span>Helpful ({review.helpful || 0})</span>
                            </button>
                            <button className="hover:text-orange-600 transition-colors">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Star className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to review this product!</p>
                    <button 
                      onClick={() => setShowReviewModal(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">
                      {product.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{product.seller.name}</h3>
                    <div className="flex items-center space-x-2">
                      {renderStars(product.seller.rating)}
                      <span className="text-sm text-gray-600">
                        {product.seller.rating} ({product.seller.reviews} reviews)
                      </span>
                      {product.seller.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{product.seller.location}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm">
                    View Store
                  </button>
                  <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center">
                    <MessageCircle size={16} className="mr-2" />
                    Contact Seller
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <EnhancedFAQSection 
            userType="customer"
            title="Product Questions"
            subtitle="Common questions about this product and similar items"
            showContactCTA={false}
            className="max-w-6xl"
          />
        </section>
      </main>
      
      <Footer />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        product={product}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
