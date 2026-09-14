import React from 'react';
import {
  Bell,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User as UserIcon,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    cartCount,
    wishlistIds,
    unreadNotificationCount,
    user,
    isAdmin,
    login,
    siteSettings,
    activeView,
    setActiveView,
    activeCategory,
    setActiveCategory,
    setIsSearchModalOpen,
    setIsCartDrawerOpen,
    setIsWishlistDrawerOpen,
    setIsAuthModalOpen,
    setIsNotificationDrawerOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useStore();

  const handleCategoryClick = (catSlug: string) => {
    setActiveCategory(catSlug);
    setActiveView('store');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Announcement Bar */}
      {siteSettings.announcementEnabled && (
        <div
          id="announcement-bar"
          className="bg-neutral-950 text-white text-xs py-2 px-4 border-b border-neutral-800"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f35d1f] animate-pulse shrink-0" />
              <p className="font-semibold tracking-wide text-[10px] sm:text-xs uppercase text-neutral-300">
                {siteSettings.announcementText}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] text-neutral-400 font-medium shrink-0">
              <a
                href={`https://wa.me/27${siteSettings.supportWhatsapp.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>WhatsApp: {siteSettings.supportPhone}</span>
              </a>
              <span>•</span>
              <span>Klerksdorp, North West</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        id="main-navbar"
        className="w-full bg-white/90 dark:bg-[#0f1114]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 min-h-20 py-2 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div
            id="brand-logo-container"
            role="button"
            tabIndex={0}
            aria-label="018 zerooneeight - Return to Home"
            onClick={() => {
              setActiveView('store');
              setActiveCategory('all');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveView('store');
                setActiveCategory('all');
              }
            }}
            className="cursor-pointer flex items-center transition-transform duration-200 hover:scale-[1.02] focus:outline-hidden select-none py-1 shrink-0 min-w-0"
          >
            <BrandLogo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-semibold tracking-tight uppercase">
            <button
              id="nav-link-all"
              onClick={() => handleCategoryClick('all')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'all'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              All Pieces
            </button>
            <button
              id="nav-link-caps"
              onClick={() => handleCategoryClick('caps')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'caps'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Caps
            </button>
            <button
              id="nav-link-hats"
              onClick={() => handleCategoryClick('hats')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'hats'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Hats
            </button>
            <button
              id="nav-link-bags"
              onClick={() => handleCategoryClick('bags')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'bags'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Bags
            </button>
            <button
              id="nav-link-accessories"
              onClick={() => handleCategoryClick('accessories')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'accessories'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Accessories
            </button>
            <button
              id="nav-link-knitwear"
              onClick={() => handleCategoryClick('knitwear')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'knitwear'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Knitwear
            </button>
            <button
              id="nav-link-dresses"
              onClick={() => handleCategoryClick('dresses')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'dresses'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Dresses
            </button>
            <button
              id="nav-link-hoodies"
              onClick={() => handleCategoryClick('hoodies')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap ${
                activeView === 'store' && activeCategory === 'hoodies'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]'
              }`}
            >
              Hoodies
            </button>
            <button
              id="nav-link-combos"
              onClick={() => handleCategoryClick('combos')}
              className={`transition-colors py-1 border-b-2 whitespace-nowrap flex items-center gap-1 ${
                activeView === 'store' && activeCategory === 'combos'
                  ? 'border-[#f35d1f] text-[#f35d1f]'
                  : 'border-transparent text-[#f35d1f] hover:text-[#ea580c]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Combos</span>
            </button>

            {/* Admin Console Direct Link for store staff */}
            <button
              id="nav-link-admin-console"
              onClick={() => {
                setActiveView('admin');
              }}
              className={`py-1 px-2.5 rounded text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-all ${
                activeView === 'admin'
                  ? 'bg-[#f35d1f] text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-[#f35d1f] hover:text-white'
              }`}
              title="Open Full Inventory & Stock Management System"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#f35d1f] group-hover:text-white" />
              <span>Admin & Inventory</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 lg:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              id="btn-search-trigger"
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden sm:flex p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors items-center gap-1.5"
              title="Search products (Cmd+K)"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-medium text-neutral-400 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleDarkMode}
              className="hidden sm:flex p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Trigger */}
            <button
              id="btn-notifications-trigger"
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="hidden sm:flex relative p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="Notifications"
              aria-label="View activity and push notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span
                  id="badge-unread-notifications"
                  className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#f35d1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse"
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Wishlist Trigger */}
            <button
              id="btn-wishlist-trigger"
              onClick={() => setIsWishlistDrawerOpen(true)}
              className="hidden sm:flex relative p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="Saved items"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span
                  id="badge-wishlist-count"
                  className="absolute top-1.5 right-1.5 w-4 h-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Account / User Trigger */}
            <button
              id="btn-account-trigger"
              onClick={() => {
                if (user) {
                  setActiveView('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="shrink-0 p-2 sm:p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors relative"
              title={user ? `Account: ${user.fullName}` : 'Sign In'}
              aria-label="User Account"
            >
              <UserIcon className="w-5 h-5" />
              {user && (
                <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              id="btn-cart-drawer-trigger"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative shrink-0 flex items-center justify-center gap-1 sm:gap-2 bg-[#f35d1f] hover:bg-[#ea580c] text-white px-2.5 sm:px-3.5 py-2 rounded-full shadow-sm hover:shadow transition-all group min-w-[42px]"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold tracking-wider">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0f1114] px-4 pt-3 pb-6 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <button
                id="mobile-nav-all"
                onClick={() => handleCategoryClick('all')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                Shop All
              </button>
              <button
                id="mobile-nav-caps"
                onClick={() => handleCategoryClick('caps')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold text-[#f35d1f]"
              >
                Caps
              </button>
              <button
                id="mobile-nav-hats"
                onClick={() => handleCategoryClick('hats')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold text-[#f35d1f]"
              >
                Hats
              </button>
              <button
                id="mobile-nav-bags"
                onClick={() => handleCategoryClick('bags')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold text-[#f35d1f]"
              >
                Bags
              </button>
              <button
                id="mobile-nav-accessories"
                onClick={() => handleCategoryClick('accessories')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold text-[#f35d1f]"
              >
                Accessories
              </button>
              <button
                id="mobile-nav-knitwear"
                onClick={() => handleCategoryClick('knitwear')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                Knitwear
              </button>
              <button
                id="mobile-nav-dresses"
                onClick={() => handleCategoryClick('dresses')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                Dresses
              </button>
              <button
                id="mobile-nav-hoodies"
                onClick={() => handleCategoryClick('hoodies')}
                className="text-left px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                Hoodies
              </button>
              <button
                id="mobile-nav-combos"
                onClick={() => handleCategoryClick('combos')}
                className="col-span-2 text-left px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#f35d1f]"
              >
                Combos & Specials
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="mobile-nav-search"
                  onClick={() => {
                    setIsSearchModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button
                  id="mobile-nav-wishlist"
                  onClick={() => {
                    setIsWishlistDrawerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4" />
                  Saved
                </button>
                <button
                  id="mobile-nav-notifications"
                  onClick={() => {
                    setIsNotificationDrawerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-4 h-4" />
                  Alerts
                </button>
              </div>

              {/* Mobile Theme Toggle Button */}
              <button
                id="mobile-nav-theme-toggle"
                onClick={toggleDarkMode}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f] flex items-center justify-between rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span>Theme Mode</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700">
                  {isDarkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Light</span>
                    </>
                  )}
                </span>
              </button>

              <button
                id="mobile-nav-brand-story"
                onClick={() => {
                  setActiveView('brand-story');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]"
              >
                Brand Story & Bokone Bophirima Roots
              </button>
              <button
                id="mobile-nav-account"
                onClick={() => {
                  if (user) {
                    setActiveView('account');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#f35d1f]"
              >
                {user ? `Customer Portal (${user.fullName})` : 'Sign In / Register'}
              </button>

              <button
                id="mobile-nav-admin"
                onClick={() => {
                  setActiveView('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-bold text-white bg-[#f35d1f] hover:bg-[#ea580c] rounded-lg flex items-center justify-between transition-colors shadow-sm"
              >
                <span>Admin & Inventory System</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
