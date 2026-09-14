export type ProductGender = 'men' | 'women' | 'unisex';
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductVariant {
  id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';
  color: string;
  colorHex: string;
  sku: string;
  priceOverride?: number;
  stockQuantity: number;
  available: boolean;
  image?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary?: boolean;
  isHover?: boolean;
  type?: 'product' | 'lifestyle' | 'editorial' | 'campaign';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  collection: string;
  gender: ProductGender;
  productType: string;
  basePrice: number; // In South African Rand (ZAR)
  salePrice?: number;
  costPrice?: number; // Admin only
  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  onSale: boolean;
  published: boolean;
  tags: string[];
  materials: string[];
  careInstructions: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  bannerImage: string;
  active: boolean;
  sortOrder: number;
  tagline?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  addedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  suburb?: string;
  city: string;
  province:
    | 'North West'
    | 'Gauteng'
    | 'Western Cape'
    | 'KwaZulu-Natal'
    | 'Eastern Cape'
    | 'Free State'
    | 'Limpopo'
    | 'Mpumalanga'
    | 'Northern Cape';
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingCost: number;
  shippingMethod: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'payfast' | 'yoco' | 'ozow' | 'card' | 'whatsapp';
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlistProductIds: string[];
  createdAt: string;
  notificationPreferences: {
    orderUpdates: boolean;
    newDrops: boolean;
    exclusiveSales: boolean;
    pushEnabled: boolean;
  };
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 10 for 10% or 200 for R200
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  description: string;
}

export interface SiteSettings {
  storeName: string;
  brandTagline: string;
  brandSlogan: string;
  announcementText: string;
  announcementEnabled: boolean;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  freeShippingThreshold: number; // R999
  standardShippingFee: number; // R99
  expressShippingFee: number; // R160
  currency: string;
  currencySymbol: string;
  featuredCollectionSlug: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  payfastMerchantId?: string;
  payfastMerchantKey?: string;
  payfastPassphrase?: string;
  payfastSandbox?: boolean;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: 'product' | 'order' | 'discount' | 'settings' | 'inventory';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'drop' | 'promo' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}
