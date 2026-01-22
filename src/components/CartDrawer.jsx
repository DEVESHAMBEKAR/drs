import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShopify } from '../context/ShopifyContext';
import { Lock, ShoppingBag, X, Minus, Plus, Trash2, Gift } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// CART DRAWER - DEEP ROOT STUDIOS "DARK LUXURY" THEME
// Fixed visibility for both light and dark modes
// ═══════════════════════════════════════════════════════════════════════════

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
            await removeCartItem(giftWrapLineItemId);
        } else {
            await addItemToCart(GIFT_WRAP_VARIANT_ID, 1);
        }
    };

    // Calculate subtotal
    const getSubtotal = () => {
        if (!cart?.lineItems) return '0.00';
        return cart.subtotalPrice?.amount || cart.subtotalPrice || '0.00';
    };

    // Get total
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

                    {/* Cart Drawer Panel */}
                    <motion.div
                        className="fixed right-0 top-0 z-50 h-full w-full sm:w-[450px] bg-[#0E0E0E] shadow-2xl flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* ═══════════════════════════════════════════════════════
                            HEADER
                            ═══════════════════════════════════════════════════ */}
                        <div className="border-b border-[#333] px-6 py-5">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display text-2xl text-[#F5F5F5]">Your Cart</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors rounded-full hover:bg-[#1C1C1C]"
                                    aria-label="Close cart"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-[#8E8E8E]">
                                {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            CART ITEMS
                            ═══════════════════════════════════════════════════ */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                            {!cart?.lineItems || cart.lineItems.length === 0 ? (
                                // Empty Cart State
                                <div className="flex flex-1 flex-col items-center justify-center h-full py-16">
                                    <div className="w-20 h-20 rounded-full bg-[#1C1C1C] flex items-center justify-center mb-6">
                                        <ShoppingBag className="w-10 h-10 text-[#555]" />
                                    </div>
                                    <p className="text-lg text-[#F5F5F5] font-medium mb-2">Your cart is empty</p>
                                    <p className="text-sm text-[#8E8E8E] mb-6">Explore our collection</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="px-8 py-3 border border-[#333] text-[#F5F5F5] text-sm tracking-widest uppercase hover:bg-[#1C1C1C] hover:border-[#555] transition-all duration-300 rounded-md"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                // Cart Items List
                                <div className="space-y-5">
                                    {cart.lineItems.map((item) => {
                                        if (!item?.variant?.id) return null;
                                        if (item.variant.id === GIFT_WRAP_VARIANT_ID) return null;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                className="flex gap-4 pb-5 border-b border-[#222]"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                {/* Product Image */}
                                                <div className="w-20 h-20 flex-shrink-0 bg-[#1C1C1C] rounded-lg overflow-hidden">
                                                    <img
                                                        src={item.variant.image?.src || '/placeholder-product.jpg'}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[#F5F5F5] text-sm font-medium truncate">
                                                        {item.title}
                                                    </h3>

                                                    {/* Variant Title */}
                                                    {item.variant?.title && item.variant.title !== 'Default Title' && (
                                                        <p className="text-[#8E8E8E] text-xs mt-0.5">{item.variant.title}</p>
                                                    )}

                                                    {/* Custom Attributes */}
                                                    {item.customAttributes && item.customAttributes.length > 0 && (
                                                        <div className="mt-1 space-y-0.5">
                                                            {item.customAttributes.map((attr, idx) => (
                                                                <p key={idx} className="text-xs text-[#8E8E8E]">
                                                                    <span className="text-[#BFC2C7]">{attr.key}:</span> {attr.value}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Price */}
                                                    <p className="mt-2 text-[#F5F5F5] text-sm font-medium">
                                                        ₹{parseFloat(item.variant.price?.amount || item.variant.price || 0).toLocaleString('en-IN')}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="flex items-center border border-[#333] rounded-md overflow-hidden">
                                                            <button
                                                                onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                                                disabled={isLoading || item.quantity <= 1}
                                                                className="w-8 h-8 flex items-center justify-center text-[#8E8E8E] hover:bg-[#1C1C1C] hover:text-[#F5F5F5] disabled:opacity-30 transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-10 text-center text-[#F5F5F5] text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                                                disabled={isLoading}
                                                                className="w-8 h-8 flex items-center justify-center text-[#8E8E8E] hover:bg-[#1C1C1C] hover:text-[#F5F5F5] disabled:opacity-30 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeCartItem(item.id)}
                                                            disabled={isLoading}
                                                            className="p-2 text-[#666] hover:text-red-400 disabled:opacity-30 transition-colors"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            FOOTER - Gift Options & Checkout
                            ═══════════════════════════════════════════════════ */}
                        {cart?.lineItems && cart.lineItems.length > 0 && (
                            <div className="border-t border-[#333] bg-[#0a0a0a] px-6 py-5">
                                {/* Gift Wrapping Option */}
                                <div className="mb-4 p-4 border border-[#333] rounded-lg bg-[#1C1C1C]/50">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={giftWrapEnabled}
                                            onChange={handleGiftWrapToggle}
                                            disabled={isLoading}
                                            className="mt-0.5 w-4 h-4 rounded border-[#444] bg-transparent accent-[#F5F5F5]"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Gift className="w-4 h-4 text-[#BFC2C7]" />
                                                    <span className="text-[#F5F5F5] text-sm font-medium">
                                                        Premium Gift Wrapping
                                                    </span>
                                                </div>
                                                <span className="text-[#8E8E8E] text-sm">
                                                    +₹{GIFT_WRAP_PRICE}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-[#666]">
                                                Elegant packaging with personalized card
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Subtotal & Total */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8E8E8E]">Subtotal</span>
                                        <span className="text-[#F5F5F5]">₹{parseFloat(getSubtotal()).toLocaleString('en-IN')}</span>
                                    </div>
                                    {giftWrapEnabled && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8E8E8E]">Gift Wrapping</span>
                                            <span className="text-[#F5F5F5]">₹{GIFT_WRAP_PRICE}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-3 border-t border-[#333]">
                                        <span className="text-[#F5F5F5] font-medium">Total</span>
                                        <span className="text-[#F5F5F5] text-lg font-semibold">
                                            ₹{parseFloat(getTotal()).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <motion.button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        navigate('/checkout/information');
                                    }}
                                    className="w-full py-4 bg-[#F5F5F5] text-[#0E0E0E] text-sm font-bold tracking-widest uppercase rounded-md hover:bg-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,245,245,0.3)]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Proceed to Checkout
                                </motion.button>

                                {/* Trust Signals */}
                                <div className="mt-4 pt-4 border-t border-[#222] space-y-2">
                                    <p className="text-[#666] text-xs">Accepted Payments:</p>
                                    <p className="text-[#8E8E8E] text-xs">
                                        UPI • GPay • PhonePe • Cards • COD Available
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Lock className="w-3 h-3 text-green-500" />
                                        <p className="text-[#666] text-xs">
                                            Secure checkout powered by Razorpay
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
