'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Location {
  _id: string;
  name: string;
  address: string;
  photos: { url: string }[];
}

export default function Home() {
  const { user } = useAuth();
  const [featuredLocations, setFeaturedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/locations?limit=3`);
        setFeaturedLocations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured locations:', error);
        setLoading(false);
      }
    };

    fetchFeaturedLocations();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Find the Perfect Location
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Discover and share amazing locations for your next film, photo shoot, or event.
            </p>
            <div className="mt-10">
              {user ? (
                <Link
                  href="/locations"
                  className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100"
                >
                  Explore Locations
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link
                    href="/register"
                    className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="inline-block bg-transparent border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-600"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Locations</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Check out some of our most popular locations
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading featured locations...</div>
          ) : featuredLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredLocations.map((location) => (
                <div key={location._id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 bg-gray-200">
                    {location.photos && location.photos.length > 0 ? (
                      <img
                        src={location.photos[0].url}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
                    <p className="text-gray-600 mb-4">{location.address}</p>
                    <Link
                      href={`/locations/${location._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured locations available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/locations"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              LocationScout makes it easy to find and share amazing locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">
                Browse through our collection of unique locations for your next project.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">
                Add your own locations and help others find the perfect spot.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">
                Contact location owners and schedule your next shoot or event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your perfect location?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join LocationScout today and discover amazing places for your next project.
          </p>
          {user ? (
            <Link
              href="/locations/new"
              className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100"
            >
              Add a Location
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
} 