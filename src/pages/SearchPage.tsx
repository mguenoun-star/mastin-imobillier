import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FilterBar } from '../components/FilterBar';
import { CardProperty } from '../components/CardProperty';
import { Property } from '../types/property';
import { RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { properties, searchFilters, resetFilters } = useApp();
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'area-desc'>('recent');
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter properties according to searchFilters
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Must be published for client search
      if (item.status !== 'published') return false;
      if (item.city.toLowerCase() !== 'tizi ouzou') return false;

      // City filter
      if (searchFilters.city && item.city.toLowerCase() !== searchFilters.city.toLowerCase()) {
        return false;
      }

      // Property type filter
      if (searchFilters.propertyType && item.propertyType !== searchFilters.propertyType) {
        return false;
      }

      // Transaction type filter
      if (searchFilters.transactionType && item.transactionType !== searchFilters.transactionType) {
        return false;
      }

      // Min price
      if (searchFilters.minPrice !== '' && item.price < Number(searchFilters.minPrice)) {
        return false;
      }

      // Max price
      if (searchFilters.maxPrice !== '' && item.price > Number(searchFilters.maxPrice)) {
        return false;
      }

      return true;
    });
  }, [properties, searchFilters]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      list.sort((a, b) => b.area - a.area);
    } else {
      // Default: recent
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [filteredProperties, sortBy]);

  const displayedProperties = sortedProperties.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProperties.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest block mb-1">
            Catalogue Immobilier
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Explorer les biens disponibles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {sortedProperties.length} bien{sortedProperties.length > 1 ? 's' : ''} correspondant à vos critères
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="area-desc">Surface décroissante</option>
            </select>
          </div>

        </div>
      </div>

      {/* Filter Bar Component */}
      <FilterBar />

      {/* Property Cards Grid View */}
      <>
          {displayedProperties.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Aucun bien ne correspond à vos filtres
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Essayez d'élargir votre recherche en modifiant la ville sélectionnée, la tranche de budget ou le type de bien.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedProperties.map((prop) => (
                <CardProperty key={prop.id} property={prop} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all"
              >
                Charger plus d'annonces ({sortedProperties.length - visibleCount} restantes)
              </button>
            </div>
          )}
      </>
    </div>
  );
};
