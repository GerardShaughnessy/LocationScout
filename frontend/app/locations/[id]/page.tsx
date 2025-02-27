'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LocationDetailPage() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the ID from the URL
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const locationId = pathParts[pathParts.length - 1]; // Get the ID from the URL
      setId(locationId);
      setLoading(false);
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
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">Location details will be loaded here.</p>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Link 
                href={`/locations/${id}/edit`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit Location
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 