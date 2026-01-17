import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interest: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', interest: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
    };

    const contactDetails = [
        {
            icon: Mail,
            label: 'Write to us',
            value: 'thedeeprootstudios@gmail.com',
            href: 'mailto:thedeeprootstudios@gmail.com',
        },
        {
            icon: MessageCircle,
            label: 'Quick Chat',
            value: '+91 95792 76597',
            href: 'tel:+919579276597',
        },
        {
            icon: MapPin,
            label: 'The Studio',
            value: 'Pune, Maharashtra, India',
            href: null,
        },
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-luxury-black pt-36 pb-20">
            <div className="mx-auto max-w-7xl px-6">
                {/* Two Column Layout */}
                <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* Left Column - Context/Info */}
                    <motion.div
                        className="space-y-12"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Headline */}
                        <motion.div variants={fadeInUp}>
                            <h1 className="font-heading text-2xl text-neon-gold md:text-4xl">
                                Let's Build Your Vision.
                            </h1>
                            <p className="mt-6 font-body text-lg leading-relaxed text-zinc-600 dark:text-text-muted">
                                From concept to glow. Whether you're commissioning a custom
                                anime silhouette or outfitting an entire gaming setup,
                                we engineer walls with spine.
                            </p>
                        </motion.div>

                        {/* Contact Details */}
                        <motion.div className="space-y-8" variants={fadeInUp}>
                            {contactDetails.map((detail, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-4"
                                    variants={fadeInUp}
                                >
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-neon-gold/30 bg-neon-gold/10 rounded-none">
                                        <detail.icon className="h-5 w-5 text-neon-gold" />
                                    </div>
                                    <div>
                                        <p className="font-body text-sm tracking-widest text-zinc-500 dark:text-gray-400">
                                            {detail.label}
                                        </p>
                                        {detail.href ? (
                                            <a
                                                href={detail.href}
                                                className="font-body text-lg text-zinc-900 dark:text-text-main transition-colors hover:text-neon-gold"
                                            >
                                                {detail.value}
                                            </a>
                                        ) : (
                                            <p className="font-body text-lg text-zinc-900 dark:text-text-main">
                                                {detail.value}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Decorative Line */}
                        <motion.div
                            className="hidden h-px w-full bg-gradient-to-r from-neon-gold/50 via-neon-gold/20 to-transparent lg:block"
                            variants={fadeInUp}
                        />
                    </motion.div>

                    {/* Right Column - The Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="border border-zinc-200 dark:border-luxury-border/20 bg-white/50 dark:bg-luxury-black/50 backdrop-blur-sm p-8 md:p-10">
                            <h2 className="mb-8 font-heading text-2xl text-zinc-900 dark:text-text-main">
                                Send us a Message
                            </h2>

                            {/* Success Message */}
                            {submitSuccess && (
                                <motion.div
                                    className="mb-6 border border-green-500/30 bg-green-500/10 p-4"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <p className="font-body text-sm text-green-400">
                                        ✓ Message sent successfully! We'll get back to you soon.
                                    </p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Name Field */}
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your Name"
                                        className="w-full border-b border-zinc-300 dark:border-gray-400/30 bg-transparent py-3 font-body text-zinc-900 dark:text-text-main placeholder-zinc-400 dark:placeholder-gray-400/50 transition-colors focus:border-white focus:outline-none"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                        className="w-full border-b border-zinc-300 dark:border-gray-400/30 bg-transparent py-3 font-body text-zinc-900 dark:text-text-main placeholder-zinc-400 dark:placeholder-gray-400/50 transition-colors focus:border-white focus:outline-none"
                                    />
                                </div>

                                {/* Interest Dropdown */}
                                <div>
                                    <select
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        required
                                        className="w-full appearance-none border-b border-zinc-300 dark:border-gray-400/30 bg-transparent py-3 font-body text-zinc-900 dark:text-text-main transition-colors focus:border-white focus:outline-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0 center',
                                        }}
                                    >
                                        <option value="" disabled className="bg-white dark:bg-luxury-black">
                                            Select your interest
                                        </option>
                                        <option value="anime-collection" className="bg-white dark:bg-luxury-black">
                                            Anime Collection
                                        </option>
                                        <option value="sports-collection" className="bg-white dark:bg-luxury-black">
                                            Sports Collection
                                        </option>
                                        <option value="custom-design" className="bg-white dark:bg-luxury-black">
                                            Custom Design
                                        </option>
                                    </select>
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder="Tell us what you need..."
                                        className="w-full resize-none border-b border-zinc-300 dark:border-gray-400/30 bg-transparent py-3 font-body text-zinc-900 dark:text-text-main placeholder-zinc-400 dark:placeholder-gray-400/50 transition-colors focus:border-white focus:outline-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center gap-2 bg-white rounded-none py-4 font-body text-sm tracking-widest text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a]" />
                                            SENDING...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            SEND MESSAGE
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
