'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import LocationList from '../components/locations/LocationList';

export default function LocationsPage() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Locations</h1>
          {user && (
            <Link 
              href="/locations/new"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add New Location
            </Link>
          )}
        </div>
        
        {user ? (
          <LocationList />
        ) : (
          <div className="text-center py-8">
            <p className="mb-4">Please log in to view and manage locations.</p>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 