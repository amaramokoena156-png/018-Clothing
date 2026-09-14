import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CatalogToolbar } from './CatalogToolbar';
import { ShoppingBag, RotateCcw } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { filteredProducts, resetFilters, searchQuery } = useStore();

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Section Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f35d1f] mb-1">
            <span>Bokone Bophirima Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
            Curated Knitwear & Streetwear
          </h2>
          <p className="text-xs text-neutral-500 max-w-lg mt-1">
            Knitted from scratch in the North West. Every piece features bespoke jacquard knits, signature 018 crests, and breathable comfort tailored for South African seasons.
          </p>
        </div>
      </div>

      {/* Toolbar: Category pills, gender, price slider, size, tags, and sort dropdown */}
      <CatalogToolbar />

      {/* Search query tag indicator if search was typed */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-xs bg-orange-50 dark:bg-orange-950/30 text-[#f35d1f] p-2.5 rounded-lg border border-orange-200 dark:border-orange-900/40">
          <span>Filtering by search query: <strong>"{searchQuery}"</strong></span>
          <button
            onClick={() => resetFilters()}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white ml-auto underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#15181b] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            No pieces match your selected filters
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your price range, clearing the selected size or tag filters to see our full North West curation.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-[#f35d1f] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ea580c] transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
