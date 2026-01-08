import { motion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';

const CollectionGrid = () => {
    const products = [
        {
            id: 1,
            name: 'The Orbit Valet Tray',
            price: '$89',
            image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2940&auto=format&fit=crop',
            size: 'large',
        },
        {
            id: 2,
            name: 'The Echo Amp',
            price: '$129',
            image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=2940&auto=format&fit=crop',
            size: 'medium',
        },
        {
            id: 3,
            name: 'Magnetic Key Bar',
            price: '$45',
            image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=2940&auto=format&fit=crop',
            size: 'small',
        },
        {
            id: 4,
            name: 'Cable Organizers',
            price: '$35',
            image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=2940&auto=format&fit=crop',
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
        <section className="bg-[#f4f4f5] dark:bg-deep-charcoal px-6 py-20 md:px-12 lg:px-20">
            {/* Section Header */}
            <div className="mb-12 text-center">
                <h2 className="font-heading text-4xl text-zinc-900 dark:text-mist md:text-5xl lg:text-6xl">
                    Featured Collection
                </h2>
                <p className="mt-4 font-body text-lg text-zinc-600 dark:text-smoke">
                    Handcrafted pieces that tell your story
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
                        <SpotlightCard className="group relative h-full overflow-hidden bg-white dark:bg-soft-black">
                            {/* Personalizable Badge */}
                            <div className="absolute right-4 top-4 z-10 bg-white/90 dark:bg-deep-charcoal/90 px-3 py-1.5 backdrop-blur-sm">
                                <span className="font-body text-xs tracking-widest text-antique-brass">
                                    PERSONALIZABLE
                                </span>
                            </div>

                            {/* Product Image - 80% of card */}
                            <div className="relative h-[80%] overflow-hidden">
                                <motion.img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-antique-brass/0 transition-all duration-300 group-hover:bg-antique-brass/10" />
                            </div>

                            {/* Product Info - Bottom 20% */}
                            <div className="flex h-[20%] flex-col justify-center px-6 py-4">
                                <h3 className="font-body text-base font-medium text-zinc-900 dark:text-mist md:text-lg">
                                    {product.name}
                                </h3>
                                <p className="mt-1 font-body text-sm text-antique-brass md:text-base">
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
