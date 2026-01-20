import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * SplitHero Component
 * 
 * A 50/50 split hero section showcasing two product categories:
 * - Left: Acrylic (Anime/Pop Culture)
 * - Right: Wood (Artisan/Premium)
 * 
 * Features:
 * - Hover expansion effect (hovered side grows to 60%)
 * - New Deeproot Studios brand colors
 * - Framer Motion animations
 */

const SplitHero = () => {
    const [hoveredSide, setHoveredSide] = useState(null); // 'left' | 'right' | null

    // Calculate widths based on hover state
    const getLeftWidth = () => {
        if (hoveredSide === 'left') return '60%';
        if (hoveredSide === 'right') return '40%';
        return '50%';
    };

    const getRightWidth = () => {
        if (hoveredSide === 'right') return '60%';
        if (hoveredSide === 'left') return '40%';
        return '50%';
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* LEFT SIDE - ACRYLIC / ANIME */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <motion.div
                className="relative h-full bg-obsidian cursor-pointer overflow-hidden group"
                initial={{ width: '50%' }}
                animate={{ width: getLeftWidth() }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={() => setHoveredSide('left')}
                onMouseLeave={() => setHoveredSide(null)}
            >
                {/* Background Image - Acrylic/Anime Product Shot */}
                <div className="absolute inset-0">
                    <img
                        src="/acrylic-hero-bg.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-obsidian/60" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-transparent to-obsidian" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    {/* Category Tag */}
                    <motion.p
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-cold-silver mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Halo-Lit Series
                    </motion.p>

                    {/* Title */}
                    <motion.h2
                        className="font-display text-3xl md:text-5xl text-ash mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Acrylic<br />
                        <span className="text-cold-silver">Icons</span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        className="font-body text-sm text-stone mb-6 max-w-xs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Laser-cut precision. LED backlit.
                        Anime & pop culture silhouettes.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            to="/shop?material=acrylic"
                            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ash hover:text-cold-silver transition-colors group"
                        >
                            <span>Explore Collection</span>
                            <motion.span
                                animate={{ x: hoveredSide === 'left' ? 5 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                →
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>

                {/* Hover Indicator Line */}
                <motion.div
                    className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cold-silver to-transparent"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: hoveredSide === 'left' ? 0.8 : 0.3 }}
                />
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* RIGHT SIDE - WOOD / ARTISAN */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <motion.div
                className="relative h-full bg-charcoal cursor-pointer overflow-hidden group"
                initial={{ width: '50%' }}
                animate={{ width: getRightWidth() }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
            >
                {/* Background Image - Wood/Artisan Product Shot */}
                <div className="absolute inset-0">
                    <img
                        src="/wooden-hero-bg.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-charcoal/50" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    {/* Category Tag */}
                    <motion.p
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-deep-walnut mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Artisan Series
                    </motion.p>

                    {/* Title */}
                    <motion.h2
                        className="font-display text-3xl md:text-5xl text-ash mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Wooden<br />
                        <span className="text-deep-walnut">Craft</span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        className="font-body text-sm text-stone mb-6 max-w-xs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Hand-finished walnut & teak.
                        Warm LED glow. Timeless elegance.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            to="/shop?material=wood"
                            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ash hover:text-deep-walnut transition-colors group"
                        >
                            <span>Explore Collection</span>
                            <motion.span
                                animate={{ x: hoveredSide === 'right' ? 5 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                →
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>

                {/* Hover Indicator Line */}
                <motion.div
                    className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-deep-walnut to-transparent"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: hoveredSide === 'right' ? 0.8 : 0.3 }}
                />
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SCROLL INDICATOR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone">
                        Scroll
                    </span>
                    <div className="w-px h-8 bg-gradient-to-b from-stone to-transparent" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SplitHero;
