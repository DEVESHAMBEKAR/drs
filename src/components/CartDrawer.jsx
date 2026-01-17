import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShopify } from '../context/ShopifyContext';
import { Lock } from 'lucide-react';

const CartDrawer = () => {
    const navigate = useNavigate();
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        updateCartItem,
        removeCartItem,
        addItemToCart,
    } = useShopify();

    const [giftWrapEnabled, setGiftWrapEnabled] = useState(false);
    const [giftWrapLineItemId, setGiftWrapLineItemId] = useState(null);

    // TODO: Replace with your actual Gift Wrap product variant ID
    const GIFT_WRAP_VARIANT_ID = 'gid://shopify/ProductVariant/YOUR_GIFT_WRAP_VARIANT_ID';
    const GIFT_WRAP_PRICE = 150; // ₹150

    // Check if gift wrap is already in cart
    useEffect(() => {
        if (cart?.lineItems) {
            const giftWrapItem = cart.lineItems.find(
                (item) => item?.variant?.id === GIFT_WRAP_VARIANT_ID
            );
            if (giftWrapItem) {
                setGiftWrapEnabled(true);
                setGiftWrapLineItemId(giftWrapItem.id);
            } else {
                setGiftWrapEnabled(false);
                setGiftWrapLineItemId(null);
            }
        }
    }, [cart]);

    // Handle gift wrap toggle
    const handleGiftWrapToggle = async () => {
        if (giftWrapEnabled && giftWrapLineItemId) {
            // Remove gift wrap from cart
            await removeCartItem(giftWrapLineItemId);
        } else {
            // Add gift wrap to cart
            await addItemToCart(GIFT_WRAP_VARIANT_ID, 1);
        }
    };

    // Calculate subtotal (excluding gift wrap for display purposes)
    const getSubtotal = () => {
        if (!cart?.lineItems) return '0.00';
        return cart.subtotalPrice?.amount || cart.subtotalPrice || '0.00';
    };

    // Get total including gift wrap
    const getTotal = () => {
        if (!cart?.totalPrice) return '0.00';
        return cart.totalPrice?.amount || cart.totalPrice || '0.00';
    };

    // Get cart item count (excluding gift wrap)
    const getItemCount = () => {
        if (!cart?.lineItems) return 0;
        return cart.lineItems.reduce((total, item) => {
            if (!item?.variant?.id) return total;
            if (item.variant.id === GIFT_WRAP_VARIANT_ID) return total;
            return total + item.quantity;
        }, 0);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Cart Drawer */}
                    <motion.div
                        className="fixed right-0 top-0 z-50 h-full w-full bg-deep-charcoal shadow-2xl sm:w-[450px]"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Cart Header */}
                        <div className="border-b border-smoke/20 px-6 py-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-heading text-3xl text-mist">Your Cart</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-smoke transition-colors hover:text-antique-brass"
                                    aria-label="Close cart"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <p className="mt-2 font-body text-sm text-smoke">
                                {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        {/* Cart Items */}
                        <div className="flex h-[calc(100%-280px)] flex-col overflow-y-auto px-6 py-6">
                            {!cart?.lineItems || cart.lineItems.length === 0 ? (
                                // Empty Cart State
                                <div className="flex flex-1 flex-col items-center justify-center">
                                    <svg
                                        className="mb-4 h-16 w-16 text-smoke/30"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                    <p className="font-body text-lg text-smoke">Your cart is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 border border-luxury-border bg-transparent px-6 py-2 rounded-md font-body text-sm tracking-widest text-text-main transition-all duration-300 hover:border-brand-white"
                                    >
                                        CONTINUE SHOPPING
                                    </button>
                                </div>
                            ) : (
                                // Cart Items List
                                <div className="space-y-4">
                                    {cart.lineItems.map((item) => {
                                        // Skip if no variant or is gift wrap
                                        if (!item?.variant?.id) return null;
                                        if (item.variant.id === GIFT_WRAP_VARIANT_ID) return null;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                className="flex gap-4 border-b border-smoke/10 pb-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                {/* Product Image */}
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-soft-black">
                                                    <img
                                                        src={item.variant.image?.src || '/placeholder-product.jpg'}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex flex-1 flex-col">
                                                    <h3 className="font-body text-sm font-medium text-mist">
                                                        {item.title}
                                                    </h3>

                                                    {/* Custom Attributes (Engraving, Wood Type) */}
                                                    {item.customAttributes && item.customAttributes.length > 0 && (
                                                        <div className="mt-1 space-y-0.5">
                                                            {item.customAttributes.map((attr, idx) => (
                                                                <p key={idx} className="font-body text-xs text-smoke">
                                                                    <span className="text-antique-brass">{attr.key}:</span> {attr.value}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <p className="mt-2 font-body text-sm text-antique-brass">
                                                        ₹{parseFloat(item.variant.price?.amount || item.variant.price || 0).toFixed(2)}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="mt-3 flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                                                disabled={isLoading || item.quantity <= 1}
                                                                className="flex h-6 w-6 items-center justify-center border border-smoke/30 text-mist transition-all hover:border-antique-brass hover:text-antique-brass disabled:opacity-30"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="font-body text-sm text-mist">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                                                disabled={isLoading}
                                                                className="flex h-6 w-6 items-center justify-center border border-smoke/30 text-mist transition-all hover:border-antique-brass hover:text-antique-brass disabled:opacity-30"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeCartItem(item.id)}
                                                            disabled={isLoading}
                                                            className="ml-auto font-body text-xs text-smoke transition-colors hover:text-red-400 disabled:opacity-30"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Cart Footer - Gift Options & Checkout */}
                        {cart?.lineItems && cart.lineItems.length > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 border-t border-smoke/20 bg-soft-black px-6 py-6">
                                {/* Gift Wrapping Option */}
                                <div className="mb-4 rounded border border-smoke/20 bg-deep-charcoal p-4">
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={giftWrapEnabled}
                                            onChange={handleGiftWrapToggle}
                                            disabled={isLoading}
                                            className="mt-1 h-4 w-4 cursor-pointer accent-antique-brass"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-body text-sm font-medium text-mist">
                                                    Add Premium Gift Wrapping
                                                </span>
                                                <span className="font-body text-sm text-antique-brass">
                                                    +₹{GIFT_WRAP_PRICE}
                                                </span>
                                            </div>
                                            <p className="mt-1 font-body text-xs text-smoke">
                                                Elegant packaging with personalized card
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Subtotal & Total */}
                                <div className="space-y-2 border-t border-smoke/20 pt-4">
                                    <div className="flex justify-between font-body text-sm text-smoke">
                                        <span>Subtotal</span>
                                        <span>₹{getSubtotal()}</span>
                                    </div>
                                    {giftWrapEnabled && (
                                        <div className="flex justify-between font-body text-sm text-smoke">
                                            <span>Gift Wrapping</span>
                                            <span>₹{GIFT_WRAP_PRICE}.00</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-smoke/20 pt-2 font-body text-lg font-medium text-mist">
                                        <span>Total</span>
                                        <span className="text-antique-brass">₹{getTotal()}</span>
                                    </div>
                                </div>

                                {/* Checkout Button - Illuminated LED Design */}
                                <motion.button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        navigate('/checkout');
                                    }}
                                    className="mt-4 block w-full bg-brand-white px-6 py-4 rounded-full text-center font-body text-sm tracking-widest text-black transition-all duration-300 ease-out hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    PROCEED TO CHECKOUT
                                </motion.button>

                                {/* Trust Signals */}
                                <div className="mt-4 space-y-3 border-t border-smoke/20 pt-4">
                                    {/* Accepted Payments */}
                                    <div>
                                        <p className="font-body text-xs text-smoke/70 mb-2">Accepted Payments:</p>
                                        <p className="font-body text-xs text-smoke">
                                            UPI • GPay • PhonePe • Cards • COD Available
                                        </p>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-3 h-3 text-green-500" />
                                        <p className="font-body text-xs text-smoke/70">
                                            Secure checkout encrypted by Shopify
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
