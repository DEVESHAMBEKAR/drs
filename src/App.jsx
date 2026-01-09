import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppWidget from './components/WhatsAppWidget';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                {/* Global Components - Show on every page */}
                <Header />

                {/* Page Routes */}
                <main className="flex-grow">
                    <Routes>
                        {/* Home Page */}
                        <Route path="/" element={<HomePage />} />

                        {/* Shop Page */}
                        <Route path="/shop" element={<ShopPage />} />

                        {/* Product Details Page - Using * to capture full Shopify GID with slashes */}
                        <Route path="/product/*" element={<ProductDetailsPage />} />

                        {/* About Page */}
                        <Route path="/about" element={<AboutPage />} />

                        {/* Contact Page */}
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </main>

                {/* Global Footer - Show on every page */}
                <Footer />

                {/* Global Cart Drawer - Show on every page */}
                <CartDrawer />

                {/* Global WhatsApp Widget - Show on every page */}
                <WhatsAppWidget />
            </div>
        </BrowserRouter>
    );
}

export default App;
