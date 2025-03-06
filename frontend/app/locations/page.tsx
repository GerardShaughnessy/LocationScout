'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import dynamic from 'next/dynamic';

// Import MapView component dynamically to avoid SSR issues
const MapView = dynamic(
  () => import('../components/map/MapView'),
  { ssr: false }
);

export default function LocationsPage() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Locations</h1>
          {user && (
            <Link 
              href="/location-new"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add New Location
            </Link>
          )}
        </div>
      </div>
      
      {user ? (
        <MapView />
      ) : (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">Please log in to view and manage locations.</p>
              <Link 
                href="/login" 
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 