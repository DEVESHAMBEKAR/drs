import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const HomeStoriesSection = () => {
    // Mock customer stories data
    const stories = [
        {
            id: 1,
            name: 'Rohan M.',
            location: 'Bangalore',
            quote: "I work from home 10 hours a day. The walnut organizer didn't just clean my desk, it actually made me want to sit there. It feels grounded.",
            product: 'Ordered the Walnut Organizer',
            verified: true
        },
        {
            id: 2,
            name: 'Aditi S.',
            location: 'Mumbai',
            quote: "The Stepwell Amp is magic. No cables, just physics. It's the first thing visitors ask about when they enter my living room.",
            product: 'Ordered the Stepwell Amp',
            verified: true
        },
        {
            id: 3,
            name: 'Vikram J.',
            location: 'Pune',
            quote: 'Bought this as a Diwali gift for my dad. He usually hates gadgets, but he loves this because it feels like old-school quality.',
            product: 'Ordered as a Gift',
            verified: true
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    };

    return (
        <section className="bg-[#0a0a0a] py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-serif text-4xl md:text-5xl text-[#c0a060] mb-4">
                        Stories from the Desk
                    </h2>
                    <p className="font-body text-base md:text-lg text-[#a3a3a3]">
                        See how others are carving out their space.
                    </p>
                </motion.div>

                {/* Stories Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {stories.map((story) => (
                        <motion.div
                            key={story.id}
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                            className="bg-[#18181b] border border-[#c0a060]/20 p-8 transition-all duration-300 hover:border-[#c0a060]/50 hover:shadow-lg hover:shadow-[#c0a060]/10"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <Quote className="w-10 h-10 text-[#c0a060]" strokeWidth={1.5} />
                            </div>

                            {/* Review Text */}
                            <blockquote className="mb-8">
                                <p className="font-serif italic text-[#e5e5e5] text-base md:text-lg leading-relaxed">
                                    "{story.quote}"
                                </p>
                            </blockquote>

                            {/* User Info */}
                            <div className="border-t border-[#c0a060]/10 pt-6">
                                {/* Name and Verified Badge */}
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-body font-medium text-[#e5e5e5]">
                                        {story.name}
                                    </h4>
                                    {story.verified && (
                                        <span className="inline-flex items-center gap-1 bg-[#c0a060]/10 px-2 py-0.5 rounded-full">
                                            <svg
                                                className="w-3 h-3 text-[#c0a060]"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="font-body text-xs text-[#c0a060]">
                                                Verified Buyer
                                            </span>
                                        </span>
                                    )}
                                </div>

                                {/* Location */}
                                <p className="font-body text-sm text-[#737373] mb-3">
                                    {story.location}
                                </p>

                                {/* Product Ordered */}
                                <p className="font-body text-xs text-[#a3a3a3] italic">
                                    {story.product}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HomeStoriesSection;
