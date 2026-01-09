import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Building2, ArrowRight } from 'lucide-react';

const CorporateShowcase = () => {
    return (
        <section className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c0a060' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Building2 className="w-6 h-6 text-[#c0a060]" />
                        <span className="font-body text-sm tracking-widest text-[#c0a060] uppercase">
                            Corporate Gifting
                        </span>
                    </div>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-mist mb-4">
                        Your Brand.{' '}
                        <span className="text-[#c0a060]">Carved in Wood.</span>
                    </h2>
                    <p className="font-body text-lg text-smoke max-w-2xl mx-auto">
                        Impress clients, reward teams, and leave a lasting impression with custom-branded
                        wooden accessories that speak volumes about your company's values.
                    </p>
                </motion.div>

                {/* Split Screen Comparison */}
                <motion.div
                    className="relative mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 rounded-xl overflow-hidden border border-[#333]">
                        {/* Left - Plain Stand */}
                        <div className="relative group">
                            <div className="aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                                <img
                                    src="/laptop_stand_plain.webp"
                                    alt="Standard wooden laptop stand"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            {/* Label */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <span className="font-body text-xs tracking-widest text-smoke/80 uppercase">
                                    Before
                                </span>
                                <h3 className="font-heading text-xl text-mist mt-1">
                                    Standard Product
                                </h3>
                            </div>
                        </div>

                        {/* Right - Branded Stand */}
                        <div className="relative group">
                            <div className="aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                                <img
                                    src="/laptop_stand_branded.webp"
                                    alt="Custom branded wooden laptop stand with company logo"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            {/* Label */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <span className="font-body text-xs tracking-widest text-[#c0a060] uppercase">
                                    After
                                </span>
                                <h3 className="font-heading text-xl text-[#c0a060] mt-1">
                                    Your Brand, Laser-Engraved
                                </h3>
                            </div>
                            {/* Highlight Badge */}
                            <div className="absolute top-4 right-4 bg-[#c0a060] text-black px-3 py-1 rounded-full">
                                <span className="font-body text-xs font-semibold tracking-wide">
                                    CUSTOMIZED
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Arrow Divider (visible on desktop) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-16 h-16 rounded-full bg-[#c0a060] flex items-center justify-center shadow-lg">
                            <ArrowRight className="w-8 h-8 text-black" />
                        </div>
                    </div>
                </motion.div>

                {/* Features & CTA */}
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#1a1a1a] border border-[#333] rounded-xl p-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {/* Features */}
                    <div className="flex flex-wrap gap-6 md:gap-10">
                        <div className="text-center md:text-left">
                            <p className="font-heading text-2xl text-[#c0a060]">50+</p>
                            <p className="font-body text-sm text-smoke">Min Order Qty</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-heading text-2xl text-[#c0a060]">15%</p>
                            <p className="font-body text-sm text-smoke">Bulk Discount</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-heading text-2xl text-[#c0a060]">Free</p>
                            <p className="font-body text-sm text-smoke">Logo Engraving</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-heading text-2xl text-[#c0a060]">7 Days</p>
                            <p className="font-body text-sm text-smoke">Turnaround</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="/corporate-catalog.pdf"
                            download
                            className="flex items-center justify-center gap-2 bg-[#c0a060] hover:bg-[#b09050] text-black px-6 py-3 rounded-lg font-body text-sm tracking-widest transition-all duration-300"
                        >
                            <Download className="w-4 h-4" />
                            DOWNLOAD CATALOG
                        </a>
                        <Link
                            to="/bulk"
                            className="flex items-center justify-center gap-2 border border-[#c0a060] text-[#c0a060] hover:bg-[#c0a060] hover:text-black px-6 py-3 rounded-lg font-body text-sm tracking-widest transition-all duration-300"
                        >
                            GET A QUOTE
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>

                {/* Trust Logos */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <p className="font-body text-xs tracking-widest text-smoke/50 uppercase mb-6">
                        Trusted by teams at
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
                        {/* Placeholder company names - you can replace with actual logos */}
                        {['Google', 'Infosys', 'Tata', 'Wipro', 'Microsoft'].map((company) => (
                            <span
                                key={company}
                                className="font-heading text-xl md:text-2xl text-smoke/60"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CorporateShowcase;
