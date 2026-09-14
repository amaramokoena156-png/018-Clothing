import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  Package,
  Boxes,
  BellRing,
  Settings,
  ArrowLeft,
  Truck,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  Check,
  X,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  TrendingDown,
  DollarSign,
  Layers,
  ShieldCheck,
  ExternalLink,
  Info,
  Database,
  RefreshCw,
  Server,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Key,
  CreditCard,
  Mail,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, Product, ProductGender, ProductVariant, ProductImage } from '../types';
import { ProductImageUploader } from './ProductImageUploader';

const CATEGORY_OPTIONS = [
  { label: 'Caps', value: 'caps' },
  { label: 'Hats', value: 'hats' },
  { label: 'Bags', value: 'bags' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Luxury Knitwear', value: 'knitwear' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Hoodies & Sweats', value: 'hoodies' },
  { label: 'Polos & Knits', value: 'polos' },
  { label: 'T-Shirts', value: 't-shirts' },
  { label: 'Combos & Sets', value: 'combos' },
];

export const AdminOperations: React.FC = () => {
  const {
    user,
    login,

    setActiveView,
    orders,
    updateOrderStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    updateInventory,
    sendNotification,
    siteSettings,
    updateSiteSettings,
    showToast,
    categories,
    isDbConnected,
    isDbSyncing,
    dbLastSynced,
    syncDatabase,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'broadcast' | 'settings' | 'database'>('inventory');

  // Inventory Management View State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'out' | 'in_stock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock-desc' | 'stock-asc' | 'price-desc' | 'price-asc'>('name');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('caps');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>(350);
  const [newProdSalePrice, setNewProdSalePrice] = useState<number | ''>('');
  const [newProdSku, setNewProdSku] = useState('018-CAP-NEW-01');
  const [newProdGender, setNewProdGender] = useState<ProductGender>('unisex');
  const [newProdType, setNewProdType] = useState('Caps');
  const [newProdCollection, setNewProdCollection] = useState('018-core');
  const [newProdShortDesc, setNewProdShortDesc] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProductImages, setNewProductImages] = useState<ProductImage[]>([]);
  const [newProdSizeType, setNewProdSizeType] = useState<'one-size' | 'clothing'>('one-size');
  const [newProdOneSizeStock, setNewProdOneSizeStock] = useState<number>(30);
  const [newProdApparelStock, setNewProdApparelStock] = useState<{ [key: string]: number }>({
    S: 15,
    M: 25,
    L: 20,
    XL: 10,
  });
  const [newProdTags, setNewProdTags] = useState('caps, headwear, bokone, streetwear');

  // Push broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('018 Friday Exclusive Drop');
  const [broadcastBody, setBroadcastBody] = useState('New Knitted Monogram Polos, Hats and Bags are now live in Klerksdorp!');
  const [broadcastType, setBroadcastType] = useState<'order' | 'drop' | 'promo' | 'system'>('drop');

  // Site settings state
  const [supportPhone, setSupportPhone] = useState(siteSettings.supportWhatsapp);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(siteSettings.freeShippingThreshold);

  // PayFast Payment Gateway Configuration State
  const [payfastMerchantId, setPayfastMerchantId] = useState(siteSettings.payfastMerchantId || '10000100');
  const [payfastMerchantKey, setPayfastMerchantKey] = useState(siteSettings.payfastMerchantKey || '46f0cd694581a');
  const [payfastPassphrase, setPayfastPassphrase] = useState(siteSettings.payfastPassphrase || '');
  const [payfastSandbox, setPayfastSandbox] = useState(siteSettings.payfastSandbox ?? true);

  // Dedicated Admin Password Management State

  // Synchronize state if site settings load or update
  useEffect(() => {
    if (siteSettings.supportWhatsapp) {
      setSupportPhone(siteSettings.supportWhatsapp);
    }
    if (siteSettings.freeShippingThreshold !== undefined) {
      setFreeShippingThreshold(siteSettings.freeShippingThreshold);
    }
    if (siteSettings.payfastMerchantId) {
      setPayfastMerchantId(siteSettings.payfastMerchantId);
    }
    if (siteSettings.payfastMerchantKey) {
      setPayfastMerchantKey(siteSettings.payfastMerchantKey);
    }
    if (siteSettings.payfastPassphrase !== undefined) {
      setPayfastPassphrase(siteSettings.payfastPassphrase);
    }
    if (siteSettings.payfastSandbox !== undefined) {
      setPayfastSandbox(siteSettings.payfastSandbox);
    }
  }, [
    siteSettings.supportWhatsapp,
    siteSettings.freeShippingThreshold,
    siteSettings.payfastMerchantId,
    siteSettings.payfastMerchantKey,
    siteSettings.payfastPassphrase,
    siteSettings.payfastSandbox,
  ]);

  // Admin access gatekeeper state
  const [adminEmailInput, setAdminEmailInput] = useState('amaramokoena156@gmail.com');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Security gate
  if (!user || user.role !== 'admin') {
    const handleAdminUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      setPassError('');
      if (!adminEmailInput.trim() || !adminPassInput) {
        setPassError('Enter your authorized Firebase admin email and password.');
        return;
      }
      const success = await login(adminEmailInput.trim().toLowerCase(), adminPassInput);
      if (!success) {
        setPassError('Admin authentication failed. Check the Firebase email/password and make sure this account is authorized.');
      } else {
        setAdminPassInput('');
      }
    };

    return (
      <div id="admin-security-gate" className="max-w-md mx-auto py-16 px-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mx-auto text-[#f35d1f] shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
              Admin & Inventory Access
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Sign in with the authorized Firebase Authentication admin account to manage inventory, catalog, orders, and real-time operations.
            </p>
          </div>

          <form onSubmit={handleAdminUnlock} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Admin Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email-gate-input"
                  type="email"
                  autoComplete="username"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#f35d1f] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Firebase Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password-gate-input"
                  type={showAdminPass ? 'text' : 'password'}
                  autoFocus
                  required
                  value={adminPassInput}
                  onChange={(e) => {
                    setAdminPassInput(e.target.value);
                    if (passError) setPassError('');
                  }}
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#f35d1f] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passError && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium animate-in fade-in">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}
            </div>

            <button
              id="admin-unlock-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('store')}
              className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Return to Store
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Inventory Metrics
  const totalProducts = products.length;
  const totalStockUnits = products.reduce(
    (sum, p) => sum + p.variants.reduce((vSum, v) => vSum + (Number(v.stockQuantity) || 0), 0),
    0
  );
  const outOfStockProducts = products.filter((p) =>
    p.variants.every((v) => (Number(v.stockQuantity) || 0) <= 0)
  );
  const lowStockProducts = products.filter(
    (p) =>
      p.variants.some((v) => (Number(v.stockQuantity) || 0) > 0 && (Number(v.stockQuantity) || 0) <= 5)
  );
  const totalCatalogValuation = products.reduce((sum, p) => {
    const productUnits = p.variants.reduce((vSum, v) => vSum + (Number(v.stockQuantity) || 0), 0);
    const price = p.salePrice || p.basePrice;
    return sum + productUnits * price;
  }, 0);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchSku && !matchCategory && !matchTags) return false;
        }

        // Category filter
        if (categoryFilter !== 'all') {
          if (p.category !== categoryFilter) return false;
        }

        // Stock status filter
        const totalUnits = p.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
        if (stockStatusFilter === 'out') {
          if (totalUnits > 0) return false;
        } else if (stockStatusFilter === 'low') {
          const hasLow = p.variants.some((v) => (Number(v.stockQuantity) || 0) > 0 && (Number(v.stockQuantity) || 0) <= 5);
          if (!hasLow) return false;
        } else if (stockStatusFilter === 'in_stock') {
          if (totalUnits <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'stock-desc') {
          const aUnits = a.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
          const bUnits = b.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
          return bUnits - aUnits;
        }
        if (sortBy === 'stock-asc') {
          const aUnits = a.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
          const bUnits = b.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
          return aUnits - bUnits;
        }
        if (sortBy === 'price-desc') {
          const aPrice = a.salePrice || a.basePrice;
          const bPrice = b.salePrice || b.basePrice;
          return bPrice - aPrice;
        }
        if (sortBy === 'price-asc') {
          const aPrice = a.salePrice || a.basePrice;
          const bPrice = b.salePrice || b.basePrice;
          return aPrice - bPrice;
        }
        return 0;
      });
  }, [products, searchQuery, categoryFilter, stockStatusFilter, sortBy]);

  // Handle Quick Add Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      showToast('Please provide product name and base price.');
      return;
    }

    const price = Number(newProdPrice);
    const salePrice = newProdSalePrice ? Number(newProdSalePrice) : undefined;
    const slug = newProdName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const variants: ProductVariant[] =
      newProdSizeType === 'one-size'
        ? [
            {
              id: `v-${Date.now()}-onesize`,
              size: 'One Size',
              color: 'Signature Colorway',
              colorHex: '#f35d1f',
              sku: `${newProdSku}-OS`,
              stockQuantity: Math.max(0, Number(newProdOneSizeStock) || 0),
              available: Number(newProdOneSizeStock) > 0,
            },
          ]
        : (['S', 'M', 'L', 'XL'] as const).map((sz) => ({
            id: `v-${Date.now()}-${sz.toLowerCase()}`,
            size: sz,
            color: 'Signature Colorway',
            colorHex: '#121417',
            sku: `${newProdSku}-${sz}`,
            stockQuantity: Math.max(0, Number(newProdApparelStock[sz]) || 0),
            available: (Number(newProdApparelStock[sz]) || 0) > 0,
          }));

    const tagsArray = newProdTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (newProductImages.length === 0) {
      showToast('Please upload at least one product photo from your device.');
      return;
    }

    const processedImages: ProductImage[] = newProductImages.map((img, idx) => ({
      ...img,
      altText: img.altText || newProdName.trim(),
      isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
    }));

    await addProduct({
      name: newProdName.trim(),
      slug,
      shortDescription: newProdShortDesc.trim() || `${newProdName} crafted by 018 Bokone Bophirima.`,
      description:
        newProdDesc.trim() ||
        `${newProdName}. Rooted in Home. Reaching Beyond. Authentic Bokone Bophirima street and luxury design.`,
      sku: newProdSku.trim() || `018-${Date.now().toString().slice(-6)}`,
      brand: '018 Bokone Bophirima',
      category: newProdCategory,
      collection: newProdCollection,
      gender: newProdGender,
      productType: newProdType.trim() || 'Apparel & Goods',
      basePrice: price,
      salePrice,
      status: 'published',
      featured: false,
      bestSeller: false,
      newArrival: true,
      onSale: !!salePrice,
      published: true,
      tags: tagsArray.length > 0 ? tagsArray : [newProdCategory],
      materials: ['Premium Materials Hand-Crafted in Bokone Bophirima'],
      careInstructions: ['Follow label guidelines for longevity'],
      images: processedImages,
      variants,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewProdName('');
    setNewProdPrice(350);
    setNewProdSalePrice('');
    setNewProdSku(`018-${newProdCategory.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    setNewProdShortDesc('');
    setNewProdDesc('');
    setNewProductImages([]);
  };

  // Handle Edit Product Save
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      basePrice: Number(editingProduct.basePrice),
      salePrice: editingProduct.salePrice ? Number(editingProduct.salePrice) : undefined,
      category: editingProduct.category,
      gender: editingProduct.gender,
      productType: editingProduct.productType,
      sku: editingProduct.sku,
      published: editingProduct.published,
      status: editingProduct.status,
      shortDescription: editingProduct.shortDescription,
      variants: editingProduct.variants,
      images: editingProduct.images,
    });

    setEditingProduct(null);
  };

  // Handle Delete Product Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch {
      // StoreContext already reports the Firebase error. Keep the confirmation open.
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    sendNotification(broadcastTitle, broadcastBody, broadcastType);
    showToast('Push notification broadcasted to all customer subscribers!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = supportPhone.replace(/\s+/g, '');
    updateSiteSettings({
      supportWhatsapp: cleanPhone,
      supportPhone: supportPhone,
      freeShippingThreshold: Number(freeShippingThreshold),
    });
    showToast('Store settings updated successfully.');
  };

  const handleSavePayfastSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      payfastMerchantId: payfastMerchantId.trim(),
      payfastMerchantKey: payfastMerchantKey.trim(),
      payfastPassphrase: payfastPassphrase.trim(),
      payfastSandbox,
    });
    showToast('PayFast payment gateway credentials saved to cloud.');
  };

  const handleResetPayfastDefaults = () => {
    setPayfastMerchantId('10000100');
    setPayfastMerchantKey('46f0cd694581a');
    setPayfastPassphrase('');
    setPayfastSandbox(true);
    updateSiteSettings({
      payfastMerchantId: '10000100',
      payfastMerchantKey: '46f0cd694581a',
      payfastPassphrase: '',
      payfastSandbox: true,
    });
    showToast('Reset to official PayFast sandbox test credentials.');
  };


  return (
    <div id="admin-operations-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="flex items-center gap-3">
          <button
            id="admin-btn-back-store"
            onClick={() => setActiveView('store')}
            className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
                018 Brand Studio Operations
              </h1>
              <span className="bg-[#f35d1f] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Inventory management, Caps & Goods catalog, orders fulfillment, and customer web push broadcasts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-btn-sync-database"
            onClick={syncDatabase}
            disabled={isDbSyncing}
            className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 disabled:opacity-60"
            title="Sync latest records from Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#f35d1f] ${isDbSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isDbSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </button>
          <button
            id="admin-btn-new-product"
            onClick={() => {
              setNewProdSku(`018-${newProdCategory.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            id="admin-btn-view-live"
            onClick={() => setActiveView('store')}
            className="px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </button>
        </div>
      </div>

      {/* Operations Navigation Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-6 text-xs font-bold uppercase tracking-wider overflow-x-auto pb-1 scrollbar-none">
        <button
          id="admin-tab-inventory"
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Inventory & Stock ({products.length})</span>
          {lowStockProducts.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
              {lowStockProducts.length} Low
            </span>
          )}
        </button>

        <button
          id="admin-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Fulfillment & Orders ({orders.length})</span>
        </button>

        <button
          id="admin-tab-broadcast"
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Push Broadcast</span>
        </button>

        <button
          id="admin-tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>

        <button
          id="admin-tab-database"
          onClick={() => setActiveTab('database')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'database'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Cloud Database</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </button>
      </div>

      {/* TAB 1: FULL INVENTORY & STOCK MANAGEMENT SYSTEM */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Inventory Summary Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Catalog Products</span>
                <Layers className="w-3.5 h-3.5 text-[#f35d1f]" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
                {totalProducts}
              </p>
              <p className="text-[10px] text-neutral-500">Across 10 categories</p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Units in Stock</span>
                <Boxes className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
                {totalStockUnits.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Available to sell</p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock Alert</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {lowStockProducts.length}
              </p>
              <p className="text-[10px] text-neutral-500">Under 5 pieces remaining</p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
                {outOfStockProducts.length}
              </p>
              <p className="text-[10px] text-neutral-500">Zero inventory</p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Retail Valuation</span>
                <DollarSign className="w-3.5 h-3.5 text-[#f35d1f]" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
                R{Math.round(totalCatalogValuation / 1000)}k
              </p>
              <p className="text-[10px] text-neutral-500">R{totalCatalogValuation.toLocaleString()} ZAR</p>
            </div>
          </div>

          {/* Filter, Search & View Controls */}
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-inventory-search"
                  type="text"
                  placeholder="Search by title, SKU, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#f35d1f]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort & View Mode Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                  id="admin-inventory-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white"
                >
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="stock-desc">Sort: Stock High to Low</option>
                  <option value="stock-asc">Sort: Stock Low to High</option>
                  <option value="price-desc">Sort: Price High to Low</option>
                  <option value="price-asc">Sort: Price Low to High</option>
                </select>

                <div className="flex items-center rounded-xl border border-neutral-300 dark:border-neutral-700 p-0.5 bg-neutral-50 dark:bg-neutral-800/60">
                  <button
                    id="admin-view-table-toggle"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-neutral-700 text-[#f35d1f] shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-white'
                    }`}
                    title="Detailed Inventory Table View"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                  <button
                    id="admin-view-cards-toggle"
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-white dark:bg-neutral-700 text-[#f35d1f] shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-white'
                    }`}
                    title="Visual Product Cards View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills & Stock Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1">Category:</span>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                    categoryFilter === 'all'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  All ({products.length})
                </button>
                {['caps', 'hats', 'bags', 'accessories', 'knitwear', 'dresses', 'hoodies', 'combos'].map((catSlug) => {
                  const count = products.filter((p) => p.category === catSlug).length;
                  return (
                    <button
                      key={catSlug}
                      onClick={() => setCategoryFilter(catSlug)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                        categoryFilter === catSlug
                          ? 'bg-[#f35d1f] text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {catSlug} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Stock Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1">Status:</span>
                <button
                  onClick={() => setStockStatusFilter('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    stockStatusFilter === 'all'
                      ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStockStatusFilter('low')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    stockStatusFilter === 'low'
                      ? 'bg-amber-500 text-white'
                      : 'text-amber-600 hover:text-amber-700'
                  }`}
                >
                  Low (≤5)
                </button>
                <button
                  onClick={() => setStockStatusFilter('out')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    stockStatusFilter === 'out'
                      ? 'bg-rose-500 text-white'
                      : 'text-rose-600 hover:text-rose-700'
                  }`}
                >
                  Out (0)
                </button>
              </div>
            </div>
          </div>

          {/* Results Count & Reset Filter */}
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>
              Showing <strong className="text-neutral-900 dark:text-white">{filteredProducts.length}</strong> of{' '}
              {products.length} products
            </span>
            {(searchQuery || categoryFilter !== 'all' || stockStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStockStatusFilter('all');
                }}
                className="flex items-center gap-1 text-[#f35d1f] hover:underline font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* INVENTORY VIEW 1: DETAILED TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 dark:bg-neutral-800/60 uppercase text-[10px] font-bold text-neutral-500">
                  <tr>
                    <th className="p-4">Item & SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Total Stock</th>
                    <th className="p-4 min-w-[280px]">Variant Stock Adjuster</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {filteredProducts.map((p) => {
                    const totalUnits = p.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
                    const isOutOfStock = totalUnits === 0;
                    const isLowStock = !isOutOfStock && p.variants.some((v) => (Number(v.stockQuantity) || 0) <= 5);

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                        {/* Product info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]?.url}
                              alt=""
                              className="w-12 h-14 object-cover rounded-lg bg-neutral-200 shrink-0 border border-neutral-200 dark:border-neutral-700"
                            />
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-neutral-900 dark:text-white max-w-[200px] sm:max-w-xs line-clamp-1">
                                {p.name}
                              </h4>
                              <p className="font-mono text-[11px] text-neutral-400">SKU: {p.sku}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-neutral-500">
                                  {p.gender}
                                </span>
                                {!p.published && (
                                  <span className="text-[10px] uppercase font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.2 rounded">
                                    Draft
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold bg-orange-50 dark:bg-orange-950/40 text-[#f35d1f] border border-orange-200 dark:border-orange-900/30">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-mono">
                          {p.salePrice ? (
                            <div>
                              <span className="font-bold text-[#f35d1f]">R{p.salePrice.toLocaleString()}</span>
                              <p className="text-[10px] text-neutral-400 line-through">R{p.basePrice.toLocaleString()}</p>
                            </div>
                          ) : (
                            <span className="font-bold text-neutral-900 dark:text-white">
                              R{p.basePrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        {/* Total Stock Badge */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                                isOutOfStock
                                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                                  : isLowStock
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              }`}
                            >
                              {totalUnits} units
                            </span>
                            <p className="text-[10px] text-neutral-400">
                              {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                            </p>
                          </div>
                        </td>

                        {/* Inline Variant Stock Adjuster */}
                        <td className="p-4">
                          <div className="space-y-2 max-w-sm">
                            {p.variants.map((v) => (
                              <div
                                key={v.id}
                                className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-[11px]"
                              >
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300 min-w-[70px]">
                                  {v.size}
                                </span>

                                <div className="flex items-center gap-1">
                                  {/* Decrement by 1 */}
                                  <button
                                    onClick={() => updateInventory(p.id, v.id, Math.max(0, v.stockQuantity - 1))}
                                    className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-bold text-neutral-700 dark:text-neutral-200 flex items-center justify-center text-xs"
                                    title="Decrease stock by 1"
                                  >
                                    -1
                                  </button>

                                  {/* Direct Input */}
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.stockQuantity}
                                    onChange={(e) =>
                                      updateInventory(p.id, v.id, Math.max(0, Number(e.target.value) || 0))
                                    }
                                    className="w-14 p-1 text-center font-mono font-bold rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs"
                                  />

                                  {/* Increment by 1 */}
                                  <button
                                    onClick={() => updateInventory(p.id, v.id, v.stockQuantity + 1)}
                                    className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-bold text-neutral-700 dark:text-neutral-200 flex items-center justify-center text-xs"
                                    title="Increase stock by 1"
                                  >
                                    +1
                                  </button>

                                  {/* Increment by 5 */}
                                  <button
                                    onClick={() => updateInventory(p.id, v.id, v.stockQuantity + 5)}
                                    className="px-1.5 h-6 rounded bg-orange-100 dark:bg-orange-950/50 hover:bg-orange-200 text-[#f35d1f] font-bold text-[10px] flex items-center justify-center"
                                    title="Quick add +5 pieces"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                              title="Edit product details & price"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => duplicateProduct(p.id)}
                              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                              title="Duplicate product"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-2 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                              title="Delete product from catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <Boxes className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                    No products matched your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setStockStatusFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold uppercase"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* INVENTORY VIEW 2: VISUAL CARD VIEW */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => {
                const totalUnits = p.variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
                const isOutOfStock = totalUnits === 0;
                const isLowStock = !isOutOfStock && p.variants.some((v) => (Number(v.stockQuantity) || 0) <= 5);

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] flex flex-col justify-between space-y-4 hover:border-[#f35d1f]/40 transition-colors shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <img
                          src={p.images[0]?.url}
                          alt=""
                          className="w-16 h-20 object-cover rounded-xl bg-neutral-200 shrink-0 border border-neutral-200 dark:border-neutral-700"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] uppercase font-extrabold text-[#f35d1f] tracking-wider truncate">
                              {p.category}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                                isOutOfStock
                                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                                  : isLowStock
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                              }`}
                            >
                              {totalUnits} left
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 leading-tight">
                            {p.name}
                          </h4>

                          <p className="font-mono text-xs font-extrabold text-neutral-900 dark:text-white">
                            R{(p.salePrice || p.basePrice).toLocaleString()}
                          </p>
                          <p className="text-[10px] font-mono text-neutral-400 truncate">SKU: {p.sku}</p>
                        </div>
                      </div>

                      {/* Variant Stock Adjuster in Card */}
                      <div className="space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          <span>Variant Stock</span>
                          <span>Adjust</span>
                        </div>
                        {p.variants.map((v) => (
                          <div key={v.id} className="flex justify-between items-center gap-1 text-xs">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-[11px]">
                              {v.size}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateInventory(p.id, v.id, Math.max(0, v.stockQuantity - 1))}
                                className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 font-bold flex items-center justify-center text-[10px]"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={v.stockQuantity}
                                onChange={(e) =>
                                  updateInventory(p.id, v.id, Math.max(0, Number(e.target.value) || 0))
                                }
                                className="w-12 p-0.5 text-center font-mono font-bold rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs"
                              />
                              <button
                                onClick={() => updateInventory(p.id, v.id, v.stockQuantity + 1)}
                                className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 font-bold flex items-center justify-center text-[10px]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => duplicateProduct(p.id)}
                          className="p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => setDeletingProduct(p)}
                        className="p-1 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b]">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 dark:bg-neutral-800/60 uppercase text-[10px] font-bold text-neutral-500">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Courier Tracking</th>
                  <th className="p-4">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="p-4 font-mono font-bold text-neutral-900 dark:text-white">
                      #{o.orderNumber}
                      <p className="text-[10px] font-normal text-neutral-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-neutral-900 dark:text-white">{o.customerName}</p>
                      <p className="text-neutral-400">{o.customerEmail}</p>
                      <p className="text-neutral-400">{o.customerPhone}</p>
                    </td>
                    <td className="p-4 text-neutral-600 dark:text-neutral-300">
                      {o.shippingAddress.city}, {o.shippingAddress.province}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#f35d1f]">
                      R{o.total.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-mono text-neutral-800 dark:text-neutral-200">
                          {o.trackingNumber || 'Pending pickup'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PUSH NOTIFICATION BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl bg-white dark:bg-[#15181b] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div>
            <h3 className="text-base font-bold font-['Syne'] text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f35d1f]" />
              <span>Broadcast Live Web Push Notification</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Immediately alerts customer devices on browser and mobile about new drops, seasonal discounts, or courier dispatch runs.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                Notification Category
              </label>
              <select
                value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value as typeof broadcastType)}
                className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold"
              >
                <option value="drop">New Drop / Limited Collection</option>
                <option value="promo">Special Run / Discount Promo</option>
                <option value="order">Fulfillment / Dispatch Notice</option>
                <option value="system">Brand Notice</option>
              </select>
            </div>

            <div>
              <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                Headline / Title
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                Message Body
              </label>
              <textarea
                rows={3}
                required
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md"
            >
              <BellRing className="w-4 h-4" />
              <span>Broadcast Web Push Notification Now</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SETTINGS & POLICIES */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
          {/* Card 1: Store Configuration */}
          <div className="bg-white dark:bg-[#15181b] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
            <div>
              <h3 className="text-base font-bold font-['Syne'] text-neutral-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#f35d1f]" />
                <span>Store Logistics & South Africa Fulfillment Configuration</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Update WhatsApp support line and free shipping threshold.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  Direct WhatsApp Support Line
                </label>
                <input
                  type="text"
                  value={supportPhone}
                  placeholder="0640629602"
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                />
                <p className="mt-1 text-[11px] text-neutral-400">
                  Used across order confirmation modals, customer support links, and footer inquiries.
                </p>
              </div>

              <div>
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  Free Express Delivery Threshold (ZAR)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                />
                <p className="mt-1 text-[11px] text-neutral-400">
                  Orders exceeding this subtotal automatically qualify for free courier shipping across South Africa.
                </p>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                Save Store Settings
              </button>
            </form>
          </div>

          {/* Card: PayFast Payment Gateway Integration */}
          <div className="bg-white dark:bg-[#15181b] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-['Syne'] text-neutral-900 dark:text-white flex items-center gap-2">
                  <div className="bg-[#b81d24] text-white px-2 py-0.5 rounded text-xs font-black font-['Syne']">
                    PayFast
                  </div>
                  <span>PayFast South Africa Gateway Integration</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Configure your official PayFast merchant credentials for Visa, Mastercard, Capitec Pay, and Instant EFT.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    payfastSandbox
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {payfastSandbox ? '● Sandbox (Testing) Mode' : '● Live (Production) Mode'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSavePayfastSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    PayFast Merchant ID
                  </label>
                  <input
                    type="text"
                    value={payfastMerchantId}
                    onChange={(e) => setPayfastMerchantId(e.target.value)}
                    placeholder="10000100"
                    className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Default PayFast Sandbox ID is <span className="font-mono">10000100</span>
                  </p>
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    PayFast Merchant Key
                  </label>
                  <input
                    type="text"
                    value={payfastMerchantKey}
                    onChange={(e) => setPayfastMerchantKey(e.target.value)}
                    placeholder="46f0cd694581a"
                    className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Default PayFast Sandbox Key is <span className="font-mono">46f0cd694581a</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  PayFast Passphrase (Optional Security Salt)
                </label>
                <input
                  type="password"
                  value={payfastPassphrase}
                  onChange={(e) => setPayfastPassphrase(e.target.value)}
                  placeholder="Leave blank or enter your PayFast account passphrase"
                  className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                />
                <p className="mt-1 text-[11px] text-neutral-400">
                  Matches the passphrase configured in your PayFast Merchant Dashboard Settings.
                </p>
              </div>

              <div>
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  Gateway Environment
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                      payfastSandbox
                        ? 'border-[#b81d24] bg-red-50/30 dark:bg-red-950/20 text-[#b81d24] dark:text-red-400 ring-1 ring-[#b81d24]'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payfastSandboxMode"
                      checked={payfastSandbox}
                      onChange={() => setPayfastSandbox(true)}
                      className="text-[#b81d24]"
                    />
                    <div>
                      <span className="font-bold text-xs block">Sandbox (Test Mode)</span>
                      <span className="text-[10px] text-neutral-400">Test orders without real money</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                      !payfastSandbox
                        ? 'border-[#b81d24] bg-red-50/30 dark:bg-red-950/20 text-[#b81d24] dark:text-red-400 ring-1 ring-[#b81d24]'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payfastSandboxMode"
                      checked={!payfastSandbox}
                      onChange={() => setPayfastSandbox(false)}
                      className="text-[#b81d24]"
                    />
                    <div>
                      <span className="font-bold text-xs block">Live (Production Mode)</span>
                      <span className="text-[10px] text-neutral-400">Real credit cards &amp; Instant EFT</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Save PayFast Configuration
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPayfastDefaults}
                    className="py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Reset to Sandbox Defaults
                  </button>
                </div>

                <a
                  href="https://www.payfast.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-semibold underline underline-offset-4"
                >
                  <span>PayFast Merchant Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </form>
          </div>

          {/* Card 2: Firebase Admin Authentication */}
          <div className="bg-white dark:bg-[#15181b] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-bold font-['Syne'] text-neutral-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#f35d1f]" />
                <span>Firebase Admin Authentication</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                Admin credentials are now managed securely by Firebase Authentication. The website no longer stores or changes an admin master password in Firestore.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101214] border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">Authorized admin account</p>
              <p className="font-mono text-neutral-600 dark:text-neutral-400">amaramokoena156@gmail.com</p>
              <p className="text-neutral-500 leading-relaxed">To change the password, use Firebase Console → Authentication → Users. If you forget it, use the password reset flow from the sign-in screen.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CLOUD DATABASE MANAGEMENT & ARCHITECTURE */}
      {activeTab === 'database' && (
        <div id="admin-database-panel" className="space-y-6">
          {/* Top Status & Sync Banner */}
          <div className="bg-white dark:bg-[#15181b] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-[#f35d1f] mt-0.5">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold font-['Syne'] text-neutral-900 dark:text-white">
                      Cloud Firestore Backend & Sync Engine
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {isDbConnected ? 'Connected & Online' : 'Local Fallback'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Persistent Google Cloud NoSQL document database powering products, inventory, orders, customer profiles, and site settings.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  id="admin-db-sync-now"
                  onClick={syncDatabase}
                  disabled={isDbSyncing}
                  className="px-4 py-2.5 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDbSyncing ? 'animate-spin' : ''}`} />
                  <span>{isDbSyncing ? 'Synchronizing...' : 'Sync Database'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Products Collection
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
                    {products.length}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {totalStockUnits} stock units
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">/products/*</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Orders Collection
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
                    {orders.length}
                  </span>
                  <span className="text-xs font-semibold text-[#f35d1f]">
                    Live Tracking Active
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">/orders/*</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Last Real-time Sync
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                    {dbLastSynced || 'Synchronized'}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-neutral-500">Live onSnapshot listeners</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101214] space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Security Rules
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Eight Pillars Active
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">firestore.rules deployed</p>
              </div>
            </div>
          </div>

          {/* Database Schema & Collections Deep-Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collections Blueprint */}
            <div className="bg-white dark:bg-[#15181b] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider font-['Syne'] text-neutral-900 dark:text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#f35d1f]" />
                  <span>Firestore Collections Blueprint</span>
                </h4>
                <span className="text-[11px] text-neutral-400 font-mono">firebase-blueprint.json</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#101214] space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-neutral-900 dark:text-white">
                    <span>1. /products/{'{productId}'}</span>
                    <span className="text-emerald-600 font-sans font-semibold text-[10px] uppercase">Public Read / Admin Write</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Stores name, slug, pricing, category (caps, hats, bags, apparel), images, tags, rating, and variants with live stock tracking.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-neutral-400">
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">id: string</span>
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">basePrice: number</span>
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">variants: array</span>
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">updatedAt: ISO</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#101214] space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-neutral-900 dark:text-white">
                    <span>2. /orders/{'{orderId}'}</span>
                    <span className="text-orange-600 font-sans font-semibold text-[10px] uppercase">Customer & Admin Auth</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Stores order number, customer info, delivery address, cart items, payment method (PayFast, Yoco, Ozow, Card, WhatsApp), and tracking number.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-neutral-400">
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">orderNumber: string</span>
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">total: number</span>
                    <span className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">status: OrderStatus</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#101214] space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-neutral-900 dark:text-white">
                    <span>3. /siteSettings/current</span>
                    <span className="text-blue-600 font-sans font-semibold text-[10px] uppercase">Singleton Doc</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Global store configuration: WhatsApp support number, free shipping threshold (R1,200), currency, brand slogan.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#101214] space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-neutral-900 dark:text-white">
                    <span>4. /users/{'{userId}'}</span>
                    <span className="text-purple-600 font-sans font-semibold text-[10px] uppercase">User Profile & RBAC</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Firebase Auth synchronization, delivery address book, wishlist product IDs, notification preferences, and admin role enforcement.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Rules & Enforcement Details */}
            <div className="bg-white dark:bg-[#15181b] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider font-['Syne'] text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Security Rules (Eight Pillars Enforcement)</span>
                </h4>
                <span className="text-[11px] text-emerald-600 font-bold">Hardened</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">Admin RBAC Gatekeeper</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Only verified administrators (matching registered director credentials or custom claims) can write, edit, or delete products and update site configuration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-[#101214] border border-neutral-200 dark:border-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">Customer Data Privacy</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Shoppers can only inspect and manage their own placed orders and delivery addresses using their UID authorization tokens.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-[#101214] border border-neutral-200 dark:border-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">Real-Time WebSocket Listeners</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Firestore <code className="font-mono text-[#f35d1f]">onSnapshot</code> listeners are attached to automatically reflect changes in catalog stock across all open browser sessions without refreshing the page.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-[#101214] border border-neutral-200 dark:border-neutral-800">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">Graceful Offline Fallback</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      IndexedDB and localStorage dual-caching ensures full shopping continuity even when network connectivity fluctuates in transit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW PRODUCT (SIMPLIFIED INVENTORY BUILDER) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#f35d1f]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Syne'] text-neutral-900 dark:text-white">
                    Add New Catalog Item
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Create a new product with category, pricing, images, and initial stock quantities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 018 Signature Trucker Cap or Jacquard Utility Bag"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-xs"
                />
              </div>

              {/* Category & Product Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => {
                      setNewProdCategory(e.target.value);
                      if (['caps', 'hats', 'bags', 'accessories'].includes(e.target.value)) {
                        setNewProdSizeType('one-size');
                      } else {
                        setNewProdSizeType('clothing');
                      }
                    }}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-xs"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Product Type / Classification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Caps, Headwear, Bags, Knitwear"
                    value={newProdType}
                    onChange={(e) => setNewProdType(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Price, Sale Price & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Base Price (ZAR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="380"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Sale Price (Optional ZAR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Leave empty if none"
                    value={newProdSalePrice}
                    onChange={(e) => setNewProdSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Gender & Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Gender Fit
                  </label>
                  <select
                    value={newProdGender}
                    onChange={(e) => setNewProdGender(e.target.value as ProductGender)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  >
                    <option value="unisex">Unisex (Standard for Caps, Hats, Bags)</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Collection
                  </label>
                  <select
                    value={newProdCollection}
                    onChange={(e) => setNewProdCollection(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  >
                    <option value="018-core">018 Core Heritage</option>
                    <option value="knitted-monogram">Knitted Monogram Collection</option>
                    <option value="rooted-in-home">Rooted In Home Edition</option>
                    <option value="special-run">Special Run / Limited Edition</option>
                  </select>
                </div>
              </div>

              {/* Local Device Product Images Uploader */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Product Photos (Upload from Phone or Computer) *
                  </label>
                  <span className="text-[10px] text-neutral-400">Direct upload or mobile camera</span>
                </div>
                <ProductImageUploader
                  idPrefix="new-product"
                  productName={newProdName || 'New Product'}
                  images={newProductImages}
                  onChange={setNewProductImages}
                />
              </div>

              {/* Size & Stock Sizing Structure */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-neutral-700 dark:text-neutral-300">
                    Sizing & Initial Stock Allocation
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewProdSizeType('one-size')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        newProdSizeType === 'one-size'
                          ? 'bg-[#f35d1f] text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      One Size (Caps / Hats / Bags)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProdSizeType('clothing')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        newProdSizeType === 'clothing'
                          ? 'bg-[#f35d1f] text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      Apparel Sizes (S/M/L/XL)
                    </button>
                  </div>
                </div>

                {newProdSizeType === 'one-size' ? (
                  <div className="flex items-center justify-between gap-4 p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">One Size</p>
                      <p className="text-[10px] text-neutral-400">Standard fit with adjustable strap or flexible build</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-neutral-500">Initial Stock:</label>
                      <input
                        type="number"
                        min="0"
                        value={newProdOneSizeStock}
                        onChange={(e) => setNewProdOneSizeStock(Number(e.target.value))}
                        className="w-20 p-1.5 text-center font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[11px] text-neutral-400">units</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['S', 'M', 'L', 'XL'] as const).map((sz) => (
                      <div
                        key={sz}
                        className="p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center space-y-1"
                      >
                        <p className="font-bold text-neutral-900 dark:text-white">Size {sz}</p>
                        <input
                          type="number"
                          min="0"
                          value={newProdApparelStock[sz]}
                          onChange={(e) =>
                            setNewProdApparelStock((prev) => ({
                              ...prev,
                              [sz]: Number(e.target.value),
                            }))
                          }
                          className="w-full p-1 text-center font-mono font-bold rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags & Description */}
              <div className="space-y-2">
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  Search Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="caps, streetwear, embroidery, bokone, summer"
                  value={newProdTags}
                  onChange={(e) => setNewProdTags(e.target.value)}
                  className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold uppercase tracking-wider text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#f35d1f]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Syne'] text-neutral-900 dark:text-white">
                    Edit Product Details
                  </h3>
                  <p className="text-xs text-neutral-500">Update pricing, category, SKU, and status.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Base Price (ZAR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.basePrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })
                    }
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Sale Price (ZAR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave 0 for normal price"
                    value={editingProduct.salePrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        salePrice: e.target.value ? Number(e.target.value) : undefined,
                        onSale: !!e.target.value,
                      })
                    }
                    className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Product Photos (Device Upload) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                    Product Photos (Upload from Phone or Computer)
                  </label>
                  <span className="text-[10px] text-neutral-400">Add or manage photos from device</span>
                </div>
                <ProductImageUploader
                  idPrefix="edit-product"
                  productName={editingProduct.name}
                  images={editingProduct.images || []}
                  onChange={(updatedImages) =>
                    setEditingProduct({ ...editingProduct, images: updatedImages })
                  }
                />
              </div>

              {/* Variant Stock Editor */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                <p className="font-bold uppercase text-neutral-700 dark:text-neutral-300 text-[10px]">
                  Variant Quantities
                </p>
                {editingProduct.variants.map((v, idx) => (
                  <div key={v.id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Size {v.size} ({v.sku})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={v.stockQuantity}
                        onChange={(e) => {
                          const updatedQuantity = Math.max(0, Number(e.target.value) || 0);
                          const updatedVariants = [...editingProduct.variants];
                          updatedVariants[idx] = {
                            ...updatedVariants[idx],
                            stockQuantity: updatedQuantity,
                            available: updatedQuantity > 0,
                          };
                          setEditingProduct({ ...editingProduct, variants: updatedVariants });
                        }}
                        className="w-16 p-1 text-center font-mono font-bold rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs"
                      />
                      <span className="text-[10px] text-neutral-400">pcs</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Published switch */}
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="font-bold text-neutral-900 dark:text-white">Store Visibility</p>
                  <p className="text-[10px] text-neutral-400">
                    {editingProduct.published ? 'Visible to all customers in the online shop' : 'Hidden as draft'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct({
                      ...editingProduct,
                      published: !editingProduct.published,
                      status: !editingProduct.published ? 'published' : 'draft',
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    editingProduct.published
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {editingProduct.published ? 'Published' : 'Draft'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold uppercase tracking-wider text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold font-['Syne'] text-neutral-900 dark:text-white">
                Delete Product from Catalog?
              </h3>
              <p className="text-xs text-neutral-500">
                Are you sure you want to permanently delete{' '}
                <strong className="text-neutral-900 dark:text-white font-bold">
                  "{deletingProduct.name}"
                </strong>
                ? Customers will no longer be able to purchase or view this piece.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left">
              <img
                src={deletingProduct.images[0]?.url}
                alt=""
                className="w-12 h-14 object-cover rounded-lg bg-neutral-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {deletingProduct.name}
                </p>
                <p className="text-[10px] text-neutral-400">SKU: {deletingProduct.sku}</p>
                <p className="text-[10px] font-bold text-[#f35d1f] uppercase">{deletingProduct.category}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase tracking-wider text-xs flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider text-xs shadow-md transition-colors flex-1"
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
