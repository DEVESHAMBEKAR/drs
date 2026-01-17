import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, ChevronDown, Monitor, PenTool, BookOpen, Building2, Menu, X, Package, MapPin, LogOut } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';
import SearchOverlay from './SearchOverlay';
import UserDropdown from './UserDropdown';

const Header = () => {
    const navigate = useNavigate();
    const { setIsCartOpen, getCartItemCount, customerToken, customer, logoutCustomer } = useShopify();
    const itemCount = getCartItemCount();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isLoggedIn = !!customerToken;

    // Handle mobile logout
    const handleMobileLogout = () => {
        setIsMobileMenuOpen(false);
        if (logoutCustomer) {
            logoutCustomer();
        } else {
            localStorage.removeItem('customer_token');
            window.location.href = '/';
        }
    };

    return (
        <>
            <header className="sticky left-0 right-0 top-0 z-30 bg-deep-charcoal/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:py-6">
                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="block md:hidden text-smoke hover:text-antique-brass transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </motion.button>

                    {/* Logo - DRS Brand */}
                    <Link to="/">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center"
                        >
                            <img
                                src="/drs-logo.png"
                                alt="DRS - Deep Root Studios"
                                className="h-14 w-auto dark:invert sm:h-20"
                            />
                        </motion.div>
                    </Link>

                    {/* Navigation */}
                    <motion.nav
                        className="hidden items-center gap-8 md:flex"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link
                            to="/"
                            className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                        >
                            HOME
                        </Link>

                        {/* Shop Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsShopDropdownOpen(true)}
                            onMouseLeave={() => setIsShopDropdownOpen(false)}
                        >
                            <button
                                className="flex items-center gap-1 font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                            >
                                SHOP
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {isShopDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-luxury-card border border-zinc-200 dark:border-luxury-border rounded-lg shadow-xl overflow-hidden"
                                    >
                                        {/* View All */}
                                        <Link
                                            to="/shop"
                                            className="block px-4 py-3 font-body text-sm text-neon-gold border-b border-zinc-200 dark:border-luxury-border hover:bg-zinc-50 dark:hover:bg-[#252525] transition-colors"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            View All Products →
                                        </Link>

                                        {/* Anime Collection */}
                                        <Link
                                            to="/shop?category=anime"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-[#252525] transition-colors group"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            <Monitor className="h-5 w-5 text-neon-gold" />
                                            <div>
                                                <span className="font-body text-sm text-zinc-900 dark:text-mist group-hover:text-neon-gold transition-colors">
                                                    Anime
                                                </span>
                                                <p className="font-body text-xs text-smoke/60">
                                                    Iconic characters, halo-lit
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Sports Collection */}
                                        <Link
                                            to="/shop?category=sports"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-[#252525] transition-colors group"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            <PenTool className="h-5 w-5 text-neon-gold" />
                                            <div>
                                                <span className="font-body text-sm text-zinc-900 dark:text-mist group-hover:text-neon-gold transition-colors">
                                                    Sports
                                                </span>
                                                <p className="font-body text-xs text-smoke/60">
                                                    Athletes, teams, moments
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Custom Collection */}
                                        <Link
                                            to="/shop?category=custom"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-[#252525] transition-colors group"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            <BookOpen className="h-5 w-5 text-neon-gold" />
                                            <div>
                                                <span className="font-body text-sm text-zinc-900 dark:text-mist group-hover:text-neon-gold transition-colors">
                                                    Custom
                                                </span>
                                                <p className="font-body text-xs text-smoke/60">
                                                    Your design, our craft
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link
                            to="/about"
                            className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                        >
                            ABOUT
                        </Link>
                    </motion.nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Search Button */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            className="group flex items-center gap-2 transition-colors min-w-[44px] min-h-[44px] justify-center"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Search products"
                        >
                            <Search className="h-5 w-5 text-smoke transition-colors group-hover:text-antique-brass" />
                        </motion.button>

                        {/* Theme Toggle */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            <ThemeToggle />
                        </motion.div>

                        {/* Login/Account Button - Conditional (Desktop Only) */}
                        {customerToken ? (
                            <motion.div
                                className="hidden md:block"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <UserDropdown />
                            </motion.div>
                        ) : (
                            <motion.button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="group flex items-center gap-2 transition-colors min-w-[44px] min-h-[44px] justify-center"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <User className="h-5 w-5 text-smoke transition-colors group-hover:text-antique-brass" />
                                <span className="hidden font-body text-sm tracking-widest text-smoke transition-colors group-hover:text-antique-brass sm:inline">
                                    LOGIN
                                </span>
                            </motion.button>
                        )}

                        {/* Cart Button */}
                        <motion.button
                            onClick={() => setIsCartOpen(true)}
                            className="group relative flex items-center gap-2 transition-colors min-w-[44px] min-h-[44px] justify-center"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Cart Icon */}
                            <svg
                                className="h-6 w-6 text-smoke transition-colors group-hover:text-antique-brass"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>

                            {/* Item Count Badge */}
                            {itemCount > 0 && (
                                <motion.span
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-antique-brass font-body text-xs font-bold text-deep-charcoal"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                >
                                    {itemCount}
                                </motion.span>
                            )}

                            <span className="hidden font-body text-sm tracking-widest text-smoke transition-colors group-hover:text-antique-brass sm:inline">
                                CART
                            </span>
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            {/* Mobile Drawer - Enhanced with Account Links */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#0a0a0a] z-50 flex flex-col md:hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-6 right-6 text-smoke hover:text-antique-brass transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Close menu"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Navigation Links */}
                            <nav className="flex-1 px-6 pt-20 pb-6 overflow-y-auto">
                                <div className="flex flex-col gap-6">
                                    <Link
                                        to="/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-2xl text-white hover:text-gray-300 transition-colors py-2"
                                    >
                                        Home
                                    </Link>

                                    <Link
                                        to="/shop"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-2xl text-white hover:text-gray-300 transition-colors py-2"
                                    >
                                        Shop
                                    </Link>

                                    <Link
                                        to="/about"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-2xl text-white hover:text-gray-300 transition-colors py-2"
                                    >
                                        About
                                    </Link>

                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-2xl text-white hover:text-gray-300 transition-colors py-2"
                                    >
                                        Contact
                                    </Link>
                                </div>

                                {/* Account Section - Only show when logged in */}
                                {isLoggedIn && (
                                    <div className="mt-8 pt-6 border-t border-[#333]">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-mono">
                                            MY ACCOUNT
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                to="/account"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 text-gray-300 hover:text-white active:text-white transition-colors py-3 min-h-[48px]"
                                            >
                                                <Package className="h-5 w-5" />
                                                <span className="font-body text-sm tracking-wide">My Orders</span>
                                            </Link>

                                            <Link
                                                to="/account"
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    // Navigate and switch to addresses tab
                                                    setTimeout(() => {
                                                        const addressTab = document.querySelector('[data-tab="addresses"]');
                                                        if (addressTab) addressTab.click();
                                                    }, 100);
                                                }}
                                                className="flex items-center gap-3 text-gray-300 hover:text-white active:text-white transition-colors py-3 min-h-[48px]"
                                            >
                                                <MapPin className="h-5 w-5" />
                                                <span className="font-body text-sm tracking-wide">My Addresses</span>
                                            </Link>

                                            <button
                                                onClick={handleMobileLogout}
                                                className="flex items-center gap-3 text-red-400 hover:text-red-300 active:text-red-300 transition-colors py-3 min-h-[48px] w-full text-left"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                <span className="font-body text-sm tracking-wide">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </nav>

                            {/* Footer - Login (only when not logged in) */}
                            {!isLoggedIn && (
                                <div className="border-t border-[#333] px-6 py-6">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="flex items-center justify-center gap-3 w-full h-12 border border-white text-white hover:bg-white hover:text-black active:scale-95 transition-all font-body text-sm tracking-widest uppercase"
                                    >
                                        <User className="h-5 w-5" />
                                        SIGN IN
                                    </button>
                                </div>
                            )}

                            {/* Logged in user info */}
                            {isLoggedIn && customer && (
                                <div className="border-t border-[#333] px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">
                                                {customer.firstName} {customer.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
