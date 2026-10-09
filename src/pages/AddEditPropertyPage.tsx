import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Property, TransactionType, PropertyType } from '../types/property';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  ShieldAlert, 
  Check, 
} from 'lucide-react';

interface AddEditPropertyPageProps {
  editPropertyId?: string | null;
}

export const AddEditPropertyPage: React.FC<AddEditPropertyPageProps> = ({ editPropertyId }) => {
  const { 
    properties, 
    addProperty, 
    updateProperty, 
    setView, 
    currentUser, 
    showToast 
  } = useApp();

  const isChef = currentUser?.role === 'chef';

  // If editing, find existing property
  const existingProperty = editPropertyId 
    ? properties.find((p) => p.id === editPropertyId) 
    : null;

  // Form State
  const [title, setTitle] = useState(existingProperty?.title || '');
  const [price, setPrice] = useState<number | ''>(existingProperty?.price || '');
  const [transactionType, setTransactionType] = useState<TransactionType>(existingProperty?.transactionType || 'sale');
  const [propertyType, setPropertyType] = useState<PropertyType>(existingProperty?.propertyType || 'appartement');
  const city = 'Tizi Ouzou';
  const [district, setDistrict] = useState(
    existingProperty?.city.toLowerCase() === 'tizi ouzou' ? existingProperty.district : 'Centre-Ville'
  );
  const [area, setArea] = useState<number | ''>(existingProperty?.area || 140);
  const [bedrooms, setBedrooms] = useState<number>(existingProperty?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState<number>(existingProperty?.bathrooms || 2);
  const [description, setDescription] = useState(existingProperty?.description || '');
  const [instagramUrl, setInstagramUrl] = useState(existingProperty?.instagramUrl || '');
  const [whatsappNumber, setWhatsappNumber] = useState(existingProperty?.whatsappNumber || '+213550123456');
  const [status, setStatus] = useState<'published' | 'draft'>(existingProperty?.status || 'published');
  const [saving, setSaving] = useState(false);
  
  // Coordinates
  const lat = 36.7167;
  const lng = 4.0500;

  // Photos
  const [images, setImages] = useState<string[]>(
    existingProperty?.images || [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    ]
  );

  // Amenities
  const availableAmenities = [
    'Piscine à débordement',
    'Vue sur mer panoramique',
    'Ascenseur sécurisé',
    'Parking en sous-sol',
    'Terrasse privative',
    'Cuisine équipée haut de gamme',
    'Climatisation centrale',
    'Chauffage central individuel',
    'Jardin paysager',
    'Hammam / Jacuzzi',
    'Résidence fermée et gardée',
    'Acte notarié & Livret foncier'
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    existingProperty?.amenities || [
      'Ascenseur sécurisé',
      'Parking en sous-sol',
      'Cuisine équipée haut de gamme',
      'Climatisation centrale',
      'Acte notarié & Livret foncier'
    ]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Access Protection
  if (!isChef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Accès Réservé au Chef d'Entreprise
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Cette page permet d'ajouter ou de modifier des annonces et est strictement réservée à l'administrateur (Mastin).
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setView('home')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Handle Photo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast('Photo ajoutée à la sélection', 'info');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      showToast('Une annonce doit comporter au moins 1 image', 'error');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) => {
      const selected = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [selected, ...remaining];
    });
    showToast('Photo principale définie', 'info');
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Veuillez renseigner un titre', 'error');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast('Veuillez renseigner un prix valide', 'error');
      return;
    }
    if (images.length === 0) {
      showToast('Ajoutez au moins une photo pour le bien', 'error');
      return;
    }

    const payload = {
      title,
      price: Number(price),
      currency: 'DZD' as const,
      transactionType,
      propertyType,
      city,
      district,
      area: Number(area) || 100,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      description: description || 'Superbe bien d\'exception proposé par l\'agence Mastin immobilier.',
      images,
      featured: true,
      status,
      lat,
      lng,
      instagramUrl,
      whatsappNumber,
      amenities: selectedAmenities,
    };

    setSaving(true);
    try {
      if (existingProperty) {
        const result = await updateProperty(existingProperty.id, payload);
        if (result.error) { showToast(`Échec de l'enregistrement: ${result.error}`, 'error'); return; }
        showToast('Annonce modifiée avec succès.', 'success');
        setView('dashboard');
      } else {
        const result = await addProperty(payload);
        if (result.error || !result.id) { showToast(`Échec de l'ajout : ${result.error ?? 'aucun identifiant reçu'}`, 'error'); return; }
        showToast('Annonce ajoutée à la base de données.', 'success');
        setView('detail', result.id);
      }
    } catch (error) {
      showToast(`Erreur Supabase : ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('dashboard')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif">
              {existingProperty ? 'Modifier l\'annonce' : 'Publier une nouvelle annonce'}
            </h1>
            <p className="text-xs text-slate-500">
              {existingProperty ? `ID: ${existingProperty.id}` : 'Fiche de bien immobilier pour le catalogue Mastin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="published">Publiée directement</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informations Générales */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serif pb-2 border-b border-slate-100">
            1. Informations Principales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Appartement F4 Haut Standing avec Vue Panoramique à Hydra"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de transaction *
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="sale">Vente (Achat)</option>
                <option value="rent">Location</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de bien *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="appartement">Appartement</option>
                <option value="villa">Villa d'architecte</option>
                <option value="duplex">Duplex & Penthouse</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prix demandé (DZD) *
              </label>
              <input
                type="number"
                required
                placeholder="Ex: 35000000"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {price ? `${Number(price).toLocaleString('fr-DZ')} DZD ${transactionType === 'rent' ? '/ mois' : ''}` : 'Saisissez le montant en dinars'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-11 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chambres
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full h-11 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sdb
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full h-11 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description détaillée du bien *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détaillez les atouts du bien, finitions, exposition, commodités, documents légaux (acte, livret foncier)..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Photos & Galerie */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                2. Galerie Photos ({images.length})
              </h2>
              <p className="text-xs text-slate-500">
                La première photo sera la photo principale affichée sur la carte.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Téléverser des photos</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Photo Previews Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
              >
                <img
                  src={img}
                  alt={`Photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Badge Primary */}
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md shadow-xs">
                    Photo principale
                  </span>
                )}

                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="p-1.5 bg-white text-slate-800 rounded-md text-[10px] font-semibold hover:bg-slate-100"
                      title="Définir comme photo principale"
                    >
                      Couverture
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    title="Supprimer cette photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Localisation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                3. Localisation Géographique
              </h2>
              <p className="text-xs text-slate-500">
                L’annonce sera située à Tizi Ouzou. Indiquez le quartier ou l’adresse.
              </p>
            </div>

            <span className="text-xs font-semibold text-slate-600">Tizi Ouzou</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={city}
                readOnly
                className="w-full h-10 px-3 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quartier / Adresse
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Réseaux & Canaux de Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serif pb-2 border-b border-slate-100">
            4. Canaux de Contact & Réseaux
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lien Vidéo Instagram (URL du Reel)
              </label>
              <input
                type="url"
                placeholder="https://www.instagram.com/reel/..."
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro WhatsApp (Format international) *
              </label>
              <input
                type="tel"
                required
                placeholder="+213 550 12 34 56"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Prestations & Équipements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serif pb-2 border-b border-slate-100">
            5. Équipements & Prestations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {availableAmenities.map((amenity) => {
              const checked = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2.5 rounded-lg border text-left text-xs flex items-center justify-between transition-colors ${
                    checked
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{amenity}</span>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center ${
                      checked ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            {saving ? 'Enregistrement…' : existingProperty ? 'Enregistrer les modifications' : 'Publier la carte de bien'}
          </button>
        </div>
      </form>
    </div>
  );
};
