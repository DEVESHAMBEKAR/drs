import { motion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';

const CollectionGrid = () => {
    const products = [
        {
            id: 1,
            name: 'Goku Glow',
            price: '$149',
            image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2940&auto=format&fit=crop',
            size: 'large',
        },
        {
            id: 2,
            name: 'Jordan Silhouette',
            price: '$179',
            image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2940&auto=format&fit=crop',
            size: 'medium',
        },
        {
            id: 3,
            name: 'F1 Racer',
            price: '$129',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop',
            size: 'small',
        },
        {
            id: 4,
            name: 'Custom Portrait',
            price: '$199',
            image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2940&auto=format&fit=crop',
            size: 'small',
        },
    ];

    // Animation variants for staggered card entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <section className="bg-[#f4f4f5] dark:bg-deep-charcoal px-6 py-10 md:py-20 md:px-12 lg:px-20">
            {/* Section Header */}
            <div className="mb-12 text-center">
                <h2 className="font-heading text-2xl text-zinc-900 dark:text-mist md:text-4xl lg:text-6xl">
                    Featured Collection
                </h2>
                <p className="mt-4 font-body text-lg text-zinc-600 dark:text-smoke">
                    Halo-lit silhouettes that command attention
                </p>
            </div>

            {/* Bento Box Grid Layout */}
            <motion.div
                className="bento-grid mx-auto max-w-7xl"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
            >
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        className={`product-card ${product.size}`}
                        variants={cardVariants}
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SpotlightCard className="group relative h-full overflow-hidden bg-luxury-card border border-luxury-border rounded-xl transition-all duration-300 hover:border-neon-gold">
                            {/* Personalizable Badge */}
                            <div className="absolute right-4 top-4 z-10 bg-luxury-black/90 px-3 py-1.5 backdrop-blur-sm rounded-md">
                                <span className="font-body text-xs tracking-widest text-neon-gold">
                                    PERSONALIZABLE
                                </span>
                            </div>

                            {/* Product Image - Full width with black bg */}
                            <div className="relative h-[80%] overflow-hidden bg-black">
                                <motion.img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Hover Overlay with subtle glow */}
                                <div className="absolute inset-0 bg-neon-gold/0 transition-all duration-300 group-hover:bg-neon-gold/5" />
                            </div>

                            {/* Product Info - Bottom 20% */}
                            <div className="flex h-[20%] flex-col justify-center px-4 py-3 md:px-6 md:py-4">
                                <h3 className="font-body text-sm font-medium text-text-main md:text-base line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="mt-1 font-body text-base font-bold text-neon-gold md:text-lg">
                                    {product.price}
                                </p>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default CollectionGrid;
