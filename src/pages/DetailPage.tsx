import React from 'react';
import { useApp } from '../context/AppContext';
import { PhotoGallery } from '../components/PhotoGallery';
import { 
  ArrowLeft, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Instagram, 
  Share2, 
  Check, 
  Maximize2, 
  Calendar, 
  Eye, 
  ShieldCheck, 
  Building, 
  Layers, 
  Sparkles,
  Phone
} from 'lucide-react';

export const DetailPage: React.FC = () => {
  const { 
    currentProperty, 
    setView, 
    isFavorite, 
    toggleFavorite, 
    formatPrice, 
    incrementContacts,
    showToast 
  } = useApp();

  if (!currentProperty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Annonce introuvable</h2>
        <button
          onClick={() => setView('search')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Retour aux annonces
        </button>
      </div>
    );
  }

  const favorite = isFavorite(currentProperty.id);

  // WhatsApp click handler
  const handleWhatsApp = () => {
    incrementContacts(currentProperty.id);
    const message = encodeURIComponent(
      `Bonjour Mastin, je vous contacte concernant l'annonce "${currentProperty.title}" (${currentProperty.city} - ${formatPrice(currentProperty.price, currentProperty.transactionType)}). Est-elle toujours disponible pour une visite ?`
    );
    const cleanPhone = currentProperty.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Instagram video click handler
  const handleInstagram = () => {
    if (currentProperty.instagramUrl) {
      window.open(currentProperty.instagramUrl, '_blank');
    } else {
      showToast('Vidéo Reel bientôt disponible sur le compte Instagram @mastin.immo', 'info');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProperty.title,
        text: `Découvrez cette propriété sur Mastin immobilier : ${currentProperty.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien de l\'annonce copié dans le presse-papier !', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar with Back Button & Share/Fav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('search')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste des biens</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Partager l'annonce"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(currentProperty.id)}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              favorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            <span>{favorite ? 'Sauvegardé' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Purchase / Contact Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media & Full Description (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Photo Gallery with Full Lightbox Zoom */}
          <PhotoGallery images={currentProperty.images} title={currentProperty.title} />

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Surface</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">{currentProperty.area} m²</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Pièces</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {currentProperty.bedrooms > 0 ? `${currentProperty.bedrooms} ch` : 'Non spécifié'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Salles de bain</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">{currentProperty.bathrooms}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Type</span>
              <span className="text-base font-bold text-slate-900 capitalize truncate block">
                {currentProperty.propertyType}
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Description détaillée
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {currentProperty.description}
            </div>

            {/* Publication metadata */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Publié le {currentProperty.createdAt}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5" />
                <span>{currentProperty.viewsCount} vues</span>
              </span>
            </div>
          </div>

          {/* Amenities & Equipements */}
          {currentProperty.amenities && currentProperty.amenities.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Prestations & Équipements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentProperty.amenities.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2.5 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Contiguous Purchase & Action Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-7 space-y-6">
            
            {/* Header Lockup */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  {currentProperty.transactionType === 'sale' ? 'À Vendre' : 'À Louer'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Réf: {currentProperty.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug">
                {currentProperty.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{currentProperty.district}, {currentProperty.city}, Algérie</span>
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Prix officiel de l'agence</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight tabular-nums">
                {formatPrice(currentProperty.price, currentProperty.transactionType)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Acte notarié & Livret foncier vérifiés
              </span>
            </div>

            {/* ACTION BUTTONS (MANDATORY FROM SPEC) */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg shadow-emerald-950/20"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contacter via WhatsApp</span>
              </button>

              {/* Instagram Video Reel Button */}
              <button
                onClick={handleInstagram}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-95 active:scale-98 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Instagram className="w-4 h-4" />
                <span>Voir la vidéo sur Instagram</span>
              </button>
            </div>

            {/* Direct Agent Contact Preview */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900">Mastin</p>
                <p className="text-[11px] text-slate-500">Directeur de l'Agence Immobilière</p>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">{currentProperty.whatsappNumber}</p>
              </div>
              <a
                href={`tel:${currentProperty.whatsappNumber}`}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                title="Appeler par téléphone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
