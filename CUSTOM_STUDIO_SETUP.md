# Custom Studio - Direct Purchase Setup Guide

## Overview

The Custom Blueprint Studio now supports **direct purchase** instead of quote requests. Users can:
1. Upload their design
2. Preview with glow effects
3. Add to cart with all customization details
4. Checkout directly through Shopify

The uploaded design URL is attached to the order so you can see it in Shopify Admin.

---

## Setup Required (3 Steps)

### Step 1: Create Cloudinary Account (Image Storage)

Cloudinary is used to store customer-uploaded designs. **Free tier: 25GB storage.**

1. **Create Account**: https://cloudinary.com/
2. **Get Cloud Name**: 
   - Go to Dashboard
   - Copy your "Cloud Name" (e.g., `dxyz123abc`)
3. **Create Upload Preset**:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Settings:
     - Preset name: `custom_blueprints`
     - Signing mode: **Unsigned** (required for browser uploads)
     - Folder: `custom-blueprints`
   - Click Save
4. **Update `.env`**:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   VITE_CLOUDINARY_UPLOAD_PRESET=custom_blueprints
   ```

### Step 2: Create Shopify Product

Create a generic product in Shopify for custom orders:

1. **Go to Shopify Admin** → Products → Add Product
2. **Product Details**:
   - Title: `Custom Commission`
   - Description: `Custom halo-lit wall art based on your uploaded design`
   - Price: `₹2,999` (or your price)
   - SKU: `CUSTOM-001`
   - Track inventory: **OFF** (unlimited custom orders)
3. **Get Variant ID**:
   - After saving, open browser DevTools (F12)
   - Go to: `https://your-store.myshopify.com/admin/products/PRODUCT_ID.json`
   - Find `variants[0].id` in the response
   - Format: `gid://shopify/ProductVariant/VARIANT_ID`
4. **Update `.env`**:
   ```
   VITE_CUSTOM_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/1234567890
   ```

### Step 3: Restart Dev Server

```bash
npm run dev
```

---

## How It Works (User Flow)

```
1. User uploads image
      ↓
2. Background auto-removed (remove.bg)
      ↓
3. User adjusts contrast/brightness/glow
      ↓
4. Click "SECURE CUSTOM SLOT (₹2,999)"
      ↓
5. Image uploaded to Cloudinary
      ↓
6. Added to Shopify cart with attributes:
   - Custom Design URL
   - Glow Color
   - Contrast %
   - Brightness %
   - Inverted (Yes/No)
   - Original Filename
      ↓
7. Cart drawer opens
      ↓
8. User completes checkout
```

---

## Viewing Custom Orders in Shopify

When a customer completes checkout, the order will show:

**Order Details → Line Items:**
```
Custom Commission × 1
  - Custom Design URL: https://res.cloudinary.com/.../design.png
  - Glow Color: Warm White
  - Contrast: 180%
  - Brightness: 100%
  - Inverted: No
  - Original Filename: my-logo.png
```

**To view the design:**
1. Open order in Shopify Admin
2. Click the "Custom Design URL" link
3. The customer's uploaded design opens in a new tab

---

## Price Configuration

The price is set in two places:

1. **Shopify Product** (actual charge): Set when creating the product
2. **Display Price** (UI): Update in `CustomStudioPage.jsx`:
   ```javascript
   const CUSTOM_PRODUCT_PRICE = 2999; // ₹2,999
   ```

Make sure both match!

---

## Troubleshooting

### "Failed to upload design"
- Check Cloudinary cloud name is correct
- Verify upload preset is set to "Unsigned"
- Check browser console for detailed error

### "Failed to add to cart"
- Verify the Product Variant ID is correct
- Check the product is published and available
- Ensure the variant ID format is: `gid://shopify/ProductVariant/NUMBERS`

### Images not showing in Shopify orders
- The URL is stored as a custom attribute
- Look under the line item details in the order
- Click the URL to view the image

### Large images failing to upload
- Cloudinary free tier has 10MB limit per upload
- Images over 10MB are rejected by the form validation

---

## Files Modified

1. **`src/pages/CustomStudioPage.jsx`**
   - Added `handleSecureSlot()` function
   - Progress bar during upload
   - Cart integration with custom attributes

2. **`src/api/cloudUpload.js`** (NEW)
   - Cloudinary upload utility
   - Handles File and data URL inputs

3. **`.env`**
   - Cloudinary configuration
   - Custom product variant ID

---

## Security Notes

- **Cloudinary**: Uses unsigned uploads (required for browser)
  - Enable "Backup" in Cloudinary settings
  - Set upload restrictions if needed

- **Design URLs**: Stored permanently in Cloudinary
  - Consider setting up auto-deletion after 90 days if needed

- **Customer Data**: All handled by Shopify checkout
  - No additional customer data stored

---

## Cost Summary

| Service | Free Tier | Paid (If Needed) |
|---------|-----------|------------------|
| Cloudinary | 25GB storage, 25GB bandwidth | Pay-as-you-go |
| Remove.bg | 50 images/month | $0.13/image |
| Shopify | Included in plan | - |

---

## Next Steps

1. ✅ Set up Cloudinary account
2. ✅ Create upload preset
3. ✅ Create Shopify product
4. ✅ Update `.env` with IDs
5. ✅ Test the full flow
6. ⏳ [Optional] Set up email notification for new custom orders
7. ⏳ [Optional] Add size/material variants to the product

---

*Updated: January 2026*
