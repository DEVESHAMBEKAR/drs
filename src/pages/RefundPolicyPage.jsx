import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, XCircle, RefreshCw, CheckCircle, Ban } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// REFUND POLICY PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// ═══════════════════════════════════════════════════════════════════════════

const RefundPolicyPage = () => {
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
                    Cancellation & Refund Policy
                </motion.h1>

                {/* Content */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p className="text-[#8E8E8E] leading-relaxed mb-6">
                        As <span className="text-white">Deep Root Studios</span> specializes in custom-crafted pieces,
                        our cancellation and refund policy reflects the bespoke nature of our work.
                    </p>

                    {/* Policy Cards */}
                    <div className="space-y-4">
                        {/* Cancellations */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <XCircle className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Cancellations</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    Cancellations are allowed <span className="text-white font-medium">within 24 hours</span> of
                                    placing your order only. After this window, production begins and cancellation is not possible.
                                </p>
                            </div>
                        </div>

                        {/* No Returns */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Ban className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Returns Policy</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    <span className="text-white font-medium">No returns</span> are accepted for
                                    "change of mind" or personal preference. Each piece is a <span className="text-white">custom commission</span> made
                                    specifically for your order.
                                </p>
                            </div>
                        </div>

                        {/* Defects */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Defective Items</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    For <span className="text-white font-medium">broken items</span> or <span className="text-white font-medium">lighting failures</span>:
                                </p>
                                <ul className="text-[#8E8E8E] mt-3 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                        <span>Full refund, or</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                        <span>Free replacement at no extra cost</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Replacement Process */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <RefreshCw className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Replacement Process</h3>
                                <ol className="text-[#8E8E8E] mt-3 space-y-2 list-decimal list-inside">
                                    <li>Contact us within 24 hours of delivery</li>
                                    <li>Share an unboxing video showing the defect</li>
                                    <li>We'll ship a replacement immediately</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-[#666] text-sm italic mt-8 pt-8 border-t border-[#333]">
                        For any refund-related queries, please email us at deveshambekar@myyahoo.com
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
