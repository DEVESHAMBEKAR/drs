import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Package,
    Mail,
    ArrowRight,
    Home,
    ShoppingBag
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// ORDER SUCCESS PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// ═══════════════════════════════════════════════════════════════════════════

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get order details from navigation state
    const orderDetails = location.state || {};
    const { orderId, paymentId, amount, email, items } = orderDetails;

    // Redirect if no order details (direct access)
    useEffect(() => {
        if (!orderId && !paymentId) {
            // Allow viewing page for demo purposes, but could redirect
            console.log('No order details in state - page accessed directly');
        }
    }, [orderId, paymentId, navigate]);

    const formatPrice = (price) => {
        if (!price) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    const checkmarkVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.3
            }
        }
    };

    return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-12">
            <motion.div
                className="max-w-lg w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Success Checkmark Animation */}
                <motion.div
                    className="mb-8"
                    variants={checkmarkVariants}
                >
                    <div className="relative inline-block">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />

                        {/* Checkmark circle */}
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </motion.div>

                {/* Thank You Message */}
                <motion.div variants={itemVariants} className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-ash mb-3">
                        Thank You!
                    </h1>
                    <p className="text-xl text-stone">
                        Your order has been confirmed
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-charcoal border border-stone-800 rounded-lg p-6 mb-8"
                >
                    {/* Order ID */}
                    <div className="flex items-center justify-between py-3 border-b border-stone-800">
                        <span className="text-stone text-sm">Order ID</span>
                        <span className="text-ash font-mono text-sm">
                            {orderId || 'DRS_' + Date.now()}
                        </span>
                    </div>

                    {/* Payment ID */}
                    {paymentId && (
                        <div className="flex items-center justify-between py-3 border-b border-stone-800">
                            <span className="text-stone text-sm">Payment ID</span>
                            <span className="text-ash font-mono text-sm truncate max-w-[180px]">
                                {paymentId}
                            </span>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="flex items-center justify-between py-3 border-b border-stone-800">
                        <span className="text-stone text-sm">Amount Paid</span>
                        <span className="text-green-400 font-semibold">
                            {formatPrice(amount) || '₹17,495'}
                        </span>
                    </div>

                    {/* Items */}
                    <div className="flex items-center justify-between py-3">
                        <span className="text-stone text-sm">Items</span>
                        <span className="text-ash">
                            {items || 3} {(items || 3) === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </motion.div>

                {/* Email Notification */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center gap-3 mb-8 p-4 bg-stone-900/50 border border-stone-800 rounded-lg"
                >
                    <Mail className="w-5 h-5 text-cold-silver" />
                    <p className="text-stone text-sm">
                        Confirmation sent to{' '}
                        <span className="text-ash">{email || 'your email'}</span>
                    </p>
                </motion.div>

                {/* What's Next Section */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-ash font-medium mb-4">What happens next?</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 text-left p-3 bg-stone-900/30 rounded-lg">
                            <div className="w-8 h-8 bg-ash/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-ash text-sm font-medium">1</span>
                            </div>
                            <div>
                                <p className="text-ash text-sm font-medium">Order Processing</p>
                                <p className="text-stone text-xs">We're preparing your handcrafted items</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-left p-3 bg-stone-900/30 rounded-lg">
                            <div className="w-8 h-8 bg-ash/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-ash text-sm font-medium">2</span>
                            </div>
                            <div>
                                <p className="text-ash text-sm font-medium">Shipping Update</p>
                                <p className="text-stone text-xs">You'll receive tracking details via email</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-left p-3 bg-stone-900/30 rounded-lg">
                            <div className="w-8 h-8 bg-ash/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-ash text-sm font-medium">3</span>
                            </div>
                            <div>
                                <p className="text-ash text-sm font-medium">Delivery</p>
                                <p className="text-stone text-xs">Estimated delivery in 5-7 business days</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        to="/account/orders"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-ash text-obsidian font-medium rounded-md hover:bg-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,245,245,0.2)]"
                    >
                        <Package className="w-5 h-5" />
                        <span>Track Order</span>
                    </Link>
                    <Link
                        to="/shop"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-stone-700 text-ash font-medium rounded-md hover:border-ash hover:bg-ash/5 transition-all duration-300"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Continue Shopping</span>
                    </Link>
                </motion.div>

                {/* Home Link */}
                <motion.div variants={itemVariants} className="mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-stone hover:text-ash transition-colors text-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return to Home</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Support Note */}
                <motion.p
                    variants={itemVariants}
                    className="mt-8 text-stone text-xs"
                >
                    Need help? Contact us at{' '}
                    <a
                        href="mailto:support@deeprootstudios.com"
                        className="text-cold-silver hover:text-ash underline transition-colors"
                    >
                        support@deeprootstudios.com
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage;
