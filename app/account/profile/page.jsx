"use client";
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '../../lib/validations';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormButton } from '../../components/forms/FormButton';
import { FormAlert } from '../../components/forms/FormAlert';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
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
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/account"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Account
            </Link>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Update your personal information and preferences</p>
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
                
                {/* Account Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span>Member since:</span>
                      <span className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Account status:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormInput name="firstName" label="First Name" disabled={!isEditing} />
                      <FormInput name="lastName" label="Last Name" disabled={!isEditing} />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail size={16} className="inline mr-2" />
                          Email Address
                        </label>
                        <div className="bg-gray-50 px-3 py-2 rounded-md border">
                          <p className="text-gray-700">{user?.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed. Contact support if needed.
                          </p>
                        </div>
                      </div>

                      <FormInput 
                        name="phone" 
                        label="Phone Number" 
                        icon={Phone} 
                        disabled={!isEditing}
                        placeholder="+254 700 123 456" 
                      />
                      
                      <FormSelect name="country" label="Country" icon={MapPin} disabled={!isEditing}>
                        <option value="">Select Country</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Egypt">Egypt</option>
                        <option value="Senegal">Senegal</option>
                      </FormSelect>

                      <FormInput name="city" label="City" disabled={!isEditing} />
                      <FormInput name="postalCode" label="Postal Code" disabled={!isEditing} />

                      <div className="md:col-span-2">
                        <FormInput 
                          name="address" 
                          label="Street Address" 
                          placeholder="Enter your full address..." 
                          disabled={!isEditing} 
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormInput 
                          name="bio" 
                          label="Bio" 
                          placeholder="Tell us about yourself..." 
                          disabled={!isEditing}
                          as="textarea"
                          rows={4} 
                        />
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

              {/* Privacy Settings Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about orders and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Link
                      href="/account/security"
                      className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                    >
                      Setup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
