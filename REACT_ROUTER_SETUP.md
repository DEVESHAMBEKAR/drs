# React Router Setup - Complete Guide

## ✅ Phase 2: App.jsx Refactoring Complete!

### 🎯 What Was Changed

**File**: `src/App.jsx`

### 📦 New Imports

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
```

### 🏗️ New Structure

```jsx
<BrowserRouter>
  <div className="min-h-screen">
    {/* Global Components */}
    <Header />
    
    {/* Routes */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={...} />
      <Route path="/product/:id" element={...} />
    </Routes>
    
    {/* Global Cart */}
    <CartDrawer />
  </div>
</BrowserRouter>
```

---

## 🛣️ Available Routes

### 1. **Home Page** - `/`
- **Component**: `<HomePage />`
- **Contains**:
  - Hero Section
  - Collection Grid
  - Product Page
- **URL**: `http://localhost:5173/`

### 2. **Shop Page** - `/shop`
- **Status**: Placeholder
- **Displays**: "Shop Page" heading
- **URL**: `http://localhost:5173/shop`
- **Next Step**: Create `ShopPage.jsx` component

### 3. **Product Details** - `/product/:id`
- **Status**: Placeholder
- **Displays**: "Product Details" heading
- **Dynamic Route**: `:id` parameter
- **Example URLs**:
  - `http://localhost:5173/product/desk-organizer`
  - `http://localhost:5173/product/valet-tray`
- **Next Step**: Create `ProductDetailPage.jsx` component

---

## 🌐 Global Components

These components appear on **every page**:

### 1. **Header** (`<Header />`)
- Fixed navigation bar
- Logo
- Cart icon with item count
- Navigation links

### 2. **CartDrawer** (`<CartDrawer />`)
- Shopping cart slide-out
- Gift wrapping option
- Checkout functionality

---

## 🧪 Testing Your Routes

### Test Home Page
```
Visit: http://localhost:5173/
Expected: Full homepage with hero, collection, and product sections
```

### Test Shop Page
```
Visit: http://localhost:5173/shop
Expected: "Shop Page" placeholder text
```

### Test Product Details
```
Visit: http://localhost:5173/product/123
Expected: "Product Details" placeholder text
```

### Test Navigation
- Click logo → Should go to home page
- Click cart icon → Cart drawer should open
- Header should stay visible on all pages

---

## 📁 Current File Structure

```
src/
├── components/
│   ├── Header.jsx          (Global - shows on all pages)
│   ├── HeroSection.jsx     (Used in HomePage)
│   ├── CollectionGrid.jsx  (Used in HomePage)
│   ├── ProductPage.jsx     (Used in HomePage)
│   └── CartDrawer.jsx      (Global - shows on all pages)
├── context/
│   └── ShopifyContext.jsx
├── pages/
│   └── HomePage.jsx        ✅ Created
├── App.jsx                 ✅ Refactored with routing
└── main.jsx
```

---

## 🚀 Next Steps

### Option 1: Create Shop Page
```jsx
// src/pages/ShopPage.jsx
import CollectionGrid from '../components/CollectionGrid';

const ShopPage = () => {
  return (
    <div className="min-h-screen bg-deep-charcoal pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-heading text-5xl text-mist mb-8">
          Our Collection
        </h1>
        <CollectionGrid />
      </div>
    </div>
  );
};

export default ShopPage;
```

### Option 2: Create Product Detail Page
```jsx
// src/pages/ProductDetailPage.jsx
import { useParams } from 'react-router-dom';
import ProductPage from '../components/ProductPage';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-deep-charcoal pt-24">
      <ProductPage productId={id} />
    </div>
  );
};

export default ProductDetailPage;
```

### Option 3: Update Header Navigation Links
Update `Header.jsx` to use React Router's `Link` component:

```jsx
import { Link } from 'react-router-dom';

// Replace <a> tags with <Link>
<Link to="/">HOME</Link>
<Link to="/shop">COLLECTION</Link>
<Link to="/about">ABOUT</Link>
```

---

## 🎯 Key Benefits of This Structure

✅ **SEO-Friendly**: Each page has its own URL  
✅ **Better UX**: Browser back/forward buttons work  
✅ **Scalable**: Easy to add new pages  
✅ **Global Components**: Header and cart persist across pages  
✅ **Dynamic Routes**: Support for product IDs and parameters  
✅ **Clean Code**: Separation of concerns with pages folder  

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /shop" error
**Solution**: This is a dev server issue. Vite should handle it automatically, but if not, the routes work in the browser when navigating via links.

### Issue: Header appears twice
**Solution**: Make sure Header is only in App.jsx, not in individual page components.

### Issue: Cart doesn't work on new pages
**Solution**: CartDrawer is global and should work everywhere. Make sure ShopifyProvider wraps BrowserRouter in main.jsx.

---

## ✨ Summary

Your app is now a **multi-page application** with:
- ✅ React Router DOM installed
- ✅ BrowserRouter wrapping the app
- ✅ 3 routes configured (home, shop, product details)
- ✅ Global header and cart drawer
- ✅ HomePage component created
- ✅ Ready for additional pages

**Your routing is live!** 🎉
