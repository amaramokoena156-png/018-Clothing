import React from 'react';
import {
  CheckCircle2,
  Package,
  MessageCircle,
  Truck,
  Printer,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationModal: React.FC = () => {
  const {
    isOrderConfirmedOpen,
    setIsOrderConfirmedOpen,
    lastOrder,
    setActiveView,
    siteSettings,
  } = useStore();

  if (!isOrderConfirmedOpen || !lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppUpdate = () => {
    const phone = siteSettings.supportWhatsapp.replace(/^0/, '27');
    const msg = encodeURIComponent(
      `Dumelang 018 Team! I placed order #${lastOrder.orderNumber} for R${lastOrder.total.toLocaleString()} to ${lastOrder.shippingAddress.city}, ${lastOrder.shippingAddress.province}. Please confirm courier dispatch.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div
      id="order-confirmation-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={() => setIsOrderConfirmedOpen(false)}
    >
      <div
        id="order-confirmation-container"
        className="relative w-full max-w-2xl bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOrderConfirmedOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-[#f35d1f] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kea Leboha / Siyabonga! Payment Confirmed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-neutral-900 dark:text-white">
            Order #{lastOrder.orderNumber}
          </h2>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Your 018 Bokone Bophirima pieces are being packed at our Klerksdorp fulfillment studio. A confirmation has been logged.
          </p>
        </div>

        {/* Tracking & Details Box */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-neutral-500">Waybill Tracking Number:</span>
            <span className="font-mono font-bold text-[#f35d1f] bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
              {lastOrder.trackingNumber}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-neutral-500">Courier Provider:</span>
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#f35d1f]" />
              <span>{lastOrder.courierName}</span>
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-neutral-500">Delivering To:</span>
            <span className="font-semibold text-neutral-900 dark:text-white text-right">
              {lastOrder.shippingAddress.streetAddress}, {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.province} ({lastOrder.shippingAddress.postalCode})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-neutral-500">Payment Gateway:</span>
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span className="bg-[#b81d24] text-white text-[9px] font-black px-1.5 py-0.5 rounded font-['Syne']">
                PayFast
              </span>
              <span>South Africa (Authorized &amp; Verified)</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-neutral-500">Total Paid:</span>
            <span className="font-['Syne'] text-base font-extrabold text-[#f35d1f]">
              R{lastOrder.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Ordered Items Preview */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Purchased Items ({lastOrder.items.length})
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {lastOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-[#181b1e] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt=""
                    className="w-10 h-12 object-cover rounded bg-neutral-200 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  R{item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={handleWhatsAppUpdate}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Dispatch</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => {
              setIsOrderConfirmedOpen(false);
              setActiveView('account');
            }}
            className="py-3 px-4 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Track in Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
