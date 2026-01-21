import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, ArrowLeft } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// ═══════════════════════════════════════════════════════════════════════════

const ContactPage = () => {
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
                    Contact the Studio
                </motion.h1>

                {/* Content */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p className="text-[#8E8E8E] leading-relaxed text-lg">
                        <span className="text-white font-medium">Deep Root Studios</span> operates as a design workshop,
                        crafting bespoke pieces with meticulous attention to detail.
                    </p>

                    {/* Contact Cards */}
                    <div className="grid gap-6 mt-10">
                        {/* Address */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <MapPin className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Studio Address</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    Near Zeal College Chowk,<br />
                                    Narhe, Pune - 411041<br />
                                    Maharashtra, India
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Mail className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Email</h3>
                                <a
                                    href="mailto:deveshambekar@myyahoo.com"
                                    className="text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors"
                                >
                                    thedeeprootstudios@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Phone className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">WhatsApp</h3>
                                <a
                                    href="https://wa.me/919579276597"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors"
                                >
                                    +91 9579276597
                                </a>
                            </div>
                        </div>

                        {/* Appointments */}
                        <div className="flex items-start gap-4 p-6 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                            <Clock className="w-6 h-6 text-[#F5F5F5] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-medium mb-2">Studio Visits</h3>
                                <p className="text-[#8E8E8E] leading-relaxed">
                                    By appointment only.<br />
                                    Please contact us to schedule a visit.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-[#666] text-sm italic mt-8 pt-8 border-t border-[#333]">
                        Response time: We typically respond within 24-48 hours during business days.
                    </p>
                </motion.div>

                {/* Merchant Legal Info - Required for Razorpay Compliance */}
                <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
                    <p className="text-xs text-[#1a1a1a]">
                        Merchant Legal Entity: Devesh Ambekar / Deep Root Studios. Registered Address: Narhe, Pune 411041.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
