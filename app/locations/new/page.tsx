'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewLocationPage() {
  const router = useRouter();

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link 
            href="/locations"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Locations
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Add New Location</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">Location form will be implemented here.</p>
          <button
            onClick={() => router.push('/locations')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Locations
          </button>
        </div>
      </div>
    </div>
  );
} 