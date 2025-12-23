# Shopify Integration Setup Guide

## 📦 What Was Implemented

Your Deep Root Studios website now has **full Shopify integration** with support for **custom attributes** (engraving and wood type selection). This allows customers' personalization choices to appear in your Shopify Admin Orders page.

---

## ✅ Files Created/Modified

### 1. **ShopifyContext.jsx** (`src/context/ShopifyContext.jsx`)
- Complete Shopify Buy SDK integration
- Cart management (add, update, remove items)
- **Custom attributes support** for personalization
- Context provider for global state management

### 2. **ProductPage.jsx** (Updated)
- Integrated with ShopifyContext
- Sends custom attributes to Shopify:
  - `Engraving`: Customer's custom text (max 15 chars)
  - `Wood Type`: Selected wood (Walnut or Oak)

### 3. **main.jsx** (Updated)
- Wrapped app with `<ShopifyProvider>` for global access

### 4. **Dependencies**
- Installed `shopify-buy` SDK (v2.17.0+)

---

## 🔧 Setup Instructions

### Step 1: Get Your Shopify Credentials

1. **Log in to your Shopify Admin**: `https://your-store.myshopify.com/admin`

2. **Create a Storefront API Access Token**:
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps** (or **Manage private apps** for older stores)
   - Click **Create an app** or **Create a private app**
   - Name it: "Deep Root Studios Website"
   - Under **Storefront API**, click **Configure**
   - Enable these permissions:
     - ✅ Read products
     - ✅ Read product listings
     - ✅ Read customer data
     - ✅ Write checkouts
   - Click **Save**, then **Install app**
   - Copy the **Storefront Access Token** (starts with `shpat_...`)

3. **Get Your Store Domain**:
   - Your store domain is: `your-store.myshopify.com`
   - Example: `deeprootstudio.myshopify.com`

### Step 2: Update ShopifyContext.jsx

Open `src/context/ShopifyContext.jsx` and replace the placeholder values:

```javascript
// Line 10-13: Replace these values
const client = Client.buildClient({
  domain: 'deeprootstudio.myshopify.com', // ← Your store domain
  storefrontAccessToken: 'shpat_xxxxxxxxxxxxxxxxxxxxx', // ← Your token
});
```

### Step 3: Get Product Variant IDs

1. In Shopify Admin, go to **Products**
2. Click on "Personalized Desk Organizer" (or create it if it doesn't exist)
3. Scroll to **Variants** section
4. Click on a variant (e.g., "Default Title")
5. Look at the URL: `https://your-store.myshopify.com/admin/products/1234567890/variants/9876543210`
6. The variant ID is the last number: `9876543210`
7. Convert to GraphQL ID format: `gid://shopify/ProductVariant/9876543210`

### Step 4: Update ProductPage.jsx

Open `src/components/ProductPage.jsx` and update line 35:

```javascript
// Line 35: Replace with your actual variant ID
const variantId = 'gid://shopify/ProductVariant/9876543210'; // ← Your variant ID
```

---

## 🎯 How Custom Attributes Work

### In Your Code

When a customer clicks "Add to Cart", the `handleAddToCart` function sends:

```javascript
const customAttributes = [
  {
    key: 'Engraving',
    value: 'JOHN DOE', // Customer's input
  },
  {
    key: 'Wood Type',
    value: 'Walnut', // Selected wood
  },
];

await addItemToCart(variantId, quantity, customAttributes);
```

### In Shopify Admin

When you receive an order, you'll see:

**Order Details** → **Line Items** → **Custom Attributes**:
- **Engraving**: JOHN DOE
- **Wood Type**: Walnut

This tells you exactly what to engrave and which wood to use!

---

## 🧪 Testing the Integration

### Local Testing (Without Real Shopify)

The current setup will work locally but won't actually create checkouts until you add your credentials. You'll see console logs and alerts showing the data being sent.

### With Shopify Credentials

1. Add your store domain and access token (Step 2)
2. Add your product variant ID (Step 4)
3. Reload the page: `http://localhost:5173/`
4. Scroll to the Product Page section
5. Select wood type and enter engraving text
6. Click "Add to Cart"
7. Check the browser console for success messages
8. Go to Shopify Admin → **Abandoned Checkouts** to see the test checkout

---

## 📋 ShopifyContext API Reference

### Available Functions

```javascript
const {
  cart,                  // Current cart/checkout object
  isCartOpen,           // Boolean: is cart drawer open?
  setIsCartOpen,        // Function to toggle cart drawer
  isLoading,            // Boolean: is API call in progress?
  addItemToCart,        // (variantId, quantity, customAttributes) => Promise
  updateCartItem,       // (lineItemId, quantity) => Promise
  removeCartItem,       // (lineItemId) => Promise
  clearCart,            // () => Promise
  getCartTotal,         // () => string (e.g., "129.00")
  getCartItemCount,     // () => number
  client,               // Shopify Buy SDK client (advanced usage)
} = useShopify();
```

### Usage Example

```javascript
import { useShopify } from '../context/ShopifyContext';

const MyComponent = () => {
  const { addItemToCart, isLoading } = useShopify();

  const handleAdd = async () => {
    const customAttributes = [
      { key: 'Engraving', value: 'DEEP ROOT' },
      { key: 'Wood Type', value: 'Oak' },
    ];

    await addItemToCart(
      'gid://shopify/ProductVariant/123456',
      1,
      customAttributes
    );
  };

  return (
    <button onClick={handleAdd} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};
```

---

## 🚀 Next Steps

### 1. Create a Cart Drawer Component
Build a slide-out cart to show items with their custom attributes:
- Display engraving preview
- Show wood type selection
- Allow quantity updates
- Checkout button

### 2. Add More Products
Replicate the ProductPage pattern for other items:
- The Orbit Valet Tray
- The Echo Amp
- Magnetic Key Bar
- Cable Organizers

### 3. Implement Product Metafields
Use Shopify metafields to store:
- Product images
- Wood options
- Engraving character limits
- Pricing variations

### 4. Deploy to Production
- Deploy to Vercel/Netlify
- Update Shopify app settings with production domain
- Test checkout flow end-to-end

---

## 🐛 Troubleshooting

### Error: "Cannot read property 'id' of null"
**Solution**: The checkout hasn't initialized. Make sure ShopifyProvider is wrapping your App in `main.jsx`.

### Error: "Invalid Storefront Access Token"
**Solution**: Double-check your token in `ShopifyContext.jsx`. It should start with `shpat_`.

### Custom Attributes Not Showing in Shopify
**Solution**: 
1. Ensure you're using `customAttributes` (not `properties`)
2. Check that the variant ID is correct
3. Verify the checkout was created successfully (check console logs)

### Products Not Loading
**Solution**: 
1. Verify your store domain is correct (no `https://`, just `store.myshopify.com`)
2. Check that Storefront API permissions are enabled
3. Make sure the product is published to the "Online Store" sales channel

---

## 📚 Additional Resources

- [Shopify Buy SDK Documentation](https://shopify.github.io/js-buy-sdk/)
- [Storefront API Reference](https://shopify.dev/api/storefront)
- [Custom Attributes Guide](https://shopify.dev/api/storefront/latest/mutations/checkoutLineItemsAdd)

---

## ✨ Summary

Your website now has:
- ✅ Full Shopify Buy SDK integration
- ✅ Custom attributes for engraving and wood type
- ✅ Cart management system
- ✅ Loading states and error handling
- ✅ Ready for production deployment

**Critical**: The custom attributes (`Engraving` and `Wood Type`) will appear in your Shopify Admin Orders page, so you know exactly what to create for each customer! 🎯
