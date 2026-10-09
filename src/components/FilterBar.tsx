import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, RotateCcw, Building2, MapPin, Tag } from 'lucide-react';

interface FilterBarProps {
  onSearch?: () => void;
  compact?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onSearch, compact = false }) => {
  const { searchFilters, setSearchFilters, resetFilters } = useApp();

  const cities = ['Toutes les villes', 'Tizi Ouzou'];
  const propertyTypes = [
    { value: '', label: 'Tous types' },
    { value: 'appartement', label: 'Appartement' },
    { value: 'villa', label: 'Villa d\'architecte' },
    { value: 'duplex', label: 'Duplex / Penthouse' },
    { value: 'studio', label: 'Studio' },
  ];

  const handleTransactionChange = (type: string) => {
    setSearchFilters((prev) => ({ ...prev, transactionType: type }));
  };

  const handleCityChange = (city: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      city: city === 'Toutes les villes' ? '' : city,
    }));
  };

  const handleTypeChange = (type: string) => {
    setSearchFilters((prev) => ({ ...prev, propertyType: type }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
      {/* Transaction Type Segmented Control */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleTransactionChange('')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              searchFilters.transactionType === ''
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous les biens
          </button>
          <button
            type="button"
            onClick={() => handleTransactionChange('sale')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              searchFilters.transactionType === 'sale'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Achat / Vente
          </button>
          <button
            type="button"
            onClick={() => handleTransactionChange('rent')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              searchFilters.transactionType === 'rent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Location
          </button>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser les filtres</span>
        </button>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Ville */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Ville / Région</span>
          </label>
          <select
            value={searchFilters.city || 'Toutes les villes'}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Type de bien */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Type de bien</span>
          </label>
          <select
            value={searchFilters.propertyType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prix Min */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Budget min (DZD)</span>
          </label>
          <input
            type="number"
            placeholder="Ex: 50 000"
            value={searchFilters.minPrice}
            onChange={(e) =>
              setSearchFilters((prev) => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : '',
              }))
            }
            className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
          />
        </div>

        {/* Prix Max & Action */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Budget max (DZD)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Ex: 50 000 000"
              value={searchFilters.maxPrice}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value ? Number(e.target.value) : '',
                }))
              }
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
            />
            {onSearch && (
              <button
                type="button"
                onClick={onSearch}
                className="px-4 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-xs"
                title="Lancer la recherche"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
