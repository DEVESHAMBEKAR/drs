# Deep Root Studios - Premium Personalized Wooden Gifts

A luxury e-commerce website for Deep Root Studios, specializing in handcrafted personalized wooden organizers and decor.

![Deep Root Studios](https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

### 🎨 Premium Design
- **Cinematic Hero Section** with wood grain background
- **Bento Box Product Grid** with uneven tile layouts
- **Dark, Luxury Aesthetic** using custom color palette
- **Smooth Animations** powered by Framer Motion
- **Responsive Design** for all devices

### 🛒 E-Commerce Functionality
- **Full Shopify Integration** via Buy SDK
- **Product Customization** (wood type, engraving)
- **Live Engraving Preview** in serif font
- **Shopping Cart Drawer** with slide-in animation
- **Gift Wrapping Option** (+₹150 upsell)
- **Custom Attributes** sent to Shopify orders

### 🎁 Personalization
- Wood selection (Walnut/Oak)
- Custom engraving (max 15 characters)
- Real-time preview
- Attributes visible in Shopify Admin

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Shopify store (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/DEVESHAMBEKAR/drs.git
cd drs

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` to see the site.

## 🔧 Configuration

### Shopify Setup

1. **Get Shopify Credentials**:
   - Store domain: `your-store.myshopify.com`
   - Storefront Access Token (from Shopify Admin → Apps)

2. **Update `src/context/ShopifyContext.jsx`**:
   ```javascript
   const client = Client.buildClient({
     domain: 'your-store.myshopify.com',
     storefrontAccessToken: 'your-token-here',
   });
   ```

3. **Get Product Variant IDs**:
   - Update `ProductPage.jsx` line 35 (desk organizer)
   - Update `CartDrawer.jsx` line 17 (gift wrap)

See [`SHOPIFY_SETUP.md`](./SHOPIFY_SETUP.md) for detailed instructions.

## 📁 Project Structure

```
DRS/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation with cart icon
│   │   ├── HeroSection.jsx      # Landing section
│   │   ├── CollectionGrid.jsx   # Product grid (Bento Box)
│   │   ├── ProductPage.jsx      # Product customization
│   │   └── CartDrawer.jsx       # Shopping cart
│   ├── context/
│   │   └── ShopifyContext.jsx   # Shopify integration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Tailwind + custom styles
├── public/
├── SHOPIFY_SETUP.md             # Shopify configuration guide
├── CART_DRAWER_SETUP.md         # Cart setup guide
├── PROJECT_SUMMARY.md           # Complete feature list
└── package.json
```

## 🎨 Design System

### Colors
- **Deep Charcoal** (#0a0a0a) - Background
- **Soft Black** (#121212) - Cards
- **Antique Brass** (#c0a060) - Primary actions
- **Mist** (#e5e5e5) - Primary text
- **Smoke** (#a3a3a3) - Secondary text

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 🛠️ Built With

- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Shopify Buy SDK](https://shopify.github.io/js-buy-sdk/) - E-commerce

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎯 Key Features

### Product Customization
- Select wood type (Walnut/Oak)
- Add custom engraving (max 15 chars)
- Live preview in serif font
- Custom attributes sent to Shopify

### Shopping Cart
- Slide-in drawer from right
- Display custom attributes
- Quantity controls
- Gift wrapping option (+₹150)
- Direct Shopify checkout

### Gift Wrapping
- Optional premium gift wrapping
- Automatically adds/removes from cart
- Shows in order details
- ₹150 additional charge

## 📚 Documentation

- **[SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md)** - Complete Shopify integration guide
- **[CART_DRAWER_SETUP.md](./CART_DRAWER_SETUP.md)** - Cart configuration
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Full feature list

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables

Add these to your deployment platform:

```env
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_TOKEN=your-storefront-token
```

## 🐛 Troubleshooting

### Cart Not Opening
Make sure `ShopifyProvider` wraps your app in `main.jsx`.

### Custom Attributes Not Showing
Verify you're passing `customAttributes` array to `addItemToCart()`.

### Products Not Loading
Check Shopify credentials in `ShopifyContext.jsx`.

See documentation files for more help.

## 📄 License

This project is private and proprietary to Deep Root Studios.

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review [Shopify Buy SDK docs](https://shopify.github.io/js-buy-sdk/)
3. Contact development team

---

**Built with ❤️ for Deep Root Studios**

*Meaning Carved in Wood.*
