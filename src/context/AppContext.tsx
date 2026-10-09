import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Property, User, UserRole, SearchFilters } from '../types/property';
import { formatPrice as formatPriceHelper } from '../utils/formatters';
import { useAuth } from './authContext';
import { supabase } from '../lib/supabaseClient';
import { createUuid } from '../utils/ids';

export type AppView = 'home' | 'search' | 'about' | 'contact' | 'detail' | 'add' | 'edit' | 'dashboard' | 'profile' | 'login';
export interface ToastInfo { id: string; message: string; type: 'success' | 'info' | 'error' }
export interface AppContextType {
  properties: Property[]; currentProperty: Property | null; currentUser: User | null;
  currentView: AppView; view: AppView; selectedPropertyId: string | null; editPropertyId: string | null;
  searchFilters: SearchFilters; language: 'fr' | 'ar'; toast: ToastInfo | null; toastMessage: string | null;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>; setLanguage: (lang: 'fr' | 'ar') => void;
  navigateTo: (view: AppView, options?: { propertyId?: string; editId?: string }) => void;
  setView: (view: AppView, propertyId?: string) => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'contactsCount'>) => Promise<{ id: string | null; error: string | null }>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<{ error: string | null }>; deleteProperty: (id: string) => void;
  togglePropertyStatus: (id: string) => void; toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean; incrementViews: (propertyId: string) => void;
  incrementContacts: (propertyId: string) => void; loginWithGoogle: (role: UserRole) => void; logout: () => void;
  switchRole: (role: UserRole) => void; showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  formatPrice: (price: number, transactionType?: 'sale' | 'rent') => string; resetFilters: () => void;
}
const DEFAULT_FILTERS: SearchFilters = { city: '', propertyType: '', transactionType: '', minPrice: '', maxPrice: '', minArea: '', bedrooms: '' };
const AppContext = createContext<AppContextType | undefined>(undefined);
const toAppProperty = (row: Record<string, any>): Property => ({
  ...row,
  transactionType: row.transactionType ?? (row.listing_type === 'location' || row.listing_type === 'rent' ? 'rent' : 'sale'),
  propertyType: row.propertyType ?? row.property_type ?? 'appartement',
  city: row.city ?? row.wilaya ?? '',
  district: row.district ?? row.commune ?? '',
  area: Number(row.area ?? row.surface_m2 ?? 0),
  lat: Number(row.lat ?? row.latitude ?? 0),
  lng: Number(row.lng ?? row.longitude ?? 0),
  status: row.status ?? (row.is_published === false ? 'draft' : 'published'),
  images: row.images ?? [],
  amenities: row.amenities ?? [],
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  viewsCount: Number(row.views_count ?? row.viewsCount ?? 0),
  contactsCount: Number(row.contacts_count ?? row.contactsCount ?? 0),
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const currentUser: User | null = auth.user ? { id: auth.user.id, name: auth.fullName, email: auth.user.email ?? '', avatar: String(auth.user.user_metadata?.avatar_url ?? ''), role: auth.role ?? 'client', favorites } : null;

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2, 9); setToast({ id, message, type });
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3200);
  };
  const fetchProperties = useCallback(async () => {
    const { data, error } = await supabase.from('properties').select('*').eq('city', 'Tizi Ouzou').order('created_at', { ascending: false });
    if (error) { showToast(error.message, 'error'); return; }
    setProperties((data ?? []).map((row) => toAppProperty(row as Record<string, any>)));
  }, []);
  useEffect(() => { void fetchProperties(); }, [fetchProperties]);
  useEffect(() => {
    if (!auth.user) { setFavorites([]); return; }
    supabase.from('favorites').select('property_id').eq('user_id', auth.user.id).then(({ data }) => setFavorites((data ?? []).map(row => row.property_id)));
  }, [auth.user?.id]);

  const navigateTo = (view: AppView, options?: { propertyId?: string; editId?: string }) => {
    if (options?.propertyId) setSelectedPropertyId(options.propertyId);
    if (options?.editId) setEditPropertyId(options.editId);
    setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const setView = (view: AppView, propertyId?: string) => navigateTo(view, { propertyId });
  const resetFilters = () => setSearchFilters(DEFAULT_FILTERS);
  const addProperty = async (input: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'contactsCount'>) => {
    const id = createUuid();
    if (!auth.user) return { id: null, error: 'Vous devez être connecté pour publier une annonce.' };
    const payload = { ...input, id, owner_id: auth.user.id, created_at: new Date().toISOString(), views_count: 0, contacts_count: 0 };
    const { data, error } = await supabase.from('properties').insert(payload).select('id').single();
    if (error) return { id: null, error: error.message };
    await fetchProperties();
    return { id: data.id, error: null };
  };
  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const { createdAt, viewsCount, contactsCount, ...fields } = updates;
    const { error } = await supabase.from('properties').update({ ...fields, views_count: viewsCount, contacts_count: contactsCount }).eq('id', id);
    if (!error) await fetchProperties();
    return { error: error?.message ?? null };
  };
  const deleteProperty = (id: string) => { void supabase.from('properties').delete().eq('id', id).then(({ error }) => error ? showToast(error.message, 'error') : void fetchProperties()); };
  const togglePropertyStatus = (id: string) => { const property = properties.find(p => p.id === id); if (property) updateProperty(id, { status: property.status === 'published' ? 'draft' : 'published' }); };
  const toggleFavorite = (id: string) => {
    if (!auth.user) { showToast('Connectez-vous pour enregistrer vos favoris.', 'info'); navigateTo('login'); return; }
    const exists = favorites.includes(id);
    const request = exists ? supabase.from('favorites').delete().eq('user_id', auth.user.id).eq('property_id', id) : supabase.from('favorites').insert({ user_id: auth.user.id, property_id: id });
    void request.then(({ error }) => { if (error) showToast(error.message, 'error'); else setFavorites(prev => exists ? prev.filter(x => x !== id) : [...prev, id]); });
  };
  const changeCounter = (id: string, field: 'views_count' | 'contacts_count') => {
    const item = properties.find(p => p.id === id); if (!item) return;
    const next = (field === 'views_count' ? item.viewsCount : item.contactsCount) + 1;
    setProperties(prev => prev.map(p => p.id === id ? { ...p, [field === 'views_count' ? 'viewsCount' : 'contactsCount']: next } : p));
    void supabase.rpc('increment_property_counter', { property_id: id, counter_name: field });
  };
  const currentProperty = properties.find(p => p.id === selectedPropertyId) ?? properties[0] ?? null;
  const ignored = () => showToast('La connexion Google n’est pas configurée. Utilisez votre adresse e-mail.', 'info');
  return <AppContext.Provider value={{ properties, currentProperty, currentUser, currentView, view: currentView, selectedPropertyId, editPropertyId, searchFilters, language, toast, toastMessage: toast?.message ?? null, setSearchFilters, setLanguage, navigateTo, setView, addProperty, updateProperty, deleteProperty, togglePropertyStatus, toggleFavorite, isFavorite: id => favorites.includes(id), incrementViews: id => changeCounter(id, 'views_count'), incrementContacts: id => changeCounter(id, 'contacts_count'), loginWithGoogle: ignored, logout: () => { void auth.signOut(); navigateTo('home'); }, switchRole: () => showToast('Le rôle est attribué par la base et ne peut pas être changé ici.', 'error'), showToast, formatPrice: formatPriceHelper, resetFilters }}>{children}</AppContext.Provider>;
};
export const useApp = () => { const context = useContext(AppContext); if (!context) throw new Error('useApp must be used within an AppProvider'); return context; };
