"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validations';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { FormInput } from '../../components/forms/FormInput';
import { FormCheckbox } from '../../components/forms/FormCheckbox';
import { FormButton } from '../../components/forms/FormButton';
import { FormAlert } from '../../components/forms/FormAlert';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

function LoginForm() {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const getDefaultRedirect = React.useCallback((role) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'seller': return '/seller/dashboard';
      case 'moderator': return '/moderator/dashboard';
      default: return '/';
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      const redirectTo = searchParams.get('redirect') || getDefaultRedirect(user.role);
      router.push(redirectTo);
    }
  }, [isAuthenticated, authLoading, user, router, searchParams, getDefaultRedirect]);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please log in.');
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMessage('');
    const result = await login(data.email, data.password);
    if (!result.success) {
      setServerError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  if (authLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your Soko Africa account</p>
              </div>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <FormAlert message={serverError} type="error" />
                  <FormAlert message={successMessage} type="success" />

                  <FormInput
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    icon={Mail}
                  />

                  <FormInput
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    icon={Lock}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                    EyeIcon={Eye}
                    EyeOffIcon={EyeOff}
                  />

                  <div className="flex items-center justify-between">
                    <FormCheckbox name="rememberMe" label="Remember me" />
                    <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                      Forgot password?
                    </Link>
                  </div>

                  <FormButton isLoading={isSubmitting}>Sign In</FormButton>
                </form>
              </FormProvider>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-orange-600 hover:text-orange-700 font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-center">
              <Image
                src="/utility/login-signup.png"
                alt="African marketplace"
                width={600}
                height={400}
                className="rounded-lg shadow-lg mb-8"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Join Africa's Premier Marketplace
              </h2>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <User className="text-green-600" size={20} />
                  </div>
                  <span className="text-gray-700">Access to exclusive African products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Lock className="text-blue-600" size={20} />
                  </div>
                  <span className="text-gray-700">Secure and trusted transactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Mail className="text-orange-600" size={20} />
                  </div>
                  <span className="text-gray-700">Personalized shopping experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}
