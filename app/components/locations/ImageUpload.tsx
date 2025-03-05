'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ImageUploadProps {
  locationId: string;
  onUploadSuccess: () => void;
}

export default function ImageUpload({ locationId, onUploadSuccess }: ImageUploadProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files || files.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to upload images');
      return;
    }
    
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/api/locations/${locationId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setFiles(null);
      setUploading(false);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Upload Images</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images (Max 5)
          </label>
          
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          type="submit"
          disabled={uploading || !files}
          className={`px-4 py-2 rounded-md text-white ${
            uploading || !files
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </form>
    </div>
  );
} 