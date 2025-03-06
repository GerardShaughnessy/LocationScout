'use client';

import Link from 'next/link';
import LocationForm from '../components/locations/LocationForm';

export default function NewLocation() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/locations" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Locations
          </Link>
        </div>
        <LocationForm />
      </div>
    </div>
  );
} 