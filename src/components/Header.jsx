import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const { setIsCartOpen, getCartItemCount } = useShopify();
    const itemCount = getCartItemCount();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-30 bg-deep-charcoal/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:py-6">
                    {/* Logo */}
                    <Link to="/">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center"
                        >
                            <img
                                src="/logo.png"
                                alt="Deep Root Studios"
                                className="h-16 w-auto invert mix-blend-screen"
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
                        <Link
                            to="/shop"
                            className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                        >
                            SHOP
                        </Link>
                        <Link
                            to="/about"
                            className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                        >
                            ABOUT
                        </Link>
                        <Link
                            to="/contact"
                            className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                        >
                            CONTACT
                        </Link>
                    </motion.nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            <ThemeToggle />
                        </motion.div>

                        {/* Login Button */}
                        <motion.button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="group flex items-center gap-2 transition-colors"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <User className="h-5 w-5 text-smoke transition-colors group-hover:text-antique-brass" />
                            <span className="hidden font-body text-sm tracking-widest text-smoke transition-colors group-hover:text-antique-brass sm:inline">
                                LOGIN
                            </span>
                        </motion.button>

                        {/* Cart Button */}
                        <motion.button
                            onClick={() => setIsCartOpen(true)}
                            className="group relative flex items-center gap-2 transition-colors"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
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
                                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-antique-brass font-body text-xs font-bold text-deep-charcoal"
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
        </>
    );
};

export default Header;
