import { NextResponse } from 'next/server';

// Sample products data
const products = [
  {
    id: 'kenyan-avocadoes',
    name: 'Fresh Kenyan Avocadoes (6 pack)',
    price: 12.99,
    originalPrice: 15.99,
    image: 'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=300&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=800&h=600&fit=crop&q=80',
    ],
    rating: 4.8,
    reviews: 156,
    badge: 'Seasonal',
    category: 'agriculture',
    description: 'Premium quality Kenyan avocadoes, hand-picked from the fertile highlands. These creamy, buttery avocados are perfect for salads, smoothies, or simply enjoyed on their own.',
    features: [
      'Premium quality from Kenyan highlands',
      'Hand-picked and carefully selected',
      'Sustainable farming practices',
      'Fresh delivery guarantee'
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
    inStock: true,
    onSale: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'ethiopian-coffee',
    name: 'Ethiopian Single Origin Coffee',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    reviews: 234,
    badge: 'Bestseller',
    category: 'agriculture',
    description: 'Rich, aromatic Ethiopian coffee beans sourced from the birthplace of coffee. Perfect for brewing your morning cup.',
    features: [
      'Single origin from Ethiopia',
      'Rich and aromatic flavor',
      'Perfect for all brewing methods',
      'Freshly roasted'
    ],
    specifications: {
      'Origin': 'Ethiopia',
      'Weight': '500g',
      'Roast Level': 'Medium',
      'Flavor Notes': 'Fruity, Wine-like',
      'Certification': 'Fair Trade'
    },
    variants: [
      { id: '250g', name: '250g Pack', price: 14.99, stock: 20 },
      { id: '500g', name: '500g Pack', price: 24.99, stock: 15 },
      { id: '1kg', name: '1kg Pack', price: 44.99, stock: 8 }
    ],
    seller: {
      name: 'Ethiopian Coffee Co.',
      rating: 4.8,
      reviews: 892,
      verified: true,
      location: 'Addis Ababa, Ethiopia'
    },
    inStock: true,
    onSale: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'maasai-basket',
    name: 'Maasai Hand-woven Basket',
    price: 35.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 67,
    badge: 'Handmade',
    category: 'handcrafted',
    description: 'Beautiful hand-woven basket by Maasai artisans. Perfect for storage or as a decorative piece.',
    features: [
      'Hand-woven by Maasai artisans',
      'Natural materials',
      'Unique traditional patterns',
      'Durable construction'
    ],
    specifications: {
      'Material': 'Natural grass and fibers',
      'Dimensions': '30cm x 20cm x 15cm',
      'Weight': '500g',
      'Care': 'Hand wash only',
      'Origin': 'Maasai Mara, Kenya'
    },
    variants: [
      { id: 'small', name: 'Small Basket', price: 25.99, stock: 12 },
      { id: 'medium', name: 'Medium Basket', price: 35.99, stock: 8 },
      { id: 'large', name: 'Large Basket', price: 45.99, stock: 5 }
    ],
    seller: {
      name: 'Maasai Crafts Collective',
      rating: 4.9,
      reviews: 156,
      verified: true,
      location: 'Maasai Mara, Kenya'
    },
    inStock: true,
    onSale: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

    let filteredProducts = [...products];

    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.badge?.toLowerCase().includes(searchTerm)
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
    }

    if (rating) {
      filteredProducts = filteredProducts.filter(product => product.rating >= parseFloat(rating));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'bestselling':
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response = {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalProducts: filteredProducts.length,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1
      },
      filters: {
        category,
        search,
        minPrice,
        maxPrice,
        rating,
        sortBy
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new product
    const newProduct = {
      id: `product-${Date.now()}`,
      ...body,
      rating: 0,
      reviews: 0,
      inStock: true,
      onSale: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real application, you would save this to a database
    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
