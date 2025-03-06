'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';
import ImageGallery from '../../components/locations/ImageGallery';
import ImageUpload from '../../components/locations/ImageUpload';
import StarRating from '../../components/reviews/StarRating';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewList from '../../components/reviews/ReviewList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Import the map component dynamically with no SSR
const LocationMap = dynamic(
  () => import('../../components/map/LocationMap'),
  { ssr: false }
);

interface ReviewType {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface ImageType {
  _id: string;
  url: string;
  publicId: string;
}

interface Location {
  _id: string;
  name: string;
  address: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  visibility: 'private' | 'shared' | 'public';
  createdBy: string;
  images?: ImageType[];
  rating?: number;
  numReviews?: number;
  reviews?: ReviewType[];
}

export default function LocationViewPage() {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get the ID from the URL
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const locationId = pathParts[pathParts.length - 1];
      fetchLocation(locationId);
    }
  }, []);

  const fetchLocation = async (locationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      
      const data = await response.json();
      setLocation(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching location:', err);
      setError('Failed to fetch location details');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !location) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error || 'Location not found'}</p>
        <Link 
          href="/locations"
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Locations
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === location.createdBy;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/locations"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Locations
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
                <p className="text-gray-600">{location.address}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                location.visibility === 'private' ? 'bg-red-100 text-red-800' :
                location.visibility === 'shared' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {location.visibility.charAt(0).toUpperCase() + location.visibility.slice(1)}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{location.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Map</h2>
              <LocationMap 
                lat={location.coordinates.lat} 
                lng={location.coordinates.lng} 
                name={location.name} 
              />
            </div>
            
            {location.images && location.images.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <ImageGallery 
                  locationId={location._id} 
                  images={location.images} 
                  isOwner={isOwner || false}
                  onImageDeleted={() => fetchLocation(location._id)} 
                />
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h2 className="text-xl font-semibold mr-2">Reviews</h2>
                {location.rating && (
                  <div className="flex items-center">
                    <StarRating rating={location.rating} size="sm" />
                    <span className="ml-2 text-sm">
                      ({location.numReviews} {location.numReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}
              </div>
              
              {location.reviews && location.reviews.length > 0 && (
                <ReviewList 
                  locationId={location._id} 
                  reviews={location.reviews} 
                  onReviewDeleted={() => fetchLocation(location._id)} 
                />
              )}
              
              <ReviewForm 
                locationId={location._id}
                onReviewAdded={() => fetchLocation(location._id)}
              />
            </div>
            
            {isOwner && (
              <div className="flex space-x-4 mt-6">
                <Link 
                  href={`/location-edit/${location._id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit Location
                </Link>
              </div>
            )}
          </div>
        </div>

        {isOwner && (
          <ImageUpload 
            locationId={location._id}
            onUploadSuccess={() => fetchLocation(location._id)}
          />
        )}
      </div>
    </div>
  );
} 