export async function saveProductToDb(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLL}/${product.id}`;

  try {
    // Make sure Firestore receives a fresh Firebase Auth token.
    // The Firestore rules use request.auth.token.email to authorize
    // product writes.
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error(
        'ADMIN_AUTH_REQUIRED: No Firebase user is currently signed in.'
      );
    }

    if (!isAdminEmail(currentUser.email)) {
      throw new Error(
        `ADMIN_AUTH_REQUIRED: ${
          currentUser.email || 'Current user'
        } is not an authorized admin.`
      );
    }

    // Force-refresh the Firebase ID token so Firestore Security Rules
    // receive the current admin authentication state.
    await currentUser.getIdToken(true);

    // Firestore documents have a 1 MiB maximum.
    // Keep a safety margin because product photos are stored as
    // compressed data URLs.
    const serializedSize = new Blob([
      JSON.stringify(product)
    ]).size;

    if (serializedSize > 900 * 1024) {
      throw new Error(
        'PRODUCT_TOO_LARGE: Product images are too large. Please use fewer or smaller product photos.'
      );
    }

    await setDoc(
      doc(db, PRODUCTS_COLL, product.id),
      product,
      { merge: true }
    );
  } catch (error) {
    console.error('Product publish failed:', error);
    handleFirestoreError(
      error,
      OperationType.WRITE,
      path
    );
  }
}
