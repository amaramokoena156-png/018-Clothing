# 018 Bokone Bophirima — Firebase Authentication Setup

The application now uses **Firebase Email/Password Authentication only**.
Google Sign-In has been removed from the application.

## 1. Enable Email/Password

In the Firebase Console for project `gen-lang-client-0816946326`:

1. Open **Authentication**.
2. Open **Sign-in method**.
3. Enable **Email/Password**.
4. Save.
5. Google does not need to be enabled for this application.

## 2. Create the Store Admin

In Firebase Console:

1. Go to **Authentication → Users**.
2. Click **Add user**.
3. Use:
   - Email: `amaramokoena156@gmail.com`
   - Password: choose a strong password yourself.
4. Save the account.

The app recognizes this exact Firebase account as the store administrator.

### Important
The admin password is **not stored in Firestore** anymore. Do not use the old `0182026!` password workflow.

To change the admin password later, change it in Firebase Authentication or use the password reset flow.

## 3. Customer accounts

Customers use the normal Sign In / Create Account modal.

- Create Account creates a Firebase Email/Password account.
- Sign In authenticates against Firebase.
- Forgot password sends a Firebase password-reset email.
- Customer profile data is stored in Firestore under `users/{firebaseUid}`.

## 4. Product publishing

Firestore is now the production source of truth for products.

When the authorized admin signs in:

1. Firebase Authentication establishes the admin session.
2. Firestore security rules recognize the admin email.
3. If the products collection is empty, the app seeds the initial catalog.
4. A one-time migration also preserves products from the old `018_catalog_products` localStorage cache.
5. Admin product saves wait for Firestore to succeed before reporting success.
6. The storefront receives products through the Firestore real-time listener.

If Firestore rejects a product save, the admin UI reports failure instead of claiming the product was published.

## 5. First test after installing

Run:

```bash
npm install
npm run dev
```

Then test in this order:

1. Open the shop.
2. Create a normal customer account.
3. Sign out.
4. Test Sign In.
5. Test **Forgot password?**.
6. Sign in to the admin console with `amaramokoena156@gmail.com` and the password you created in Firebase Authentication.
7. Open the Database panel and click **Sync Database** once if the initial catalog has not yet appeared.
8. Add one test product.
9. Confirm the product appears in Firestore under `products`.
10. Open the storefront and confirm the same product appears there.

Do not manually create a `products` collection. Firestore creates it automatically when the first authorized write succeeds.
