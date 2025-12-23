import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';

const Header = () => {
    const { setIsCartOpen, getCartItemCount } = useShopify();
    const itemCount = getCartItemCount();

    return (
        <header className="fixed left-0 right-0 top-0 z-30 bg-deep-charcoal/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:py-6">
                {/* Logo */}
                <motion.a
                    href="/"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center"
                >
                    <img
                        src="/logo.png"
                        alt="Deep Root Studios"
                        className="h-16 w-auto sm:h-20"
                    />
                </motion.a>

                {/* Navigation */}
                <motion.nav
                    className="hidden items-center gap-8 md:flex"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <a
                        href="#collection"
                        className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                    >
                        COLLECTION
                    </a>
                    <a
                        href="#about"
                        className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                    >
                        ABOUT
                    </a>
                    <a
                        href="#contact"
                        className="font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
                    >
                        CONTACT
                    </a>
                </motion.nav>

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
        </header>
    );
};

export default Header;
