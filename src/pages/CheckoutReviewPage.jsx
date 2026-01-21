import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Lock,
    MapPin,
    Package,
    ShoppingBag,
    ChevronLeft,
    Shield,
    Truck,
    User,
    AlertCircle
} from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';
import { prepareCheckoutForCustomer } from '../api/cart';

const CheckoutReviewPage = () => {
    const navigate = useNavigate();
    const {
        cart,
        isLoggedIn,
        customer,
        customerToken,
        getCartTotal,
        getCartItemCount
    } = useShopify();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Redirect if cart is empty
    useEffect(() => {
        if (!cart || cart.lineItems?.length === 0) {
            navigate('/shop');
        }
    }, [cart, navigate]);

    /**
     * Handle checkout - Redirect to our custom Razorpay checkout
     */
    const handleCheckout = async () => {
        if (!cart) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Small delay for UX feedback
            await new Promise(resolve => setTimeout(resolve, 300));

            // Redirect to our custom Razorpay checkout page
            // The checkout page will handle customer pre-filling if logged in
            navigate('/checkout/information');

        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to initiate checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    /**
     * Format price for display
     */
    const formatPrice = (price) => {
        if (!price) return '₹0';
        const amount = typeof price === 'object' ? price.amount : price;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    /**
     * Get cart subtotal
     */
    const getSubtotal = () => {
        if (!cart?.lineItems) return 0;
        return cart.lineItems.reduce((total, item) => {
            const price = item.variant?.price?.amount || item.variant?.priceV2?.amount || 0;
            return total + (parseFloat(price) * item.quantity);
        }, 0);
    };

    // Calculate totals
    const subtotal = getSubtotal();
    const shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* Header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Back Link */}
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft size={18} />
                        <span className="text-sm font-mono uppercase tracking-wider">Continue Shopping</span>
                    </Link>

                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
                        REQUISITION SUMMARY
                    </h1>
                    <p className="mt-3 text-gray-500 font-mono text-sm">
                        MISSION MANIFESTO // FINAL REVIEW BEFORE TRANSFER
                    </p>
                </motion.div>

                {/* Main Grid - Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Left Column (60%) - Shipping Manifest */}
                    <motion.div
                        className="lg:col-span-3 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Shipping Manifest Card */}
                        <div className="border border-[#333] bg-[#0a0a0a] p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="h-5 w-5 text-white" />
                                <h2 className="font-mono text-sm uppercase tracking-widest text-white">
                                    SHIPPING MANIFEST
                                </h2>
                            </div>

                            {isLoggedIn && customer ? (
                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 border border-white/30 flex items-center justify-center">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-display text-xl text-white">
                                                {customer.firstName} {customer.lastName}
                                            </p>
                                            <p className="text-gray-400 text-sm font-mono">
                                                {customer.email}
                                            </p>
                                            {customer.phone && (
                                                <p className="text-gray-500 text-sm font-mono mt-1">
                                                    {customer.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-[#333]" />

                                    {/* Address */}
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-wider mb-3 font-mono">
                                            DELIVERY COORDINATES
                                        </p>

                                        {customer.defaultAddress ? (
                                            <div className="bg-[#111] border border-[#222] p-4">
                                                <div className="flex items-start gap-3">
                                                    <Truck className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                                                    <div className="text-gray-300 text-sm leading-relaxed space-y-1">
                                                        {Array.isArray(customer.defaultAddress) ? (
                                                            customer.defaultAddress.map((line, i) => (
                                                                <p key={i}>{line}</p>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <p>{customer.defaultAddress.address1}</p>
                                                                {customer.defaultAddress.address2 && (
                                                                    <p>{customer.defaultAddress.address2}</p>
                                                                )}
                                                                <p>
                                                                    {customer.defaultAddress.city}, {customer.defaultAddress.province}
                                                                </p>
                                                                <p>
                                                                    {customer.defaultAddress.country} - {customer.defaultAddress.zip}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-[#111] border border-[#222] p-4 text-center">
                                                <p className="text-gray-500 text-sm italic">
                                                    No saved address. You can enter it at checkout.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pre-fill Badge */}
                                    <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                                        <Shield size={14} />
                                        <span>CUSTOMER DATA WILL BE PRE-FILLED AT CHECKOUT</span>
                                    </div>
                                </div>
                            ) : (
                                /* Guest User - Login Prompt */
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto bg-[#111] border border-[#333] flex items-center justify-center mb-4">
                                        <User className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <h3 className="font-display text-lg text-gray-400 uppercase tracking-wider mb-2">
                                        GUEST OPERATIVE
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                                        Login to pre-fill your shipping details and track your orders.
                                    </p>
                                    <Link
                                        to="/"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors font-display uppercase tracking-wider text-sm"
                                    >
                                        <Lock size={16} />
                                        LOGIN TO PRE-FILL
                                    </Link>
                                    <p className="mt-4 text-gray-600 text-xs">
                                        or continue as guest at checkout
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Security Note */}
                        <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] border border-[#222]">
                            <Shield className="h-5 w-5 text-white flex-shrink-0" />
                            <div>
                                <p className="text-xs text-white font-mono uppercase tracking-wider mb-1">
                                    SECURE TRANSFER PROTOCOL
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Your payment details are handled exclusively by Shopify's PCI-DSS compliant secure gateway.
                                    We never store your card information.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column (40%) - Item Log */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="border border-[#333] bg-[#0a0a0a] p-6 md:p-8 sticky top-28">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <Package className="h-5 w-5 text-white" />
                                <h2 className="font-mono text-sm uppercase tracking-widest text-white">
                                    ITEM LOG ({getCartItemCount()})
                                </h2>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {cart?.lineItems?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-3 bg-[#111] border border-[#222]"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-16 h-16 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                                            {item.variant?.image?.src ? (
                                                <img
                                                    src={item.variant.image.src}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="h-6 w-6 text-gray-700" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display text-sm text-white truncate">
                                                {item.title}
                                            </p>
                                            {item.variant?.title && item.variant.title !== 'Default Title' && (
                                                <p className="text-xs text-gray-500 font-mono truncate">
                                                    {item.variant.title}
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-gray-600 font-mono">
                                                    QTY: {item.quantity}
                                                </span>
                                                <span className="text-sm text-white font-bold">
                                                    {formatPrice(item.variant?.price || item.variant?.priceV2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#333] my-6" />

                            {/* Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-mono">SUBTOTAL</span>
                                    <span className="text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-mono">SHIPPING</span>
                                    <span className={shipping === 0 ? 'text-green-500' : 'text-white'}>
                                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-gray-600 text-right">
                                        Free shipping on orders over ₹999
                                    </p>
                                )}
                                <div className="border-t border-[#333] pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-mono text-sm">TOTAL</span>
                                        <span className="text-2xl font-display font-bold text-white">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || !cart?.lineItems?.length}
                                className="w-full h-14 bg-white text-black font-bold uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        <span>PROCESSING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        <span>INITIATE SECURE TRANSFER</span>
                                    </>
                                )}
                            </button>

                            {/* Security Seal */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                                <Lock size={12} />
                                <span className="text-xs font-mono uppercase tracking-wider">
                                    ENCRYPTED HANDOFF TO SHOPIFY SECURE GATEWAY
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutReviewPage;
