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
                                        className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-luxury-card border-2 border-zinc-300 dark:border-luxury-border rounded-lg shadow-2xl backdrop-blur-sm overflow-hidden"
                                    >
                                        {/* View All */}
                                        <Link
                                            to="/shop"
                                            className="block px-4 py-3 font-body text-sm text-black dark:text-white hover:text-zinc-600 dark:hover:text-gray-300 border-b-2 border-zinc-300 dark:border-luxury-border hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            View All Products →
                                        </Link>

                                        {/* Anime Collection */}
                                        <Link
                                            to="/shop?category=anime"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors group"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            <Monitor className="h-5 w-5 text-black dark:text-white" />
                                            <div>
                                                <span className="font-body text-sm text-zinc-900 dark:text-white transition-colors">
                                                    Anime
                                                </span>
                                                <p className="font-body text-xs text-gray-600 dark:text-gray-400">
                                                    Iconic characters, halo-lit
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Sports Collection */}
                                        <Link
                                            to="/shop?category=sports"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors group"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            <PenTool className="h-5 w-5 text-black dark:text-white" />
                                            <div>
                                                <span className="font-body text-sm text-zinc-900 dark:text-white transition-colors">
                                                    Sports
                                                </span>
                                                <p className="font-body text-xs text-gray-600 dark:text-gray-400">
                                                    Athletes, teams, moments
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Custom Collection */}
                                        <Link
                                            to="/custom-studio"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors group"
                                            onClick={() => setIsShopDropdownOpen(false)}
                                        >
                                            <BookOpen className="h-5 w-5 text-black dark:text-white" />
                                            <div>
                                                <span className="font-body text-sm text-zinc-900 dark:text-white transition-colors">
                                                    Custom
                                                </span>
                                                <p className="font-body text-xs text-gray-600 dark:text-gray-400">
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

            {/* Mobile Menu - Full Screen Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-white dark:bg-[#0a0a0a] z-50 md:hidden overflow-y-auto"
                    >
                        {/* Top Bar with Close Button */}
                        <div className="sticky top-0 bg-white dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-[#333] z-10">
                            <div className="flex items-center justify-between px-4 py-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-zinc-900 dark:text-white font-body text-sm tracking-widest uppercase"
                                >
                                    CLOSE
                                </button>
                                <img
                                    src="/drs-logo.png"
                                    alt="DRS"
                                    className="h-10 w-auto dark:invert"
                                />
                                <div className="w-16"></div> {/* Spacer for centering */}
                            </div>

                            {/* Horizontal Tab Navigation */}
                            <div className="flex items-center justify-around border-t border-zinc-200 dark:border-[#333] bg-zinc-50 dark:bg-[#0a0a0a]">
                                <Link
                                    to="/shop"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center py-3 font-body text-xs tracking-widest uppercase text-zinc-900 dark:text-white border-r border-zinc-200 dark:border-[#333] hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors"
                                >
                                    SHOP
                                </Link>
                                <Link
                                    to="/shop?filter=new"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center py-3 font-body text-xs tracking-widest uppercase text-zinc-900 dark:text-white border-r border-zinc-200 dark:border-[#333] hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors"
                                >
                                    NEW IN
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center py-3 font-body text-xs tracking-widest uppercase text-zinc-900 dark:text-white border-r border-zinc-200 dark:border-[#333] hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors"
                                >
                                    ABOUT
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsSearchOpen(true);
                                    }}
                                    className="flex-1 text-center py-3 font-body text-xs tracking-widest uppercase text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors"
                                >
                                    SEARCH
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="px-4 py-8">
                            {/* Collections Section */}
                            <div className="mb-8">
                                <h3 className="font-body text-xs tracking-widest uppercase text-zinc-500 dark:text-gray-500 mb-4">
                                    COLLECTIONS
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/shop?category=anime"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block font-serif text-xl text-zinc-900 dark:text-white hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-2"
                                    >
                                        Anime
                                    </Link>
                                    <Link
                                        to="/shop?category=sports"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block font-serif text-xl text-zinc-900 dark:text-white hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-2"
                                    >
                                        Sports
                                    </Link>
                                    <Link
                                        to="/custom-studio"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block font-serif text-xl text-zinc-900 dark:text-white hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-2"
                                    >
                                        Custom
                                    </Link>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="mb-8">
                                <h3 className="font-body text-xs tracking-widest uppercase text-zinc-500 dark:text-gray-500 mb-4">
                                    QUICK LINKS
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block font-body text-sm text-zinc-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-1"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block font-body text-sm text-zinc-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-1"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>

                            {/* Account Section - Only show when logged in */}
                            {isLoggedIn && (
                                <div className="mb-8 pt-6 border-t border-zinc-200 dark:border-[#333]">
                                    <h3 className="font-body text-xs tracking-widest uppercase text-zinc-500 dark:text-gray-500 mb-4">
                                        MY ACCOUNT
                                    </h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/account"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 text-zinc-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-2"
                                        >
                                            <Package className="h-5 w-5" />
                                            <span className="font-body text-sm">My Orders</span>
                                        </Link>

                                        <Link
                                            to="/account"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                setTimeout(() => {
                                                    const addressTab = document.querySelector('[data-tab="addresses"]');
                                                    if (addressTab) addressTab.click();
                                                }, 100);
                                            }}
                                            className="flex items-center gap-3 text-zinc-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-neon-gold transition-colors py-2"
                                        >
                                            <MapPin className="h-5 w-5" />
                                            <span className="font-body text-sm">My Addresses</span>
                                        </Link>

                                        <button
                                            onClick={handleMobileLogout}
                                            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors py-2 w-full text-left"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span className="font-body text-sm">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Login Button - Only when not logged in */}
                            {!isLoggedIn && (
                                <div className="pt-6 border-t border-zinc-200 dark:border-[#333]">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="flex items-center justify-center gap-3 w-full py-3 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-body text-sm tracking-widest uppercase"
                                    >
                                        <User className="h-5 w-5" />
                                        SIGN IN
                                    </button>
                                </div>
                            )}

                            {/* User Info - When logged in */}
                            {isLoggedIn && customer && (
                                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-[#333]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center">
                                            <User className="h-6 w-6 text-zinc-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-900 dark:text-white font-medium">
                                                {customer.firstName} {customer.lastName}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-gray-500 truncate max-w-[200px]">
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
