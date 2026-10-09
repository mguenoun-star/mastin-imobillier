// Types correspondant au schéma SQL (voir sql/schema.sql)
// Tu peux aussi générer ce fichier automatiquement avec :
// npx supabase gen types typescript --project-id <ton-project-id> > src/lib/database.types.ts

export type PropertyType = 'appartement' | 'villa' | 'terrain' | 'local' | 'bureau';
export type ListingType = 'vente' | 'location';

export interface Profile {
  id: string; // = auth.users.id
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_agent: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  currency: string; // 'DZD' par défaut
  property_type: PropertyType;
  listing_type: ListingType;
  wilaya: string; // ex: "Alger", "Oran", "Sétif"
  commune: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  surface_m2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  images: string[]; // URLs publiques Supabase Storage
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}