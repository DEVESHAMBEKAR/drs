import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';

const ShopPage = () => {
    const { client } = useShopify();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get filter from URL params
    const materialFilter = searchParams.get('material') || 'all'; // 'all' | 'acrylic' | 'wood'
    const categoryFilter = searchParams.get('category') || 'all'; // 'all' | 'anime' | 'sports'

    // Fetch all products from Shopify
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching products from Shopify...');
                const fetchedProducts = await client.product.fetchAll();
                console.log('Fetched products:', fetchedProducts);
                setProducts(fetchedProducts);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(`Failed to load products: ${err.message || 'Please check your Shopify configuration.'}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (client) {
            fetchProducts();
        }
    }, [client]);

    // Filter products based on material type and category
    // Products can be tagged via: tags, productType, title, or description
    const filteredProducts = products.filter(product => {
        // Debug: Log product data to see what fields are available
        if (products.length > 0 && product === products[0]) {
            console.log('Product data sample:', {
                title: product.title,
                productType: product.productType,
                tags: product.tags,
                handle: product.handle,
                hasDescription: !!product.description
            });
        }

        // Get available fields for matching (lowercase for comparison)
        const tags = product.tags?.map(tag => typeof tag === 'string' ? tag.toLowerCase() : tag) || [];
        const productType = (product.productType || '').toLowerCase();
        const title = (product.title || '').toLowerCase();
        const handle = (product.handle || '').toLowerCase();
        const description = (product.description || '').toLowerCase();

        // Material filter - check multiple sources
        let matchesMaterial = true;
        if (materialFilter !== 'all') {
            const searchTerm = materialFilter.toLowerCase();
            // Check for "wood" or "wooden"
            const woodTerms = ['wood', 'wooden', 'walnut', 'teak'];
            const acrylicTerms = ['acrylic', 'led', 'halo'];

            if (materialFilter === 'wood') {
                matchesMaterial = woodTerms.some(term =>
                    tags.includes(term) ||
                    productType.includes(term) ||
                    title.includes(term) ||
                    handle.includes(term) ||
                    description.includes(term)
                );
            } else if (materialFilter === 'acrylic') {
                matchesMaterial = acrylicTerms.some(term =>
                    tags.includes(term) ||
                    productType.includes(term) ||
                    title.includes(term) ||
                    handle.includes(term) ||
                    description.includes(term)
                );
            }
        }

        // Category filter - check multiple sources
        let matchesCategory = true;
        if (categoryFilter !== 'all') {
            matchesCategory = tags.includes(categoryFilter) ||
                productType.includes(categoryFilter) ||
                title.includes(categoryFilter) ||
                handle.includes(categoryFilter) ||
                description.includes(categoryFilter);
        }

        return matchesMaterial && matchesCategory;
    });

    // Handle filter changes
    const handleMaterialFilter = (material) => {
        const newParams = new URLSearchParams(searchParams);
        if (material === 'all') {
            newParams.delete('material');
        } else {
            newParams.set('material', material);
        }
        setSearchParams(newParams);
    };

    const handleCategoryFilter = (category) => {
        const newParams = new URLSearchParams(searchParams);
        if (category === 'all') {
            newParams.delete('category');
        } else {
            newParams.set('category', category);
        }
        setSearchParams(newParams);
    };

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
        <div className="min-h-screen bg-ash dark:bg-obsidian pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-6">
                {/* Page Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-display text-3xl text-zinc-900 dark:text-ash md:text-5xl">
                        Our Collection
                    </h1>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* MATERIAL TYPE FILTER - NEW DEEPROOT STYLE */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-stone mb-4">
                        Material Type
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {/* Acrylic Button */}
                        <button
                            onClick={() => handleMaterialFilter('acrylic')}
                            className={`
                                px-6 py-3 border-2 transition-all duration-300 font-mono text-[11px] uppercase tracking-[0.2em]
                                ${materialFilter === 'acrylic'
                                    ? 'border-cold-silver bg-obsidian text-cold-silver'
                                    : 'border-zinc-300 dark:border-charcoal text-zinc-600 dark:text-stone hover:border-cold-silver hover:text-cold-silver'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Acrylic
                            </span>
                        </button>

                        {/* Wood Button */}
                        <button
                            onClick={() => handleMaterialFilter('wood')}
                            className={`
                                px-6 py-3 border-2 transition-all duration-300 font-mono text-[11px] uppercase tracking-[0.2em]
                                ${materialFilter === 'wood'
                                    ? 'border-deep-walnut bg-charcoal text-deep-walnut'
                                    : 'border-zinc-300 dark:border-charcoal text-zinc-600 dark:text-stone hover:border-deep-walnut hover:text-deep-walnut'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Wooden
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Flex Container - Sidebar + Products Grid */}
                <div className="flex flex-col gap-8 md:flex-row md:gap-12">
                    {/* Sticky Sidebar - Desktop Only */}
                    <aside className="w-full md:sticky md:top-28 md:h-[calc(100vh-8rem)] md:w-64 flex-shrink-0">
                        <nav className="space-y-6">
                            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-stone">
                                Categories
                            </h2>

                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => handleCategoryFilter('all')}
                                        className={`font-body text-sm transition-colors duration-300 text-left w-full ${categoryFilter === 'all'
                                            ? 'text-zinc-900 dark:text-ash font-medium'
                                            : 'text-zinc-500 dark:text-stone hover:text-zinc-900 dark:hover:text-ash'
                                            }`}
                                    >
                                        All Products
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        to="/custom-studio"
                                        className="font-body text-sm text-zinc-500 dark:text-stone hover:text-zinc-900 dark:hover:text-ash transition-colors duration-300 text-left w-full inline-block"
                                    >
                                        Custom →
                                    </Link>
                                </li>
                            </ul>

                            {/* Divider */}
                            <div className="border-t border-zinc-200 dark:border-charcoal pt-6 mt-8">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-stone">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                                </p>

                                {/* Active Filters */}
                                {(materialFilter !== 'all' || categoryFilter !== 'all') && (
                                    <div className="mt-4 space-y-2">
                                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 dark:text-stone/70">
                                            Active Filters:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {materialFilter !== 'all' && (
                                                <span className={`px-2 py-1 text-[10px] uppercase tracking-[0.1em] ${materialFilter === 'acrylic'
                                                    ? 'bg-cold-silver/20 text-cold-silver border border-cold-silver/30'
                                                    : 'bg-deep-walnut/20 text-deep-walnut border border-deep-walnut/30'
                                                    }`}>
                                                    {materialFilter}
                                                </span>
                                            )}
                                            {categoryFilter !== 'all' && (
                                                <span className="px-2 py-1 text-[10px] uppercase tracking-[0.1em] bg-zinc-200 dark:bg-charcoal text-zinc-600 dark:text-stone">
                                                    {categoryFilter}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSearchParams(new URLSearchParams());
                                            }}
                                            className="text-[10px] text-zinc-500 dark:text-stone hover:text-zinc-900 dark:hover:text-ash underline"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </aside>

                    {/* Products Grid Container - Takes Remaining Space */}
                    <div className="flex-1">

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 dark:border-charcoal border-t-zinc-900 dark:border-t-ash mx-auto"></div>
                                    <p className="font-body text-zinc-600 dark:text-stone">Loading products...</p>
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
                                        className="mt-4 border border-zinc-900 dark:border-ash px-6 py-2 font-body text-sm tracking-widest text-zinc-900 dark:text-ash transition-all hover:bg-zinc-900 hover:text-white dark:hover:bg-ash dark:hover:text-obsidian"
                                    >
                                        RETRY
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Products Grid - Deeproot Style */}
                        {!isLoading && !error && filteredProducts.length > 0 && (
                            <motion.div
                                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredProducts.map((product) => {
                                    // Determine material type from multiple sources
                                    const tags = product.tags?.map(tag => typeof tag === 'string' ? tag.toLowerCase() : '') || [];
                                    const title = (product.title || '').toLowerCase();
                                    const handle = (product.handle || '').toLowerCase();
                                    const description = (product.description || '').toLowerCase();
                                    const productType = (product.productType || '').toLowerCase();

                                    const woodTerms = ['wood', 'wooden', 'walnut', 'teak'];
                                    const acrylicTerms = ['acrylic', 'led', 'halo'];

                                    const isWood = woodTerms.some(term =>
                                        tags.includes(term) || title.includes(term) || handle.includes(term) || description.includes(term) || productType.includes(term)
                                    );
                                    const isAcrylic = acrylicTerms.some(term =>
                                        tags.includes(term) || title.includes(term) || handle.includes(term) || description.includes(term) || productType.includes(term)
                                    );

                                    return (
                                        <motion.div key={product.id} variants={itemVariants}>
                                            <Link
                                                to={`/product/${encodeURIComponent(product.id)}`}
                                                className="group block"
                                            >
                                                {/* Product Card - Deeproot Style */}
                                                <div className="border border-zinc-200 dark:border-charcoal bg-white dark:bg-charcoal/30 transition-all duration-300 hover:border-zinc-400 dark:hover:border-stone overflow-hidden">
                                                    {/* Product Image */}
                                                    <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-obsidian">
                                                        {product.images && product.images.length > 0 ? (
                                                            <motion.img
                                                                src={product.images[0].src}
                                                                alt={product.title}
                                                                loading="lazy"
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <span className="font-body text-sm text-zinc-400 dark:text-stone">
                                                                    No image
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Material Badge */}
                                                        {(isWood || isAcrylic) && (
                                                            <div className={`absolute top-3 left-3 px-2 py-1 text-[9px] uppercase tracking-[0.15em] font-mono ${isWood
                                                                ? 'bg-deep-walnut/90 text-white'
                                                                : 'bg-cold-silver/90 text-obsidian'
                                                                }`}>
                                                                {isWood ? 'Wood' : 'Acrylic'}
                                                            </div>
                                                        )}

                                                        {/* Hover Overlay */}
                                                        <div className="absolute inset-0 bg-zinc-900/0 transition-all duration-300 group-hover:bg-zinc-900/10 dark:group-hover:bg-white/5" />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-4">
                                                        <h3 className="font-body text-sm font-medium text-zinc-900 dark:text-ash line-clamp-1">
                                                            {product.title}
                                                        </h3>

                                                        {product.variants && product.variants.length > 0 && (
                                                            <p className="mt-2 font-mono text-sm text-zinc-600 dark:text-stone">
                                                                ₹{parseFloat(product.variants[0].price.amount).toFixed(0)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && filteredProducts.length === 0 && (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="text-center">
                                    <p className="font-body text-lg text-zinc-600 dark:text-stone mb-2">
                                        No products found.
                                    </p>
                                    <p className="font-body text-sm text-zinc-500 dark:text-stone/70 mb-6">
                                        Try adjusting your filters or browse all products.
                                    </p>
                                    <button
                                        onClick={() => setSearchParams(new URLSearchParams())}
                                        className="border-2 border-zinc-900 dark:border-ash px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-900 dark:text-ash transition-all hover:bg-zinc-900 hover:text-white dark:hover:bg-ash dark:hover:text-obsidian"
                                    >
                                        View All Products
                                    </button>
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
