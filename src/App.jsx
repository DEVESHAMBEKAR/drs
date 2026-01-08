import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

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

                        {/* Product Details Page */}
                        <Route path="/product/:id" element={<ProductDetailsPage />} />
                    </Routes>
                </main>

                {/* Global Footer - Show on every page */}
                <Footer />

                {/* Global Cart Drawer - Show on every page */}
                <CartDrawer />
            </div>
        </BrowserRouter>
    );
}

export default App;
