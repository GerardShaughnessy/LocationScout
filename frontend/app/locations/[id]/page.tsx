'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Location {
  _id: string;
  name: string;
  address: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/locations/${id}`);
        setLocation(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching location:', err);
        setError('Failed to fetch location details');
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push('/locations');
    } catch (err: any) {
      console.error('Error deleting location:', err);
      alert('Failed to delete location');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading location details...</div>;
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

  const isOwner = user && location.createdBy && user._id === location.createdBy._id;

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
            <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
            <p className="text-gray-600 mb-4">{location.address}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{location.description}</p>
            </div>
            
            {location.features && location.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Features</h2>
                <ul className="list-disc pl-5">
                  {location.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Coordinates</h2>
              <p className="text-gray-700">Latitude: {location.coordinates.lat}</p>
              <p className="text-gray-700">Longitude: {location.coordinates.lng}</p>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <p className="text-sm text-gray-500">
                Added by {location.createdBy?.name || 'Unknown'} on {new Date(location.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            {isOwner && (
              <div className="flex space-x-4 mt-6">
                <Link 
                  href={`/locations/${id}/edit`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit Location
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${deleteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Location'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 