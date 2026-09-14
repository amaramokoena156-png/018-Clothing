import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Product, Order, SiteSettings, UserProfile, OrderStatus } from '../types';
import { initialProducts, initialSiteSettings } from '../data/initialCatalog';

const PRODUCTS_COLL = 'products';
const ORDERS_COLL = 'orders';
const SETTINGS_COLL = 'site_settings';
const USERS_COLL = 'users';

export const ADMIN_EMAILS = [
  'amaramokoena156@gmail.com',
  'admin@018bokone.co.za',
  'director@018bokone.co.za',
];

export function isAdminEmail(email?: string | null): boolean {
  const normalized = email?.trim().toLowerCase() || '';
  return ADMIN_EMAILS.includes(normalized);
}

export interface DatabaseStatus {
  connected: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  productCount: number;
  orderCount: number;
  error: string | null;
}

/**
 * Initialize Firestore. Product seeding is only attempted when the current
 * Firebase Auth session belongs to an authorized admin.
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    const currentUser = auth.currentUser;

    if (currentUser && isAdminEmail(currentUser.email)) {
      const productsSnap = await getDocs(collection(db, PRODUCTS_COLL));
      if (productsSnap.empty) {
        let seedProducts = initialProducts;

        // One-time migration: preserve products that were previously created
        // by the old localStorage-based admin workflow. After this successful
        // migration, Firestore becomes the only catalog source of truth.
        if (typeof window !== 'undefined') {
          try {
            const legacy = JSON.parse(localStorage.getItem('018_catalog_products') || 'null');
            if (Array.isArray(legacy) && legacy.length > 0) {
              const byId = new Map(initialProducts.map((product) => [product.id, product]));
              for (const product of legacy) {
                if (product?.id && product?.name && product?.variants) {
                  byId.set(product.id, product);
                }
              }
              seedProducts = Array.from(byId.values()) as Product[];
            }
          } catch (migrationError) {
            console.warn('Legacy catalog migration could not be read:', migrationError);
          }
        }

        console.log(`Database empty. Seeding ${seedProducts.length} 018 Bokone Bophirima products...`);
        for (const prod of seedProducts) {
          await setDoc(doc(db, PRODUCTS_COLL, prod.id), prod);
        }
        if (typeof window !== 'undefined') {
          localStorage.removeItem('018_catalog_products');
        }
        console.log(`Seeded ${seedProducts.length} products to database.`);
      }
    }

    const settingsDocRef = doc(db, SETTINGS_COLL, 'active');
    const settingsSnap = await getDoc(settingsDocRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsDocRef, initialSiteSettings);
    }

    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

/**
 * Subscribe to live products from the database
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, PRODUCTS_COLL);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Product);
      });
      onUpdate(items);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, PRODUCTS_COLL);
    }
  );
}

/**
 * Subscribe to live orders from the database.
 * Guarded to only execute if an authenticated user is present,
 * scoping to the user's orders or all orders for admins to satisfy security rules.
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: Error) => void,
  userId?: string
) {
  if (!auth.currentUser) {
    return () => {};
  }

  const currentUserEmail = auth.currentUser.email?.toLowerCase() || '';
  const isAdminUser =
    currentUserEmail === 'amaramokoena156@gmail.com' ||
    currentUserEmail === 'admin@018bokone.co.za' ||
    currentUserEmail === 'director@018bokone.co.za' ||
    currentUserEmail.includes('admin');

  let q;
  if (isAdminUser) {
    q = query(collection(db, ORDERS_COLL), orderBy('createdAt', 'desc'));
  } else {
    const targetUid = userId || auth.currentUser.uid;
    q = query(collection(db, ORDERS_COLL), where('userId', '==', targetUid));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Order);
      });
      items.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      onUpdate(items);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLL);
    }
  );
}

/**
 * Subscribe to live site settings from the database
 */
export function subscribeToSiteSettings(
  onUpdate: (settings: SiteSettings) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, SETTINGS_COLL, 'active');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as SiteSettings);
      }
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLL}/active`);
    }
  );
}

/**
 * Save / update product in database
 */
export async function saveProductToDb(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLL}/${product.id}`;
  try {
    // Firestore documents have a 1 MiB maximum. Keep a safety margin because
    // uploaded product photos are stored as compressed data URLs in this app.
    const serializedSize = new Blob([JSON.stringify(product)]).size;
    if (serializedSize > 900 * 1024) {
      throw new Error('Product data is too large for Firestore. Please use fewer or smaller product photos.');
    }
    await setDoc(doc(db, PRODUCTS_COLL, product.id), product, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete product from database
 */
export async function deleteProductFromDb(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLL}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLL, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Update stock level in database
 */
export async function updateProductStockInDb(
  productId: string,
  variantId: string,
  newStockQuantity: number,
  currentProduct?: Product
): Promise<void> {
  const path = `${PRODUCTS_COLL}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLL, productId);
    let productToUpdate = currentProduct;
    if (!productToUpdate) {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        productToUpdate = snap.data() as Product;
      }
    }

    if (productToUpdate) {
      const updatedVariants = productToUpdate.variants.map((v) =>
        v.id === variantId ? { ...v, stockQuantity: Math.max(0, newStockQuantity) } : v
      );
      await updateDoc(docRef, {
        variants: updatedVariants,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save new order to database
 */
export async function saveOrderToDb(order: Order): Promise<void> {
  const path = `${ORDERS_COLL}/${order.id}`;
  try {
    await setDoc(doc(db, ORDERS_COLL, order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update order status and tracking
 */
export async function updateOrderStatusInDb(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  courierName?: string
): Promise<void> {
  const path = `${ORDERS_COLL}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLL, orderId);
    const updates: Partial<Order> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (courierName) updates.courierName = courierName;
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save site settings to database
 */
export async function saveSiteSettingsToDb(settings: SiteSettings): Promise<void> {
  const path = `${SETTINGS_COLL}/active`;
  try {
    await setDoc(doc(db, SETTINGS_COLL, 'active'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save user profile in database
 */
export async function saveUserProfileToDb(user: UserProfile): Promise<void> {
  const path = `${USERS_COLL}/${user.id}`;
  try {
    await setDoc(doc(db, USERS_COLL, user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Email/password authentication. Firebase Auth is the source of truth for
 * customer and admin credentials.
 */
export async function registerWithEmailPassword(
  name: string,
  email: string,
  password: string
): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return credential.user;
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return credential.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

/**
 * Sign out of Firebase Auth
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Listen to Firebase Auth state
 */
export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
