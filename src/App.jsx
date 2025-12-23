import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen">
                {/* Global Components - Show on every page */}
                <Header />

                {/* Page Routes */}
                <Routes>
                    {/* Home Page */}
                    <Route path="/" element={<HomePage />} />

                    {/* Shop Page - Placeholder */}
                    <Route path="/shop" element={
                        <div className="flex min-h-screen items-center justify-center bg-deep-charcoal">
                            <h1 className="font-heading text-4xl text-mist">Shop Page</h1>
                        </div>
                    } />

                    {/* Product Details Page - Placeholder */}
                    <Route path="/product/:id" element={
                        <div className="flex min-h-screen items-center justify-center bg-deep-charcoal">
                            <h1 className="font-heading text-4xl text-mist">Product Details</h1>
                        </div>
                    } />
                </Routes>

                {/* Global Cart Drawer - Show on every page */}
                <CartDrawer />
            </div>
        </BrowserRouter>
    );
}

export default App;
