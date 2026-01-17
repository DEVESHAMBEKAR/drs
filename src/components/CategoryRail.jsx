import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Trophy, Zap, Shield, Wand2 } from 'lucide-react';

const CategoryRail = () => {
    const categories = [
        {
            id: 1,
            name: 'THE SHONEN DROP',
            slug: 'anime',
            icon: Sparkles,
            gradient: 'from-[#1a1a1a] to-[#050505]',
        },
        {
            id: 2,
            name: 'STADIUM LEGENDS',
            slug: 'sports',
            icon: Trophy,
            gradient: 'from-[#1a1a1a] to-[#050505]',
        },
        {
            id: 3,
            name: 'TRACKSIDE',
            slug: 'f1',
            icon: Zap,
            gradient: 'from-[#1a1a1a] to-[#050505]',
        },
        {
            id: 4,
            name: 'VIGILANTES',
            slug: 'superheroes',
            icon: Shield,
            gradient: 'from-[#1a1a1a] to-[#050505]',
        },
        {
            id: 5,
            name: 'BESPOKE',
            slug: 'custom',
            icon: Wand2,
            gradient: 'from-[#1a1a1a] to-[#050505]',
        },
    ];

    return (
        <section className="bg-white dark:bg-luxury-black py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Title */}
                <motion.h2
                    className="mb-8 font-heading text-2xl font-bold tracking-tight text-zinc-900 dark:text-text-main md:text-3xl lg:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    BROWSE BY FACTION
                </motion.h2>

                {/* Desktop Grid / Mobile Scroll */}
                <div className="relative">
                    {/* Mobile: Horizontal Scroll */}
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:hidden">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Desktop: Grid */}
                    <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Individual Category Card Component
const CategoryCard = ({ category, index }) => {
    const Icon = category.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="min-w-[280px] snap-start md:min-w-0"
        >
            <Link to={`/shop?category=${category.slug}`}>
                <motion.div
                    className={`group relative aspect-video overflow-hidden border border-luxury-border bg-gradient-to-br ${category.gradient} rounded-none transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Background Icon - Faded */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                        <Icon className="h-32 w-32 text-neon-gold md:h-40 md:w-40" />
                    </div>

                    {/* Category Name - Centered */}
                    <div className="relative z-10 flex h-full items-center justify-center p-6">
                        <h3 className="text-center font-heading text-lg font-black uppercase tracking-tight text-text-main transition-colors duration-300 group-hover:text-neon-gold md:text-xl lg:text-2xl">
                            {category.name}
                        </h3>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border border-transparent transition-all duration-300 group-hover:border-neon-gold" />
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default CategoryRail;
