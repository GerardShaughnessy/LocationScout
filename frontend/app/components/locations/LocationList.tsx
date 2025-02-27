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
}

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log('Fetching locations from:', `${API_URL}/api/locations`);
        const response = await axios.get(`${API_URL}/api/locations`);
        console.log('Locations data:', response.data);
        setLocations(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching locations:', err);
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
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <p className="mt-2">API URL: {API_URL}</p>
      </div>
    );
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
    <div>
      <h2 className="text-xl font-bold mb-4">Your Locations ({locations.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <div key={location._id} className="border p-4 rounded-md">
            <h3 className="font-bold">{location.name}</h3>
            <p>{location.address}</p>
            <p className="mt-2 text-sm text-gray-600">{location.description}</p>
            <Link 
              href={`/locations/${location._id}`}
              className="mt-2 inline-block text-indigo-600"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 