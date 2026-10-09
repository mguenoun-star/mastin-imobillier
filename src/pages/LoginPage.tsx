import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/authContext';
import { Building2, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const { signIn, signUpChef } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setErrorMessage('');
    const result = mode === 'signup'
      ? await signUpChef({ fullName, email, phone, password })
      : await signIn(email, password);
    setBusy(false);
    if (result.error) {
      if (mode === 'signup') setErrorMessage(result.error);
      else showToast(result.error, 'error');
      return;
    }
    if (mode === 'signup') {
      setMessage('Votre demande est enregistrée et reste en attente. L’administrateur doit l’approuver dans la base avant que vous puissiez vous connecter.');
      setPassword('');
      return;
    }
    showToast('Connexion réussie.', 'success');
    navigateTo('home');
  };

  return <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-16 bg-slate-50">
    <div className="w-full max-w-md mb-6"><button onClick={() => navigateTo('home')} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><ArrowLeft className="w-4 h-4" />Retour à l'accueil</button></div>
    <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 sm:p-10 space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-3"><Building2 className="w-7 h-7" /></div>
        <h1 className="font-serif text-2xl font-bold">Mastin immobilier</h1>
        <p className="text-xs text-slate-500 mt-2">{mode === 'login' ? 'Connexion réservée au compte approuvé' : 'Demande d’accès à l’espace administration'}</p>
      </div>

      {mode === 'signup' && <>
        <label className="block text-sm">Nom complet<input type="text" required maxLength={100} value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 w-full h-11 px-3 bg-slate-50 border rounded-lg" autoComplete="name" /></label>
        <label className="block text-sm">Téléphone<input type="tel" required maxLength={30} value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full h-11 px-3 bg-slate-50 border rounded-lg" autoComplete="tel" /></label>
      </>}
      <label className="block text-sm">Adresse e-mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full h-11 px-3 bg-slate-50 border rounded-lg" autoComplete="email" /></label>
      <label className="block text-sm">Mot de passe<input type="password" required minLength={mode === 'signup' ? 8 : 6} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full h-11 px-3 bg-slate-50 border rounded-lg" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></label>

      {message && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs leading-5 text-emerald-700">{message}</p>}
      {errorMessage && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs leading-5 text-rose-700">{errorMessage}</p>}

      <button disabled={busy} className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold disabled:opacity-60">{busy ? 'Veuillez patienter…' : mode === 'signup' ? 'Envoyer ma demande' : 'Se connecter'}</button>
      <div className="text-center">
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); setErrorMessage(''); }} className="text-xs font-semibold text-emerald-600 hover:text-emerald-500">
          {mode === 'login' ? 'Demander la création d’un compte admin' : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
      <p className="text-center text-xs leading-5 text-slate-500">Les demandes sont vérifiées et approuvées dans Supabase. Aucun accès admin n’est accordé avant validation.</p>
    </form>
  </div>;
};
