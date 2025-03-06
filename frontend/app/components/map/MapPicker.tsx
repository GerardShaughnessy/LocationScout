'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onMarkerMove: (lat: number, lng: number) => void;
}

// Map layer URLs
const MAP_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
function MapInitializer({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([latitude, longitude], 13);
    
    // Invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map, latitude, longitude]);
  
  return null;
}

export default function MapPicker({ latitude, longitude, onMarkerMove }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  // Initialize Leaflet icons
  useLeafletIcons();

  // Update position when props change
  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  const handleMarkerDrag = (e: L.LeafletEvent) => {
    const marker = e.target;
    const newPos = marker.getLatLng();
    setPosition([newPos.lat, newPos.lng]);
    onMarkerMove(newPos.lat, newPos.lng);
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer {...MAP_LAYERS.street} />
      <MapInitializer latitude={latitude} longitude={longitude} />
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: handleMarkerDrag,
        }}
      />
    </MapContainer>
  );
} 