# How to Connect Your Shopify Account - Complete Guide

## 🎯 Overview

Your website is ready to connect to Shopify! You just need to add your store credentials to make it live.

---

## 📋 Step-by-Step Setup

### Step 1: Get Your Shopify Store Domain

1. **Log in to your Shopify Admin**
   - Go to: `https://admin.shopify.com/`
   - Or: `https://your-store.myshopify.com/admin`

2. **Find your store domain**
   - Look at your URL - it will be something like:
     - `deeprootstudios.myshopify.com`
     - `your-store-name.myshopify.com`
   - **Important**: Use only the domain part (no `https://`)

---

### Step 2: Create a Storefront Access Token

#### Option A: Using Shopify Admin (Recommended)

1. **Go to Settings**
   - In your Shopify Admin, click **Settings** (bottom left)

2. **Navigate to Apps and sales channels**
   - Click **Apps and sales channels**
   - Click **Develop apps**

3. **Create a new app**
   - Click **Create an app**
   - Name it: `Deep Root Studios Website`
   - Click **Create app**

4. **Configure Storefront API**
   - Click **Configure Storefront API scopes**
   - Enable these permissions:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_product_tags`
     - ✅ `unauthenticated_write_checkouts`
     - ✅ `unauthenticated_read_checkouts`
   - Click **Save**

5. **Install the app**
   - Click **Install app**
   - Confirm installation

6. **Get your Storefront Access Token**
   - Go to **API credentials** tab
   - Under **Storefront API access token**, click **Reveal token once**
   - **Copy this token** - it looks like: `shpat_xxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **Important**: Save this somewhere safe! You can only see it once.

#### Option B: Using Private App (Older Shopify Stores)

If you don't see "Develop apps":

1. Go to **Settings** → **Apps and sales channels**
2. Click **Manage private apps** (at the bottom)
3. Click **Create new private app**
4. Name: `Deep Root Studios Website`
5. Under **Storefront API**, enable:
   - Read access to products
   - Read access to product listings
   - Write access to checkouts
6. Click **Save**
7. Copy the **Storefront Access Token**

---

### Step 3: Update Your Code

Open `src/context/ShopifyContext.jsx` and update lines 10-13:

**Before:**
```javascript
const client = Client.buildClient({
  domain: 'your-store.myshopify.com', // Replace with your store domain
  storefrontAccessToken: 'your-storefront-access-token', // Replace with your token
});
```

**After:**
```javascript
const client = Client.buildClient({
  domain: 'deeprootstudios.myshopify.com', // ← Your actual store domain
  storefrontAccessToken: 'shpat_abc123xyz456...', // ← Your actual token
});
```

**Example with real values:**
```javascript
const client = Client.buildClient({
  domain: 'deeprootstudios.myshopify.com',
  storefrontAccessToken: 'shpat_1234567890abcdefghijklmnopqrstuvwxyz',
});
```

---

### Step 4: Add Your Products to Shopify

Your website will automatically fetch products from Shopify. Make sure you have products set up:

1. **Go to Products** in Shopify Admin
2. **Add a product** (or edit existing ones)
3. **Important fields**:
   - **Title**: Product name (e.g., "Personalized Desk Organizer")
   - **Description**: Product details (supports HTML)
   - **Price**: Set your price (e.g., ₹129.00)
   - **Images**: Upload product photos
   - **Variants**: At least one variant is required

4. **Publish to Online Store**
   - Make sure product is published to "Online Store" sales channel
   - Go to product → **Sales channels and apps** → Enable **Online Store**

---

### Step 5: Get Product Variant IDs (For Specific Products)

If you want to use specific products in your code (like in ProductPage.jsx):

1. **Go to Products** in Shopify Admin
2. **Click on a product**
3. **Look at the URL**:
   ```
   https://admin.shopify.com/store/your-store/products/1234567890
   ```
   The number at the end is the Product ID

4. **For Variant ID**:
   - Scroll to **Variants** section
   - Click on a variant
   - URL will show:
   ```
   https://admin.shopify.com/store/your-store/products/1234567890/variants/9876543210
   ```
   The last number is the Variant ID

5. **Convert to GraphQL format**:
   ```
   gid://shopify/ProductVariant/9876543210
   ```

6. **Update in your code** (if needed):
   - `src/components/ProductPage.jsx` (line 35)
   - `src/components/CartDrawer.jsx` (line 17 - for gift wrap)

---

## 🧪 Testing Your Connection

### Test 1: Check if Products Load

1. **Save your changes** to `ShopifyContext.jsx`
2. **Refresh your browser** at `http://localhost:5173/`
3. **Go to Shop page** (`/shop`)
4. **Expected**: Your Shopify products should appear in the grid
5. **If not loading**: Check browser console for errors

### Test 2: Check Product Details

1. **Click on any product** from the shop page
2. **Expected**: Product details page loads with:
   - Product images
   - Title and price
   - Description
   - Engraving input
3. **If 404 or error**: Check that product IDs are correct

### Test 3: Test Add to Cart

1. **On product details page**, enter engraving text
2. **Click "Add to Cart"**
3. **Expected**: Cart drawer opens with product
4. **Check**: Custom engraving attribute should show
5. **Click "Proceed to Checkout"**
6. **Expected**: Redirects to Shopify checkout

---

## 🔒 Security Best Practices

### Option 1: Environment Variables (Recommended for Production)

Instead of hardcoding credentials, use environment variables:

1. **Create `.env` file** in project root:
```env
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_TOKEN=your-storefront-access-token
```

2. **Update ShopifyContext.jsx**:
```javascript
const client = Client.buildClient({
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN,
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_TOKEN,
});
```

3. **Add to .gitignore**:
```
.env
.env.local
```

4. **For deployment** (Vercel/Netlify):
   - Add environment variables in deployment settings
   - Don't commit `.env` to GitHub

### Option 2: Keep in Code (For Testing Only)

- ✅ Good for local testing
- ❌ Don't push to public GitHub with real credentials
- ⚠️ Anyone can see your token if repo is public

---

## 🐛 Troubleshooting

### Issue: "Products not loading"

**Check:**
1. ✅ Store domain is correct (no `https://`, just `store.myshopify.com`)
2. ✅ Access token is correct (starts with `shpat_`)
3. ✅ Products are published to "Online Store" channel
4. ✅ Storefront API permissions are enabled
5. ✅ Check browser console for error messages

### Issue: "Invalid access token"

**Solution:**
- Token might be wrong or expired
- Create a new app and get a new token
- Make sure you copied the entire token

### Issue: "Product images not showing"

**Check:**
1. Products have images uploaded in Shopify
2. Images are published
3. Check `product.images[0].src` in console

### Issue: "Add to cart doesn't work"

**Check:**
1. Product has at least one variant
2. Variant ID is correct
3. ShopifyContext is properly wrapped around App
4. Check console for errors

### Issue: "Custom attributes not showing in Shopify orders"

**Check:**
1. Using `customAttributes` (not `properties`)
2. Format is correct: `[{ key: 'Engraving', value: 'text' }]`
3. Check in Shopify Admin → Orders → Line items

---

## 📊 What You'll See in Shopify Admin

### When Customer Places Order:

**Orders → View Order → Line Items**:
```
Personalized Desk Organizer
  Quantity: 1
  Price: ₹129.00
  
  Custom Attributes:
    • Custom Engraving: "JOHN DOE"
    • Wood Type: "Walnut" (if you added this)
```

**Gift Wrapping** (if selected):
```
Premium Gift Wrapping
  Quantity: 1
  Price: ₹150.00
```

This tells you exactly what to create for each customer!

---

## 🚀 Quick Start Checklist

- [ ] Log in to Shopify Admin
- [ ] Create Storefront API app
- [ ] Copy store domain (e.g., `yourstore.myshopify.com`)
- [ ] Copy Storefront Access Token (starts with `shpat_`)
- [ ] Update `src/context/ShopifyContext.jsx` with credentials
- [ ] Add products in Shopify (with images, prices, variants)
- [ ] Publish products to "Online Store" channel
- [ ] Test: Visit `/shop` - products should load
- [ ] Test: Click product - details should load
- [ ] Test: Add to cart - should work with engraving
- [ ] Test: Checkout - should redirect to Shopify

---

## 📞 Need Help?

If you're stuck:

1. **Check browser console** (F12) for error messages
2. **Check Shopify API logs** in your app settings
3. **Verify permissions** are enabled
4. **Test with a simple product** first
5. **Check network tab** to see API requests

---

## ✨ You're Almost There!

Once you add your credentials, your website will:
- ✅ Fetch real products from your Shopify store
- ✅ Display them in the shop page
- ✅ Allow customers to customize with engraving
- ✅ Add to cart with custom attributes
- ✅ Checkout through Shopify
- ✅ Show custom attributes in your orders

**Just 2 values to add and you're live!** 🎉
