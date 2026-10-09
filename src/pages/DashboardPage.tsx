import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types/property';
import { DeleteModal } from '../components/DeleteModal';
import { 
  PlusCircle, 
  Eye, 
  MessageSquare, 
  Building2, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ShieldAlert, 
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    properties, 
    setView, 
    currentUser, 
    deleteProperty, 
    updateProperty, 
    formatPrice 
  } = useApp();

  const isChef = currentUser?.role === 'chef';
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Protection Guard
  if (!isChef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Tableau de Bord Administrateur
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Le tableau de bord de gestion des annonces est réservé au compte administrateur approuvé dans la base de données.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setView('home')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Retour au site
          </button>
        </div>
      </div>
    );
  }

  // Analytics KPI calculations
  const totalCards = properties.length;
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalContacts = properties.reduce((acc, p) => acc + (p.contactsCount || 0), 0);
  const publishedCount = properties.filter((p) => p.status === 'published').length;

  // Filtered properties
  const filteredList = properties.filter((prop) => {
    const matchesSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && prop.status === filterStatus;
  });

  const handleToggleStatus = (prop: Property) => {
    const nextStatus = prop.status === 'published' ? 'draft' : 'published';
    updateProperty(prop.id, { status: nextStatus });
  };

  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id);
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest block mb-1">
            Espace Direction
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Dashboard Chef d'entreprise
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bienvenue Mastin — Supervision globale de votre parc immobilier
          </p>
        </div>

        {/* Primary CTA: + Ajouter une nouvelle carte */}
        <button
          onClick={() => setView('add')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-98 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Ajouter une nouvelle carte</span>
        </button>
      </div>

      {/* KPI Stats Section (Section 1.D: Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cartes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Annonces</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalCards}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {publishedCount} publiées en ligne · {totalCards - publishedCount} brouillons
          </p>
        </div>

        {/* Total Vues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Vues Cumulées</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalViews.toLocaleString('fr-DZ')}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Visibilité sur Tizi Ouzou</span>
          </p>
        </div>

        {/* Contacts WhatsApp */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Contacts WhatsApp</span>
            <MessageSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalContacts}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Leads directs envoyés sur votre mobile
          </p>
        </div>

        {/* Taux de Conversion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Efficacité</span>
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Ratio contacts / consultations
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par titre, quartier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Toutes ({properties.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'published' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Publiées ({publishedCount})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'draft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Brouillons ({properties.length - publishedCount})
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Bien / Titre</th>
                <th className="py-3 px-4">Prix</th>
                <th className="py-3 px-4">Localisation</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Stats</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Aucune annonce trouvée
                  </td>
                </tr>
              ) : (
                filteredList.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Thumbnail + Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                        />
                        <div className="min-w-0 max-w-xs">
                          <button
                            onClick={() => setView('detail', prop.id)}
                            className="font-semibold text-slate-900 hover:text-rose-600 transition-colors truncate block text-left"
                            title={prop.title}
                          >
                            {prop.title}
                          </button>
                          <span className="text-[11px] text-slate-400 capitalize block">
                            {prop.propertyType} · {prop.transactionType === 'sale' ? 'Vente' : 'Location'} · {prop.area} m²
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatPrice(prop.price, prop.transactionType)}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{prop.district}, {prop.city}</span>
                      </span>
                    </td>

                    {/* Statut Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(prop)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          prop.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Cliquer pour basculer le statut"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${prop.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{prop.status === 'published' ? 'Publié' : 'Brouillon'}</span>
                      </button>
                    </td>

                    {/* Stats */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                      <span title="Nombre de vues">{prop.viewsCount} vues</span>
                      <span className="mx-1 text-slate-300">·</span>
                      <span title="Contacts WhatsApp générés" className="text-emerald-700 font-medium">
                        {prop.contactsCount} contacts
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Preview */}
                        <button
                          onClick={() => setView('detail', prop.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Voir l'annonce en direct"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setView('edit', prop.id)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Modifier les informations"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setPropertyToDelete(prop)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          title="Supprimer la carte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(propertyToDelete)}
        property={propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
