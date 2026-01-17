# Order History Setup Guide

## How Order History Works in DRS

### ✅ What We've Implemented:

1. **Automatic Customer Association**
   - When you create a customer account and log in, your email is automatically linked to your cart
   - Any purchases made while logged in are associated with your customer account
   - Orders appear in the Dashboard's "MISSION LOG" section

2. **Checkout Flow**
   ```
   Login → Add to Cart → Checkout → Complete Purchase
                ↓
   Order automatically associated with your email
                ↓
   Appears in Dashboard (refresh page if needed)
   ```

3. **Order Data Fetched**
   - Order number
   - Date of purchase
   - Product thumbnails
   - Payment status (PAID, PENDING, REFUNDED)
   - Fulfillment status (SHIPPED, PROCESSING)
   - Total price

### 🔧 Important Shopify Settings:

**Required:**
1. ✅ "Classic customer accounts" enabled (password-based)
2. ✅ "Require customers to sign in before checkout" (optional but recommended)

**To verify orders are linking:**
1. Go to Shopify Admin → Customers
2. Find the customer by email
3. Check their "Orders" section
4. Orders should appear there after checkout completion

### 📝 Test Flow:

1. **Create Account:**
   - Click "Login" → "CREATE ACCOUNT"
   - Fill in name, email, password
   - Submit → Auto-login → Redirect to Dashboard

2. **Place Order:**
   - Browse products → Add to cart
   - Checkout (must be logged in)
   - Complete payment

3. **View Order:**
   - Go to `/account` (Dashboard)
   - Orders appear in "MISSION LOG // RECENT TRANSACTIONS"
   - Refresh page if order doesn't appear immediately

### ⚙️ How It Works Technically:

**ShopifyContext:**
```javascript
// When customer logs in:
1. fetchCustomerInfo() - Gets customer details
2. fetchCustomerOrders() - Gets order history
3. Cart is associated with customer email

// When adding to cart:
- Cart uses customer's email
- Shopify links completed checkouts to customer account
```

**DashboardPage:**
```javascript
// On page load:
1. Checks for customer_token
2. Fetches customer dossier via Storefront API
3. Displays all orders for that customer
```

### 🐛 Troubleshooting:

**Orders not showing?**
1. Verify customer is logged in (check localStorage for `customer_token`)
2. Check Shopify Admin → Orders to see if order exists
3. Verify order is associated with correct customer email
4. Refresh Dashboard page

**Order appears in Shopify but not Dashboard?**
- The Storefront API may have a delay (1-2 minutes)
- Refresh the page
- Check console logs for API errors

### 📦 Order States:

**Payment Status:**
- PAID: Payment successful
- PENDING: Awaiting payment
- REFUNDED: Order refunded

**Fulfillment Status:**
- SHIPPED: Order shipped to customer
- PROCESSING: Order being prepared
- UNFULFILLED: Not yet processed

---

**Made by:** Antigravity AI
**For:** Deep Root Studios (DRS) - Walls with a Spine
