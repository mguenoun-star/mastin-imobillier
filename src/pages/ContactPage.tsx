import React, { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import contactImage from '../assets/images/property_luxury_apartment_living_1790261318498.jpg';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get('firstName') ?? '');
    const lastName = String(form.get('lastName') ?? '');
    const email = String(form.get('email') ?? '');
    const phone = String(form.get('phone') ?? '');
    const subject = String(form.get('subject') ?? '');
    const message = String(form.get('message') ?? '');
    const content = `Bonjour, je vous contacte depuis votre site.\n\nNom : ${firstName} ${lastName}\nEmail : ${email}\nTéléphone : ${phone}\nSujet : ${subject}\n\nMessage :\n${message}`;
    const whatsappUrl = `https://wa.me/213550123456?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    showToast('Votre message est prêt dans WhatsApp. Envoyez-le pour terminer.', 'info');
    event.currentTarget.reset();
  };

  const fieldClass = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';
  return (
    <div className="contact-page mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="contact-enter grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-black/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Restons en contact</span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">Parlons de votre prochain projet.</h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">Une question sur un bien ou besoin d’être accompagné ? Écrivez-nous. Nous vous répondrons dès que possible.</p>
          </div>

          <div className="contact-photo-wrap relative my-9 overflow-hidden rounded-2xl">
            <img src={contactImage} alt="Un intérieur accueillant pour votre prochain projet immobilier" className="contact-photo h-64 w-full object-cover sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">À votre écoute, à chaque étape</span>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2">
            <a href="mailto:contact@mastin-immobilier.dz" className="flex items-center gap-3 text-sm text-slate-200 transition-colors hover:text-emerald-400"><span className="rounded-xl bg-white/10 p-2.5"><Mail className="h-4 w-4" /></span>contact@mastin-immobilier.dz</a>
            <a href="tel:+213550123456" className="flex items-center gap-3 text-sm text-slate-200 transition-colors hover:text-emerald-400"><span className="rounded-xl bg-white/10 p-2.5"><Phone className="h-4 w-4" /></span>+213 (0) 550 12 34 56</a>
            <p className="flex items-center gap-3 text-sm text-slate-200 sm:col-span-2"><span className="rounded-xl bg-white/10 p-2.5"><MapPin className="h-4 w-4" /></span>Tizi Ouzou, Algérie</p>
          </div>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Envoyez-nous un message</h2>
            <p className="mt-2 text-sm text-slate-500">Les champs marqués d’un astérisque sont obligatoires.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">Prénom <span className="text-rose-500">*</span><input className={fieldClass} name="firstName" autoComplete="given-name" placeholder="Votre prénom" required /></label>
              <label className="text-xs font-semibold text-slate-600">Nom <span className="text-rose-500">*</span><input className={fieldClass} name="lastName" autoComplete="family-name" placeholder="Votre nom" required /></label>
            </div>
            <label className="block text-xs font-semibold text-slate-600">Email <span className="text-rose-500">*</span><input className={fieldClass} name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" required /></label>
            <label className="block text-xs font-semibold text-slate-600">Numéro de téléphone <span className="text-rose-500">*</span><input className={fieldClass} name="phone" type="tel" autoComplete="tel" placeholder="+213 555 44 66 77" required /></label>
            <label className="block text-xs font-semibold text-slate-600">Sujet <span className="text-rose-500">*</span><input className={fieldClass} name="subject" placeholder="Achat, vente, location…" required /></label>
            <label className="block text-xs font-semibold text-slate-600">Message <span className="text-rose-500">*</span><textarea className={`${fieldClass} min-h-36 resize-y`} name="message" placeholder="Décrivez votre projet immobilier…" maxLength={1000} required /></label>
            <button type="submit" className="button-motion inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 hover:bg-emerald-500">
              {submitted ? <MessageCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {submitted ? 'Envoyer un autre message' : 'Continuer sur WhatsApp'}
            </button>
            <p className="text-center text-[11px] leading-5 text-slate-500">Après validation, WhatsApp s’ouvrira avec votre message prérempli. Vous pourrez le vérifier et l’envoyer.</p>
          </form>
        </section>
      </div>
    </div>
  );
};
