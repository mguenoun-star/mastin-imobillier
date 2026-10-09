import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CardProperty } from '../components/CardProperty';
import { 
  Search, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Video, 
  MessageSquare, 
  Compass, 
  Award, 
  PhoneCall, 
  CheckCircle,
  Home
} from 'lucide-react';
import heroVillaImg from '../assets/images/hero_luxury_villa_algiers_1790261307079.jpg';

export const HomePage: React.FC = () => {
  const { properties, setView, setSearchFilters } = useApp();
  const [quickCity, setQuickCity] = useState('Tizi Ouzou');
  const [quickType, setQuickType] = useState('');
  const [quickTransaction, setQuickTransaction] = useState('sale');

  // Featured properties (published, up to 6)
  const featuredProperties = properties
    .filter((p) => p.status === 'published' && p.city.toLowerCase() === 'tizi ouzou')
    .slice(0, 6);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters((prev) => ({
      ...prev,
      city: quickCity,
      propertyType: quickType,
      transactionType: quickTransaction,
    }));
    setView('search');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroVillaImg}
            alt="Villa contemporaine à Tizi Ouzou"
            className="hero-image-motion w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="hero-content-motion relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Excellence Immobilière en Algérie</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl leading-tight font-serif" style={{ textWrap: 'balance' }}>
            Trouvez votre prochain chez-vous
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl font-light">
            Villas d'architecte, appartements de haut standing et résidences d'exception à Tizi Ouzou.
          </p>

          {/* Quick Search Widget */}
          <div className="hero-search-motion mt-10 w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/30 text-left">
            {/* Quick Segmented Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setQuickTransaction('sale')}
                className={`button-motion px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  quickTransaction === 'sale'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Acheter
              </button>
              <button
                type="button"
                onClick={() => setQuickTransaction('rent')}
                className={`button-motion px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  quickTransaction === 'rent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Louer
              </button>
            </div>

            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Ville</span>
                </label>
                <select
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Toutes les villes</option>
                  <option value="Tizi Ouzou">Tizi Ouzou</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Type de bien</span>
                </label>
                <select
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value)}
                  className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Tous les types</option>
                  <option value="villa">Villa d'architecte</option>
                  <option value="appartement">Appartement F3 / F4</option>
                  <option value="duplex">Duplex & Penthouse</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="button-motion w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98 text-xs sm:text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher les biens</span>
                </button>
              </div>
            </form>
          </div>

          {/* Social Proof Key Numbers */}
          <div className="mt-10 grid grid-cols-3 gap-6 sm:gap-12 text-white border-t border-white/10 pt-6">
            <div>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">100%</p>
              <p className="text-xs text-slate-300 mt-0.5">Actes notariés certifiés</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">+180</p>
              <p className="text-xs text-slate-300 mt-0.5">Biens d'exception</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">&lt; 24h</p>
              <p className="text-xs text-slate-300 mt-0.5">Réponse WhatsApp directe</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION BIENS EN VEDETTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest block mb-1">
              Sélection Exclusive
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Biens en vedette
            </h2>
          </div>
          <button
            onClick={() => setView('search')}
            className="button-motion inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors group"
          >
            <span>Voir toutes les annonces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop) => (
            <CardProperty key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* SECTION COMMENT ÇA MARCHE */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest block mb-1">
              Processus Simplifié
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Un parcours clair et transparent pour acquérir ou louer votre bien en toute sérénité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors relative">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 font-bold text-lg flex items-center justify-center mb-5">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Chercher & Filtrer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explorez notre catalogue géolocalisé par ville, quartier prestigieux, surface et budget avec des filtres précis et transparents.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors relative">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 font-bold text-lg flex items-center justify-center mb-5">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Voir en Détails & Vidéo
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Accédez aux galeries photos haute définition, à l'emplacement cartographique exact et aux vidéos immersives Reels Instagram.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors relative">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 font-bold text-lg flex items-center justify-center mb-5">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Contacter via WhatsApp
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Échangez en direct avec Mastin pour planifier une visite sur place, obtenir le dossier juridique complet et faire une offre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ENGAGEMENT ET CONFIANCE MASTIN IMMOBILIER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 sm:p-12 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest block">
              Engagement Professionnel
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
              Vous êtes propriétaire d'un bien de prestige ?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Confiez la vente ou la location de votre villa ou appartement à l'agence Mastin immobilier. Nous assurons la prise de vue professionnelle, la publication vidéo et la mise en relation avec des acheteurs qualifiés.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Estimation offerte
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Vérification notariale rigoureuse
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Discrétion assurée
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a
              href="https://wa.me/213550123456?text=Bonjour%20Mastin%2C%20je%20souhaite%20proposer%20un%20bien%20%C3%A0%20la%20vente%20ou%20location"
              target="_blank"
              rel="noopener noreferrer"
              className="button-motion px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacter sur WhatsApp</span>
            </a>
            <button
              onClick={() => setView('search')}
              className="button-motion px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-white/20"
            >
              <span>Découvrir le catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
