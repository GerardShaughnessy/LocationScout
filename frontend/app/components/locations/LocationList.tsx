'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Location {
  _id: string;
  name: string;
  address: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
  photos: {
    url: string;
    caption: string;
  }[];
}

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/locations`);
        setLocations(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch locations');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading locations...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No locations found.</p>
        <Link 
          href="/locations/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Your First Location
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <div key={location._id} className="border rounded-lg overflow-hidden shadow-md">
          {location.photos && location.photos.length > 0 ? (
            <img 
              src={location.photos[0].url} 
              alt={location.name} 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
            <p className="text-gray-600 mb-2">{location.address}</p>
            <p className="text-gray-700 mb-4 line-clamp-2">{location.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Added by {location.createdBy.name}</span>
              <Link 
                href={`/locations/${location._id}`}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 