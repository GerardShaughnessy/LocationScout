'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ReviewFormProps {
  locationId: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({ locationId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      setError('Please enter a comment');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/locations/${locationId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRating(0);
      setComment('');
      setSubmitting(false);
      onReviewAdded();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Failed to submit review. Please try again.');
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p>Please log in to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating 
            rating={rating} 
            size="lg" 
            editable={true} 
            onChange={setRating} 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your experience with this location..."
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded-md text-white ${
            submitting
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
} 