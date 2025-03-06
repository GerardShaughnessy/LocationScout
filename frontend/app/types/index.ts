export interface Location {
  _id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdBy: string;
  images: {
    _id: string;
    url: string;
    publicId: string;
  }[];
  createdAt: string;
  updatedAt: string;
} 