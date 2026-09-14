import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Tag,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const POPULAR_TAGS = ['monogram', 'knitwear', 'heritage', 'limited edition', 'friday fit', 'special run', 'combo'];

export const CatalogToolbar: React.FC = () => {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    activeGender,
    setActiveGender,
    selectedSizes,
    toggleSizeFilter,
    selectedTag,
    setSelectedTag,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    onlyOnSale,
    setOnlyOnSale,
    onlyInStock,
    setOnlyInStock,
    filteredProducts,
    products,
    resetFilters,
  } = useStore();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  const isFiltered =
    activeCategory !== 'all' ||
    activeGender !== 'all' ||
    selectedSizes.length > 0 ||
    selectedTag !== null ||
    onlyOnSale ||
    onlyInStock ||
    priceRange[0] > 0 ||
    priceRange[1] < 4000;

  return (
    <div id="catalog-toolbar-section" className="space-y-4">
      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.slug}`}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight uppercase whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Action Row: Filters Toggle, Product Count, Sort By Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-filter-panel"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isFilterPanelOpen || isFiltered
                ? 'border-[#f35d1f] text-[#f35d1f] bg-orange-50 dark:bg-orange-950/20'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-[#f35d1f]" />
            )}
          </button>

          {isFiltered && (
            <button
              id="btn-reset-filters"
              onClick={resetFilters}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}

          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Showing <strong className="text-neutral-900 dark:text-white">{filteredProducts.length}</strong> of {products.length} pieces
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="select-sort-by" className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#f35d1f]"
            >
              <option value="featured">Featured Curations</option>
              <option value="date-desc">Newest First (By Date)</option>
              <option value="bestseller">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A - Z</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expandable Filter Details Panel */}
      {isFilterPanelOpen && (
        <div
          id="filter-details-panel"
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#121417] space-y-4 animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gender Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Department / Gender
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Women', value: 'women' },
                  { label: 'Men', value: 'men' },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setActiveGender(g.value)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      activeGender === g.value
                        ? 'bg-[#f35d1f] text-white'
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filters */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSizeFilter(size)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <span>Max Price</span>
                <span className="text-[#f35d1f] font-mono font-bold">R{priceRange[1]}</span>
              </div>
              <input
                id="input-price-range"
                type="range"
                min="0"
                max="4000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-[#f35d1f] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>R0</span>
                <span>R4,000</span>
              </div>
            </div>

            {/* Toggles: Sale & In Stock */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Availability & Deals
              </label>
              <div className="space-y-1.5 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={onlyOnSale}
                    onChange={(e) => setOnlyOnSale(e.target.checked)}
                    className="rounded border-neutral-300 text-[#f35d1f] focus:ring-[#f35d1f]"
                  />
                  <span>On Sale Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded border-neutral-300 text-[#f35d1f] focus:ring-[#f35d1f]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tags Pills Row */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Tags:</span>
            </span>
            {POPULAR_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#f35d1f] text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-[#f35d1f]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>#{tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
