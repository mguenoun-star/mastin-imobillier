import { createClient } from '@supabase/supabase-js';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '').replace(/\/rest\/v1$/, '');
const configuredKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let validUrl = false;
try {
  const parsedUrl = new URL(configuredUrl ?? '');
  validUrl = parsedUrl.protocol === 'https:' || parsedUrl.hostname === 'localhost';
} catch {
  validUrl = false;
}

export const isSupabaseConfigured = Boolean(validUrl && configuredKey);
// Client de repli valide pour afficher un message clair au lieu d'un écran blanc.
export const supabase = createClient(
  isSupabaseConfigured ? configuredUrl! : 'https://example.supabase.co',
  isSupabaseConfigured ? configuredKey! : 'missing-supabase-key',
);
