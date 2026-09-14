import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistDrawerOpen,
    setIsWishlistDrawerOpen,
    wishlistProducts,
    toggleWishlist,
    moveWishlistToCart,
    openProductDetail,
  } = useStore();

  if (!isWishlistDrawerOpen) return null;

  return (
    <div
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsWishlistDrawerOpen(false)}
    >
      <div
        id="wishlist-drawer-panel"
        className="w-full max-w-md bg-white dark:bg-[#15181b] h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#f35d1f] fill-current" />
            <h2 className="font-bold text-lg text-neutral-900 dark:text-white font-['Syne']">
              Saved Pieces ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistDrawerOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No pieces saved yet
              </p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Tap the heart icon on any knitwear, dress, or hoodie to curate your personal wishlist.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181b1e] shadow-xs"
              >
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  onClick={() => {
                    setIsWishlistDrawerOpen(false);
                    openProductDetail(product);
                  }}
                  className="w-16 h-20 object-cover rounded-lg bg-neutral-100 shrink-0 cursor-pointer hover:opacity-90"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4
                        onClick={() => {
                          setIsWishlistDrawerOpen(false);
                          openProductDetail(product);
                        }}
                        className="text-xs font-bold text-neutral-900 dark:text-white hover:text-[#f35d1f] cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-['Syne'] font-extrabold text-sm text-neutral-900 dark:text-white pt-1">
                      R{(product.salePrice || product.basePrice).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => moveWishlistToCart(product.id)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#f35d1f] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
