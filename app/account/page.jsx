"use client";
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '../lib/validations';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { FormInput } from '../components/forms/FormInput';
import { FormSelect } from '../components/forms/FormSelect';
import { FormButton } from '../components/forms/FormButton';
import { FormAlert } from '../components/forms/FormAlert';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X } from 'lucide-react';

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const { getRoleDisplayName, getRoleColor } = useRoleAccess();
  
  const [isEditing, setIsEditing] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

  const methods = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
      bio: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting, isDirty } } = methods;

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        country: user.country || '',
        bio: user.bio || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setServerMessage({ type: '', text: '' });
    const result = await updateProfile(data);
    if (result.success) {
      setServerMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setServerMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  const handleCancel = () => {
    reset(); // Resets form to defaultValues (or last reset values)
    setIsEditing(false);
    setServerMessage({ type: '', text: '' });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600">Manage your profile and account settings</p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {isEditing ? <X size={16} /> : <Edit size={16} />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
          
          <FormAlert message={serverMessage.text} type={serverMessage.type} />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-orange-600" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{user?.email}</p>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getRoleDisplayName(user?.role)}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormInput name="firstName" label="First Name" disabled={!isEditing} />
                      <FormInput name="lastName" label="Last Name" disabled={!isEditing} />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <p className="text-gray-500">{user?.email}</p>
                      </div>

                      <FormInput name="phone" label="Phone Number" icon={Phone} disabled={!isEditing} />
                      
                      <FormSelect name="country" label="Country" icon={MapPin} disabled={!isEditing}>
                        <option value="Kenya">Kenya</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="South Africa">South Africa</option>
                      </FormSelect>

                      <div className="md:col-span-2">
                        <FormInput name="bio" label="Bio" placeholder="Tell us about yourself..." disabled={!isEditing} />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <FormButton isLoading={isSubmitting} disabled={!isDirty}>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </FormButton>
                      </div>
                    )}
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}