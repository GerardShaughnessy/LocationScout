'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

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
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
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
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome to your locations dashboard!</h2>
          
          {user ? (
            <div>
              <p className="mb-4">You can add new locations or view your existing ones.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold">Sample Location</h3>
                  <p>123 Main Street, Anytown</p>
                  <Link 
                    href="/location-view/sample-id"
                    className="mt-2 inline-block text-indigo-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">Please log in to view and manage locations.</p>
              <Link 
                href="/login" 
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 