import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database - In production, this would be a real database
let users = [
  {
    id: '1',
    email: 'admin@sokoafrica.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+254700000000',
    country: 'Kenya',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null
  },
  {
    id: '2',
    email: 'seller@sokoafrica.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'John',
    lastName: 'Seller',
    role: 'seller',
    phone: '+254700000001',
    country: 'Kenya',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null
  },
  {
    id: '3',
    email: 'customer@sokoafrica.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Jane',
    lastName: 'Customer',
    role: 'customer',
    phone: '+254700000002',
    country: 'Kenya',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    
    // Fields that can be updated
    const allowedFields = [
      'firstName', 
      'lastName', 
      'phone', 
      'country', 
      'bio', 
      'address', 
      'city', 
      'postalCode',
      'subscribeNewsletter'
    ];

    // Update only allowed fields
    const updatedUser = { ...users[userIndex] };
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updatedUser[field] = updateData[field];
      }
    });

    updatedUser.updatedAt = new Date().toISOString();

    // Update user in database
    users[userIndex] = updatedUser;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
