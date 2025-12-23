import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';

const ShopPage = () => {
    const { client } = useShopify();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all products from Shopify
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const fetchedProducts = await client.product.fetchAll();
                setProducts(fetchedProducts);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [client]);

    // Animation variants for staggered product entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-deep-charcoal pt-28 pb-20">
            <div className="mx-auto max-w-7xl px-6">
                {/* Page Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-heading text-5xl text-mist md:text-6xl">
                        Our Collection
                    </h1>
                    <p className="mt-4 font-body text-lg text-smoke">
                        Handcrafted wooden pieces, personalized just for you
                    </p>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-smoke/20 border-t-antique-brass mx-auto"></div>
                            <p className="font-body text-smoke">Loading products...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="rounded border border-red-500/30 bg-red-500/10 p-6 text-center">
                            <p className="font-body text-red-400">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 border border-antique-brass px-6 py-2 font-body text-sm tracking-widest text-antique-brass transition-all hover:bg-antique-brass hover:text-deep-charcoal"
                            >
                                RETRY
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && !error && products.length > 0 && (
                    <motion.div
                        className="grid grid-cols-2 gap-6 md:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {products.map((product) => (
                            <motion.div key={product.id} variants={itemVariants}>
                                <Link
                                    to={`/product/${product.id}`}
                                    className="group block"
                                >
                                    {/* Product Card */}
                                    <div className="overflow-hidden bg-soft-black transition-all duration-300 hover:shadow-2xl">
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-deep-charcoal">
                                            {product.images && product.images.length > 0 ? (
                                                <motion.img
                                                    src={product.images[0].src}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <span className="font-body text-sm text-smoke/50">
                                                        No image
                                                    </span>
                                                </div>
                                            )}

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-antique-brass/0 transition-all duration-300 group-hover:bg-antique-brass/10" />

                                            {/* Personalizable Badge */}
                                            <div className="absolute right-2 top-2 bg-deep-charcoal/90 px-2 py-1 backdrop-blur-sm">
                                                <span className="font-body text-xs tracking-widest text-antique-brass">
                                                    CUSTOM
                                                </span>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-body text-sm font-medium text-mist line-clamp-2 md:text-base">
                                                {product.title}
                                            </h3>

                                            {product.variants && product.variants.length > 0 && (
                                                <p className="mt-2 font-body text-base text-antique-brass md:text-lg">
                                                    ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                                                </p>
                                            )}

                                            {/* View Details Link */}
                                            <div className="mt-3 flex items-center gap-2 font-body text-xs tracking-widest text-smoke transition-colors group-hover:text-antique-brass">
                                                <span>VIEW DETAILS</span>
                                                <svg
                                                    className="h-3 w-3 transition-transform group-hover:translate-x-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && !error && products.length === 0 && (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <p className="font-body text-lg text-smoke">
                                No products available at the moment.
                            </p>
                            <Link
                                to="/"
                                className="mt-4 inline-block border border-antique-brass px-6 py-2 font-body text-sm tracking-widest text-antique-brass transition-all hover:bg-antique-brass hover:text-deep-charcoal"
                            >
                                BACK TO HOME
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
