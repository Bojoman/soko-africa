import { NextResponse } from 'next/server';

// Sample products data (in a real app, this would come from a database)
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
      'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=800&h=600&fit=crop&q=80'
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
    shipping: {
      free: 'Free shipping on orders over $50',
      standard: 'Standard delivery: 3-5 business days',
      express: 'Express delivery: 1-2 business days'
    },
    inStock: true,
    onSale: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Remove product
    products.splice(productIndex, 1);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
