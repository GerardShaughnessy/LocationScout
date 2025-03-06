'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import AddressSearch from './AddressSearch';

// Define visibility types
type VisibilityType = 'private' | 'shared' | 'public' | 'all';

// Define map types
type MapType = 'street' | 'satellite' | 'terrain';

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  visibility: 'private' | 'shared' | 'public';
}

// Map layer URLs
const MAP_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  }
};

// Fix Leaflet's default icon issue
function useLeafletIcons() {
  useEffect(() => {
    // Define the interface for the Icon prototype
    interface IconDefault extends L.Icon.Default {
      _getIconUrl?: string;
    }
    
    delete (L.Icon.Default.prototype as IconDefault)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);
}

// Map initialization component
function MapInitializer({ locations }: { locations: Location[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      map.fitBounds(bounds);
    } else {
      // If no locations, try to get user's location
      map.locate({ setView: true, maxZoom: 13 });
    }
    
    // Invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map, locations]);
  
  return null;
}

export default function MapView({ locations = [] }: { locations: Location[] }) {
  const [selectedMapType, setSelectedMapType] = useState<MapType>('street');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityType>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Leaflet icons
  useLeafletIcons();

  const filteredLocations = locations.filter(location => 
    visibilityFilter === 'all' || location.visibility === visibilityFilter
  );

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setSearchLocation({ lat, lng });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        <div className="flex-grow">
          <AddressSearch onSelect={handleAddressSelect} placeholder="Search for a location..." />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'map'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {Object.keys(MAP_LAYERS).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedMapType(type as MapType)}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              selectedMapType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'private', 'shared', 'public'].map((type) => (
          <button
            key={type}
            onClick={() => setVisibilityFilter(type as VisibilityType)}
            className={`px-4 py-2 rounded-md capitalize ${
              visibilityFilter === type
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {viewMode === 'map' ? (
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer {...MAP_LAYERS[selectedMapType]} />
            <MapInitializer locations={filteredLocations} />
            
            {searchLocation && (
              <Marker
                position={[searchLocation.lat, searchLocation.lng]}
                icon={new L.Icon({
                  iconUrl: '/leaflet/marker-icon.png',
                  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
                  shadowUrl: '/leaflet/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>Searched Location</Popup>
              </Marker>
            )}

            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={new L.Icon({
                  iconUrl: `/leaflet/marker-icon-${
                    location.visibility === 'private'
                      ? 'red'
                      : location.visibility === 'shared'
                      ? 'grey'
                      : 'blue'
                  }.png`,
                  iconRetinaUrl: `/leaflet/marker-icon-2x-${
                    location.visibility === 'private'
                      ? 'red'
                      : location.visibility === 'shared'
                      ? 'grey'
                      : 'blue'
                  }.png`,
                  shadowUrl: '/leaflet/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <Link
                      href={`/location-view/${location.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-gray-600 mt-1">{location.address}</p>
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    location.visibility === 'private'
                      ? 'bg-red-100 text-red-800'
                      : location.visibility === 'shared'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {location.visibility}
                </span>
              </div>
              <Link
                href={`/location-view/${location.id}`}
                className="mt-3 inline-block text-indigo-600 hover:text-indigo-800"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 