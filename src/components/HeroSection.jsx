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
    const headline = 'Walls with a Spine.';
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

            {/* Dark Overlay for Text Contrast - 50% Black */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Gradient Fade at Bottom - Seamless Blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

            {/* Content Container - Above Overlays, Full Width Edge-to-Edge */}
            <motion.div
                className="relative z-20 flex h-full w-full flex-col items-center justify-center px-4 md:px-8"
                style={{ y: headlineY }}
            >
                {/* Animated Main Headline with Letter Stagger - Massive Edge-to-Edge */}
                <motion.h1
                    className="font-heading text-[7vw] lg:text-[8vw] font-black leading-none tracking-tighter text-center text-white w-full"
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
                                    className={`inline-block ${word === 'Spine.' ? 'text-neon-gold' : ''
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

                {/* Animated Subheadline - Edgy Brand Copy */}
                <motion.p
                    className="mt-8 max-w-4xl text-center font-body text-base md:text-lg lg:text-xl tracking-wide text-gray-300 px-4 md:px-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 1.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    Bold silhouettes. Rigid precision. Give your space the backbone it deserves with our halo-lit acrylic art.
                </motion.p>

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
                        EXPLORE COLLECTION
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
