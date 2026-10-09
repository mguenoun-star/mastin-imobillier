import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  PlusCircle,
  LayoutDashboard,
  Search,
  Home,
  Menu,
  X,
  ShieldCheck,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';

type Accent = 'rose' | 'blue' | 'green';
const accents: Accent[] = ['green', 'blue', 'rose'];

export const Header: React.FC = () => {
  const {
    view,
    setView,
    currentUser,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('site-mode') !== 'light');
  const [accent, setAccent] = useState<Accent>(() => {
    const saved = localStorage.getItem('site-accent');
    return accents.includes(saved as Accent) ? saved as Accent : 'green';
  });
  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    localStorage.setItem('site-accent', accent);
  }, [accent]);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('site-mode', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const changeAccent = () => {
    setAccent((current) => accents[(accents.indexOf(current) + 1) % accents.length]);
  };
  // Un seul type de compte existe : le chef d'agence. S'il est connecté, isChef = true.
  const isChef = !!currentUser;

  const handleNav = (targetView: Parameters<typeof setView>[0]) => {
    setView(targetView);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-lg shadow-black/10 transition-colors ${darkMode ? 'bg-[#101512]/95 border-[#26332c]' : 'bg-white/95 border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ZONE 1: BRAND TITLE (One line, clean wordmark) */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg group"
            aria-label="Mastin immobilier Accueil"
          >
            <Logo size="md" variant="full" />
          </button>

          {/* ZONE 2: 4-6 CLEAN TEXT NAVIGATION LINKS */}
          <nav className={`hidden xl:flex items-center gap-5 text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <button
              onClick={() => handleNav('home')}
              className={`transition-colors py-1 relative ${
                view === 'home'
                  ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handleNav('search')}
              className={`transition-colors py-1 relative ${
                view === 'search'
                  ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Rechercher un bien
            </button>

            {!isChef && (
              <>
                <button
                  onClick={() => handleNav('about')}
                  className={`transition-colors py-1 relative ${view === 'about' ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600' : 'hover:text-slate-900'}`}
                >
                  À propos
                </button>

                <button
                  onClick={() => handleNav('contact')}
                  className="button-motion inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/20"
                >
                  Contactez-nous
                </button>
              </>
            )}

            {/* Liens réservés au chef, visibles uniquement une fois connecté */}
            {isChef && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`transition-colors py-1 relative inline-flex items-center gap-1.5 ${
                    view === 'dashboard'
                      ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Tableau de bord</span>
                </button>

                <button
                  onClick={() => handleNav('add')}
                  className={`transition-colors py-1 relative inline-flex items-center gap-1.5 ${
                    view === 'add'
                      ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-slate-500" />
                  <span>Publier une annonce</span>
                </button>
              </>
            )}
          </nav>

          {/* ZONE 3: PRIMARY ACTIONS */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={changeAccent} className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label={`Changer la couleur (actuellement ${accent})`} title={`Couleur : ${accent} — cliquer pour changer`}>
              <Palette className="w-4 h-4" />
            </button>
            <button onClick={() => setDarkMode((mode) => !mode)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label={`Activer le mode ${darkMode ? 'clair' : 'sombre'}`} title={`Activer le mode ${darkMode ? 'clair' : 'sombre'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-slate-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Chef d'agence
                    </p>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : null}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex items-center gap-2 xl:hidden">
            <button onClick={changeAccent} className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100" aria-label={`Changer la couleur (actuellement ${accent})`} title={`Couleur : ${accent} — cliquer pour changer`}>
              <Palette className="w-5 h-5" />
            </button>
            <button onClick={() => setDarkMode((mode) => !mode)} className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100" aria-label={`Activer le mode ${darkMode ? 'clair' : 'sombre'}`} title={`Activer le mode ${darkMode ? 'clair' : 'sombre'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                view === 'home' ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => handleNav('search')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                view === 'search' ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Rechercher un bien</span>
            </button>

            {!isChef && (
              <>
                <button
                  onClick={() => handleNav('about')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${view === 'about' ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>À propos de nous</span>
                </button>

                <button
                  onClick={() => handleNav('contact')}
                  className="button-motion w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <span>Contactez-nous</span>
                </button>
              </>
            )}

            {isChef && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    view === 'dashboard' ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tableau de bord Chef</span>
                </button>

                <button
                  onClick={() => handleNav('add')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    view === 'add' ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Publier une annonce</span>
                </button>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-medium hover:underline"
                >
                  Déconnexion
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};
