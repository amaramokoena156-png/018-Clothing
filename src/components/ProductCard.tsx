import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    toggleWishlist,
    isInWishlist,
    addToCart,
    showToast,
  } = useStore();

  const isLiked = isInWishlist(product.id);
  const primaryImgObj = product.images.find((img) => img.isPrimary) || product.images[0];
  const primaryImg = primaryImgObj?.url || '';
  const secondaryImgObj = product.images.find((img) => img.id !== primaryImgObj?.id);
  const hoverImg = secondaryImgObj?.url || primaryImg;

  const currentPrice = product.salePrice || product.basePrice;
  const originalPrice = product.basePrice;
  const discountAmount = product.salePrice ? originalPrice - product.salePrice : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants.length === 1) {
      addToCart(product, product.variants[0].id, 1);
    } else {
      // If multiple variants exist, open detail view so user picks size
      openProductDetail(product);
      showToast('Please select your preferred size and color.');
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => openProductDetail(product)}
      className="group relative flex flex-col bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          src={primaryImg}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {hoverImg !== primaryImg && (
          <img
            src={hoverImg}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.onSale && (
            <span className="bg-[#f35d1f] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
              SAVE R{discountAmount}
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
              BESTSELLER
            </span>
          )}
          {product.newArrival && !product.bestSeller && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
              NEW DROP
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 hover:text-[#f35d1f] dark:hover:text-[#f35d1f] shadow-sm backdrop-blur-xs transition-colors"
          title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isLiked ? 'fill-[#f35d1f] text-[#f35d1f] scale-110' : ''
            }`}
          />
        </button>

        {/* Bottom Quick Action Bar on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            id={`btn-quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product);
            }}
            className="flex-1 py-2 px-3 rounded-lg bg-neutral-950/80 hover:bg-neutral-950 text-white text-xs font-semibold backdrop-blur-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            id={`btn-quick-add-${product.id}`}
            onClick={handleQuickAdd}
            className="py-2 px-3 rounded-lg bg-[#f35d1f] hover:bg-[#ea580c] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            title="Quick add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span className="uppercase tracking-wider text-[10px] text-neutral-500 dark:text-neutral-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                {product.rating}
              </span>
            </div>
          </div>

          <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-[#f35d1f] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Price Row */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base text-neutral-950 dark:text-white font-['Syne']">
              R{currentPrice.toLocaleString()}
            </span>
            {product.salePrice && (
              <span className="text-xs line-through text-neutral-400">
                R{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 uppercase font-medium">
            {product.variants.length} {product.variants.length === 1 ? 'Size' : 'Sizes'}
          </span>
        </div>
      </div>
    </div>
  );
};
