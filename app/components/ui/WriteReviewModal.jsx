"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  Star, 
  User, 
  Mail, 
  MessageSquare,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function WriteReviewModal({ isOpen, onClose, product, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    title: '',
    comment: '',
    name: '',
    email: '',
    wouldRecommend: true,
    verified: false
  });
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setReviewData({
        title: '',
        comment: '',
        name: '',
        email: '',
        wouldRecommend: true,
        verified: false
      });
      setPhotos([]);
      setIsSubmitting(false);
      setShowThankYou(false);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!reviewData.title.trim()) {
      newErrors.title = 'Review title is required';
    }
    if (!reviewData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    }
    if (reviewData.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }
    if (!reviewData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!reviewData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(reviewData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReview = {
        id: Date.now(),
        ...reviewData,
        rating,
        date: new Date().toISOString().split('T')[0],
        photos,
        productId: product?.id,
        helpful: 0,
        verified: Math.random() > 0.3 // Simulate 70% chance of verified purchase
      };

      if (onSubmitReview) {
        onSubmitReview(newReview);
      }

      setShowThankYou(true);
      
      // Auto close after showing thank you
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    
    if (photos.length + files.length > maxFiles) {
      setErrors({ photos: `You can only upload up to ${maxFiles} photos` });
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ photos: 'Each photo must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear photo errors
    setErrors(prev => ({ ...prev, photos: '' }));
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const renderStarRating = (interactive = true) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`p-1 transition-colors ${interactive ? 'hover:scale-110' : ''}`}
          >
            <Star
              size={24}
              className={`${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {showThankYou ? (
            // Thank You Screen
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-4">
                Your review has been submitted successfully. It will be published after moderation.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span>Your rating: {rating} out of 5 stars</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Star className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
                    <p className="text-sm text-gray-600">
                      {product?.name || 'Product Name'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Overall Rating *
                  </label>
                  <div className="flex items-center space-x-4">
                    {renderStarRating()}
                    <span className="text-sm text-gray-600">
                      {rating > 0 && (
                        <>
                          {rating} out of 5 stars
                          {rating === 1 && ' - Poor'}
                          {rating === 2 && ' - Fair'}
                          {rating === 3 && ' - Good'}
                          {rating === 4 && ' - Very Good'}
                          {rating === 5 && ' - Excellent'}
                        </>
                      )}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                  )}
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={reviewData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Summarize your experience..."
                    maxLength={100}
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {reviewData.title.length}/100 characters
                    </p>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                      errors.comment ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    maxLength={1000}
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.comment && (
                      <p className="text-sm text-red-600">{errors.comment}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {reviewData.comment.length}/1000 characters
                    </p>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Add Photos (Optional)
                  </label>
                  <div className="space-y-3">
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {photos.map((photo) => (
                          <div key={photo.id} className="relative">
                            <Image
                              src={photo.url}
                              alt="Review photo"
                              width={100}
                              height={100}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {photos.length < 5 && (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-600 transition-colors cursor-pointer block">
                        <div className="text-center">
                          <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600">
                            Click to add photos ({photos.length}/5)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    
                    {errors.photos && (
                      <p className="text-sm text-red-600">{errors.photos}</p>
                    )}
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Would you recommend this product?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        checked={reviewData.wouldRecommend === true}
                        onChange={() => handleInputChange('wouldRecommend', true)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        checked={reviewData.wouldRecommend === false}
                        onChange={() => handleInputChange('wouldRecommend', false)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-medium text-gray-900">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={reviewData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={reviewData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="text-red-500 mr-2" size={20} />
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    * Required fields
                  </p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
