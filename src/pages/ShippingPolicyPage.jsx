import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, Clock, AlertTriangle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// SHIPPING POLICY PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// ═══════════════════════════════════════════════════════════════════════════

const ShippingPolicyPage = () => {
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
                    Shipping & Delivery Protocol
                </motion.h1>

                {/* Content */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p className="text-[#8E8E8E] leading-relaxed mb-6">
                        Each piece from <span className="text-white">Deep Root Studios</span> is handcrafted with precision.
                        Our shipping timeline reflects our commitment to quality.
                    </p>

                    {/* Timeline Cards */}
                    <div className="space-y-4">
                        {/* Production */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Package className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Production Time</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    <span className="text-white font-medium">3-5 Business Days</span><br />
                                    Commission-based crafting. Each piece is made to order.
                                </p>
                            </div>
                        </div>

                        {/* Transit */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Truck className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Transit Time</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    <span className="text-white font-medium">3-5 Business Days</span><br />
                                    Shipped via <span className="text-white">Delhivery</span> or <span className="text-white">BlueDart</span> with tracking.
                                </p>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Clock className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Total Delivery Time</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    <span className="text-white font-medium">7-10 Business Days</span><br />
                                    From order confirmation to doorstep delivery.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Damages Section */}
                    <div className="mt-10 pt-8 border-t border-[#333]">
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Damaged Items</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    If your order arrives damaged, email us <span className="text-white">within 24 hours</span> with
                                    an <span className="text-white">unboxing video</span> for a <span className="text-white">free replacement</span>.
                                    No questions asked.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-[#666] text-sm italic mt-8">
                        Shipping is free on orders above ₹999. Standard shipping charges apply otherwise.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;
