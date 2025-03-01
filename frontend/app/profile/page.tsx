'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const [userLocations, setUserLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserLocations();
    }
  }, [user]);

  const fetchUserLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoadingLocations(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/locations/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserLocations(response.data);
      setIsLoadingLocations(false);
    } catch (error) {
      console.error('Error fetching user locations:', error);
      setIsLoadingLocations(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Locations</h2>
                <Link
                  href="/location-new"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Add New Location
                </Link>
              </div>
              
              {isLoadingLocations ? (
                <p>Loading your locations...</p>
              ) : userLocations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userLocations.map((location: any) => (
                    <div key={location._id} className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">{location.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{location.address}</p>
                      <p className="text-gray-600 text-sm mb-3">Category: {location.category}</p>
                      <div className="flex space-x-3">
                        <Link
                          href={`/location-view/${location._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/location-edit/${location._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="mb-4">You haven't added any locations yet.</p>
                  <Link
                    href="/location-new"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Your First Location
                  </Link>
                </div>
              )}
            </div>
            
            <div className="border-t pt-6">
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 