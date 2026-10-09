
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { AddEditPropertyPage } from './pages/AddEditPropertyPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthProvider } from './context/authContext';
import { isSupabaseConfigured } from './lib/supabaseClient';

const AppContent: React.FC = () => {
  const { view, selectedPropertyId, language } = useApp();

  const renderCurrentView = () => {
    switch (view) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'detail':
        return <DetailPage />;
      case 'add':
        return <AddEditPropertyPage />;
      case 'edit':
        return <AddEditPropertyPage editPropertyId={selectedPropertyId} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'login':
        return <LoginPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div 
      className={`site-shell min-h-screen flex flex-col bg-slate-50 text-slate-900 ${language === 'ar' ? 'font-sans' : ''}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Header />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      {view !== 'login' && <Footer />}
      <Toast />
    </div>
  );
};

export default function App() {
  if (!isSupabaseConfigured) {
    return <main className="min-h-screen grid place-items-center bg-slate-50 px-5 text-slate-800">
      <section className="max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold">Configuration Supabase manquante</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Créez un fichier <code>.env.local</code> à la racine du projet avec <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code>, puis redémarrez le serveur Vite.</p>
      </section>
    </main>;
  }
  return (
    <AuthProvider>
      <AppProvider><AppContent /></AppProvider>
    </AuthProvider>
  );
}
