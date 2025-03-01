'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ImageGallery from '../../components/locations/ImageGallery';
import ImageUpload from '../../components/locations/ImageUpload';
import StarRating from '../../components/reviews/StarRating';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewList from '../../components/reviews/ReviewList';

// Import the map component dynamically with no SSR
const LocationMap = dynamic(
  () => import('../../components/map/LocationMap'),
  { ssr: false }
);

export default function LocationViewPage() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshImages, setRefreshImages] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const isOwner = user && location && user.id === location.createdBy;

  useEffect(() => {
    // Get the ID from the URL
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const locationId = pathParts[pathParts.length - 1]; // Get the ID from the URL
      setId(locationId);
      setLoading(false);
      setRefreshImages(false);
      setRefreshReviews(false);
    }
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

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
            <h1 className="text-3xl font-bold mb-2">Location Details</h1>
            <p className="text-gray-600 mb-4">Location ID: {id}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Map</h2>
              <LocationMap 
                lat={location.coordinates.lat} 
                lng={location.coordinates.lng} 
                name={location.name} 
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">Location details will be loaded here.</p>
            </div>
            
            {location && location.images && location.images.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <ImageGallery 
                  locationId={location._id} 
                  images={location.images} 
                  isOwner={isOwner}
                  onImageDeleted={() => setRefreshImages(true)} 
                />
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h2 className="text-xl font-semibold mr-2">Reviews</h2>
                <div className="flex items-center">
                  <StarRating rating={location.rating} size="sm" />
                  <span className="ml-2 text-sm">
                    ({location.numReviews} {location.numReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              
              {location.reviews && (
                <ReviewList 
                  locationId={location._id} 
                  reviews={location.reviews} 
                  onReviewDeleted={() => setRefreshReviews(true)} 
                />
              )}
              
              <ReviewForm 
                locationId={location._id}
                onReviewAdded={() => setRefreshReviews(true)}
              />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Link 
                href={`/location-edit/${id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit Location
              </Link>
            </div>
          </div>
        </div>

        {location && isOwner && (
          <ImageUpload 
            locationId={location._id}
            onUploadSuccess={() => setRefreshImages(true)}
          />
        )}
      </div>
    </div>
  );
} 