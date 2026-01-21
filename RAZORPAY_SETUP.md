# 🔐 Razorpay + Shopify Headless Checkout Setup

Complete guide to connect Razorpay payments with Shopify order creation.

---

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHECKOUT FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. CUSTOMER FILLS FORM                                                     │
│   └── CheckoutPage.jsx (Dark Luxury UI)                                      │
│                                                                              │
│   2. RAZORPAY PAYMENT                                                        │
│   └── Razorpay Checkout Modal opens                                          │
│   └── Customer pays via UPI/Cards/Wallets                                    │
│   └── Payment confirmation received                                          │
│                                                                              │
│   3. SHOPIFY ORDER CREATION (Silent)                                         │
│   └── POST /api/create-shopify-order                                         │
│   └── Creates order in Shopify Admin                                         │
│   └── Marks as "Paid" with Razorpay reference                                │
│                                                                              │
│   4. SUCCESS PAGE                                                            │
│   └── /order-success with order details                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Step 1: Razorpay Setup

### 1.1 Create Razorpay Account
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Sign up and complete KYC verification
3. For testing, use **Test Mode** (toggle in dashboard)

### 1.2 Get API Keys
1. Go to **Settings → API Keys**
2. Generate new key pair:
   - **Key ID**: `rzp_test_xxxxx` (Test) or `rzp_live_xxxxx` (Live)
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxx`

### 1.3 Add to Environment
```env
# Frontend (public)
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID

# Backend (secret - add to Vercel/Netlify)
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

---

## 🛒 Step 2: Shopify Admin API Setup

### 2.1 Create Private App
1. Go to **Shopify Admin → Settings → Apps and sales channels**
2. Click **Develop apps** (you may need to enable this first)
3. Click **Create an app**
4. Name it: `DRS Headless Checkout`

### 2.2 Configure API Scopes
In the app configuration, enable these **Admin API scopes**:
- ✅ `write_orders` - Create orders
- ✅ `read_orders` - Read order details
- ✅ `read_products` - Read product/variant info
- ✅ `read_inventory` - Check stock levels

### 2.3 Install and Get Token
1. Click **Install app**
2. Copy the **Admin API access token** (starts with `shpat_`)
3. ⚠️ This token is shown only once - save it securely!

### 2.4 Add to Environment
```env
# Backend (add to Vercel/Netlify environment)
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_admin_api_token
```

---

## 🚀 Step 3: Deploy Backend API

### Option A: Vercel Deployment (Recommended)

1. The `/api/create-shopify-order.js` file is ready for Vercel
2. Push to GitHub and connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `SHOPIFY_STORE_URL`
   - `SHOPIFY_ACCESS_TOKEN`
   - `RAZORPAY_KEY_SECRET`

### Option B: Netlify Functions

1. Move the file to `/netlify/functions/create-shopify-order.js`
2. Uncomment the Netlify handler at the bottom of the file
3. Deploy and add environment variables in Netlify

### Option C: Express Server

```javascript
const express = require('express');
const createShopifyOrder = require('./api/create-shopify-order');

const app = express();
app.use(express.json());
app.post('/api/create-shopify-order', createShopifyOrder);
app.listen(3001);
```

---

## 🧪 Step 4: Testing

### 4.1 Test Card Numbers (Razorpay Test Mode)
| Card Number | Result |
|------------|--------|
| `4111 1111 1111 1111` | Success |
| `4000 0000 0000 0002` | Failure |

### 4.2 Test UPI ID
- Use any UPI ID ending in `@razorpay`
- Example: `success@razorpay`

### 4.3 Verify Order in Shopify
1. Complete a test payment
2. Check **Shopify Admin → Orders**
3. Look for order tagged with `Web Order, Razorpay, Headless`

---

## 📁 File Structure

```
DRS/
├── api/
│   └── create-shopify-order.js    # Backend API (Vercel/Netlify)
├── src/
│   ├── pages/
│   │   ├── CheckoutPage.jsx       # Dark Luxury Checkout UI
│   │   └── OrderSuccessPage.jsx   # Success confirmation
│   └── ...
├── .env                           # Environment variables
└── RAZORPAY_SETUP.md              # This file
```

---

## 🔒 Security Checklist

- [ ] Razorpay Key ID (public) in frontend `.env`
- [ ] Razorpay Key Secret (private) in backend environment only
- [ ] Shopify Access Token in backend environment only
- [ ] CORS configured for your domain
- [ ] Signature verification enabled in production

---

## 🐛 Troubleshooting

### Payment Modal Not Opening
- Check Razorpay SDK is loaded (console log)
- Verify `VITE_RAZORPAY_KEY_ID` is correct
- Check browser console for errors

### Order Not Created in Shopify
- Verify `SHOPIFY_ACCESS_TOKEN` has `write_orders` scope
- Check API response in browser Network tab
- Review Vercel/Netlify function logs

### Signature Verification Failed
- Ensure `RAZORPAY_KEY_SECRET` matches your Razorpay dashboard
- Check that order_id is being passed correctly

---

## 💡 Production Checklist

1. **Switch to Live Mode**
   - Get live API keys from Razorpay
   - Update `VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

2. **Enable Signature Verification**
   - Uncomment verification code in `create-shopify-order.js`

3. **Add Webhook (Optional)**
   - Configure Razorpay webhook for payment.captured
   - Backup mechanism if frontend call fails

4. **Set Up Email Notifications**
   - Shopify will auto-send order confirmation
   - Configure in Shopify Admin → Settings → Notifications
