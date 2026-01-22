# ═══════════════════════════════════════════════════════════════════════════════
# VERCEL DEPLOYMENT GUIDE - Deep Root Studios
# ═══════════════════════════════════════════════════════════════════════════════

## Quick Start

1. Push code to GitHub
2. Import to Vercel: https://vercel.com/new
3. Add environment variables (see below)
4. Deploy!

---

## Environment Variables for Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Required Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `SHOPIFY_STORE_URL` | `deep-root-studios.myshopify.com` | Your store URL |
| `SHOPIFY_CLIENT_ID` | `61bc7cc2184c21d49c8d8570edde63a8` | From Dev Dashboard |
| `SHOPIFY_CLIENT_SECRET` | `shpss_xxxxx` | From Dev Dashboard Settings |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_xxxxx` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Your secret | Razorpay Secret |

### Optional Variables:

| Variable | Value |
|----------|-------|
| `VITE_WEB3FORMS_KEY` | Contact form key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Image upload cloud |
| `VITE_OPENAI_API_KEY` | Custom Studio AI |

---

## Getting Shopify Credentials (New Dev Dashboard)

### Step 1: Go to Dev Dashboard
Open: https://dev.shopify.com

### Step 2: Select Your App
Click on **DRS** or your app name

### Step 3: Go to Settings
In the left sidebar, click **Settings**

### Step 4: Copy Credentials
- **Client ID**: Copy the long string (e.g., `61bc7cc2...`)
- **Client Secret**: Click the eye icon to reveal, copy the `shpss_...` value

### Step 5: Configure API Scopes
1. Go to **Versions** in the left sidebar
2. Click on active version
3. Find **Access scopes**
4. Ensure these scopes are enabled:
   - `write_orders`
   - `read_orders`
   - `read_products`
   - `read_customers`

### Step 6: Install on Store
1. Go to **Home**
2. Click **Install app** (right side)
3. Select your store
4. Approve installation

---

## Testing Orders

### Test with Razorpay Test Card:
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `123456`

### Verify in Shopify:
Go to: https://admin.shopify.com/store/deep-root-studios/orders

Orders should appear with tags: `Web Order, Razorpay, Headless`

---

## Troubleshooting

### "Shopify API not configured" error
- Ensure `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` are set in Vercel
- Redeploy after adding variables

### "401 Unauthorized" error  
- Check Client Secret is correct (starts with `shpss_`)
- Ensure app is installed on the store

### Orders not appearing
1. Check Vercel Function logs
2. Verify API scopes include `write_orders`
3. Reinstall app on store

---

## Going Live

1. Get Razorpay Live keys from dashboard
2. Update in Vercel:
   - `VITE_RAZORPAY_KEY_ID` → `rzp_live_xxxxx`
   - `RAZORPAY_KEY_SECRET` → Live secret
3. Redeploy

---

## Support

Email: thedeeprootstudios@gmail.com
