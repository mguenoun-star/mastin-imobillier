import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { MapPin, Phone, MessageSquare, Instagram, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Logo size="md" variant="full" light={true} />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Fondée et dirigée par Mastin, notre agence accompagne vos projets d'achat, de vente et de location à Tizi Ouzou.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://wa.me/213550123456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-900 transition-colors"
                aria-label="Contacter sur WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 hover:bg-rose-900 transition-colors"
                aria-label="Suivre sur Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@mastin-immobilier.dz"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
                aria-label="Envoyer un email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Biens par Ville */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Par Ville
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              
              
              <li>
                <button
                  onClick={() => setView('search')}
                  className="hover:text-white transition-colors"
                >
                  Immobilier à Tizi Ouzou et ses environs
                </button>
              </li>
            
            </ul>
          </div>

          {/* Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => setView('home')} className="hover:text-white transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => setView('search')} className="hover:text-white transition-colors">
                  Toutes les annonces
                </button>
              </li>
              <li>
                <button onClick={() => setView('profile')} className="hover:text-white transition-colors">
                  Mes favoris
                </button>
              </li>
            </ul>
          </div>

          {/* Coordonnées & Horaires */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Siège de l'Agence
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Tizi Ouzou, Algérie</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+213 (0) 550 12 34 56</span>
              </p>
              <p className="pt-2 text-[11px] text-slate-500 leading-normal">
                Ouvert du Samedi au Jeudi<br />08h30 - 18h00 (Visites sur RDV)
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Mastin immobilier. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Acte notarié & livret foncier garantis
            </span>
            <span>Mentions Légales</span>
            <span>Confidentialité</span>
            <button onClick={() => setView('login')} className="text-slate-600 hover:text-slate-400 transition-colors" aria-label="Acc�s r�serv� au chef d'agence" title="Acc�s r�serv� au chef d'agence">Administration</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
