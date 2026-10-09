import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, BadgeCheck, Building2, FileCheck2, HeartHandshake, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import villaImage from '../assets/images/hero_luxury_villa_algiers_1790261307079.jpg';
import apartmentImage from '../assets/images/property_luxury_apartment_living_1790261318498.jpg';
import poolImage from '../assets/images/property_modern_villa_pool_1790261343234.jpg';
import seaImage from '../assets/images/property_sea_view_duplex_1790261331073.jpg';

const reasons = [
  { icon: ShieldCheck, title: 'Des démarches rassurantes', text: 'Nous vous accompagnons dans la vérification des informations et la préparation de votre dossier, à chaque étape.' },
  { icon: MapPin, title: 'Une vraie connaissance du terrain', text: 'Nous connaissons Tizi Ouzou et ses quartiers pour vous aider à trouver l’adresse qui vous correspond.' },
  { icon: HeartHandshake, title: 'Un accompagnement humain', text: 'Un interlocuteur disponible pour comprendre votre projet, organiser les visites et répondre à vos questions.' },
  { icon: Building2, title: 'Des biens présentés avec soin', text: 'Photos, caractéristiques et informations utiles vous aident à comparer les biens en toute clarté.' },
];

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

export const AboutPage: React.FC = () => {
  const { setView } = useApp();
  return (
    <div className="about-page overflow-hidden pb-20">
      <section className="relative isolate overflow-hidden border-b border-slate-200/70">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-950/10 via-transparent to-rose-500/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="about-enter">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              <Sparkles className="h-4 w-4" /> Mastin immobilier
            </span>
            <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Votre prochain chapitre commence <span className="text-emerald-600">ici.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Acheter, vendre ou louer un bien est une étape importante. Notre agence vous accompagne avec écoute, clarté et une connaissance attentive du marché immobilier algérien.
              
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setView('search')} className="button-motion inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500">
                Découvrir nos biens <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#notre-approche" className="button-motion inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600">
                Notre approche <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-6">
              <div><p className="font-serif text-3xl font-bold text-slate-900">+180</p><p className="mt-1 text-xs text-slate-500">biens à découvrir</p></div>
              <div><p className="font-serif text-3xl font-bold text-slate-900">1</p><p className="mt-1 text-xs text-slate-500">ville couverte : Tizi Ouzou</p></div>
              <div><p className="font-serif text-3xl font-bold text-slate-900">24h</p><p className="mt-1 text-xs text-slate-500">pour vous répondre</p></div>
            </div>
          </div>

          <div className="about-visual relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="about-orbit absolute -right-8 -top-8 h-40 w-40 rounded-full border border-emerald-500/30" />
            <div className="about-orbit about-orbit-delay absolute -bottom-8 -left-8 h-32 w-32 rounded-full border border-rose-500/30" />
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] shadow-2xl shadow-emerald-950/20 sm:h-[520px]">
              <img src={villaImage} alt="Villa contemporaine proposée par Mastin immobilier" className="about-hero-image h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div><p className="text-xs uppercase tracking-[0.2em] text-white/75">L’immobilier en Algérie</p><p className="mt-1 font-serif text-2xl font-semibold">Un lieu à vous.</p></div>
                <span className="rounded-full border border-white/30 bg-white/15 p-3 backdrop-blur-md"><BadgeCheck className="h-5 w-5" /></span>
              </div>
            </div>
            <div className="about-float absolute -left-5 top-12 hidden w-44 overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-xl sm:block">
              <img src={apartmentImage} alt="Intérieur lumineux d’un appartement" className="h-24 w-full rounded-xl object-cover" />
              <p className="px-2 pb-1 pt-2 text-xs font-semibold text-slate-800">Des biens sélectionnés</p>
            </div>
            <div className="about-float about-float-delay absolute -bottom-5 right-5 hidden items-center gap-3 rounded-2xl border border-white/20 bg-white px-4 py-3 shadow-xl sm:flex">
              <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><FileCheck2 className="h-5 w-5" /></span>
              <span className="text-xs font-semibold text-slate-800">Un suivi à chaque étape</span>
            </div>
          </div>
        </div>
      </section>

      <section id="notre-approche" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Pourquoi nous choisir</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Un projet immobilier mérite une vraie présence.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">De la première recherche jusqu’à la visite, nous faisons de votre projet une expérience plus claire et plus sereine.</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 100}>
              <article className="about-reason group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/40 hover:shadow-xl">
                <span className="mb-5 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-600"><Icon className="h-6 w-6" /></span>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                <span className="mt-6 block h-1 w-10 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-16" />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-100/60 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Un aperçu de vos possibilités</span><h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Des lieux qui donnent envie d’avancer.</h2></div>
            <button onClick={() => setView('search')} className="button-motion inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500">Explorer les annonces <ArrowRight className="h-4 w-4" /></button>
          </Reveal>
          <div className="grid h-[540px] grid-cols-2 grid-rows-2 gap-3 sm:gap-5 lg:h-[600px]">
            <Reveal className="row-span-2 overflow-hidden rounded-2xl sm:rounded-3xl"><img src={apartmentImage} alt="Salon élégant et lumineux" className="about-gallery-image h-full w-full object-cover" /></Reveal>
            <Reveal delay={120} className="overflow-hidden rounded-2xl sm:rounded-3xl"><img src={poolImage} alt="Villa avec piscine" className="about-gallery-image h-full w-full object-cover" /></Reveal>
            <Reveal delay={220} className="overflow-hidden rounded-2xl sm:rounded-3xl"><img src={seaImage} alt="Appartement avec vue sur la mer" className="about-gallery-image h-full w-full object-cover" /></Reveal>
          </div>
        </div>
      </section>

      <Reveal className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="about-cta relative overflow-hidden rounded-3xl bg-slate-900 px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between">
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative max-w-2xl"><span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Parlons de votre projet</span><h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">La bonne adresse commence par une conversation.</h2><p className="mt-4 text-sm leading-7 text-slate-300">Notre équipe est à votre écoute pour vous aider à trouver le bien qui vous ressemble.</p></div>
          <button onClick={() => setView('contact')} className="button-motion relative mt-7 inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 lg:mt-0">Contactez-nous <ArrowRight className="h-4 w-4" /></button>
        </div>
      </Reveal>
    </div>
  );
};
