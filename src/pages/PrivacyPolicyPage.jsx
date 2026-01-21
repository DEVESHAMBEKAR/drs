import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PRIVACY POLICY PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// ═══════════════════════════════════════════════════════════════════════════

const PrivacyPolicyPage = () => {
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
                    Privacy Policy
                </motion.h1>

                {/* Content */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p className="text-[#8E8E8E] leading-relaxed mb-6">
                        At <span className="text-white">Deep Root Studios</span>, we respect your privacy and are committed
                        to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
                    </p>

                    {/* Policy Cards */}
                    <div className="space-y-4">
                        {/* Data Collection */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Database className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Information We Collect</h3>
                                <ul className="text-[#8E8E8E] space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Name, email, phone number, and shipping address for order fulfillment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Payment information (processed securely via Razorpay)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Order history and preferences</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Usage */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Eye className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">How We Use Your Data</h3>
                                <ul className="text-[#8E8E8E] space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Processing and shipping your orders</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Communicating order updates and shipping notifications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Improving our products and services</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Sending promotional emails (only if you opt in)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Lock className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Data Security</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    We implement industry-standard security measures to protect your data:
                                </p>
                                <ul className="text-[#8E8E8E] mt-3 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span><span className="text-white">SSL encryption</span> on all pages</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span><span className="text-white">PCI-DSS compliant</span> payment processing via Razorpay</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>We never store your credit card information</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Third Parties */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Shield className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Third-Party Sharing</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    We only share your data with:
                                </p>
                                <ul className="text-[#8E8E8E] mt-3 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span><span className="text-white">Razorpay</span> - Payment processing</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full mt-2 flex-shrink-0"></span>
                                        <span><span className="text-white">Delhivery/BlueDart</span> - Shipping and delivery</span>
                                    </li>
                                </ul>
                                <p className="text-[#8E8E8E] mt-3">
                                    We <span className="text-white">never sell</span> your personal information to third parties.
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Mail className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Questions or Concerns?</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    For any privacy-related queries, please contact us at{' '}
                                    <a
                                        href="mailto:deveshambekar@myyahoo.com"
                                        className="text-white hover:underline"
                                    >
                                        deveshambekar@myyahoo.com
                                    </a>
                                </p>
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

export default PrivacyPolicyPage;
