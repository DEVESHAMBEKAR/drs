import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Package,
    Mail,
    ArrowRight,
    Home,
    ShoppingBag,
    AlertTriangle,
    XCircle,
    Truck,
    Phone,
    RefreshCw
} from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';

// ═══════════════════════════════════════════════════════════════════════════
// ORDER SUCCESS PAGE - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// Shows order details ONLY if order was successfully created in Shopify
// ═══════════════════════════════════════════════════════════════════════════

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useShopify();

    // Get order details from navigation state (passed from checkout)
    const stateDetails = location.state || {};
    const {
        orderCreated,
        orderError,
        orderId,
        orderNumber,
        paymentId,
        amount,
        email,
        shopifyOrderId,
        orderStatusUrl,
        cartItems,
        shippingAddress,
        isDevelopmentMode
    } = stateDetails;

    // Determine display mode
    const isSuccess = orderCreated === true;
    const isError = orderCreated === false;
    const items = cartItems || [];
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Clear cart on successful order
    useEffect(() => {
        if (isSuccess && clearCart) {
            clearCart();
        }
    }, [isSuccess, clearCart]);

    // Redirect if no state (direct access)
    useEffect(() => {
        if (!location.state) {
            console.log('No order state - page accessed directly');
        }
    }, [location.state]);

    const formatPrice = (price) => {
        if (!price) return '₹0';
        const numericPrice = typeof price === 'object' ? price.amount : price;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numericPrice);
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

    // ═══════════════════════════════════════════════════════════════════════════
    // ERROR STATE - Order creation failed
    // ═══════════════════════════════════════════════════════════════════════════
    if (isError) {
        return (
            <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-4 py-12">
                <motion.div
                    className="max-w-lg w-full text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Error Icon */}
                    <motion.div
                        className="mb-8"
                        variants={checkmarkVariants}
                    >
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                                <XCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F5F5F5] mb-3">
                            Unable to Place Order
                        </h1>
                        <p className="text-xl text-[#8E8E8E]">
                            Something went wrong
                        </p>
                    </motion.div>

                    {/* Error Details Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#1C1C1C] border border-red-500/30 rounded-lg p-6 mb-8"
                    >
                        <div className="flex items-start gap-3 text-left">
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-medium mb-2">Order Creation Failed</p>
                                <p className="text-[#8E8E8E] text-sm">
                                    {orderError || 'We were unable to create your order in our system. Your payment was processed but the order could not be completed.'}
                                </p>
                            </div>
                        </div>

                        {/* Payment Info if available */}
                        {paymentId && (
                            <div className="mt-4 pt-4 border-t border-[#333]">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-[#8E8E8E] text-sm">Payment ID</span>
                                    <span className="text-[#F5F5F5] font-mono text-sm">{paymentId}</span>
                                </div>
                                {amount && (
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[#8E8E8E] text-sm">Amount</span>
                                        <span className="text-[#F5F5F5] font-medium">{formatPrice(amount)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Contact Support */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8"
                    >
                        <p className="text-amber-400 text-sm">
                            Please contact us immediately with your Payment ID for assistance.
                            We will ensure your order is processed or your payment is refunded.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <a
                            href="mailto:thedeeprootstudios@gmail.com?subject=Order%20Creation%20Failed&body=Payment%20ID:%20${paymentId}"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F5F5] text-[#0E0E0E] font-medium rounded-md hover:bg-white transition-all duration-300"
                        >
                            <Mail className="w-5 h-5" />
                            <span>Contact Support</span>
                        </a>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#444] text-[#F5F5F5] font-medium rounded-md hover:border-[#666] hover:bg-[#1C1C1C] transition-all duration-300"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Try Again</span>
                        </button>
                    </motion.div>

                    {/* Home Link */}
                    <motion.div variants={itemVariants} className="mt-8">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors text-sm"
                        >
                            <Home className="w-4 h-4" />
                            <span>Return to Home</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUCCESS STATE - Order created successfully
    // ═══════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-4 py-12">
            <motion.div
                className="max-w-xl w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Development Mode Banner */}
                {isDevelopmentMode && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 flex items-center justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                    >
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <p className="text-amber-400 text-sm">Development Mode - Payment simulated</p>
                    </motion.div>
                )}

                {/* Order Confirmed Badge */}
                {isSuccess && !isDevelopmentMode && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-green-400 text-sm">Order confirmed in Shopify</p>
                    </motion.div>
                )}

                {/* Success Checkmark Animation */}
                <motion.div
                    className="mb-8"
                    variants={checkmarkVariants}
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </motion.div>

                {/* Thank You Message */}
                <motion.div variants={itemVariants} className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F5F5F5] mb-3">
                        Thank You!
                    </h1>
                    <p className="text-xl text-[#8E8E8E]">
                        Your order has been placed successfully
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-[#1C1C1C] border border-[#333] rounded-lg p-6 mb-6"
                >
                    {/* Order ID */}
                    <div className="flex items-center justify-between py-3 border-b border-[#333]">
                        <span className="text-[#8E8E8E] text-sm">Order ID</span>
                        <span className="text-[#F5F5F5] font-mono text-sm">
                            {orderId || 'Processing...'}
                        </span>
                    </div>

                    {/* Order Number */}
                    {orderNumber && (
                        <div className="flex items-center justify-between py-3 border-b border-[#333]">
                            <span className="text-[#8E8E8E] text-sm">Order Number</span>
                            <span className="text-[#F5F5F5] font-mono text-sm">
                                #{orderNumber}
                            </span>
                        </div>
                    )}

                    {/* Payment ID */}
                    {paymentId && (
                        <div className="flex items-center justify-between py-3 border-b border-[#333]">
                            <span className="text-[#8E8E8E] text-sm">Payment ID</span>
                            <span className="text-[#F5F5F5] font-mono text-xs truncate max-w-[180px]">
                                {paymentId}
                            </span>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="flex items-center justify-between py-3 border-b border-[#333]">
                        <span className="text-[#8E8E8E] text-sm">Amount Paid</span>
                        <span className="text-green-400 font-semibold">
                            {formatPrice(amount)}
                        </span>
                    </div>

                    {/* Items Count */}
                    <div className="flex items-center justify-between py-3">
                        <span className="text-[#8E8E8E] text-sm">Items</span>
                        <span className="text-[#F5F5F5]">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════════
                    ORDER LINE ITEMS
                    ═══════════════════════════════════════════════════════════ */}
                {items.length > 0 && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#1C1C1C] border border-[#333] rounded-lg p-6 mb-6"
                    >
                        <h3 className="text-[#F5F5F5] font-medium mb-4 text-left flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Order Items
                        </h3>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-[#2a2a2a] rounded-md overflow-hidden flex-shrink-0 border border-[#333]">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-[#555]" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Product Info */}
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-[#F5F5F5] text-sm font-medium truncate">
                                            {item.title}
                                        </p>
                                        {item.variantTitle && item.variantTitle !== 'Default Title' && (
                                            <p className="text-[#666] text-xs">{item.variantTitle}</p>
                                        )}
                                        {item.customAttributes?.length > 0 && (
                                            <div className="mt-1">
                                                {item.customAttributes.map((attr, idx) => (
                                                    <p key={idx} className="text-[#8E8E8E] text-xs">
                                                        {attr.key}: {attr.value}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-[#8E8E8E] text-xs mt-1">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    {/* Price */}
                                    <div className="text-right">
                                        <span className="text-[#F5F5F5] text-sm font-medium">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    SHIPPING ADDRESS
                    ═══════════════════════════════════════════════════════════ */}
                {shippingAddress && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#1C1C1C] border border-[#333] rounded-lg p-6 mb-6 text-left"
                    >
                        <h3 className="text-[#F5F5F5] font-medium mb-3 flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Shipping To
                        </h3>
                        <div className="text-[#8E8E8E] text-sm space-y-1">
                            <p className="text-[#F5F5F5] font-medium">
                                {shippingAddress.firstName} {shippingAddress.lastName}
                            </p>
                            <p>{shippingAddress.address1}</p>
                            {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                            <p>
                                {shippingAddress.city}, {shippingAddress.province} - {shippingAddress.zip}
                            </p>
                            <p>{shippingAddress.country}</p>
                            {shippingAddress.phone && (
                                <p className="flex items-center gap-2 text-[#666] mt-2">
                                    <Phone className="w-3 h-3" />
                                    {shippingAddress.phone}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Email Notification */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center gap-3 mb-8 p-4 bg-[#1C1C1C]/50 border border-[#333] rounded-lg"
                >
                    <Mail className="w-5 h-5 text-[#BFC2C7]" />
                    <p className="text-[#8E8E8E] text-sm">
                        Confirmation sent to{' '}
                        <span className="text-[#F5F5F5]">{email || 'your email'}</span>
                    </p>
                </motion.div>

                {/* What's Next Section */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-[#F5F5F5] font-medium mb-4">What happens next?</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 text-left p-3 bg-[#1C1C1C]/30 rounded-lg border border-[#222]">
                            <div className="w-8 h-8 bg-[#F5F5F5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[#F5F5F5] text-sm font-medium">1</span>
                            </div>
                            <div>
                                <p className="text-[#F5F5F5] text-sm font-medium">Order Processing</p>
                                <p className="text-[#8E8E8E] text-xs">We're preparing your handcrafted items</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-left p-3 bg-[#1C1C1C]/30 rounded-lg border border-[#222]">
                            <div className="w-8 h-8 bg-[#F5F5F5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[#F5F5F5] text-sm font-medium">2</span>
                            </div>
                            <div>
                                <p className="text-[#F5F5F5] text-sm font-medium">Shipping Update</p>
                                <p className="text-[#8E8E8E] text-xs">You'll receive tracking details via email</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-left p-3 bg-[#1C1C1C]/30 rounded-lg border border-[#222]">
                            <div className="w-8 h-8 bg-[#F5F5F5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[#F5F5F5] text-sm font-medium">3</span>
                            </div>
                            <div>
                                <p className="text-[#F5F5F5] text-sm font-medium">Delivery</p>
                                <p className="text-[#8E8E8E] text-xs">Estimated delivery in 5-7 business days</p>
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
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F5F5] text-[#0E0E0E] font-medium rounded-md hover:bg-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,245,245,0.2)]"
                    >
                        <Package className="w-5 h-5" />
                        <span>Track Order</span>
                    </Link>
                    <Link
                        to="/shop"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#444] text-[#F5F5F5] font-medium rounded-md hover:border-[#666] hover:bg-[#1C1C1C] transition-all duration-300"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Continue Shopping</span>
                    </Link>
                </motion.div>

                {/* Home Link */}
                <motion.div variants={itemVariants} className="mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors text-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return to Home</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Support Note */}
                <motion.p
                    variants={itemVariants}
                    className="mt-8 text-[#666] text-xs"
                >
                    Need help? Contact us at{' '}
                    <a
                        href="mailto:thedeeprootstudios@gmail.com"
                        className="text-[#BFC2C7] hover:text-[#F5F5F5] underline transition-colors"
                    >
                        thedeeprootstudios@gmail.com
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage;
