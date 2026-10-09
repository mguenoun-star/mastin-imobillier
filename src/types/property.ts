export type TransactionType = 'sale' | 'rent';
export type PropertyType = 'appartement' | 'villa' | 'studio' | 'duplex' | 'penthouse' | 'terrain' | 'local';
export type PropertyStatus = 'published' | 'draft';
export type UserRole = 'chef' | 'client';

export interface Property {
  id: string;
  title: string;
  price: number;
  currency: 'DZD';
  transactionType: TransactionType;
  propertyType: PropertyType;
  city: string;
  district: string;
  area: number; // in m²
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  description: string;
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  lat: number;
  lng: number;
  instagramUrl?: string;
  whatsappNumber: string;
  amenities: string[];
  viewsCount: number;
  contactsCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  favorites: string[];
}

export interface SearchFilters {
  city: string;
  propertyType: string;
  transactionType: string;
  minPrice: number | '';
  maxPrice: number | '';
  minArea: number | '';
  bedrooms: string;
}
