import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';

const HeroSection = () => {
    const ref = useRef(null);

    // Track scroll progress of the hero section
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    // Parallax transforms
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

    // Split headline into letters for stagger animation
    const headline = 'The Art of Ambience.';
    const words = headline.split(' ');

    // Container animation for staggering letters
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0.2,
            },
        },
    };

    // Individual letter animation
    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden">
            {/* Dark Industrial Background Image - Matte Wall Texture */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-[center_top]"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2600&auto=format&fit=crop')`,
                    y: backgroundY,
                }}
                initial={{ scale: 1.0 }}
                animate={{ scale: 1.1 }}
                transition={{
                    duration: 10,
                    ease: 'easeInOut',
                }}
            />

            {/* Dark Overlay for Text Contrast - Deep Black */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Gradient Fade at Bottom - Seamless Blend to Deep Black */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />

            {/* Content Container - Above Overlays, Full Width Edge-to-Edge */}
            <motion.div
                className="relative z-20 flex h-full w-full flex-col items-center justify-center px-4 md:px-8"
                style={{ y: headlineY }}
            >
                {/* Animated Main Headline - Massive & Premium */}
                <motion.h1
                    className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter text-center text-white w-full"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {words.map((word, wordIndex) => (
                        <span key={wordIndex} className="inline-block">
                            {word.split('').map((letter, letterIndex) => (
                                <motion.span
                                    key={`${wordIndex}-${letterIndex}`}
                                    variants={letterVariants}
                                    className={`inline-block ${word === 'Ambience.'
                                            ? 'drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]'
                                            : ''
                                        }`}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                            {wordIndex < words.length - 1 && (
                                <span className="inline-block">&nbsp;</span>
                            )}
                        </span>
                    ))}
                </motion.h1>

                {/* Animated Subheadline - SEO Optimized Premium Copy */}
                <motion.h2
                    className="mt-8 max-w-2xl text-center font-light text-lg md:text-xl text-gray-400 px-4 md:px-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 1.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    Transform your space with premium halo-lit wall art. Precision-cut matte black silhouettes engineered for the modern sanctuary.
                </motion.h2>

                {/* CTA Button */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 1.8,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {/* Explore Collection - Illuminated LED Button */}
                    <MagneticButton
                        href="/shop"
                        className="bg-brand-white px-12 py-4 rounded-full font-body text-sm tracking-widest text-black transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                    >
                        Explore the Collection
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
