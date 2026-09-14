import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    appliedDiscount,
    discountAmount,
    applyDiscountCode,
    removeDiscountCode,
    shippingCost,
    isFreeShipping,
    freeShippingRemaining,
    siteSettings,
    setIsCheckoutModalOpen,
    showToast,
  } = useStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyDiscountCode(promoCodeInput);
    setPromoStatus(res.message);
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your bag is empty.');
      return;
    }
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / siteSettings.freeShippingThreshold) * 100)
  );

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white dark:bg-[#15181b] h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#f35d1f]" />
            <h2 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white font-['Syne']">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="btn-close-cart-drawer"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-neutral-50 dark:bg-[#101214] p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <Truck className="w-4 h-4 text-[#f35d1f]" />
              {isFreeShipping ? (
                <strong className="text-emerald-600 dark:text-emerald-400">You unlocked FREE Express Delivery!</strong>
              ) : (
                <span>
                  Add <strong className="text-[#f35d1f]">R{freeShippingRemaining.toLocaleString()}</strong> more for FREE Shipping
                </span>
              )}
            </span>
            <span className="text-neutral-400 text-[11px]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f35d1f] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                Your shopping bag is empty
              </p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore the latest 018 Bokone Bophirima knitwear, hoodies, and exclusive combo drops.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#f35d1f] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ea580c] transition-colors"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#191c20] shadow-xs"
              >
                <img
                  src={item.product.images[0]?.url}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover rounded-lg bg-neutral-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Size: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.size}</span>
                      {item.color && <span> • {item.color}</span>}
                    </p>
                  </div>

                  <div className="flex justify-between items-baseline pt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden bg-neutral-50 dark:bg-neutral-800">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-neutral-900 dark:text-white min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right font-['Syne'] font-extrabold text-sm text-neutral-900 dark:text-white">
                      R{(item.unitPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs uppercase font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#f35d1f]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-bold rounded-lg hover:bg-[#f35d1f] hover:text-white transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoStatus && (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {promoStatus}
                </p>
              )}

              {appliedDiscount && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">
                  <span className="flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    Code {appliedDiscount.code} applied
                  </span>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-neutral-400 hover:text-red-500 font-bold ml-2"
                  >
                    ×
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Summary */}
            <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                  R{cartSubtotal.toLocaleString()}
                </span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span className="font-mono font-bold">-R{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Door-to-Door Courier Delivery</span>
                <span className="font-semibold font-mono">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `R${shippingCost}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-950 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span>Estimated Total (ZAR)</span>
                <span className="font-['Syne'] text-base text-[#f35d1f]">
                  R{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="btn-proceed-to-checkout"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-neutral-400">
              Secure South African checkout via PayFast (Cards, Capitec Pay, Instant EFT &amp; Scan to Pay).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
