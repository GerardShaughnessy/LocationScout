'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AddressSearch from '../../components/map/AddressSearch';

// Import MapPicker dynamically to avoid SSR issues
const MapPicker = dynamic(
  () => import('../../components/map/MapPicker'),
  { ssr: false }
);

interface LocationFormData {
  name: string;
  address: string;
  description: string;
  visibility: 'private' | 'shared' | 'public';
  latitude: number;
  longitude: number;
}

const initialFormData: LocationFormData = {
  name: '',
  address: '',
  description: '',
  visibility: 'private',
  latitude: 37.7749,
  longitude: -122.4194,
};

export default function NewLocationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<LocationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleMarkerMove = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create location');
      }

      router.push('/locations');
    } catch (err) {
      console.error('Error creating location:', err);
      setError('Failed to create location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Location</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Location Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <AddressSearch
              onSelect={handleAddressSelect}
              placeholder="Search for an address or place"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Visibility
            </label>
            <div className="mt-2 space-x-4">
              {['private', 'shared', 'public'].map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value={type}
                    checked={formData.visibility === type}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'private' | 'shared' | 'public' }))}
                    className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location on Map
            </label>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onMarkerMove={handleMarkerMove}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-md text-white ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Location'
              )}
            </button>
          </div>
        </form>
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link 
            href="/locations"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Locations
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Add New Location</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">Location form will be implemented here.</p>
          <button
            onClick={() => router.push('/locations')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Locations
          </button>
        </div>
      </div>
    </div>
  );
} 