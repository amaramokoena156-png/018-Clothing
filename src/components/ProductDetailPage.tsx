import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Share2,
  Ruler,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Star,
  Check,
  Flame,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    closeProductDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutModalOpen,
    siteSettings,
    showToast,
  } = useStore();

  if (!selectedProduct) return null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    selectedProduct.variants[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'story' | 'materials' | 'shipping'>('story');

  const isLiked = isInWishlist(selectedProduct.id);
  const selectedVariant =
    selectedProduct.variants.find((v) => v.id === selectedVariantId) ||
    selectedProduct.variants[0];

  const currentPrice = selectedVariant?.priceOverride || selectedProduct.salePrice || selectedProduct.basePrice;
  const originalPrice = selectedProduct.basePrice;
  const discountAmount = selectedProduct.salePrice ? originalPrice - selectedProduct.salePrice : 0;

  const currentStock = selectedVariant ? selectedVariant.stockQuantity : 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(selectedProduct, selectedVariant.id, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    const added = addToCart(selectedProduct, selectedVariant.id, quantity);
    if (added) {
      closeProductDetail();
      setIsCheckoutModalOpen(true);
    }
  };

  const handleWhatsAppOrder = () => {
    const phone = siteSettings.supportWhatsapp.replace(/^0/, '27');
    const msg = encodeURIComponent(
      `Dumelang / Hello! I would like to order the 018 ${selectedProduct.name} in Size ${selectedVariant?.size || 'Standard'} (Price: R${currentPrice}). Is this available for delivery from Klerksdorp?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: selectedProduct.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.');
    }
  };

  return (
    <div
      id="product-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={closeProductDetail}
    >
      <div
        id="product-detail-modal"
        className="relative w-full max-w-5xl bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-product-detail"
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:text-[#f35d1f] shadow-md backdrop-blur-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 bg-neutral-100 dark:bg-neutral-900 flex flex-col p-4 sm:p-6 justify-between">
            {/* Main Stage Image */}
            <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-inner">
              <img
                src={selectedProduct.images[activeImageIndex]?.url || selectedProduct.images[0]?.url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center"
              />
              {selectedProduct.onSale && (
                <div className="absolute top-3 left-3 bg-[#f35d1f] text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded shadow-sm">
                  SAVE R{discountAmount}
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#f35d1f] scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Header / Brand & Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
                <span>018 Bokone Bophirima • {selectedProduct.category}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title="Share piece"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`hover:text-[#f35d1f] transition-colors ${
                      isLiked ? 'text-[#f35d1f]' : ''
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
                {selectedProduct.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {selectedProduct.rating}
                </span>
                <span className="text-neutral-400">
                  ({selectedProduct.reviewCount} customer reviews)
                </span>
              </div>

              {/* Price Block */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-neutral-950 dark:text-white font-['Syne']">
                  R{currentPrice.toLocaleString()}
                </span>
                {selectedProduct.salePrice && (
                  <span className="text-sm line-through text-neutral-400">
                    R{originalPrice.toLocaleString()}
                  </span>
                )}
                {selectedProduct.salePrice && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Save R{discountAmount}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pay in full or pay 4x interest-free installments via PayFast / Ozow.
              </p>
            </div>

            {/* Size & Variant Selector */}
            <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Select Size: <strong className="text-neutral-950 dark:text-white">{selectedVariant?.size}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[#f35d1f] hover:underline font-semibold flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide (SA)</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const isLow = v.stockQuantity > 0 && v.stockQuantity <= 5;
                  const isSoldOut = v.stockQuantity <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={isSoldOut}
                      className={`relative px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 ring-2 ring-[#f35d1f]'
                          : isSoldOut
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed line-through'
                          : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-[#f35d1f]'
                      }`}
                    >
                      <span>{v.size}</span>
                      {isLow && (
                        <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded-full">
                          Low
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Live stock alert */}
              {selectedVariant && currentStock > 0 && currentStock <= 5 && (
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hurry! Only {currentStock} pieces left in stock for Size {selectedVariant.size}.</span>
                </p>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-neutral-900 dark:text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="px-3 py-2 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  id="btn-modal-add-to-bag"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#f35d1f] hover:bg-[#ea580c] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                </button>
              </div>

              {/* Direct Buy Now & WhatsApp Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-modal-buy-now"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Instant Checkout
                </button>
                <button
                  id="btn-modal-whatsapp-order"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Information Tabs: Story, Materials, Shipping */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-6 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`pb-2 transition-colors border-b-2 ${
                    activeTab === 'story'
                      ? 'border-[#f35d1f] text-[#f35d1f]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                >
                  The Story
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`pb-2 transition-colors border-b-2 ${
                    activeTab === 'materials'
                      ? 'border-[#f35d1f] text-[#f35d1f]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                >
                  Materials & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 transition-colors border-b-2 ${
                    activeTab === 'shipping'
                      ? 'border-[#f35d1f] text-[#f35d1f]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                >
                  Delivery & Returns
                </button>
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed min-h-24">
                {activeTab === 'story' && (
                  <div className="space-y-2">
                    <p>{selectedProduct.description}</p>
                    <p className="text-[11px] text-neutral-400 italic">
                      "We don't just make clothes. We preserve who we are. Bokone Bophirima. Proudly North West."
                    </p>
                  </div>
                )}
                {activeTab === 'materials' && (
                  <div className="space-y-2">
                    <p className="font-bold text-neutral-800 dark:text-white">Composition:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedProduct.materials.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                    <p className="font-bold text-neutral-800 dark:text-white pt-2">Garment Care:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedProduct.careInstructions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-[#f35d1f] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-neutral-800 dark:text-white">Courier Delivery (2-4 Business Days)</p>
                        <p className="text-neutral-500">Free door-to-door shipping via The Courier Guy on orders over R999 across all 9 provinces.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2">
                      <RotateCcw className="w-4 h-4 text-[#f35d1f] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-neutral-800 dark:text-white">Hassle-Free Size Exchanges</p>
                        <p className="text-neutral-500">14-day return and exchange policy on all unworn items with tags intact.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
