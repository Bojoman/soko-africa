"use client";
import React, { Suspense } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { FormInput } from '../../components/forms/FormInput';
import { FormButton } from '../../components/forms/FormButton';
import { FormAlert } from '../../components/forms/FormAlert';
import { resetPasswordSchema } from '../../lib/validations';
import { authApi } from '../../lib/api';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [serverError, setServerError] = React.useState('');
  const [done, setDone] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '', token }
  });

  React.useEffect(() => {
    methods.setValue('token', token);
  }, [token, methods]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await authApi.resetPassword(data.token, data.password);
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (error) {
      setServerError(error.message || 'Could not reset password');
    }
  };

  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-600 mb-6">This reset link is invalid or incomplete.</p>
        <Link href="/auth/forgot-password" className="text-soko-orange font-semibold hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto mb-4 text-green-600" size={56} />
        <h1 className="text-2xl font-bold text-soko-dark-teal mb-2">Password updated</h1>
        <p className="text-gray-600">
          Your Soko Africa password has been changed. Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-soko-dark-teal mb-2">Set a new password</h1>
        <p className="text-gray-600">Choose a strong password for your SokoAfrica account.</p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...methods.register('token')} />
          <FormAlert message={serverError} type="error" />
          <FormInput
            name="password"
            label="New password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter a new password"
            icon={Lock}
            showPassword={showPassword}
            togglePassword={() => setShowPassword((prev) => !prev)}
            EyeIcon={Eye}
            EyeOffIcon={EyeOff}
          />
          <FormInput
            name="confirmPassword"
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your new password"
            icon={Lock}
            showPassword={showConfirmPassword}
            togglePassword={() => setShowConfirmPassword((prev) => !prev)}
            EyeIcon={Eye}
            EyeOffIcon={EyeOff}
          />
          <p className="text-xs text-gray-500">
            At least 8 characters with uppercase, lowercase, a number, and a special
            character (@$!%*?&amp;).
          </p>
          <FormButton isLoading={methods.formState.isSubmitting}>Update password</FormButton>
        </form>
      </FormProvider>
      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center text-soko-orange font-medium hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back to login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto px-6 py-16">
        <Suspense fallback={<p className="text-center text-gray-500">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
