import React, { useState, useEffect, useRef } from 'react';
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
  Home,
  Sparkles,
  Star,
  TrendingUp
} from 'lucide-react';
import heroVillaImg from '../assets/images/hero_luxury_villa_algiers_1790261307079.jpg';

/* Animated counter hook */
function useCountUp(end: number, duration: number = 2000, trigger: boolean = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, trigger]);
  return count;
}

/* Scroll reveal component */
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};

export const HomePage: React.FC = () => {
  const { properties, setView, setSearchFilters } = useApp();
  const [quickCity, setQuickCity] = useState('Tizi Ouzou');
  const [quickType, setQuickType] = useState('');
  const [quickTransaction, setQuickTransaction] = useState('sale');

  /* Stats visible tracking */
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stat1 = useCountUp(100, 1800, statsVisible);
  const stat2 = useCountUp(180, 1800, statsVisible);

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
    <div className="space-y-0 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroVillaImg}
            alt="Villa contemporaine à Tizi Ouzou"
            className="hero-image-motion w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/50" />
          {/* Extra vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />
        </div>

        {/* Floating decorative particles */}
        <div className="floating-dot" style={{ top: '15%', left: '8%' }} />
        <div className="floating-dot" style={{ top: '25%', right: '12%' }} />
        <div className="floating-dot" style={{ bottom: '30%', left: '15%' }} />
        <div className="floating-dot" style={{ bottom: '20%', right: '20%' }} />

        {/* Hero Content */}
        <div className="hero-content-motion relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Subtle Tag */}
          <div className="tag-glow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-8 shadow-lg shadow-black/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Excellence Immobilière en Algérie</span>
            <Star className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h1 className="hero-text-shadow text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] font-serif" style={{ textWrap: 'balance' }}>
            Trouvez votre prochain{' '}
            <span className="text-shimmer">chez-vous</span>
          </h1>

          <p className="hero-text-shadow-light mt-6 text-lg sm:text-xl text-slate-100 max-w-2xl font-light leading-relaxed">
            Villas d'architecte, appartements de haut standing et résidences d'exception à <strong className="font-semibold text-white">Tizi Ouzou</strong>.
          </p>

          {/* Quick Search Widget */}
          <div className="hero-search-motion mt-12 w-full max-w-3xl bg-white/95 backdrop-blur-lg rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/20 border border-white/40 text-left">
            {/* Quick Segmented Tabs */}
            <div className="flex items-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => setQuickTransaction('sale')}
                className={`button-motion px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                  quickTransaction === 'sale'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                🏠 Acheter
              </button>
              <button
                type="button"
                onClick={() => setQuickTransaction('rent')}
                className={`button-motion px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                  quickTransaction === 'rent'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                🔑 Louer
              </button>
            </div>

            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Ville</span>
                </label>
                <select
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full h-12 px-4 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                >
                  <option value="">Toutes les villes</option>
                  <option value="Tizi Ouzou">Tizi Ouzou</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-500" />
                  <span>Type de bien</span>
                </label>
                <select
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value)}
                  className="w-full h-12 px-4 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
                  className="button-motion cta-pulse w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 text-sm"
                >
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Social Proof Key Numbers */}
          <div ref={statsRef} className="mt-12 grid grid-cols-3 gap-6 sm:gap-16 text-white border-t border-white/15 pt-8">
            <div className="stat-number">
              <p className="hero-text-shadow text-2xl sm:text-4xl font-extrabold font-mono tabular-nums text-white">{stat1}%</p>
              <p className="text-sm text-slate-200 mt-1.5 font-medium">Actes notariés certifiés</p>
            </div>
            <div className="stat-number">
              <p className="hero-text-shadow text-2xl sm:text-4xl font-extrabold font-mono tabular-nums text-white">+{stat2}</p>
              <p className="text-sm text-slate-200 mt-1.5 font-medium">Biens d'exception</p>
            </div>
            <div className="stat-number">
              <p className="hero-text-shadow text-2xl sm:text-4xl font-extrabold font-mono tabular-nums text-white">&lt; 24h</p>
              <p className="text-sm text-slate-200 mt-1.5 font-medium">Réponse WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <hr className="section-divider" />

      {/* SECTION BIENS EN VEDETTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-5 border-b border-slate-200 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" />
                Sélection Exclusive
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
                Biens en vedette
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-lg">
                Découvrez notre sélection de biens d'exception, soigneusement choisis pour vous.
              </p>
            </div>
            <button
              onClick={() => setView('search')}
              className="button-motion inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors group bg-rose-50 px-5 py-3 rounded-xl hover:bg-rose-100"
            >
              <span>Voir toutes les annonces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Reveal>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop, index) => (
            <Reveal key={prop.id} delay={index * 120}>
              <CardProperty property={prop} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <hr className="section-divider" />

      {/* SECTION COMMENT ÇA MARCHE */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">
                <TrendingUp className="w-4 h-4" />
                Processus Simplifié
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
                Comment ça marche ?
              </h2>
              <p className="text-base text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
                Un parcours clair et transparent pour acquérir ou louer votre bien en toute sérénité.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Étape 1 */}
            <Reveal delay={0}>
              <div className="step-card bg-slate-50 rounded-2xl p-7 border border-slate-200/80 relative h-full">
                <div className="step-number w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 font-black text-xl flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  🔍 Chercher & Filtrer
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Explorez notre catalogue géolocalisé par ville, quartier prestigieux, surface et budget avec des filtres précis et transparents.
                </p>
              </div>
            </Reveal>

            {/* Étape 2 */}
            <Reveal delay={150}>
              <div className="step-card bg-slate-50 rounded-2xl p-7 border border-slate-200/80 relative h-full">
                <div className="step-number w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 font-black text-xl flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  📸 Voir en Détails & Vidéo
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Accédez aux galeries photos haute définition, à l'emplacement cartographique exact et aux vidéos immersives Reels Instagram.
                </p>
              </div>
            </Reveal>

            {/* Étape 3 */}
            <Reveal delay={300}>
              <div className="step-card bg-slate-50 rounded-2xl p-7 border border-slate-200/80 relative h-full">
                <div className="step-number w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 font-black text-xl flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  💬 Contacter via WhatsApp
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Échangez en direct avec Mastin pour planifier une visite sur place, obtenir le dossier juridique complet et faire une offre.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION ENGAGEMENT ET CONFIANCE MASTIN IMMOBILIER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <div className="engagement-card bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-slate-700/50 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-5 max-w-xl relative z-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                <Award className="w-4 h-4" />
                Engagement Professionnel
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                Vous êtes propriétaire d'un bien de{' '}
                <span className="text-shimmer">prestige</span> ?
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Confiez la vente ou la location de votre villa ou appartement à l'agence Mastin immobilier. Nous assurons la prise de vue professionnelle, la publication vidéo et la mise en relation avec des acheteurs qualifiés.
              </p>
              <div className="flex flex-wrap items-center gap-5 pt-3 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Estimation offerte
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Vérification notariale
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Discrétion assurée
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
              <a
                href="https://wa.me/213550123456?text=Bonjour%20Mastin%2C%20je%20souhaite%20proposer%20un%20bien%20%C3%A0%20la%20vente%20ou%20location"
                target="_blank"
                rel="noopener noreferrer"
                className="button-motion cta-pulse px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contacter sur WhatsApp</span>
              </a>
              <button
                onClick={() => setView('search')}
                className="button-motion px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all border border-white/20 backdrop-blur-sm"
              >
                <span>Découvrir le catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
