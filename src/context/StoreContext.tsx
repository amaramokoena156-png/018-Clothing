import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  initialCategories,
  initialCollections,
  initialDiscounts,
  initialProducts,
  initialSiteSettings,
} from '../data/initialCatalog';
import {
  initializeDatabase,
  subscribeToProducts,
  subscribeToOrders,
  subscribeToSiteSettings,
  saveProductToDb,
  deleteProductFromDb,
  updateProductStockInDb,
  saveOrderToDb,
  updateOrderStatusInDb,
  saveSiteSettingsToDb,
  saveUserProfileToDb,
  registerWithEmailPassword,
  signInWithEmailPassword,
  resetPassword as sendPasswordReset,
  signOutUser,
  subscribeToAuthState,
  isAdminEmail,
} from '../services/dbService';
import { testFirestoreConnection } from '../lib/firebase';
import {
  Address,
  AdminActivityLog,
  CartItem,
  Category,
  Collection,
  DiscountCode,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  PushNotificationItem,
  SiteSettings,
  UserProfile,
} from '../types';

interface StoreContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Catalog
  products: Product[];
  categories: Category[];
  collections: Collection[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeCollection: string;
  setActiveCollection: (col: string) => void;
  activeGender: string;
  setActiveGender: (gender: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSizes: string[];
  toggleSizeFilter: (size: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onlyOnSale: boolean;
  setOnlyOnSale: (val: boolean) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  filteredProducts: Product[];
  resetFilters: () => void;

  // Product Detail
  selectedProduct: Product | null;
  openProductDetail: (product: Product | string) => void;
  closeProductDetail: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartCount: number;
  appliedDiscount: DiscountCode | null;
  discountAmount: number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  shippingCost: number;
  isFreeShipping: boolean;
  freeShippingRemaining: number;

  // Wishlist
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => void;

  // Auth & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;

  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;

  // Orders & Checkout
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: 'payfast' | 'yoco' | 'ozow' | 'card' | 'whatsapp';
    shippingMethod: string;
    notes?: string;
  }) => Order;
  lastOrder: Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, tracking?: string, courier?: string) => void;

  // Push Notifications
  notifications: PushNotificationItem[];
  unreadNotificationCount: number;
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<void>;
  sendNotification: (title: string, body: string, type?: 'order' | 'drop' | 'promo' | 'system', link?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Admin CMS & Catalog Management
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  updateInventory: (productId: string, variantId: string, quantity: number) => void;
  discounts: DiscountCode[];
  addDiscountCode: (code: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
  toggleDiscountStatus: (id: string) => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  auditLogs: AdminActivityLog[];

  // Navigation & Modals
  activeView: 'store' | 'admin' | 'account' | 'collections' | 'brand-story' | 'contact' | 'legal';
  setActiveView: (view: 'store' | 'admin' | 'account' | 'collections' | 'brand-story' | 'contact' | 'legal') => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isOrderConfirmedOpen: boolean;
  setIsOrderConfirmedOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Database Connection & Synchronization
  isDbConnected: boolean;
  isDbSyncing: boolean;
  dbLastSynced: string | null;
  syncDatabase: () => Promise<void>;


  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Audio notification chime synthesizer
const playLuxuryChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // First harmonic
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.5);
  } catch {
    // Ignore audio permission block
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('018_theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('018_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync with OS preference if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('018_theme');
      if (!saved) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      setToastMessage(next ? 'Switched to Dark Mode' : 'Switched to Light Mode');
      setTimeout(() => {
        setToastMessage((current) =>
          current === 'Switched to Dark Mode' || current === 'Switched to Light Mode' ? null : current
        );
      }, 2500);
      return next;
    });
  };

  // Products & Catalogs — Firestore is the production source of truth.
  // Bundled products are only a temporary visual fallback until the first
  // successful Firestore snapshot arrives. Product changes are never persisted
  // to localStorage.
  const [products, setProducts] = useState<Product[]>(initialProducts);


  const [categories] = useState<Category[]>(initialCategories);
  const [collections] = useState<Collection[]>(initialCollections);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_site_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.supportWhatsapp === '0794133820') {
            parsed.supportWhatsapp = '0640629602';
            parsed.supportPhone = '064 062 9602';
          }
          return { ...initialSiteSettings, ...parsed };
        } catch {}
      }
    }
    return initialSiteSettings;
  });

  useEffect(() => {
    localStorage.setItem('018_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Database Connection & Synchronization State
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isDbSyncing, setIsDbSyncing] = useState<boolean>(false);
  const [dbLastSynced, setDbLastSynced] = useState<string | null>(null);

  const syncDatabase = async () => {
    setIsDbSyncing(true);
    try {
      const success = await initializeDatabase();
      setIsDbConnected(success);
      if (!success) throw new Error('Firebase database synchronization failed.');
      setDbLastSynced(new Date().toLocaleTimeString());
      showToast('Database synchronized with cloud.');
    } catch (err) {
      console.error('Database sync failed:', err);
      setIsDbConnected(false);
      showToast('Database synchronization failed.');
    } finally {
      setIsDbSyncing(false);
    }
  };

  // Mount effect: Test connection, seed database if empty, and subscribe to live collections
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;
    let unsubscribeAuth: (() => void) | undefined;

    const setupDatabase = async () => {
      setIsDbSyncing(true);
      try {
        const connected = await testFirestoreConnection();
        setIsDbConnected(connected);
        if (connected) {
          setDbLastSynced(new Date().toLocaleTimeString());
        }

        unsubscribeProducts = subscribeToProducts(
          (cloudProducts) => {
            setProducts(cloudProducts);
            setDbLastSynced(new Date().toLocaleTimeString());
          },
          (err) => {
            console.warn('Products live listener:', err);
            setIsDbConnected(false);
          }
        );

        unsubscribeSettings = subscribeToSiteSettings(
          (cloudSettings) => {
            setSiteSettings(cloudSettings);
          },
          (err) => console.warn('Settings live listener:', err)
        );
      } catch (err) {
        console.warn('Initial cloud db setup:', err);
        setIsDbConnected(false);
      } finally {
        setIsDbSyncing(false);
      }
    };

    setupDatabase();

    // Firebase Auth state listener: only attach protected orders listener once authenticated
    unsubscribeAuth = subscribeToAuthState((fbUser) => {
      // Detach any previous orders subscription
      unsubscribeOrders?.();
      unsubscribeOrders = undefined;

      if (fbUser) {
        const isAdminUser = isAdminEmail(fbUser.email);

        setUser((prev) => ({
          id: fbUser.uid,
          email: fbUser.email || 'customer@018bokone.co.za',
          fullName:
            fbUser.displayName ||
            (isAdminUser ? '018 Store Director' : fbUser.email?.split('@')[0] || '018 Customer'),
          phone: prev?.phone || '079 413 3820',
          role: isAdminUser ? 'admin' : 'customer',
          addresses: prev?.addresses || [
            {
              id: 'addr-default',
              firstName: fbUser.displayName?.split(' ')[0] || 'Customer',
              lastName: fbUser.displayName?.split(' ')[1] || 'User',
              phone: '079 413 3820',
              streetAddress: '14 Anderson Street',
              suburb: 'Wilkoppies',
              city: 'Klerksdorp',
              province: 'North West',
              postalCode: '2571',
              country: 'South Africa',
              isDefault: true,
            },
          ],
          wishlistProductIds: prev?.wishlistProductIds || [],
          createdAt: prev?.createdAt || new Date().toISOString(),
          notificationPreferences: prev?.notificationPreferences || {
            orderUpdates: true,
            newDrops: true,
            exclusiveSales: true,
            pushEnabled: true,
          },
        }));

        if (isAdminUser) {
          initializeDatabase().then((success) => {
            if (!success) {
              showToast('Admin account authenticated, but Firebase catalog initialization failed.');
            }
          });
        }

        // Attach orders listener safely scoped to authenticated credentials
        unsubscribeOrders = subscribeToOrders(
          (cloudOrders) => {
            setOrders(cloudOrders);
            setDbLastSynced(new Date().toLocaleTimeString());
          },
          (err) => console.warn('Orders live listener:', err),
          fbUser.uid
        );
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribeProducts?.();
      unsubscribeOrders?.();
      unsubscribeSettings?.();
      unsubscribeAuth?.();
    };
  }, []);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [activeGender, setActiveGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 4000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveCollection('all');
    setActiveGender('all');
    setSearchQuery('');
    setSelectedSizes([]);
    setSelectedTag(null);
    setPriceRange([0, 4000]);
    setSortBy('featured');
    setOnlyOnSale(false);
    setOnlyInStock(false);
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.published)
      .filter((p) => {
        // Category
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // Collection
        if (activeCollection !== 'all' && p.collection !== activeCollection) {
          return false;
        }
        // Gender
        if (activeGender !== 'all' && p.gender !== 'unisex' && p.gender !== activeGender) {
          return false;
        }
        // On Sale
        if (onlyOnSale && !p.onSale) {
          return false;
        }
        // Tag
        if (selectedTag && !p.tags.includes(selectedTag)) {
          return false;
        }
        // Price Range
        const currentPrice = p.salePrice || p.basePrice;
        if (currentPrice < priceRange[0] || currentPrice > priceRange[1]) {
          return false;
        }
        // In stock
        const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
        if (onlyInStock && totalStock <= 0) {
          return false;
        }
        // Sizes
        if (selectedSizes.length > 0) {
          const hasMatchingSize = p.variants.some(
            (v) => selectedSizes.includes(v.size) && v.stockQuantity > 0
          );
          if (!hasMatchingSize) return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSku && !matchTag) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.basePrice;
        const priceB = b.salePrice || b.basePrice;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'bestseller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        // Default: featured first, then newest
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    activeCategory,
    activeCollection,
    activeGender,
    onlyOnSale,
    selectedTag,
    priceRange,
    onlyInStock,
    selectedSizes,
    searchQuery,
    sortBy,
  ]);

  // Product Detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProductDetail = (productOrSlug: Product | string) => {
    if (typeof productOrSlug === 'string') {
      const found = products.find((p) => p.slug === productOrSlug || p.id === productOrSlug);
      if (found) setSelectedProduct(found);
    } else {
      setSelectedProduct(productOrSlug);
    }
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('018_cart', JSON.stringify(cart));
  }, [cart]);

  const [discounts, setDiscounts] = useState<DiscountCode[]>(initialDiscounts);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  const addToCart = (product: Product, variantId: string, quantity = 1): boolean => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.stockQuantity < quantity) {
      showToast('Selected variant is currently out of stock.');
      return false;
    }

    const price = variant.priceOverride || product.salePrice || product.basePrice;
    const cartItemId = `${product.id}-${variantId}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > variant.stockQuantity) {
          showToast(`Maximum available stock reached (${variant.stockQuantity}).`);
          return prev;
        }
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          variantId,
          size: variant.size,
          color: variant.color,
          quantity,
          unitPrice: price,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    playLuxuryChime();
    showToast(`Added ${product.name} (${variant.size}) to your bag.`);
    setIsCartDrawerOpen(true);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from your bag.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const freeShippingThreshold = siteSettings.freeShippingThreshold;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || appliedDiscount?.type === 'free_shipping';
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percentage') {
      return Math.round((cartSubtotal * appliedDiscount.value) / 100);
    }
    if (appliedDiscount.type === 'fixed') {
      return Math.min(appliedDiscount.value, cartSubtotal);
    }
    if (appliedDiscount.type === 'free_shipping') {
      return siteSettings.standardShippingFee;
    }
    return 0;
  }, [appliedDiscount, cartSubtotal, siteSettings.standardShippingFee]);

  const shippingCost = isFreeShipping ? 0 : cart.length > 0 ? siteSettings.standardShippingFee : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = discounts.find((d) => d.code.toUpperCase() === cleanCode && d.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Code ${cleanCode} requires a minimum order of R${found.minOrderAmount}.`,
      };
    }
    setAppliedDiscount(found);
    playLuxuryChime();
    return { success: true, message: `Promo code ${cleanCode} applied successfully!` };
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    showToast('Promotional code removed.');
  };

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_wishlist');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('018_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        playLuxuryChime();
        showToast('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const moveWishlistToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.variants.length === 0) return;
    const availableVariant = product.variants.find((v) => v.stockQuantity > 0) || product.variants[0];
    addToCart(product, availableVariant.id, 1);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  // Auth & Profile — Firebase Authentication is the only source of truth.
  const [user, setUser] = useState<UserProfile | null>(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const buildProfile = (fbUser: import('firebase/auth').User, role: 'customer' | 'admin'): UserProfile => ({
    id: fbUser.uid,
    email: fbUser.email || '',
    fullName: fbUser.displayName || (role === 'admin' ? '018 Store Director' : fbUser.email?.split('@')[0] || '018 Customer'),
    phone: fbUser.phoneNumber || '064 062 9602',
    role,
    addresses: [],
    wishlistProductIds: wishlistIds,
    createdAt: new Date().toISOString(),
    notificationPreferences: {
      orderUpdates: true,
      newDrops: true,
      exclusiveSales: true,
      pushEnabled: true,
    },
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const fbUser = await signInWithEmailPassword(email, password);
      const role = isAdminEmail(fbUser.email) ? 'admin' : 'customer';
      const profile = buildProfile(fbUser, role);
      setUser(profile);
      await saveUserProfileToDb(profile);
      playLuxuryChime();
      showToast(role === 'admin' ? 'Admin signed in successfully.' : `Welcome back, ${profile.fullName}.`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      console.error('Firebase sign-in failed:', err);
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code?: string }).code) : '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        showToast('Incorrect email or password.');
      } else if (code.includes('too-many-requests')) {
        showToast('Too many attempts. Please try again later.');
      } else {
        showToast('Sign in failed. Please try again.');
      }
      return false;
    }
  };


  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const cleanName = name.trim() || '018 Shopper';
      const cleanEmail = email.trim().toLowerCase();
      const fbUser = await registerWithEmailPassword(cleanName, cleanEmail, password);
      const profile = buildProfile(fbUser, 'customer');
      profile.fullName = cleanName;
      setUser(profile);
      await saveUserProfileToDb(profile);
      playLuxuryChime();
      showToast(`Welcome to 018, ${cleanName}.`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      console.error('Firebase registration failed:', err);
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code?: string }).code) : '';
      if (code.includes('email-already-in-use')) showToast('An account with this email already exists. Please sign in.');
      else if (code.includes('weak-password')) showToast('Please choose a stronger password.');
      else if (code.includes('invalid-email')) showToast('Please enter a valid email address.');
      else showToast('Account creation failed. Please try again.');
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordReset(email);
      showToast('Password reset email sent. Check your inbox.');
      return true;
    } catch (err: unknown) {
      console.error('Password reset failed:', err);
      showToast('We could not send the reset email. Please check the address and try again.');
      return false;
    }
  };

  const logout = () => {
    signOutUser().catch(() => {});
    setUser(null);
    showToast('Signed out of your 018 account.');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast('Profile updated successfully.');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: newAddress.isDefault ? false : a.isDefault,
    }));
    setUser({
      ...user,
      addresses: [...updated, newAddress],
    });
    showToast('Delivery address saved.');
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Order[];
          // Remove the legacy demo order while preserving any real customer orders.
          return Array.isArray(parsed)
            ? parsed.filter((order) => order.customerId !== 'usr-demo-018')
            : [];
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('018_orders', JSON.stringify(orders));
  }, [orders]);

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: 'payfast' | 'yoco' | 'ozow' | 'card' | 'whatsapp';
    shippingMethod: string;
    notes?: string;
  }): Order => {
    const orderNum = `018-ZA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: user?.id,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: cart.map((item) => ({
        id: `ord-it-${Date.now()}-${item.variantId}`,
        productId: item.productId,
        productName: item.product.name,
        variantId: item.variantId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.unitPrice * item.quantity,
        image: item.product.images[0]?.url || '',
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      discountCode: appliedDiscount?.code,
      shippingCost,
      shippingMethod: orderData.shippingMethod,
      total: cartTotal,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: orderData.paymentMethod,
      trackingNumber: `018-${Math.random().toString(36).substring(2, 9).toUpperCase()}-ZA`,
      courierName: 'The Courier Guy (Express Door-to-Door)',
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = cart.find((item) => item.productId === prod.id);
        if (!orderedItem) return prod;
        const updatedVariants = prod.variants.map((v) =>
          v.id === orderedItem.variantId
            ? { ...v, stockQuantity: Math.max(0, v.stockQuantity - orderedItem.quantity) }
            : v
        );
        const updatedProd = { ...prod, variants: updatedVariants };
        saveProductToDb(updatedProd).catch(() => {});
        return updatedProd;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToDb(newOrder).catch((err) => console.warn('Order cloud save:', err));
    setLastOrder(newOrder);
    clearCart();
    setAppliedDiscount(null);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f35d1f', '#181b1e', '#ffffff', '#eab308'],
      });
    } catch {}

    // Send push notification
    sendNotification(
      'Order Confirmed! 018 Bokone Bophirima',
      `Your order #${newOrder.orderNumber} for R${newOrder.total.toLocaleString()} has been received and is being prepared.`,
      'order'
    );

    setIsCheckoutModalOpen(false);
    setIsOrderConfirmedOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    tracking?: string,
    courier?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              trackingNumber: tracking || ord.trackingNumber,
              courierName: courier || ord.courierName,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );
    updateOrderStatusInDb(orderId, status, tracking, courier).catch((err) =>
      console.warn('Order status cloud update error:', err)
    );
    showToast(`Order status updated to ${status}.`);
    sendNotification(
      `Order Update: #${orderId}`,
      `Your order status has changed to: ${status.toUpperCase()}.`,
      'order'
    );
  };

  // Push Notifications
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      {
        id: 'notif-1',
        title: 'New Drop: 018 Weekend Special Run',
        body: 'Save up to R700 on the Knitted Dress and Male Knit Polo combo with free beanie.',
        type: 'drop',
        timestamp: '2026-09-12T05:00:00Z',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Welcome to 018 Bokone Bophirima',
        body: 'Not Just A Brand, It\'s A Lifestyle. Use code WELCOME10 for 10% off your initial order.',
        type: 'promo',
        timestamp: '2026-09-11T12:00:00Z',
        read: true,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('018_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPushPermission(res);
        if (res === 'granted') {
          showToast('Push notifications enabled for 018 updates!');
          sendNotification(
            'Notifications Activated',
            'You will now receive instant alerts for new drops, order updates, and limited runs.',
            'system'
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const sendNotification = (
    title: string,
    body: string,
    type: 'order' | 'drop' | 'promo' | 'system' = 'system',
    link?: string
  ) => {
    const newItem: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      body,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };
    setNotifications((prev) => [newItem, ...prev]);
    playLuxuryChime();

    // Trigger browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch {}
    }
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Admin Audit Log
  const [auditLogs, setAuditLogs] = useState<AdminActivityLog[]>([
    {
      id: 'log-1',
      adminId: 'usr-admin',
      adminEmail: 'admin@018bokone.co.za',
      action: 'Catalog Initialized',
      entityType: 'product',
      entityId: 'all',
      details: 'Loaded 11 authentic 018 Bokone Bophirima campaign products.',
      timestamp: '2026-09-12T06:00:00Z',
    },
  ]);

  const logAdminAction = (
    action: string,
    entityType: AdminActivityLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminEmail: user?.email || 'admin@018bokone.co.za',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Admin Product Actions — Firestore write must succeed before the UI claims success.
  const addProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>
  ) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
    };
    try {
      await saveProductToDb(newProduct);
      setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
      logAdminAction('Created Product', 'product', newProduct.id, `Created ${newProduct.name}`);
      showToast(`Product "${newProduct.name}" published successfully.`);
    } catch (err) {
      console.error('Product cloud save error:', err);
      import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  initialCategories,
  initialCollections,
  initialDiscounts,
  initialProducts,
  initialSiteSettings,
} from '../data/initialCatalog';
import {
  initializeDatabase,
  subscribeToProducts,
  subscribeToOrders,
  subscribeToSiteSettings,
  saveProductToDb,
  deleteProductFromDb,
  updateProductStockInDb,
  saveOrderToDb,
  updateOrderStatusInDb,
  saveSiteSettingsToDb,
  saveUserProfileToDb,
  registerWithEmailPassword,
  signInWithEmailPassword,
  resetPassword as sendPasswordReset,
  signOutUser,
  subscribeToAuthState,
  isAdminEmail,
} from '../services/dbService';
import { testFirestoreConnection } from '../lib/firebase';
import {
  Address,
  AdminActivityLog,
  CartItem,
  Category,
  Collection,
  DiscountCode,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  PushNotificationItem,
  SiteSettings,
  UserProfile,
} from '../types';

interface StoreContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Catalog
  products: Product[];
  categories: Category[];
  collections: Collection[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeCollection: string;
  setActiveCollection: (col: string) => void;
  activeGender: string;
  setActiveGender: (gender: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSizes: string[];
  toggleSizeFilter: (size: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onlyOnSale: boolean;
  setOnlyOnSale: (val: boolean) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  filteredProducts: Product[];
  resetFilters: () => void;

  // Product Detail
  selectedProduct: Product | null;
  openProductDetail: (product: Product | string) => void;
  closeProductDetail: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartCount: number;
  appliedDiscount: DiscountCode | null;
  discountAmount: number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  shippingCost: number;
  isFreeShipping: boolean;
  freeShippingRemaining: number;

  // Wishlist
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => void;

  // Auth & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;

  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;

  // Orders & Checkout
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: 'payfast' | 'yoco' | 'ozow' | 'card' | 'whatsapp';
    shippingMethod: string;
    notes?: string;
  }) => Order;
  lastOrder: Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, tracking?: string, courier?: string) => void;

  // Push Notifications
  notifications: PushNotificationItem[];
  unreadNotificationCount: number;
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<void>;
  sendNotification: (title: string, body: string, type?: 'order' | 'drop' | 'promo' | 'system', link?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Admin CMS & Catalog Management
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  updateInventory: (productId: string, variantId: string, quantity: number) => void;
  discounts: DiscountCode[];
  addDiscountCode: (code: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
  toggleDiscountStatus: (id: string) => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  auditLogs: AdminActivityLog[];

  // Navigation & Modals
  activeView: 'store' | 'admin' | 'account' | 'collections' | 'brand-story' | 'contact' | 'legal';
  setActiveView: (view: 'store' | 'admin' | 'account' | 'collections' | 'brand-story' | 'contact' | 'legal') => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isOrderConfirmedOpen: boolean;
  setIsOrderConfirmedOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Database Connection & Synchronization
  isDbConnected: boolean;
  isDbSyncing: boolean;
  dbLastSynced: string | null;
  syncDatabase: () => Promise<void>;


  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Audio notification chime synthesizer
const playLuxuryChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // First harmonic
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.5);
  } catch {
    // Ignore audio permission block
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('018_theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('018_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync with OS preference if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('018_theme');
      if (!saved) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      setToastMessage(next ? 'Switched to Dark Mode' : 'Switched to Light Mode');
      setTimeout(() => {
        setToastMessage((current) =>
          current === 'Switched to Dark Mode' || current === 'Switched to Light Mode' ? null : current
        );
      }, 2500);
      return next;
    });
  };

  // Products & Catalogs — Firestore is the production source of truth.
  // Bundled products are only a temporary visual fallback until the first
  // successful Firestore snapshot arrives. Product changes are never persisted
  // to localStorage.
  const [products, setProducts] = useState<Product[]>(initialProducts);


  const [categories] = useState<Category[]>(initialCategories);
  const [collections] = useState<Collection[]>(initialCollections);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_site_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.supportWhatsapp === '0794133820') {
            parsed.supportWhatsapp = '0640629602';
            parsed.supportPhone = '064 062 9602';
          }
          return { ...initialSiteSettings, ...parsed };
        } catch {}
      }
    }
    return initialSiteSettings;
  });

  useEffect(() => {
    localStorage.setItem('018_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Database Connection & Synchronization State
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isDbSyncing, setIsDbSyncing] = useState<boolean>(false);
  const [dbLastSynced, setDbLastSynced] = useState<string | null>(null);

  const syncDatabase = async () => {
    setIsDbSyncing(true);
    try {
      const success = await initializeDatabase();
      setIsDbConnected(success);
      if (!success) throw new Error('Firebase database synchronization failed.');
      setDbLastSynced(new Date().toLocaleTimeString());
      showToast('Database synchronized with cloud.');
    } catch (err) {
      console.error('Database sync failed:', err);
      setIsDbConnected(false);
      showToast('Database synchronization failed.');
    } finally {
      setIsDbSyncing(false);
    }
  };

  // Mount effect: Test connection, seed database if empty, and subscribe to live collections
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;
    let unsubscribeAuth: (() => void) | undefined;

    const setupDatabase = async () => {
      setIsDbSyncing(true);
      try {
        const connected = await testFirestoreConnection();
        setIsDbConnected(connected);
        if (connected) {
          setDbLastSynced(new Date().toLocaleTimeString());
        }

        unsubscribeProducts = subscribeToProducts(
          (cloudProducts) => {
            setProducts(cloudProducts);
            setDbLastSynced(new Date().toLocaleTimeString());
          },
          (err) => {
            console.warn('Products live listener:', err);
            setIsDbConnected(false);
          }
        );

        unsubscribeSettings = subscribeToSiteSettings(
          (cloudSettings) => {
            setSiteSettings(cloudSettings);
          },
          (err) => console.warn('Settings live listener:', err)
        );
      } catch (err) {
        console.warn('Initial cloud db setup:', err);
        setIsDbConnected(false);
      } finally {
        setIsDbSyncing(false);
      }
    };

    setupDatabase();

    // Firebase Auth state listener: only attach protected orders listener once authenticated
    unsubscribeAuth = subscribeToAuthState((fbUser) => {
      // Detach any previous orders subscription
      unsubscribeOrders?.();
      unsubscribeOrders = undefined;

      if (fbUser) {
        const isAdminUser = isAdminEmail(fbUser.email);

        setUser((prev) => ({
          id: fbUser.uid,
          email: fbUser.email || 'customer@018bokone.co.za',
          fullName:
            fbUser.displayName ||
            (isAdminUser ? '018 Store Director' : fbUser.email?.split('@')[0] || '018 Customer'),
          phone: prev?.phone || '079 413 3820',
          role: isAdminUser ? 'admin' : 'customer',
          addresses: prev?.addresses || [
            {
              id: 'addr-default',
              firstName: fbUser.displayName?.split(' ')[0] || 'Customer',
              lastName: fbUser.displayName?.split(' ')[1] || 'User',
              phone: '079 413 3820',
              streetAddress: '14 Anderson Street',
              suburb: 'Wilkoppies',
              city: 'Klerksdorp',
              province: 'North West',
              postalCode: '2571',
              country: 'South Africa',
              isDefault: true,
            },
          ],
          wishlistProductIds: prev?.wishlistProductIds || [],
          createdAt: prev?.createdAt || new Date().toISOString(),
          notificationPreferences: prev?.notificationPreferences || {
            orderUpdates: true,
            newDrops: true,
            exclusiveSales: true,
            pushEnabled: true,
          },
        }));

        if (isAdminUser) {
          initializeDatabase().then((success) => {
            if (!success) {
              showToast('Admin account authenticated, but Firebase catalog initialization failed.');
            }
          });
        }

        // Attach orders listener safely scoped to authenticated credentials
        unsubscribeOrders = subscribeToOrders(
          (cloudOrders) => {
            setOrders(cloudOrders);
            setDbLastSynced(new Date().toLocaleTimeString());
          },
          (err) => console.warn('Orders live listener:', err),
          fbUser.uid
        );
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribeProducts?.();
      unsubscribeOrders?.();
      unsubscribeSettings?.();
      unsubscribeAuth?.();
    };
  }, []);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [activeGender, setActiveGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 4000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveCollection('all');
    setActiveGender('all');
    setSearchQuery('');
    setSelectedSizes([]);
    setSelectedTag(null);
    setPriceRange([0, 4000]);
    setSortBy('featured');
    setOnlyOnSale(false);
    setOnlyInStock(false);
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.published)
      .filter((p) => {
        // Category
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // Collection
        if (activeCollection !== 'all' && p.collection !== activeCollection) {
          return false;
        }
        // Gender
        if (activeGender !== 'all' && p.gender !== 'unisex' && p.gender !== activeGender) {
          return false;
        }
        // On Sale
        if (onlyOnSale && !p.onSale) {
          return false;
        }
        // Tag
        if (selectedTag && !p.tags.includes(selectedTag)) {
          return false;
        }
        // Price Range
        const currentPrice = p.salePrice || p.basePrice;
        if (currentPrice < priceRange[0] || currentPrice > priceRange[1]) {
          return false;
        }
        // In stock
        const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
        if (onlyInStock && totalStock <= 0) {
          return false;
        }
        // Sizes
        if (selectedSizes.length > 0) {
          const hasMatchingSize = p.variants.some(
            (v) => selectedSizes.includes(v.size) && v.stockQuantity > 0
          );
          if (!hasMatchingSize) return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSku && !matchTag) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.basePrice;
        const priceB = b.salePrice || b.basePrice;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'bestseller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        // Default: featured first, then newest
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    activeCategory,
    activeCollection,
    activeGender,
    onlyOnSale,
    selectedTag,
    priceRange,
    onlyInStock,
    selectedSizes,
    searchQuery,
    sortBy,
  ]);

  // Product Detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProductDetail = (productOrSlug: Product | string) => {
    if (typeof productOrSlug === 'string') {
      const found = products.find((p) => p.slug === productOrSlug || p.id === productOrSlug);
      if (found) setSelectedProduct(found);
    } else {
      setSelectedProduct(productOrSlug);
    }
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('018_cart', JSON.stringify(cart));
  }, [cart]);

  const [discounts, setDiscounts] = useState<DiscountCode[]>(initialDiscounts);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  const addToCart = (product: Product, variantId: string, quantity = 1): boolean => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.stockQuantity < quantity) {
      showToast('Selected variant is currently out of stock.');
      return false;
    }

    const price = variant.priceOverride || product.salePrice || product.basePrice;
    const cartItemId = `${product.id}-${variantId}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > variant.stockQuantity) {
          showToast(`Maximum available stock reached (${variant.stockQuantity}).`);
          return prev;
        }
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          variantId,
          size: variant.size,
          color: variant.color,
          quantity,
          unitPrice: price,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    playLuxuryChime();
    showToast(`Added ${product.name} (${variant.size}) to your bag.`);
    setIsCartDrawerOpen(true);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from your bag.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const freeShippingThreshold = siteSettings.freeShippingThreshold;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || appliedDiscount?.type === 'free_shipping';
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percentage') {
      return Math.round((cartSubtotal * appliedDiscount.value) / 100);
    }
    if (appliedDiscount.type === 'fixed') {
      return Math.min(appliedDiscount.value, cartSubtotal);
    }
    if (appliedDiscount.type === 'free_shipping') {
      return siteSettings.standardShippingFee;
    }
    return 0;
  }, [appliedDiscount, cartSubtotal, siteSettings.standardShippingFee]);

  const shippingCost = isFreeShipping ? 0 : cart.length > 0 ? siteSettings.standardShippingFee : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = discounts.find((d) => d.code.toUpperCase() === cleanCode && d.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Code ${cleanCode} requires a minimum order of R${found.minOrderAmount}.`,
      };
    }
    setAppliedDiscount(found);
    playLuxuryChime();
    return { success: true, message: `Promo code ${cleanCode} applied successfully!` };
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    showToast('Promotional code removed.');
  };

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_wishlist');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('018_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        playLuxuryChime();
        showToast('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const moveWishlistToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.variants.length === 0) return;
    const availableVariant = product.variants.find((v) => v.stockQuantity > 0) || product.variants[0];
    addToCart(product, availableVariant.id, 1);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  // Auth & Profile — Firebase Authentication is the only source of truth.
  const [user, setUser] = useState<UserProfile | null>(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const buildProfile = (fbUser: import('firebase/auth').User, role: 'customer' | 'admin'): UserProfile => ({
    id: fbUser.uid,
    email: fbUser.email || '',
    fullName: fbUser.displayName || (role === 'admin' ? '018 Store Director' : fbUser.email?.split('@')[0] || '018 Customer'),
    phone: fbUser.phoneNumber || '064 062 9602',
    role,
    addresses: [],
    wishlistProductIds: wishlistIds,
    createdAt: new Date().toISOString(),
    notificationPreferences: {
      orderUpdates: true,
      newDrops: true,
      exclusiveSales: true,
      pushEnabled: true,
    },
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const fbUser = await signInWithEmailPassword(email, password);
      const role = isAdminEmail(fbUser.email) ? 'admin' : 'customer';
      const profile = buildProfile(fbUser, role);
      setUser(profile);
      await saveUserProfileToDb(profile);
      playLuxuryChime();
      showToast(role === 'admin' ? 'Admin signed in successfully.' : `Welcome back, ${profile.fullName}.`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      console.error('Firebase sign-in failed:', err);
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code?: string }).code) : '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        showToast('Incorrect email or password.');
      } else if (code.includes('too-many-requests')) {
        showToast('Too many attempts. Please try again later.');
      } else {
        showToast('Sign in failed. Please try again.');
      }
      return false;
    }
  };


  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const cleanName = name.trim() || '018 Shopper';
      const cleanEmail = email.trim().toLowerCase();
      const fbUser = await registerWithEmailPassword(cleanName, cleanEmail, password);
      const profile = buildProfile(fbUser, 'customer');
      profile.fullName = cleanName;
      setUser(profile);
      await saveUserProfileToDb(profile);
      playLuxuryChime();
      showToast(`Welcome to 018, ${cleanName}.`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      console.error('Firebase registration failed:', err);
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code?: string }).code) : '';
      if (code.includes('email-already-in-use')) showToast('An account with this email already exists. Please sign in.');
      else if (code.includes('weak-password')) showToast('Please choose a stronger password.');
      else if (code.includes('invalid-email')) showToast('Please enter a valid email address.');
      else showToast('Account creation failed. Please try again.');
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordReset(email);
      showToast('Password reset email sent. Check your inbox.');
      return true;
    } catch (err: unknown) {
      console.error('Password reset failed:', err);
      showToast('We could not send the reset email. Please check the address and try again.');
      return false;
    }
  };

  const logout = () => {
    signOutUser().catch(() => {});
    setUser(null);
    showToast('Signed out of your 018 account.');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast('Profile updated successfully.');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: newAddress.isDefault ? false : a.isDefault,
    }));
    setUser({
      ...user,
      addresses: [...updated, newAddress],
    });
    showToast('Delivery address saved.');
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Order[];
          // Remove the legacy demo order while preserving any real customer orders.
          return Array.isArray(parsed)
            ? parsed.filter((order) => order.customerId !== 'usr-demo-018')
            : [];
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('018_orders', JSON.stringify(orders));
  }, [orders]);

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: 'payfast' | 'yoco' | 'ozow' | 'card' | 'whatsapp';
    shippingMethod: string;
    notes?: string;
  }): Order => {
    const orderNum = `018-ZA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: user?.id,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: cart.map((item) => ({
        id: `ord-it-${Date.now()}-${item.variantId}`,
        productId: item.productId,
        productName: item.product.name,
        variantId: item.variantId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.unitPrice * item.quantity,
        image: item.product.images[0]?.url || '',
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      discountCode: appliedDiscount?.code,
      shippingCost,
      shippingMethod: orderData.shippingMethod,
      total: cartTotal,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: orderData.paymentMethod,
      trackingNumber: `018-${Math.random().toString(36).substring(2, 9).toUpperCase()}-ZA`,
      courierName: 'The Courier Guy (Express Door-to-Door)',
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = cart.find((item) => item.productId === prod.id);
        if (!orderedItem) return prod;
        const updatedVariants = prod.variants.map((v) =>
          v.id === orderedItem.variantId
            ? { ...v, stockQuantity: Math.max(0, v.stockQuantity - orderedItem.quantity) }
            : v
        );
        const updatedProd = { ...prod, variants: updatedVariants };
        saveProductToDb(updatedProd).catch(() => {});
        return updatedProd;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToDb(newOrder).catch((err) => console.warn('Order cloud save:', err));
    setLastOrder(newOrder);
    clearCart();
    setAppliedDiscount(null);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f35d1f', '#181b1e', '#ffffff', '#eab308'],
      });
    } catch {}

    // Send push notification
    sendNotification(
      'Order Confirmed! 018 Bokone Bophirima',
      `Your order #${newOrder.orderNumber} for R${newOrder.total.toLocaleString()} has been received and is being prepared.`,
      'order'
    );

    setIsCheckoutModalOpen(false);
    setIsOrderConfirmedOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    tracking?: string,
    courier?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              trackingNumber: tracking || ord.trackingNumber,
              courierName: courier || ord.courierName,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );
    updateOrderStatusInDb(orderId, status, tracking, courier).catch((err) =>
      console.warn('Order status cloud update error:', err)
    );
    showToast(`Order status updated to ${status}.`);
    sendNotification(
      `Order Update: #${orderId}`,
      `Your order status has changed to: ${status.toUpperCase()}.`,
      'order'
    );
  };

  // Push Notifications
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('018_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      {
        id: 'notif-1',
        title: 'New Drop: 018 Weekend Special Run',
        body: 'Save up to R700 on the Knitted Dress and Male Knit Polo combo with free beanie.',
        type: 'drop',
        timestamp: '2026-09-12T05:00:00Z',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Welcome to 018 Bokone Bophirima',
        body: 'Not Just A Brand, It\'s A Lifestyle. Use code WELCOME10 for 10% off your initial order.',
        type: 'promo',
        timestamp: '2026-09-11T12:00:00Z',
        read: true,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('018_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPushPermission(res);
        if (res === 'granted') {
          showToast('Push notifications enabled for 018 updates!');
          sendNotification(
            'Notifications Activated',
            'You will now receive instant alerts for new drops, order updates, and limited runs.',
            'system'
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const sendNotification = (
    title: string,
    body: string,
    type: 'order' | 'drop' | 'promo' | 'system' = 'system',
    link?: string
  ) => {
    const newItem: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      body,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };
    setNotifications((prev) => [newItem, ...prev]);
    playLuxuryChime();

    // Trigger browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch {}
    }
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Admin Audit Log
  const [auditLogs, setAuditLogs] = useState<AdminActivityLog[]>([
    {
      id: 'log-1',
      adminId: 'usr-admin',
      adminEmail: 'admin@018bokone.co.za',
      action: 'Catalog Initialized',
      entityType: 'product',
      entityId: 'all',
      details: 'Loaded 11 authentic 018 Bokone Bophirima campaign products.',
      timestamp: '2026-09-12T06:00:00Z',
    },
  ]);

  const logAdminAction = (
    action: string,
    entityType: AdminActivityLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminEmail: user?.email || 'admin@018bokone.co.za',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Admin Product Actions — Firestore write must succeed before the UI claims success.
  const addProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>
  ) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
    };
    try {
      await saveProductToDb(newProduct);
      setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
      logAdminAction('Created Product', 'product', newProduct.id, `Created ${newProduct.name}`);
      showToast(`Product "${newProduct.name}" published successfully.`);
    } catch (err) {
      console.error('Product cloud save error:', err);
      showToast('Product was not published. Firebase rejected the save.');
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    const updatedProduct = { ...current, ...updates, updatedAt: new Date().toISOString() };
    try {
      await saveProductToDb(updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
      logAdminAction('Updated Product', 'product', id, 'Updated product fields.');
      showToast('Product updated successfully.');
    } catch (err) {
      console.error('Product cloud update error:', err);
      showToast('Product update failed. Your previous data is still intact.');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    try {
      await deleteProductFromDb(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      logAdminAction('Deleted Product', 'product', id, `Deleted ${target?.name || id}`);
      showToast('Product removed from catalog.');
    } catch (err) {
      console.error('Product cloud delete error:', err);
      showToast('Product could not be deleted from Firebase.');
      throw err;
    }
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${target.sku}-CPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProductToDb(duplicated).then(() => {
      setProducts((prev) => [duplicated, ...prev]);
      logAdminAction('Duplicated Product', 'product', duplicated.id, `Duplicated ${target.name}`);
      showToast(`Duplicated ${target.name}.`);
    }).catch((err) => {
      console.error('Product duplicate save error:', err);
      showToast('Product copy could not be saved to Firebase.');
    });
  };

  const updateInventory = (productId: string, variantId: string, quantity: number) => {
    const currentProduct = products.find((p) => p.id === productId);
    updateProductStockInDb(productId, variantId, quantity, currentProduct).then(() => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                variants: p.variants.map((v) =>
                  v.id === variantId ? { ...v, stockQuantity: Math.max(0, quantity) } : v
                ),
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      logAdminAction('Updated Inventory', 'inventory', `${productId}-${variantId}`, `Adjusted stock to ${quantity}`);
      showToast('Inventory level updated.');
    }).catch((err) => {
      console.error('Stock cloud update error:', err);
      showToast('Inventory update failed.');
    });
  };

  const addDiscountCode = (codeData: Omit<DiscountCode, 'id' | 'usageCount'>) => {
    const newCode: DiscountCode = {
      ...codeData,
      id: `disc-${Date.now()}`,
      usageCount: 0,
    };
    setDiscounts((prev) => [newCode, ...prev]);
    logAdminAction('Created Discount', 'discount', newCode.id, `Added promo code ${newCode.code}`);
    showToast(`Discount code ${newCode.code} created.`);
  };

  const toggleDiscountStatus = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
    showToast('Discount status toggled.');
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const merged = { ...prev, ...settings };
      saveSiteSettingsToDb(merged).catch((err) =>
        console.warn('Site settings cloud update error:', err)
      );
      return merged;
    });
    logAdminAction('Updated Site Settings', 'settings', 'site', 'Modified brand configuration.');
    showToast('Site settings updated.');
  };

  // Views & Modals
  const [activeView, setActiveView] = useState<
    'store' | 'admin' | 'account' | 'collections' | 'brand-story' | 'contact' | 'legal'
  >('store');

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Keyboard shortcut Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        products,
        categories,
        collections,
        activeCategory,
        setActiveCategory,
        activeCollection,
        setActiveCollection,
        activeGender,
        setActiveGender,
        searchQuery,
        setSearchQuery,
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
        resetFilters,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartCount,
        appliedDiscount,
        discountAmount,
        applyDiscountCode,
        removeDiscountCode,
        shippingCost,
        isFreeShipping,
        freeShippingRemaining,
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        resetPassword,
        logout,
        updateProfile,
        addAddress,
        orders,
        createOrder,
        lastOrder,
        updateOrderStatus,
        notifications,
        unreadNotificationCount,
        pushPermission,
        requestPushPermission,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateInventory,
        discounts,
        addDiscountCode,
        toggleDiscountStatus,
        siteSettings,
        updateSiteSettings,
        auditLogs,
        activeView,
        setActiveView,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isWishlistDrawerOpen,
        setIsWishlistDrawerOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isOrderConfirmedOpen,
        setIsOrderConfirmedOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isDbConnected,
        isDbSyncing,
        dbLastSynced,
        syncDatabase,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    const updatedProduct = { ...current, ...updates, updatedAt: new Date().toISOString() };
    try {
      await saveProductToDb(updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
      logAdminAction('Updated Product', 'product', id, 'Updated product fields.');
      showToast('Product updated successfully.');
    } catch (err) {
      console.error('Product cloud update error:', err);
      showToast('Product update failed. Your previous data is still intact.');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    try {
      await deleteProductFromDb(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      logAdminAction('Deleted Product', 'product', id, `Deleted ${target?.name || id}`);
      showToast('Product removed from catalog.');
    } catch (err) {
      console.error('Product cloud delete error:', err);
      showToast('Product could not be deleted from Firebase.');
      throw err;
    }
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${target.sku}-CPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProductToDb(duplicated).then(() => {
      setProducts((prev) => [duplicated, ...prev]);
      logAdminAction('Duplicated Product', 'product', duplicated.id, `Duplicated ${target.name}`);
      showToast(`Duplicated ${target.name}.`);
    }).catch((err) => {
      console.error('Product duplicate save error:', err);
      showToast('Product copy could not be saved to Firebase.');
    });
  };

  const updateInventory = (productId: string, variantId: string, quantity: number) => {
    const currentProduct = products.find((p) => p.id === productId);
    updateProductStockInDb(productId, variantId, quantity, currentProduct).then(() => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                variants: p.variants.map((v) =>
                  v.id === variantId ? { ...v, stockQuantity: Math.max(0, quantity) } : v
                ),
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      logAdminAction('Updated Inventory', 'inventory', `${productId}-${variantId}`, `Adjusted stock to ${quantity}`);
      showToast('Inventory level updated.');
    }).catch((err) => {
      console.error('Stock cloud update error:', err);
      showToast('Inventory update failed.');
    });
  };

  const addDiscountCode = (codeData: Omit<DiscountCode, 'id' | 'usageCount'>) => {
    const newCode: DiscountCode = {
      ...codeData,
      id: `disc-${Date.now()}`,
      usageCount: 0,
    };
    setDiscounts((prev) => [newCode, ...prev]);
    logAdminAction('Created Discount', 'discount', newCode.id, `Added promo code ${newCode.code}`);
    showToast(`Discount code ${newCode.code} created.`);
  };

  const toggleDiscountStatus = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
    showToast('Discount status toggled.');
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const merged = { ...prev, ...settings };
      saveSiteSettingsToDb(merged).catch((err) =>
        console.warn('Site settings cloud update error:', err)
      );
      return merged;
    });
    logAdminAction('Updated Site Settings', 'settings', 'site', 'Modified brand configuration.');
    showToast('Site settings updated.');
  };

  // Views & Modals
  const [activeView, setActiveView] = useState<
    'store' | 'admin' | 'account' | 'collections' | 'brand-story' | 'contact' | 'legal'
  >('store');

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Keyboard shortcut Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        products,
        categories,
        collections,
        activeCategory,
        setActiveCategory,
        activeCollection,
        setActiveCollection,
        activeGender,
        setActiveGender,
        searchQuery,
        setSearchQuery,
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
        resetFilters,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartCount,
        appliedDiscount,
        discountAmount,
        applyDiscountCode,
        removeDiscountCode,
        shippingCost,
        isFreeShipping,
        freeShippingRemaining,
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        resetPassword,
        logout,
        updateProfile,
        addAddress,
        orders,
        createOrder,
        lastOrder,
        updateOrderStatus,
        notifications,
        unreadNotificationCount,
        pushPermission,
        requestPushPermission,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateInventory,
        discounts,
        addDiscountCode,
        toggleDiscountStatus,
        siteSettings,
        updateSiteSettings,
        auditLogs,
        activeView,
        setActiveView,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isWishlistDrawerOpen,
        setIsWishlistDrawerOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isOrderConfirmedOpen,
        setIsOrderConfirmedOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isDbConnected,
        isDbSyncing,
        dbLastSynced,
        syncDatabase,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
