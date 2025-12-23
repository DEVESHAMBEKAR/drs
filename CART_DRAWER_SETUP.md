# CartDrawer Component - Setup Guide

## ✨ Features Implemented

Your CartDrawer now includes:

### 🎁 Premium Gift Wrapping Option
- Checkbox to add gift wrapping service (+₹150)
- Automatically adds/removes gift wrap product from cart
- Shows gift wrap price in total calculation
- Elegant description: "Elegant packaging with personalized card"

### 🎨 Design Features
- **Clean, dark aesthetic** matching your brand
- **Playfair Display font** for "Your Cart" heading
- Slide-in animation from the right
- Backdrop overlay with blur effect
- Responsive design (full width on mobile, 450px on desktop)

### 🛒 Cart Functionality
- Display all cart items with images
- Show custom attributes (Engraving, Wood Type)
- Quantity controls (+/- buttons)
- Remove item button
- Empty cart state
- Real-time subtotal and total calculation
- Direct checkout link to Shopify

---

## 🔧 Setup Instructions

### Step 1: Get Gift Wrap Product Variant ID

1. **Create Gift Wrap Product in Shopify**:
   - Go to Shopify Admin → **Products** → **Add product**
   - Title: "Premium Gift Wrapping"
   - Price: ₹150
   - Description: "Elegant packaging with personalized card"
   - Click **Save**

2. **Get the Variant ID**:
   - Click on the product you just created
   - Scroll to **Variants** section
   - Click on "Default Title" variant
   - Look at URL: `https://your-store.myshopify.com/admin/products/123/variants/456`
   - The variant ID is: `456`
   - Convert to GraphQL format: `gid://shopify/ProductVariant/456`

### Step 2: Update CartDrawer.jsx

Open `src/components/CartDrawer.jsx` and update line 17:

```javascript
// Line 17: Replace with your actual Gift Wrap variant ID
const GIFT_WRAP_VARIANT_ID = 'gid://shopify/ProductVariant/YOUR_GIFT_WRAP_VARIANT_ID';
```

**Example**:
```javascript
const GIFT_WRAP_VARIANT_ID = 'gid://shopify/ProductVariant/44567890123456';
```

### Step 3: Adjust Gift Wrap Price (Optional)

If you want to change the gift wrap price, update line 18:

```javascript
const GIFT_WRAP_PRICE = 150; // Change to your desired price
```

---

## 🎯 How It Works

### Gift Wrap Logic

1. **User checks the box** → `handleGiftWrapToggle()` is called
2. Function checks if gift wrap is already in cart
3. If **not in cart**: Adds gift wrap product with quantity 1
4. If **already in cart**: Removes gift wrap product
5. Cart automatically updates with new total

### Custom Attributes Display

The cart shows personalization details for each item:
```
Product Name
Engraving: JOHN DOE
Wood Type: Walnut
₹129.00
```

### Price Calculation

```
Subtotal:      ₹129.00  (product price)
Gift Wrapping: ₹150.00  (if checked)
─────────────────────────
Total:         ₹279.00
```

---

## 🎨 Visual Design

### Color Scheme
- **Background**: Deep Charcoal (#0a0a0a)
- **Card Background**: Soft Black (#121212)
- **Text**: Mist (#e5e5e5)
- **Accents**: Antique Brass (#c0a060)
- **Secondary Text**: Smoke (#a3a3a3)

### Typography
- **Heading**: Playfair Display (serif) - "Your Cart"
- **Body**: Inter (sans-serif) - All other text

### Animations
- **Slide-in**: Spring animation from right
- **Backdrop**: Fade-in with blur
- **Items**: Fade-up animation when added
- **Buttons**: Scale on hover/tap

---

## 🧪 Testing the Cart

### Opening the Cart

The cart opens when `isCartOpen` is set to `true`. You can trigger this by:

1. **From ProductPage**: After clicking "Add to Cart"
2. **From a Cart Icon** (you'll need to add this to your header)

### Adding a Cart Icon to Header

Create a simple cart button:

```jsx
import { useShopify } from '../context/ShopifyContext';

const Header = () => {
  const { setIsCartOpen, getCartItemCount } = useShopify();

  return (
    <button onClick={() => setIsCartOpen(true)}>
      Cart ({getCartItemCount()})
    </button>
  );
};
```

---

## 📋 CartDrawer Component API

### Props
None - uses ShopifyContext for all data

### Shopify Context Functions Used
```javascript
const {
  cart,              // Current cart object
  isCartOpen,        // Boolean: is drawer open?
  setIsCartOpen,     // Function to open/close drawer
  isLoading,         // Boolean: API call in progress?
  updateCartItem,    // Update quantity
  removeCartItem,    // Remove item
  addItemToCart,     // Add gift wrap
} = useShopify();
```

---

## 🚀 Next Steps

### 1. Add Cart Icon to Navigation
Create a header/navigation component with a cart icon that shows item count and opens the drawer.

### 2. Add More Gift Options
Extend the gift options section:
- Gift message input
- Gift card selection
- Special delivery instructions

### 3. Add Discount Code Field
Add a promo code input field in the cart footer.

### 4. Implement Cart Persistence
The cart already persists via Shopify's checkout ID stored in localStorage.

---

## 🐛 Troubleshooting

### Cart Drawer Not Opening
**Solution**: Make sure you're calling `setIsCartOpen(true)` from somewhere (e.g., after adding to cart in ProductPage).

### Gift Wrap Not Adding
**Solution**: 
1. Verify the `GIFT_WRAP_VARIANT_ID` is correct
2. Check that the gift wrap product exists in Shopify
3. Ensure the product is published to "Online Store" channel

### Custom Attributes Not Showing
**Solution**: Custom attributes only appear if they were added when the item was added to cart. Check that ProductPage is sending them correctly.

### Prices Showing as "0.00"
**Solution**: This happens when Shopify credentials aren't configured yet. Add your store domain and access token to `ShopifyContext.jsx`.

---

## ✨ Features Summary

✅ **Clean, dark design** with brand colors  
✅ **Playfair Display** heading font  
✅ **Premium gift wrapping** checkbox (+₹150)  
✅ **Custom attributes** display (Engraving, Wood Type)  
✅ **Quantity controls** with +/- buttons  
✅ **Remove items** functionality  
✅ **Empty cart state** with continue shopping button  
✅ **Real-time totals** with gift wrap calculation  
✅ **Smooth animations** (slide-in, fade, scale)  
✅ **Responsive design** (mobile & desktop)  
✅ **Direct checkout** link to Shopify  

Your cart is now production-ready! 🎉
