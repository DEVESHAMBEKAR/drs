import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                >
                    {/* Search Container */}
                    <motion.div
                        className="mx-auto max-w-6xl px-6"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Bar */}
                        <div className="relative mt-20 mb-12">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                autoFocus
                                className="w-full bg-transparent border-0 border-b-2 border-[#333] focus:border-[#c0a060] text-4xl md:text-5xl font-serif text-white placeholder-[#666] outline-none pb-4 transition-colors duration-300"
                            />

                            {/* Clear Button */}
                            {searchQuery && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#c0a060] transition-colors duration-300"
                                    aria-label="Clear search"
                                >
                                    <X size={32} />
                                </button>
                            )}
                        </div>

                        {/* Results Section */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                // Loading State
                                <div className="text-center py-20">
                                    <p className="font-body text-lg text-[#a3a3a3]">
                                        Loading catalog...
                                    </p>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                // Results Grid
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
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
                                            <div className="bg-[#1a1a1a] border border-[#333] hover:border-[#c0a060] transition-all duration-300 overflow-hidden">
                                                {/* Product Image */}
                                                <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={product.images[0].src}
                                                            alt={product.title}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <span className="font-body text-sm text-[#666]">
                                                                No image
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-4">
                                                    <h3 className="font-body text-sm font-medium text-[#c0a060] line-clamp-2 mb-2">
                                                        {product.title}
                                                    </h3>
                                                    {product.variants && product.variants.length > 0 && (
                                                        <p className="font-body text-base text-[#a3a3a3]">
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
                                <div className="text-center py-20">
                                    <p className="font-body text-lg text-[#a3a3a3] mb-2">
                                        No products found for "{searchQuery}"
                                    </p>
                                    <p className="font-body text-sm text-[#666]">
                                        Try a different search term
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Helper Text */}
                        <div className="mt-8 text-center">
                            <p className="font-body text-xs text-[#666]">
                                Press <kbd className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-[#a3a3a3]">ESC</kbd> to close
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
