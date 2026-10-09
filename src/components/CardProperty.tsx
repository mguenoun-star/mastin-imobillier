import React, { useState } from 'react';
import { Property } from '../types/property';
import { useApp } from '../context/AppContext';
import { MapPin, Heart, ArrowRight, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, BedDouble, Bath, Phone, MessageCircle } from 'lucide-react';

interface CardPropertyProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

export const CardProperty: React.FC<CardPropertyProps> = ({
  property,
  onEdit,
  onDelete,
}) => {
  const { setView, isFavorite, toggleFavorite, formatPrice, currentUser, incrementViews } = useApp();
  const favorite = isFavorite(property.id);
  const isChef = currentUser?.role === 'chef';
  const [imageIndex, setImageIndex] = useState(0);
  const images = property.images.length ? property.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'];
  const moveImage = (direction: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setImageIndex((current) => (current + direction + images.length) % images.length);
  };

  const handleClickDetails = () => {
    incrementViews(property.id);
    setView('detail', property.id);
  };

  const propertyTypeLabels: Record<string, string> = {
    appartement: 'Appartement',
    villa: 'Villa',
    studio: 'Studio',
    duplex: 'Duplex',
    penthouse: 'Penthouse',
    terrain: 'Terrain',
    local: 'Local commercial',
  };

  return (
    <article className="property-card group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-rose-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Media Slot */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={handleClickDetails}>
        <img
          src={images[imageIndex]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Scrim for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {images.length > 1 && (
          <>
            <button onClick={(event) => moveImage(-1, event)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60" aria-label="Photo précédente">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={(event) => moveImage(1, event)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60" aria-label="Photo suivante">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, index) => <span key={index} className={`w-1.5 h-1.5 rounded-full ${index === imageIndex ? 'bg-emerald-400' : 'bg-white/50'}`} />)}
            </div>
          </>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Transaction Type Quiet Tag */}
          <span className="pointer-events-auto text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/95 backdrop-blur-md text-slate-900 rounded-md shadow-xs border border-white/40">
            {property.transactionType === 'sale' ? 'Vente' : 'Location'}
          </span>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ${
              favorite
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600 shadow-xs'
            }`}
            aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom City Overlay for instant orientation */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white drop-shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{property.district}, {property.city}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Metadata (Zero-Pill Rule) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span>{propertyTypeLabels[property.propertyType] || property.propertyType}</span>
          <span aria-hidden="true">·</span>
          <span>{property.area} m²</span>
          {property.bedrooms > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>{property.bedrooms} {property.bedrooms > 1 ? 'chambres' : 'chambre'}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={handleClickDetails}
          className="text-base font-semibold text-slate-900 line-clamp-1 hover:text-rose-600 transition-colors cursor-pointer mb-2"
          title={property.title}
        >
          {property.title}
        </h3>

        {/* Price Baseline */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Prix demandé</span>
            <span className="text-xl font-extrabold text-slate-950 font-mono tabular-nums tracking-tight">
              {formatPrice(property.price, property.transactionType)}
            </span>
          </div>

          <button
            onClick={handleClickDetails}
            className="button-motion inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:translate-x-0.5 transition-all py-1.5 px-2.5 rounded-lg hover:bg-rose-50"
          >
            <span>Voir détails</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-emerald-500" />{property.bedrooms}</span>
          <span className="inline-flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-emerald-500" />{property.bathrooms}</span>
          <span className="inline-flex items-center gap-1.5"><span className="text-emerald-500">▦</span>{property.area} m²</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={`tel:${property.whatsappNumber}`} className="button-motion inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500">
            <Phone className="w-3.5 h-3.5" /> Appeler
          </a>
          <a href={`https://wa.me/${property.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="button-motion inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 px-3 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/60">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>

        {/* Chef Management Controls (when logged in as Chef) */}
        {isChef && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{property.viewsCount} vues</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit ? onEdit(property) : setView('edit', property.id);
                }}
                className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
                title="Modifier cette annonce"
              >
                <Edit3 className="w-3 h-3" />
                <span>Modifier</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete ? onDelete(property) : null;
                }}
                className="px-2 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                title="Supprimer cette annonce"
              >
                <Trash2 className="w-3 h-3" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
