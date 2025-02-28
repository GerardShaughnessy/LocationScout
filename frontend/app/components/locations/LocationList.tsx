'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import LocationSearch from './LocationSearch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Location {
  _id: string;
  name: string;
  address: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/locations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  useEffect(() => {
    // Apply search filter
    if (searchQuery) {
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [locations, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <div className="text-center py-8">Loading locations...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (filteredLocations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">
          {searchQuery 
            ? 'No locations found matching your search.' 
            : 'No locations found. Add your first location to get started!'}
        </p>
        {!searchQuery && (
          <Link 
            href="/locations/new" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Your First Location
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <LocationSearch onSearch={handleSearch} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <div key={location._id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
              <p className="text-gray-600 mb-2">{location.address}</p>
              <p className="text-gray-700 mb-4 line-clamp-2">{location.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(location.createdAt).toLocaleDateString()}
                </span>
                <Link 
                  href={`/locations/${location._id}`}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 