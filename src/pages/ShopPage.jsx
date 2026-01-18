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
                console.log('Fetching products from Shopify...');
                console.log('Client:', client);
                const fetchedProducts = await client.product.fetchAll();
                console.log('Fetched products:', fetchedProducts);
                setProducts(fetchedProducts);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                console.error('Error details:', JSON.stringify(err, null, 2));
                setError(`Failed to load products: ${err.message || 'Please check your Shopify configuration.'}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (client) {
            fetchProducts();
        }
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
        <div className="min-h-screen bg-white dark:bg-luxury-black pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-6">
                {/* Page Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-heading text-3xl text-zinc-900 dark:text-white md:text-5xl">
                        Our Collection
                    </h1>
                    <p className="mt-4 font-body text-lg text-zinc-600 dark:text-gray-300">
                        Premium halo-lit wall art
                    </p>
                </motion.div>

                {/* Flex Container - Sidebar + Products Grid */}
                <div className="flex flex-col gap-8 md:flex-row md:gap-12">
                    {/* Sticky Sidebar - Desktop Only */}
                    <aside className="w-full md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-64">
                        <nav className="space-y-6">
                            <h2 className="font-heading text-xl text-neon-gold mb-6">
                                Collections
                            </h2>

                            <ul className="space-y-4">
                                <li>
                                    <button className="font-body text-lg text-text-main hover:text-neon-gold transition-colors duration-300 text-left w-full">
                                        All Products
                                    </button>
                                </li>
                                <li>
                                    <button className="font-body text-lg text-text-muted hover:text-neon-gold transition-colors duration-300 text-left w-full">
                                        Anime
                                    </button>
                                </li>
                                <li>
                                    <button className="font-body text-lg text-text-muted hover:text-neon-gold transition-colors duration-300 text-left w-full">
                                        Sports
                                    </button>
                                </li>
                                <li>
                                    <button className="font-body text-lg text-text-muted hover:text-neon-gold transition-colors duration-300 text-left w-full">
                                        Custom
                                    </button>
                                </li>
                            </ul>

                            {/* Divider */}
                            <div className="border-t border-luxury-border pt-6 mt-8">
                                <p className="font-body text-sm text-text-muted">
                                    {products.length} Products
                                </p>
                            </div>
                        </nav>
                    </aside>

                    {/* Products Grid Container - Takes Remaining Space */}
                    <div className="flex-1">

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

                        {/* Products Grid - Brutalist Style */}
                        {!isLoading && !error && products.length > 0 && (
                            <motion.div
                                className="grid grid-cols-2 gap-0 border-t border-l border-[#333] md:grid-cols-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {products.map((product) => (
                                    <motion.div key={product.id} variants={itemVariants}>
                                        <Link
                                            to={`/product/${encodeURIComponent(product.id)}`}
                                            className="group block"
                                        >
                                            {/* Product Card - Brutalist Sharp Corners */}
                                            <div className="border-r border-b border-[#333] bg-luxury-card transition-all duration-300 hover:bg-luxury-black">
                                                {/* Product Image - Strict Aspect Ratio */}
                                                <div className="relative aspect-square overflow-hidden bg-black">
                                                    {product.images && product.images.length > 0 ? (
                                                        <motion.img
                                                            src={product.images[0].src}
                                                            alt={product.title}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <span className="font-body text-sm text-text-muted">
                                                                No image
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Subtle Hover Overlay */}
                                                    <div className="absolute inset-0 bg-neon-gold/0 transition-all duration-300 group-hover:bg-neon-gold/5" />
                                                </div>

                                                {/* Product Info - Minimal Text Left Aligned */}
                                                <div className="p-3 md:p-4">
                                                    <h3 className="font-body text-sm font-medium text-text-main line-clamp-1 md:text-base text-left">
                                                        {product.title}
                                                    </h3>

                                                    {product.variants && product.variants.length > 0 && (
                                                        <p className="mt-2 font-body text-base font-bold text-neon-gold md:text-lg text-left">
                                                            ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                                                        </p>
                                                    )}
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
                                    <p className="font-body text-lg text-zinc-600 dark:text-smoke">
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
                    {/* End Products Grid Container */}
                </div>
                {/* End Flex Container */}
            </div>
            {/* End Max Width Container */}
        </div>
    );
};

export default ShopPage;
