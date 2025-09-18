import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock user database - In production, this would be a real database
let users = [
  {
    id: '1',
    email: 'admin@sokoafrica.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
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
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
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
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
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

// Valid roles
const VALID_ROLES = ['customer', 'seller', 'admin', 'moderator'];

export async function POST(request) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      country, 
      role = 'customer',
      agreeToTerms,
      subscribeNewsletter = false
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !country) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      return NextResponse.json(
        { message: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      country: country.trim(),
      role: role,
      isActive: true,
      subscribeNewsletter: subscribeNewsletter,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      profileImage: null,
      bio: null,
      address: null,
      city: null,
      postalCode: null
    };

    // Add user to database (in production, this would be a database operation)
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
