import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';

const RecommendedSection = ({ currentProductId }) => {
    const { client } = useShopify();
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                setIsLoading(true);
                // Fetch all products
                const allProducts = await client.product.fetchAll();

                // Filter out current product
                const filteredProducts = allProducts.filter(
                    (product) => product.id !== currentProductId
                );

                // Shuffle array using Fisher-Yates algorithm
                const shuffled = [...filteredProducts];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }

                // Take first 4 items
                setRecommendedProducts(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching recommended products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (client && currentProductId) {
            fetchRecommendedProducts();
        }
    }, [client, currentProductId]);

    // Don't render if no products or loading
    if (isLoading || recommendedProducts.length === 0) {
        return null;
    }

    // Animation variants
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
        <section className="border-t border-zinc-200 dark:border-smoke/20 bg-white dark:bg-soft-black py-16">
            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}
                <motion.h2
                    className="font-heading text-3xl text-antique-brass md:text-4xl mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    You Might Also Like
                </motion.h2>

                {/* Products Grid */}
                <motion.div
                    className="grid grid-cols-2 gap-6 md:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {recommendedProducts.map((product) => (
                        <motion.div key={product.id} variants={itemVariants}>
                            <Link
                                to={`/product/${encodeURIComponent(product.id)}`}
                                className="group block"
                            >
                                {/* Product Card */}
                                <div className="overflow-hidden bg-white dark:bg-soft-black transition-all duration-300 hover:shadow-2xl">
                                    {/* Product Image */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-deep-charcoal">
                                        {product.images && product.images.length > 0 ? (
                                            <motion.img
                                                src={product.images[0].src}
                                                alt={product.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="font-body text-sm text-zinc-400 dark:text-smoke/50">
                                                    No image
                                                </span>
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-antique-brass/0 transition-all duration-300 group-hover:bg-antique-brass/10" />

                                        {/* Personalizable Badge */}
                                        <div className="absolute right-2 top-2 bg-white/90 dark:bg-deep-charcoal/90 px-2 py-1 backdrop-blur-sm">
                                            <span className="font-body text-xs tracking-widest text-antique-brass">
                                                CUSTOM
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-body text-sm font-medium text-zinc-900 dark:text-mist line-clamp-2 md:text-base">
                                            {product.title}
                                        </h3>

                                        {product.variants && product.variants.length > 0 && (
                                            <p className="mt-2 font-body text-base text-antique-brass md:text-lg">
                                                ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                                            </p>
                                        )}

                                        {/* View Details Link */}
                                        <div className="mt-3 flex items-center gap-2 font-body text-xs tracking-widest text-zinc-600 dark:text-smoke transition-colors group-hover:text-antique-brass">
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
            </div>
        </section>
    );
};

export default RecommendedSection;
