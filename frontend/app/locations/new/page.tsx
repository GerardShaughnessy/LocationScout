'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import LocationForm from '../../components/locations/LocationForm';

export default function NewLocationPage() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="min-h-screen p-8 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You need to be logged in to add a location.</p>
        <Link 
          href="/login"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Log In
        </Link>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push('/locations');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/locations"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Locations
          </Link>
        </div>
        
        <LocationForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
} 