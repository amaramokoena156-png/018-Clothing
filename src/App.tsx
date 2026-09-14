import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { NotificationCenter } from './components/NotificationCenter';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminOperations } from './components/AdminOperations';
import { Sparkles, MapPin, Check, Heart } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;

  return (
    <div
      id="global-toast-notification"
      className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 dark:border-neutral-200 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200"
    >
      <Check className="w-4 h-4 text-[#f35d1f] shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};

const MainStoreContent: React.FC = () => {
  const { activeView } = useStore();

  if (activeView === 'account') {
    return <CustomerPortal />;
  }

  if (activeView === 'admin') {
    return <AdminOperations />;
  }

  return (
    <main>
      {/* Campaign Hero Banner */}
      <HeroBanner />

      {/* Cultural Heritage Banner */}
      <section className="bg-orange-50/60 dark:bg-[#151210] border-y border-orange-100 dark:border-orange-950/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f35d1f] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                018 Heritage Knitting Studio • Klerksdorp
              </h3>
              <p className="text-xs text-neutral-500 max-w-xl">
                Every monogram, stripe, and silhouette is engineered in North West Province. Sustainable yarn, precision ribbing, and authentic South African identity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#f35d1f]" />
              <span>North West (018)</span>
            </span>
            <span>•</span>
            <span>The Courier Guy Door-to-Door</span>
            <span>•</span>
            <span>Paxi Collection</span>
          </div>
        </div>
      </section>

      {/* Main E-Commerce Product Catalog with Categories, Tags, Price, and Search */}
      <ProductGrid />
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d0f11] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 selection:bg-[#f35d1f] selection:text-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Views */}
        <div className="flex-1">
          <MainStoreContent />
        </div>

        {/* Global Modals & Drawers */}
        <SearchModal />
        <CartDrawer />
        <WishlistDrawer />
        <NotificationCenter />
        <ProductDetailPage />
        <CheckoutModal />
        <OrderConfirmationModal />
        <AuthModal />
        <SizeGuideModal />

        {/* Toast notifications */}
        <ToastNotification />

        {/* Brand Footer */}
        <Footer />
      </div>
    </StoreProvider>
  );
}
