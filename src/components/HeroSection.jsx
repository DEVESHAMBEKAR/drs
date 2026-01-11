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
    const headline = 'Meaning Carved in Wood.';
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
            {/* Animated Background Image with Parallax - Wood Grain/Desk Setup */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2940&auto=format&fit=crop')`,
                    y: backgroundY,
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
            <motion.div
                className="relative z-10 flex h-full flex-col items-center justify-center px-6"
                style={{ y: headlineY }}
            >
                {/* Animated Main Headline with Letter Stagger */}
                <motion.h1
                    className="font-heading text-4xl tracking-wide text-mist md:text-6xl lg:text-8xl"
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
                                    className="inline-block"
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

                {/* Animated Subheadline */}
                <motion.p
                    className="mt-6 max-w-2xl text-center font-body text-lg tracking-wide text-smoke md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 1.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    Handcrafted organizers and decor, personalized for your story.
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
                    {/* Explore Collection - Solid Brass Button with Magnetic Effect */}
                    <MagneticButton
                        href="/shop"
                        className="bg-antique-brass px-12 py-4 font-body text-sm tracking-widest text-deep-charcoal transition-all duration-300 hover:shadow-[0_0_20px_rgba(192,160,96,0.6)]"
                    >
                        EXPLORE COLLECTION
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
