import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Animated Background Image with Zoom Effect - Wood Grain/Desk Setup */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2940&auto=format&fit=crop')`,
                }}
                initial={{ scale: 1.0 }}
                animate={{ scale: 1.1 }}
                transition={{
                    duration: 10,
                    ease: 'easeInOut',
                }}
            />

            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

            {/* Content Container */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
                {/* Animated Main Headline */}
                <motion.h1
                    className="font-heading text-6xl tracking-wide text-mist md:text-7xl lg:text-8xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    Meaning Carved in Wood.
                </motion.h1>

                {/* Animated Subheadline */}
                <motion.p
                    className="mt-6 max-w-2xl text-center font-body text-lg tracking-wide text-smoke md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 0.3,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    Handcrafted organizers and decor, personalized for your story.
                </motion.p>

                {/* Dual CTA Buttons - Side by Side */}
                <motion.div
                    className="mt-16 flex flex-col gap-4 sm:flex-row sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 0.6,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {/* Shop For Him - Solid Brass Button */}
                    <motion.button
                        className="bg-antique-brass px-10 py-4 font-body text-sm tracking-widest text-deep-charcoal transition-all duration-300"
                        whileHover={{
                            boxShadow: '0 0 20px rgba(192, 160, 96, 0.6)',
                            scale: 1.05,
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        SHOP FOR HIM
                    </motion.button>

                    {/* Shop For Her - Outline Style Button */}
                    <motion.button
                        className="border-2 border-antique-brass bg-transparent px-10 py-4 font-body text-sm tracking-widest text-antique-brass transition-all duration-300 hover:bg-antique-brass/10"
                        whileHover={{
                            boxShadow: '0 0 20px rgba(192, 160, 96, 0.4)',
                            scale: 1.05,
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        SHOP FOR HER
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
