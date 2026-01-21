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
import CustomStudioPage from './pages/CustomStudioPage';
import DashboardPage from './pages/DashboardPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutReviewPage from './pages/CheckoutReviewPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AuthCallback from './pages/AuthCallback';

function AppContent() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAuthCallback = location.pathname === '/account/callback';
    const isCheckoutPage = location.pathname.startsWith('/checkout/') || location.pathname === '/order-success';

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Announcement Banner - Only on Home Page */}
            {isHomePage && <TopBanner />}

            {/* Global Components - Hide Header/Footer on Auth Callback and Checkout */}
            {!isAuthCallback && !isCheckoutPage && <Header />}

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

                    {/* Custom Studio - Neural Silhouette Engine */}
                    <Route path="/custom-studio" element={<CustomStudioPage />} />

                    {/* Account Dashboard - Command Center */}
                    <Route path="/account" element={<DashboardPage />} />
                    <Route path="/account/orders" element={<DashboardPage />} />
                    <Route path="/account/addresses" element={<DashboardPage />} />

                    {/* Order Detail Page */}
                    <Route path="/account/order/:orderId" element={<OrderDetailPage />} />

                    {/* OAuth Callback - Handles Google Sign-In redirect */}
                    <Route path="/account/callback" element={<AuthCallback />} />

                    {/* Checkout Review - Pre-checkout summary page */}
                    <Route path="/checkout" element={<CheckoutReviewPage />} />

                    {/* Checkout Page - Shopify-style split checkout */}
                    <Route path="/checkout/information" element={<CheckoutPage />} />

                    {/* Order Success Page - Post-payment confirmation */}
                    <Route path="/order-success" element={<OrderSuccessPage />} />

                    {/* Legal Policy Pages */}
                    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                    <Route path="/refund-policy" element={<RefundPolicyPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                </Routes>
            </main>

            {/* Global Footer - Hide on Auth Callback and Checkout */}
            {!isAuthCallback && !isCheckoutPage && <Footer />}

            {/* Global Cart Drawer - Hide on Checkout page */}
            {!isAuthCallback && !isCheckoutPage && <CartDrawer />}

            {/* Global WhatsApp Widget - Hide on Auth Callback and Checkout */}
            {!isAuthCallback && !isCheckoutPage && <WhatsAppWidget />}
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
