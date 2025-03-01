'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to LocationScout
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Find and share the perfect locations for your next project
          </p>
          
          <div className="mt-10">
            {user ? (
              <div className="space-y-4">
                <p className="text-lg">
                  Welcome back, <span className="font-medium">{user.name}</span>!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/locations"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Browse Locations
                  </Link>
                  <Link
                    href="/location-new"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add New Location
                  </Link>
                  <Link
                    href="/profile"
                    className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg">
                  Join our community to discover and share amazing locations
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/locations"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Browse Locations
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Use LocationScout?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Discover Locations</h3>
              <p className="text-gray-500">
                Find the perfect locations for your film, photography, or event projects.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Share Your Spots</h3>
              <p className="text-gray-500">
                Add your favorite locations and help others discover hidden gems.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect & Collaborate</h3>
              <p className="text-gray-500">
                Join a community of creators and location scouts to collaborate on projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 