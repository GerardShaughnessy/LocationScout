'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditLocationPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the ID from the URL
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const locationId = pathParts[pathParts.length - 2]; // Get the ID from the URL
      setId(locationId);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/locations"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Locations
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Edit Location</h1>
        <p>Location ID: {id}</p>
        
        <div className="mt-6">
          <p>Edit form will be implemented here.</p>
          <button
            onClick={() => router.push('/locations')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Locations
          </button>
        </div>
      </div>
    </div>
  );
} 