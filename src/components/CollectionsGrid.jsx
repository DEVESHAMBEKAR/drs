import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CollectionsGrid = () => {
    const collections = [
        {
            id: 1,
            name: 'THE TRIPTYCH SERIES',
            slug: 'triptych',
            itemCount: 24,
            description: '3-Piece Split LED Sets',
            image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2600&auto=format&fit=crop',
        },
        {
            id: 2,
            name: 'CINEMA & SERIES',
            slug: 'cinema',
            itemCount: 38,
            description: 'Movies & TV Legends',
            image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2600&auto=format&fit=crop',
        },
        {
            id: 3,
            name: 'VELOCITY',
            slug: 'velocity',
            itemCount: 42,
            description: 'F1 Tracks & JDM Cars',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2600&auto=format&fit=crop',
        },
        {
            id: 4,
            name: 'SHONEN JUMP',
            slug: 'shonen',
            itemCount: 56,
            description: 'Anime Action',
            image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2600&auto=format&fit=crop',
        },
        {
            id: 5,
            name: 'THE GRIND',
            slug: 'motivational',
            itemCount: 28,
            description: 'Motivational Quotes & Gym',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2600&auto=format&fit=crop',
        },
        {
            id: 6,
            name: 'ICONS',
            slug: 'music',
            itemCount: 32,
            description: 'Music Legends',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2600&auto=format&fit=crop',
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
                        <p className="mb-2 text-xs text-gray-400 md:text-sm">
                            {collection.description}
                        </p>
                        <p className="text-xs font-medium text-neon-gold transition-colors duration-300 group-hover:text-white">
                            View {collection.itemCount} Designs →
                        </p>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default CollectionsGrid;
