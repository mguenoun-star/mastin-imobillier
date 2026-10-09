import React from 'react';
import { useApp } from '../context/AppContext';
import { CardProperty } from '../components/CardProperty';
import { 
  LogOut, 
  Heart, 
  Mail, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  ExternalLink 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    properties, 
    setView
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Non connecté</h2>
        <p className="text-xs text-slate-500">
          Veuillez vous connecter avec votre compte Google pour accéder à votre profil et retrouver vos favoris.
        </p>
        <button
          onClick={() => setView('login')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  // Get favorite properties
  const favoriteProperties = properties.filter((p) =>
    currentUser.favorites.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar with authentic Google indicator */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md border-2 border-white overflow-hidden">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentUser.name.charAt(0)}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                {currentUser.name}
              </h1>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                currentUser.role === 'chef'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {currentUser.role === 'chef' ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                <span>{currentUser.role === 'chef' ? 'Chef d\'entreprise' : 'Client'}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Mes Favoris Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Mes Biens Favoris ({favoriteProperties.length})
            </h2>
          </div>

          <button
            onClick={() => setView('search')}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explorer d'autres annonces</span>
          </button>
        </div>

        {favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Aucun favori enregistré
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lorsque vous parcourez le catalogue, cliquez sur le cœur ❤️ en haut de chaque carte pour retrouver vos biens préférés ici.
            </p>
            <button
              onClick={() => setView('search')}
              className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Parcourir le catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((prop) => (
              <CardProperty key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
