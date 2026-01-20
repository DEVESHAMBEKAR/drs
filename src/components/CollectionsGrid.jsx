import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CollectionsGrid = () => {
    const collections = [
        {
            id: 1,
            name: 'SPORTS LEGENDS',
            slug: 'sports',
            itemCount: 30,
            description: 'Athletes & Teams',
            image: '/sports-legends.png',
        },
        {
            id: 2,
            name: 'MARVEL UNIVERSE',
            slug: 'marvel',
            itemCount: 40,
            description: 'Iconic Heroes & Villains',
            image: '/marvel-universe.png',
        },
        {
            id: 3,
            name: 'NATURE ESCAPES',
            slug: 'nature',
            itemCount: 25,
            description: 'Landscapes & Wildlife',
            image: '/nature-escapes.png',
        },
        {
            id: 4,
            name: 'VELOCITY ARCHIVE',
            slug: 'velocity',
            itemCount: 35,
            description: 'Cars, Bikes & Circuits',
            image: '/velocity-archive.png',
        },
    ];

    return (
        <section className="bg-white dark:bg-luxury-black py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Title */}
                <motion.h2
                    className="mb-12 text-center font-heading text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-text-main md:text-4xl lg:text-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    EXPLORE COLLECTIONS
                </motion.h2>

                {/* Collections Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {collections.map((collection, index) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Individual Collection Card Component
const CollectionCard = ({ collection, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link to={`/shop?category=${collection.slug}`}>
                <motion.div
                    className="group relative aspect-[3/4] overflow-hidden border border-luxury-border bg-black"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Background Image */}
                    <motion.div
                        className="absolute inset-0 h-full w-full"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src={collection.image}
                            alt={collection.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </motion.div>

                    {/* Dark Gradient Overlay - Bottom to Top */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Hover Border Glow */}
                    <div className="absolute inset-0 border border-transparent transition-all duration-300 group-hover:border-neon-gold" />

                    {/* Text Content - Bottom Left */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <h3 className="mb-1 font-heading text-sm font-bold uppercase tracking-tight text-white md:text-base lg:text-xl">
                            {collection.name}
                        </h3>
                        <p className="text-xs text-gray-400 md:text-sm">
                            {collection.description}
                        </p>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default CollectionsGrid;
