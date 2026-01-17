import { motion } from 'framer-motion';

const AboutPage = () => {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
        },
    };

    const values = [
        {
            title: 'Dual-Layer Construction',
            description:
                'Matte black acrylic front, clear diffusion back. The "Sandwich Method" creates depth and glow.',
        },
        {
            title: '120 LEDs/meter',
            description:
                'High-density lighting eliminates hotspots. Your art glows evenly, edge to edge.',
        },
        {
            title: 'Stainless Steel Standoffs',
            description:
                '1-inch floating mount. Your art hovers off the wall with architectural precision.',
        },
    ];

    return (
        <div className="min-h-screen bg-deep-charcoal pt-36 pb-20">
            <div className="mx-auto max-w-5xl px-6">
                {/* Hero Section */}
                <motion.div
                    className="mb-20 text-center"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Main Headline */}
                    <motion.h1
                        className="font-heading text-3xl leading-tight text-mist md:text-5xl lg:text-7xl"
                        variants={fadeInUp}
                    >
                        We don't just hang art.
                        <br />
                        <span className="text-black dark:text-white font-bold">We engineer backbones.</span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        className="mt-8 font-body text-xl tracking-widest text-smoke md:text-2xl"
                        variants={fadeInUp}
                    >
                        Rigid. Precise. Illuminated.
                    </motion.p>
                </motion.div>

                {/* Mission/Philosophy Section - The Art of Ambience */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="mx-auto max-w-3xl">
                        <h2 className="font-heading text-3xl font-bold text-black dark:text-white mb-8 md:text-4xl">
                            The Art of Ambience.
                        </h2>
                        <p className="font-body text-lg leading-relaxed text-text-muted md:text-xl">
                            Most decor is passive. It sits there. We build art that pushes back.
                            Our dual-layer acrylic construction isn't just about durability—it's
                            about giving your space a backbone. Rigid, precise, and impossible to ignore.
                        </p>
                    </div>
                </motion.div>

                {/* Image Divider */}
                <motion.div
                    className="mb-20 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.7 }}
                >
                    <div className="relative aspect-[21/9] overflow-hidden bg-soft-black">
                        <img
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2832&auto=format&fit=crop"
                            alt="Wood craftsmanship"
                            className="h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-transparent to-transparent" />
                    </div>
                </motion.div>

                {/* Values Grid */}
                <motion.div
                    className="mb-20 grid gap-8 md:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            className="border border-luxury-border bg-luxury-card p-8 text-center rounded-none"
                            variants={fadeInUp}
                        >
                            <h3 className="mb-4 font-heading text-2xl text-black dark:text-white">
                                {value.title}
                            </h3>
                            <p className="font-body text-sm leading-relaxed text-text-muted">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Signature/Founder Note */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <div className="mx-auto max-w-2xl border-t border-smoke/20 pt-12">
                        <p className="font-heading text-2xl italic text-mist md:text-3xl">
                            "Designed for the modern thinker."
                        </p>
                        <p className="mt-6 font-body text-sm tracking-widest text-gray-400">
                            — Deep Root Studios
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
