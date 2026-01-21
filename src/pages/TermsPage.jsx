import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Shield, Home, FileText } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TERMS OF SERVICE PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// ═══════════════════════════════════════════════════════════════════════════

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-[#0E0E0E]">
            <div className="max-w-3xl mx-auto py-20 px-6">
                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors mb-12 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Title */}
                <motion.h1
                    className="text-3xl md:text-4xl font-serif font-bold text-[#F5F5F5] mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Terms of Service
                </motion.h1>

                {/* Content */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p className="text-[#8E8E8E] leading-relaxed mb-6">
                        By using the <span className="text-white">Deep Root Studios</span> website and purchasing our products,
                        you agree to the following terms and conditions.
                    </p>

                    {/* Terms Cards */}
                    <div className="space-y-4">
                        {/* Jurisdiction */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Scale className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Governing Law</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    These terms are governed by and construed in accordance with the laws of
                                    <span className="text-white font-medium"> Pune, Maharashtra, India</span>.
                                    Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune.
                                </p>
                            </div>
                        </div>

                        {/* IP Rights */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Shield className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Intellectual Property</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    <span className="text-white font-medium">Deep Root Studios</span> owns all intellectual
                                    property rights including but not limited to:
                                </p>
                                <ul className="text-[#8E8E8E] mt-3 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#F5F5F5] rounded-full"></span>
                                        <span>Product designs and patterns</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#F5F5F5] rounded-full"></span>
                                        <span>Brand logos and trademarks</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#F5F5F5] rounded-full"></span>
                                        <span>Website content and imagery</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#F5F5F5] rounded-full"></span>
                                        <span>Custom commission blueprints</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Product Usage */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Home className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Product Usage</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    All Deep Root Studios products are designed for <span className="text-white font-medium">indoor use only</span>.
                                    We are not liable for damage caused by outdoor exposure, water contact, or improper handling.
                                </p>
                            </div>
                        </div>

                        {/* General Terms */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <FileText className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">General Terms</h3>
                                <ul className="text-[#8E8E8E] space-y-3">
                                    <li className="leading-relaxed">
                                        • Prices are subject to change without prior notice.
                                    </li>
                                    <li className="leading-relaxed">
                                        • Product images are for representation; slight variations may occur.
                                    </li>
                                    <li className="leading-relaxed">
                                        • We reserve the right to refuse service to anyone.
                                    </li>
                                    <li className="leading-relaxed">
                                        • By placing an order, you confirm you are 18 years or older.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <p className="text-[#666] text-sm italic mt-8 pt-8 border-t border-[#333]">
                        Last updated: January 2026
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
