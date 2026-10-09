import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Property } from '../lib/databasetypes';

interface UsePropertiesOptions {
  wilaya?: string;
  listingType?: 'vente' | 'location';
  onlyMine?: boolean; // filtre sur owner_id = utilisateur connecté
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('properties')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (options.wilaya) query = query.eq('wilaya', options.wilaya);
    if (options.listingType) query = query.eq('listing_type', options.listingType);

    if (options.onlyMine) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) query = query.eq('owner_id', userData.user.id);
    }

    const { data, error } = await query;
    if (error) setError(error.message);
    else setProperties(data as Property[]);
    setLoading(false);
  }, [options.wilaya, options.listingType, options.onlyMine]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  async function createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { error: 'Utilisateur non connecté' };

    const { data, error } = await supabase
      .from('properties')
      .insert({ ...property, owner_id: userData.user.id })
      .select()
      .single();

    if (!error) await fetchProperties();
    return { data, error: error?.message ?? null };
  }

  async function updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error) await fetchProperties();
    return { data, error: error?.message ?? null };
  }

  async function deleteProperty(id: string) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (!error) await fetchProperties();
    return { error: error?.message ?? null };
  }

  return { properties, loading, error, refetch: fetchProperties, createProperty, updateProperty, deleteProperty };
}