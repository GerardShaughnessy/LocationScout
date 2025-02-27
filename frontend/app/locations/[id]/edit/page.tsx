'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LocationFormData {
  name: string;
  address: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

export default function EditLocationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useAuth();
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    description: '',
    coordinates: {
      lat: 0,
      lng: 0
    },
    features: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/locations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const location = response.data;
        setFormData({
          name: location.name,
          address: location.address,
          description: location.description,
          coordinates: location.coordinates,
          features: location.features || []
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching location:', err);
        setError('Failed to fetch location details');
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/locations/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      router.push(`/locations/${id}`);
    } catch (err: any) {
      console.error('Error updating location:', err);
      setError(err.response?.data?.message || 'Failed to update location');
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('coordinates.')) {
      const coordField = name.split('.')[1];
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [coordField]: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading location data...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            href={`/locations/${id}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Location Details
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Edit Location</h1>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                name="coordinates.lat"
                value={formData.coordinates.lat}
                onChange={handleChange}
                step="any"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                name="coordinates.lng"
                value={formData.coordinates.lng}
                onChange={handleChange}
                step="any"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            
            {formData.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Parking available"
                />
                
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Add Feature
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            
            <Link 
              href={`/locations/${id}`}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 