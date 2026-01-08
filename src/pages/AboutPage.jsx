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
            title: 'Handcrafted in Pune',
            description:
                'Every piece is shaped by skilled artisans who understand the language of wood.',
        },
        {
            title: 'Sustainable Timber',
            description:
                'We source responsibly, ensuring every grain tells a story of ethical forestry.',
        },
        {
            title: 'Uniquely Yours',
            description:
                'No two pieces are alike. Your personalization makes each creation one-of-a-kind.',
        },
    ];

    return (
        <div className="min-h-screen bg-deep-charcoal pt-28 pb-20">
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
                        className="font-heading text-5xl leading-tight text-mist md:text-6xl lg:text-7xl"
                        variants={fadeInUp}
                    >
                        We don't just carve wood.
                        <br />
                        <span className="text-antique-brass">We carve silence.</span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        className="mt-8 font-body text-xl tracking-widest text-smoke md:text-2xl"
                        variants={fadeInUp}
                    >
                        Analog Soul. Digital World.
                    </motion.p>
                </motion.div>

                {/* Story Section */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="mx-auto max-w-3xl">
                        <p className="font-body text-lg leading-relaxed text-smoke md:text-xl">
                            In a world buzzing with notifications, Deep Root Studios was born
                            from a simple desire: to bring the forest back to the desk. We
                            believe that the objects you hold every day—your phone stand,
                            your pen holder, your speaker—should have a soul. They shouldn't
                            just be manufactured; they should be grown.
                        </p>
                        <p className="mt-8 font-body text-lg leading-relaxed text-smoke md:text-xl">
                            We select timber with character—Walnut, Teak, and Oak that
                            carries the history of decades in its grain. We don't hide the
                            knots or the imperfections; we highlight them. They are the
                            fingerprints of nature.
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
                            className="border border-smoke/20 bg-soft-black p-8 text-center"
                            variants={fadeInUp}
                        >
                            <h3 className="mb-4 font-heading text-2xl text-antique-brass">
                                {value.title}
                            </h3>
                            <p className="font-body text-sm leading-relaxed text-smoke">
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
                        <p className="mt-6 font-body text-sm tracking-widest text-antique-brass">
                            — Deep Root Studios
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
