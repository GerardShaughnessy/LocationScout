'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Define visibility types
type VisibilityType = 'private' | 'shared' | 'public';

interface Location {
  _id: string;
  name: string;
  address: string;
  description: string;
  visibility: VisibilityType;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Custom marker icons for different visibility types
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const markerIcons = {
  private: createMarkerIcon('#FF4444'),  // Red
  shared: createMarkerIcon('#808080'),   // Gray
  public: createMarkerIcon('#4444FF'),   // Blue
};

export default function MapView() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityType[]>(['private', 'shared', 'public']);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fix Leaflet icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    // Fetch locations
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  if (!mounted) return null;

  const toggleVisibility = (type: VisibilityType) => {
    setVisibilityFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredLocations = locations.filter(loc => 
    visibilityFilter.includes(loc.visibility)
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Visibility Toggle Bar */}
      <div className="bg-white p-4 shadow-md z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => toggleVisibility('private')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                visibilityFilter.includes('private') ? 'bg-red-100 text-red-700' : 'bg-gray-100'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Private</span>
            </button>
            <button
              onClick={() => toggleVisibility('shared')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                visibilityFilter.includes('shared') ? 'bg-gray-200 text-gray-700' : 'bg-gray-100'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Shared</span>
            </button>
            <button
              onClick={() => toggleVisibility('public')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                visibilityFilter.includes('public') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Public</span>
            </button>
          </div>
          
          <button
            onClick={() => setViewMode(prev => prev === 'map' ? 'list' : 'map')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {viewMode === 'map' ? 'Switch to List' : 'Switch to Map'}
          </button>
        </div>
      </div>

      {/* Map/List View */}
      <div className="flex-1">
        {viewMode === 'map' ? (
          <MapContainer
            center={[37.7749, -122.4194]} // Default to San Francisco
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredLocations.map((location) => (
              <Marker
                key={location._id}
                position={[location.coordinates.lat, location.coordinates.lng]}
                icon={markerIcons[location.visibility]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <Link
                      href={`/location/${location._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 block"
                    >
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <div
                  key={location._id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        location.visibility === 'private' ? 'bg-red-500' :
                        location.visibility === 'shared' ? 'bg-gray-500' : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-sm text-gray-600 capitalize">{location.visibility}</span>
                  </div>
                  <h3 className="font-bold">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-sm text-gray-500 mt-2">{location.description}</p>
                  <Link
                    href={`/location/${location._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm mt-4 block"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 