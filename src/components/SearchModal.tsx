import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowRight, Tag, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const POPULAR_SEARCHES = [
  'Knit Dress',
  'Men\'s Polo',
  'Culture Hoodie',
  'Special Run Combo',
  'Ribbed Beanie',
  'Monogram',
];

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    openProductDetail,
    setSearchQuery: setGlobalSearch,
  } = useStore();

  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setLocalQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const results = localQuery.trim()
    ? products.filter((p) => {
        const q = localQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelectProduct = (product: typeof products[0]) => {
    setIsSearchModalOpen(false);
    openProductDetail(product);
  };

  const handleSearchTerm = (term: string) => {
    setLocalQuery(term);
  };

  const handleViewAllResults = () => {
    setGlobalSearch(localQuery);
    setIsSearchModalOpen(false);
    const catalogElem = document.getElementById('catalog-section');
    catalogElem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsSearchModalOpen(false)}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            id="input-global-search"
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search knitwear, hoodies, dresses, polos, or tags..."
            className="w-full bg-transparent text-base sm:text-lg font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-1"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Suggestions / Popular Searches */}
          {!localQuery.trim() && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Popular Searches in 018</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchTerm(term)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#f35d1f] hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Quick Collections</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Knitted Monogram', desc: 'Dresses & Polos' },
                    { name: 'Culture & Identity', desc: 'Heavyweight Hoodies' },
                    { name: 'Platinum Belt', desc: 'Sunset Stripe Prints' },
                  ].map((col) => (
                    <button
                      key={col.name}
                      onClick={() => handleSearchTerm(col.name)}
                      className="text-left p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-[#f35d1f] transition-colors"
                    >
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {col.name}
                      </p>
                      <p className="text-[11px] text-neutral-400">{col.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results List */}
          {localQuery.trim() && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>{results.length} results found</span>
                {results.length > 0 && (
                  <button
                    onClick={handleViewAllResults}
                    className="text-[#f35d1f] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View all in catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    No matching pieces found for "{localQuery}"
                  </p>
                  <p className="text-xs text-neutral-400">
                    Try searching for "knitwear", "dress", "hoodie", or "polo"
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-200 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#f35d1f] transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 capitalize">
                            {product.category} • {product.gender}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-sm text-neutral-900 dark:text-white font-['Syne']">
                          R{(product.salePrice || product.basePrice).toLocaleString()}
                        </p>
                        {product.salePrice && (
                          <p className="text-[10px] text-neutral-400 line-through">
                            R{product.basePrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
