import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppWidget from './components/WhatsAppWidget';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import AuthCallback from './pages/AuthCallback';

function AppContent() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAuthCallback = location.pathname === '/account/callback';

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Announcement Banner - Only on Home Page */}
            {isHomePage && <TopBanner />}

            {/* Global Components - Hide Header/Footer on Auth Callback */}
            {!isAuthCallback && <Header />}

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

                    {/* Account Dashboard - Command Center */}
                    <Route path="/account" element={<DashboardPage />} />
                    <Route path="/account/orders" element={<DashboardPage />} />
                    <Route path="/account/addresses" element={<DashboardPage />} />

                    {/* OAuth Callback - Handles Google Sign-In redirect */}
                    <Route path="/account/callback" element={<AuthCallback />} />
                </Routes>
            </main>

            {/* Global Footer - Hide on Auth Callback */}
            {!isAuthCallback && <Footer />}

            {/* Global Cart Drawer - Show on every page */}
            {!isAuthCallback && <CartDrawer />}

            {/* Global WhatsApp Widget - Hide on Auth Callback */}
            {!isAuthCallback && <WhatsAppWidget />}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
