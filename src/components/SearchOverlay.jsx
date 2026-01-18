import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, TrendingUp } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';

const SearchOverlay = ({ isOpen, onClose }) => {
    const { client } = useShopify();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch all products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const fetchedProducts = await client.product.fetchAll();
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products for search:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && client) {
            fetchProducts();
        }
    }, [isOpen, client]);

    // Filter products based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    // Handle Escape key to close overlay
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            // Prevent body scroll when overlay is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle product click
    const handleProductClick = () => {
        setSearchQuery('');
        onClose();
    };

    // Clear search
    const handleClear = () => {
        setSearchQuery('');
    };

    // Popular searches (you can customize these)
    const popularSearches = ['Anime', 'Sports', 'Custom'];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                >
                    {/* Close Button - Top Right */}
                    <button
                        onClick={onClose}
                        className="fixed top-6 right-6 z-10 p-3 rounded-full bg-white dark:bg-black border-2 border-zinc-300 dark:border-white text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        aria-label="Close search"
                    >
                        <X size={24} />
                    </button>

                    {/* Search Container */}
                    <motion.div
                        className="mx-auto max-w-5xl px-6 h-full flex flex-col"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Bar */}
                        <div className="pt-24 pb-8">
                            <div className="relative">
                                {/* Search Icon */}
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 dark:text-gray-600" />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    autoFocus
                                    className="w-full bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white text-3xl md:text-4xl font-serif text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-gray-600 outline-none pb-4 pl-12 transition-colors duration-300"
                                />

                                {/* Clear Button */}
                                {searchQuery && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors duration-300"
                                        aria-label="Clear search"
                                    >
                                        <X size={28} />
                                    </button>
                                )}
                            </div>

                            {/* Search Info */}
                            <div className="mt-4 flex items-center justify-between">
                                <p className="font-body text-sm text-zinc-600 dark:text-gray-400">
                                    {searchQuery ? (
                                        `${filteredProducts.length} ${filteredProducts.length === 1 ? 'result' : 'results'} found`
                                    ) : (
                                        `${products.length} products available`
                                    )}
                                </p>
                                <p className="font-body text-xs text-zinc-500 dark:text-gray-500">
                                    Press <kbd className="px-2 py-1 bg-white dark:bg-black border-2 border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-gray-400 font-mono text-xs">ESC</kbd> to close
                                </p>
                            </div>
                        </div>

                        {/* Popular Searches - Show when no search query */}
                        {!searchQuery && !isLoading && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="h-4 w-4 text-black dark:text-white" />
                                    <h3 className="font-body text-sm tracking-widest uppercase text-zinc-600 dark:text-gray-500">
                                        Popular Searches
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setSearchQuery(term)}
                                            className="px-4 py-2 bg-white dark:bg-black border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:border-black dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors font-body text-sm"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results Section */}
                        <div className="flex-1 overflow-y-auto pb-8 custom-scrollbar">
                            {isLoading ? (
                                // Loading State
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center">
                                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-black dark:border-t-white mx-auto"></div>
                                        <p className="font-body text-lg text-zinc-600 dark:text-gray-400">
                                            Loading catalog...
                                        </p>
                                    </div>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                // Results Grid
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {filteredProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${encodeURIComponent(product.id)}`}
                                            onClick={handleProductClick}
                                            className="group block"
                                        >
                                            {/* Product Card */}
                                            <div className="bg-white dark:bg-black border-2 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all duration-300 overflow-hidden">
                                                {/* Product Image */}
                                                <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={product.images[0].src}
                                                            alt={product.title}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <span className="font-body text-sm text-zinc-400 dark:text-gray-600">
                                                                No image
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/0 dark:bg-white/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-all duration-300" />
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-3">
                                                    <h3 className="font-body text-sm font-medium text-zinc-900 dark:text-white line-clamp-2 mb-1 transition-colors">
                                                        {product.title}
                                                    </h3>
                                                    {product.variants && product.variants.length > 0 && (
                                                        <p className="font-body text-sm font-semibold text-zinc-900 dark:text-white">
                                                            ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            ) : (
                                // No Results
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center max-w-md">
                                        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-zinc-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                                            <Search className="h-8 w-8 text-zinc-400 dark:text-gray-600" />
                                        </div>
                                        <p className="font-body text-lg text-zinc-900 dark:text-white mb-2">
                                            No products found
                                        </p>
                                        <p className="font-body text-sm text-zinc-600 dark:text-gray-400 mb-4">
                                            We couldn't find any products matching "{searchQuery}"
                                        </p>
                                        <button
                                            onClick={handleClear}
                                            className="px-6 py-2 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-body text-sm tracking-widest uppercase"
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
