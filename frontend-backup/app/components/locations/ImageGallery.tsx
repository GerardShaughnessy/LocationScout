'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ImageType {
  _id: string;
  url: string;
  publicId: string;
}

interface ImageGalleryProps {
  locationId: string;
  images: ImageType[];
  isOwner: boolean;
  onImageDeleted: () => void;
}

export default function ImageGallery({ locationId, images, isOwner, onImageDeleted }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const openModal = (image: ImageType) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const deleteImage = async (imageId: string) => {
    if (!user) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/api/locations/${locationId}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsDeleting(false);
      closeModal();
      onImageDeleted();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image. Please try again.');
      setIsDeleting(false);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">No images available for this location.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div 
            key={image._id} 
            className="relative h-48 cursor-pointer overflow-hidden rounded-md"
            onClick={() => openModal(image)}
          >
            <Image
              src={image.url}
              alt="Location"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-medium">Location Image</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="relative h-[60vh] w-full">
              <Image
                src={selectedImage.url}
                alt="Location"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm p-4">{error}</p>}
            
            {isOwner && (
              <div className="p-4 border-t">
                <button
                  onClick={() => deleteImage(selectedImage._id)}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-md text-white ${
                    isDeleting
                      ? 'bg-red-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Image'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 