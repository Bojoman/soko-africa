import { z } from 'zod';
import { USER_ROLES } from '../contexts/AuthContext';

// Phone number regex (supports international formats)
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

// Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

// Registration Schema
export const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().regex(phoneRegex, { message: 'Invalid phone number' }),
  country: z.string().min(1, { message: 'Country is required' }),
  role: z.nativeEnum(USER_ROLES, { message: 'Please select an account type' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password cannot exceed 128 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, {
      message: 'Password must contain at least one special character (@$!%*?&)',
    })
    // Backend allows only these characters; reject e.g. '#', '_', '-', spaces.
    .regex(/^[A-Za-z\d@$!%*?&]+$/, {
      message: 'Password may only contain letters, numbers, and @$!%*?&',
    }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  subscribeNewsletter: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // a an error on the confirmPassword field
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(32, { message: 'Invalid reset token' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(128, { message: 'Password cannot exceed 128 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&]/, {
        message: 'Password must contain at least one special character (@$!%*?&)'
      })
      .regex(/^[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password may only contain letters, numbers, and @$!%*?&'
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().regex(phoneRegex, { message: 'Invalid phone number' }),
  country: z.string().min(1, { message: 'Country is required' }),
  bio: z.string().max(500, { message: 'Bio cannot exceed 500 characters' }).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

// Card and M-Pesa helpers
const cardNumberRegex = /^[0-9 ]{12,23}$/;
const cardExpiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
const cardCvvRegex = /^\d{3,4}$/;
const mpesaRegex = /^(?:\+?254|0)?[17]\d{8}$/;

// Checkout schema (multi-step)
export const checkoutSchema = z
  .object({
    // Step 1 — Contact
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(phoneRegex, { message: 'Invalid phone number' }),
    // Step 2 — Shipping
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    address: z.string().min(3, { message: 'Address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().optional(),
    postalCode: z.string().min(2, { message: 'Postal code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    shippingMethod: z.enum(['standard', 'express'], {
      message: 'Choose a shipping method'
    }),
    // Step 3 — Payment. 'card' is handled by Stripe Elements (no raw card
    // fields collected here), 'paypal' goes via the PayPal Orders flow,
    // 'mpesa' uses Daraja STK Push.
    paymentMethod: z.enum(['card', 'paypal', 'mpesa'], {
      message: 'Choose a payment method'
    }),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    cardName: z.string().optional(),
    mpesaPhone: z.string().optional(),
    saveCard: z.boolean().optional(),
    // Step 4 — Review
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: 'You must agree to the terms before placing your order'
    })
  })
  .superRefine((data, ctx) => {
    // 'card' is now collected via Stripe Elements at confirmation time; we
    // intentionally don't validate raw card fields in this schema anymore.
    if (data.paymentMethod === 'mpesa') {
      if (!data.mpesaPhone || !mpesaRegex.test(data.mpesaPhone.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mpesaPhone'],
          message: 'Enter a valid Kenyan phone number'
        });
      }
    }
  });

// Silence "unused" lint for helpers we keep around for callers still doing
// inline validation (e.g. saved-cards UI). Safe to remove if unused.
void cardNumberRegex;
void cardExpiryRegex;
void cardCvvRegex;

// Per-step field groupings for multi-step UIs
export const CHECKOUT_STEP_FIELDS = {
  contact: ['email', 'phone'],
  shipping: [
    'firstName',
    'lastName',
    'address',
    'city',
    'state',
    'postalCode',
    'country',
    'shippingMethod'
  ],
  payment: ['paymentMethod', 'mpesaPhone'],
  review: ['agreeToTerms']
};
