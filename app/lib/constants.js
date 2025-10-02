/**
 * Application constants for Soko Africa
 */

// Brand Colors - Updated from brand book
export const BRAND_COLORS = {
  darkTeal: '#004A63',
  lightBlue: '#A8D6E2', 
  cream: '#ECE6CC',
  orangeRed: '#CF3604',
  darkBrown: '#663B00',
  brightCyan: '#03B1D0',
  orange: '#ED952A',
  darkRed: '#560000',
};

// Application configuration
export const APP_CONFIG = {
  name: 'Soko Africa',
  description: 'Authentic African Products Global Marketplace',
  version: '1.0.0',
  supportEmail: 'support@sokoafrica.com',
  supportPhone: '+254 700 123 456',
};

// API endpoints
export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/categories',
  users: '/api/users',
  orders: '/api/orders',
  cart: '/api/cart',
  wishlist: '/api/wishlist',
  sellers: '/api/sellers',
  auth: '/api/auth',
  search: '/api/search',
  reviews: '/api/reviews',
};

// Product categories
export const PRODUCT_CATEGORIES = [
  {
    id: 'agriculture',
    name: 'Agri & Natural Products',
    icon: '🌾',
    description: 'Fresh produce, coffee, spices, and natural ingredients',
    subcategories: ['Avocadoes', 'Macadamia', 'Coffee', 'Tea', 'Honey', 'Oranges', 'Spices', 'Grains']
  },
  {
    id: 'handcrafted',
    name: 'Handcrafted Goods',
    icon: '🏺',
    description: 'Pottery, woodwork, sculptures, and traditional crafts',
    subcategories: ['Baskets & Bags', 'Homeware', 'Maasai Market', 'Pottery', 'Woodwork', 'Sculptures']
  },
  {
    id: 'fashion',
    name: 'Textile & Fashion',
    icon: '👗',
    description: 'Ankara fabrics, clothes, and traditional fashion',
    subcategories: ['Ankara Fabrics', 'Clothes', 'Textiles', 'Traditional Wear', 'Accessories', 'Jewelry']
  },
  {
    id: 'beauty',
    name: 'Natural Beauty & Wellness',
    icon: '🧴',
    description: 'Natural oils, soaps, and herbal wellness products',
    subcategories: ['Oils', 'Soaps', 'Herbal Products', 'Skincare', 'Wellness', 'Traditional Medicine']
  },
  {
    id: 'nyamazone',
    name: 'Nyamazone Meats',
    icon: '🥩',
    description: 'Premium quality meats and delicacies',
    subcategories: ['Lamb', 'Beef', 'Fish', 'Chicken', 'Meat Products', 'Game Meat']
  }
];

// Seasonal/Featured Products
export const SEASONAL_PICKS = [
  {
    category: 'Fruits',
    products: ['Avocadoes', 'Oranges', 'Mangoes', 'Pineapples']
  },
  {
    category: 'Textiles',
    products: ['Ankara Fabrics', 'Kente Cloth', 'Traditional Prints']
  },
  {
    category: 'Fashion',
    products: ['Traditional Dresses', 'African Jewelry', 'Handwoven Accessories']
  },
  {
    category: 'Crafts',
    products: ['Maasai Baskets', 'Wood Carvings', 'Pottery']
  }
];

// Currency options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

// Shipping zones
export const SHIPPING_ZONES = [
  {
    name: 'Africa',
    countries: ['KE', 'NG', 'ZA', 'GH', 'TZ', 'UG', 'RW', 'ET'],
    rates: { standard: 5, express: 15 }
  },
  {
    name: 'North America',
    countries: ['US', 'CA'],
    rates: { standard: 15, express: 35 }
  },
  {
    name: 'Europe',
    countries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL'],
    rates: { standard: 12, express: 28 }
  },
  {
    name: 'Asia Pacific',
    countries: ['AU', 'JP', 'SG', 'HK', 'NZ'],
    rates: { standard: 18, express: 40 }
  },
  {
    name: 'Rest of World',
    countries: ['*'],
    rates: { standard: 20, express: 45 }
  }
];

// Order statuses
export const ORDER_STATUSES = [
  { key: 'pending', label: 'Pending', color: 'yellow' },
  { key: 'confirmed', label: 'Confirmed', color: 'blue' },
  { key: 'processing', label: 'Processing', color: 'orange' },
  { key: 'shipped', label: 'Shipped', color: 'purple' },
  { key: 'delivered', label: 'Delivered', color: 'green' },
  { key: 'cancelled', label: 'Cancelled', color: 'red' },
  { key: 'refunded', label: 'Refunded', color: 'gray' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'mpesa', name: 'M-Pesa', icon: '📱' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
];

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Seller verification levels
export const SELLER_VERIFICATION_LEVELS = {
  UNVERIFIED: 'unverified',
  EMAIL_VERIFIED: 'email_verified',
  PHONE_VERIFIED: 'phone_verified',
  DOCUMENT_VERIFIED: 'document_verified',
  FULLY_VERIFIED: 'fully_verified',
};

// Product condition options
export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'vintage', label: 'Vintage' },
];

// Search filters
export const SEARCH_FILTERS = {
  PRICE_RANGES: [
    { min: 0, max: 25, label: 'Under $25' },
    { min: 25, max: 50, label: '$25 - $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: null, label: 'Over $200' },
  ],
  RATINGS: [
    { value: 4, label: '4 stars & up' },
    { value: 3, label: '3 stars & up' },
    { value: 2, label: '2 stars & up' },
    { value: 1, label: '1 star & up' },
  ],
  SORT_OPTIONS: [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'bestselling', label: 'Best Selling' },
  ],
};

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/sokoafrica',
  twitter: 'https://twitter.com/sokoafrica',
  instagram: 'https://instagram.com/sokoafrica',
  linkedin: 'https://linkedin.com/company/sokoafrica',
  youtube: 'https://youtube.com/sokoafrica',
};

// Application limits
export const APP_LIMITS = {
  MAX_CART_ITEMS: 99,
  MAX_WISHLIST_ITEMS: 100,
  MAX_IMAGES_PER_PRODUCT: 10,
  MAX_PRODUCT_DESCRIPTION_LENGTH: 5000,
  MAX_REVIEW_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 8,
  MAX_SEARCH_RESULTS: 100,
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_CRYPTO_PAYMENTS: process.env.NODE_ENV === 'production',
  ENABLE_LIVE_CHAT: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_SELLER_ANALYTICS: true,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_DARK_MODE: false,
};

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  ORDER_CONFIRMATION: 'order_confirmation',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  PASSWORD_RESET: 'password_reset',
  SELLER_VERIFICATION: 'seller_verification',
  NEWSLETTER: 'newsletter',
};
