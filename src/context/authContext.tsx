import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { UserRole } from '../types/property';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  fullName: string;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpChef: (input: { fullName: string; email: string; phone: string; password: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let checkId = 0;

    const acceptOnlyApprovedChef = async (nextSession: Session | null) => {
      const currentCheck = ++checkId;
      if (!nextSession) {
        if (active) { setSession(null); setRole(null); setLoading(false); }
        return;
      }

      if (active) { setSession(nextSession); setRole(null); setLoading(true); }
      const { data, error } = await supabase.from('profiles').select('role').eq('id', nextSession.user.id).maybeSingle();
      if (!active || currentCheck !== checkId) return;
      let isApprovedChef = !error && data?.role === 'chef';
      if (isApprovedChef) {
        const { data: request, error: requestError } = await supabase
          .from('chef_signup_requests')
          .select('status')
          .eq('user_id', nextSession.user.id)
          .maybeSingle();
        if (requestError || (request && request.status !== 'approved')) isApprovedChef = false;
      }
      if (!active || currentCheck !== checkId) return;
      if (!isApprovedChef) {
        setSession(null);
        setRole(null);
        setLoading(false);
        await supabase.auth.signOut();
        return;
      }
      setSession(nextSession);
      setRole('chef');
      setLoading(false);
    };

    void supabase.auth.getSession().then(({ data }) => acceptOnlyApprovedChef(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void acceptOnlyApprovedChef(nextSession);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Connexion impossible.' };
    if (data.user.identities?.length === 0) return { error: "Cette adresse e-mail est déjà utilisée. Connectez-vous ou contactez l'administrateur." };
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
    let isApprovedChef = !profileError && profile?.role === 'chef';
    if (isApprovedChef) {
      const { data: request, error: requestError } = await supabase
        .from('chef_signup_requests')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle();
      if (requestError || (request && request.status !== 'approved')) isApprovedChef = false;
    }
    if (!isApprovedChef) {
      await supabase.auth.signOut();
      return { error: "Ce compte n'est pas encore approuve par l'administrateur." };
    }
    return { error: null };
  }

  async function signUpChef(input: { fullName: string; email: string; phone: string; password: string }) {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          phone: input.phone,
          account_request: 'chef',
        },
      },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Impossible de créer la demande. Réessayez.' };
    if (data.user.identities?.length === 0) return { error: "That email is already registered; contact the administrator." };
    return { error: null };
  }

  async function signOut() { await supabase.auth.signOut(); }

  const user = session?.user ?? null;
  const fullName = String(user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Mastin');
  return <AuthContext.Provider value={{ user, session, role, fullName, loading, signIn, signUpChef, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>');
  return ctx;
}
