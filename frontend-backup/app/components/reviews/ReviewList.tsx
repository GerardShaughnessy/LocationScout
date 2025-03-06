'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ReviewType {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface ReviewListProps {
  locationId: string;
  reviews: ReviewType[];
  onReviewDeleted: () => void;
}

export default function ReviewList({ locationId, reviews, onReviewDeleted }: ReviewListProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const deleteReview = async (reviewId: string) => {
    if (!user) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/api/locations/${locationId}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsDeleting(false);
      onReviewDeleted();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
      setIsDeleting(false);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">No reviews yet. Be the first to review this location!</p>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="ml-2 text-sm font-medium">{review.name}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              {user && user.id === review.user && (
                <button
                  onClick={() => deleteReview(review._id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            
            <p className="mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 