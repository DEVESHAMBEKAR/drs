import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    ShoppingBag,
    Truck,
    Shield,
    Tag,
    X,
    Check,
    AlertCircle,
    Lock,
    CreditCard
} from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';

// ═══════════════════════════════════════════════════════════════════════════
// DEEP ROOT STUDIOS - DARK LUXURY CHECKOUT
// Shopify-Style Split Layout with Razorpay Integration
// ═══════════════════════════════════════════════════════════════════════════

// Razorpay Configuration
const RAZORPAY_CONFIG = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
    name: 'Deep Root Studios',
    description: 'Premium Handcrafted Products',
    image: '/logo.png',
    theme: {
        color: '#0E0E0E',
        backdrop_color: 'rgba(0, 0, 0, 0.9)'
    }
};

// Mock cart data for development
const MOCK_CART_ITEMS = [
    {
        id: '1',
        title: 'Handcrafted Walnut Watch Box',
        variant: {
            id: 'variant_1',
            title: 'Natural Finish',
            price: { amount: '4999.00', currencyCode: 'INR' },
            image: { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' }
        },
        quantity: 2,
        customAttributes: [{ key: 'Engraving', value: 'J.D.' }]
    },
    {
        id: '2',
        title: 'Premium Leather Wallet',
        variant: {
            id: 'variant_2',
            title: 'Midnight Black',
            price: { amount: '2499.00', currencyCode: 'INR' },
            image: { src: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop' }
        },
        quantity: 1,
        customAttributes: []
    }
];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, isLoggedIn, customer } = useShopify();

    // Use mock data if cart is empty (development mode)
    const cartItems = cart?.lineItems?.length > 0 ? cart.lineItems : MOCK_CART_ITEMS;

    // ─────────────────────────────────────────────────────────────────────────
    // STATE MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(null);
    const [discountError, setDiscountError] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Form Data State
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zip: '',
        country: 'IN',
        phone: ''
    });

    // ─────────────────────────────────────────────────────────────────────────
    // RAZORPAY SDK DYNAMIC LOADING
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (window.Razorpay) {
            setIsRazorpayLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setIsRazorpayLoaded(true);
        script.onerror = () => setPaymentError('Payment gateway failed to load. Please refresh.');
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // ADDRESS AUTO-FILL FROM LOGGED-IN USER
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isLoggedIn && customer) {
            const addr = customer.defaultAddress;
            setFormData(prev => ({
                ...prev,
                email: customer.email || prev.email,
                firstName: customer.firstName || addr?.firstName || prev.firstName,
                lastName: customer.lastName || addr?.lastName || prev.lastName,
                address: addr?.address1 || prev.address,
                apartment: addr?.address2 || prev.apartment,
                city: addr?.city || prev.city,
                state: addr?.province || addr?.provinceCode || prev.state,
                zip: addr?.zip || prev.zip,
                country: addr?.countryCodeV2 || 'IN',
                phone: customer.phone || addr?.phone || prev.phone
            }));
        }
    }, [isLoggedIn, customer]);

    // ─────────────────────────────────────────────────────────────────────────
    // PRICE CALCULATIONS
    // ─────────────────────────────────────────────────────────────────────────
    const subtotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.variant?.price?.amount || item.variant?.price || 0);
        return total + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 999 ? 0 : 99;
    const discountAmount = discountApplied ? (subtotal * discountApplied.percentage / 100) : 0;
    const taxes = Math.round((subtotal - discountAmount) * 0.18);
    const total = subtotal - discountAmount + shipping + taxes;
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // FORM VALIDATION
    // ─────────────────────────────────────────────────────────────────────────
    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Valid email required';
        }
        if (!formData.firstName.trim()) errors.firstName = 'First name required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name required';
        if (!formData.address.trim()) errors.address = 'Address required';
        if (!formData.city.trim()) errors.city = 'City required';
        if (!formData.state) errors.state = 'State required';
        if (!formData.zip || !/^\d{6}$/.test(formData.zip)) errors.zip = 'Valid 6-digit PIN required';
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Valid 10-digit phone required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    // ─────────────────────────────────────────────────────────────────────────
    // EVENT HANDLERS
    // ─────────────────────────────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleDiscountApply = () => {
        setDiscountError('');
        const code = discountCode.toUpperCase().trim();
        if (code === 'DRS10') {
            setDiscountApplied({ code: 'DRS10', percentage: 10, label: '10% Off' });
            setDiscountCode('');
        } else if (code === 'WELCOME20') {
            setDiscountApplied({ code: 'WELCOME20', percentage: 20, label: '20% Off' });
            setDiscountCode('');
        } else if (code) {
            setDiscountError('Invalid discount code');
        }
    };

    const handleRemoveDiscount = () => {
        setDiscountApplied(null);
        setDiscountError('');
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RAZORPAY + SHOPIFY BACKEND INTEGRATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Create Razorpay order via backend API
     * In production: POST /api/create-razorpay-order
     * For now: Mock order creation (replace with real backend call)
     */
    const createRazorpayOrder = async () => {
        // TODO: Replace with your backend API call
        // const response = await fetch('/api/create-razorpay-order', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ amount: Math.round(total * 100), currency: 'INR' })
        // });
        // const data = await response.json();
        // return data;

        // Mock order for development (Razorpay test mode works without real order_id)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'order_' + Math.random().toString(36).substr(2, 12).toUpperCase(),
                    receipt: 'DRS_' + Date.now(),
                    amount: Math.round(total * 100), // Paise
                    currency: 'INR'
                });
            }, 300);
        });
    };

    /**
     * Create Shopify order after successful Razorpay payment
     * Calls backend API to create order in Shopify Admin
     */
    const createShopifyOrder = async (razorpayResponse, orderReceipt) => {
        const API_URL = import.meta.env.VITE_API_URL || '';

        try {
            const response = await fetch(`${API_URL}/api/create-shopify-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Razorpay payment details
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,

                    // Cart items
                    cartItems: cartItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        variant: {
                            id: item.variant?.id,
                            title: item.variant?.title,
                            price: item.variant?.price
                        },
                        customAttributes: item.customAttributes || []
                    })),

                    // Customer details
                    customerAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        apartment: formData.apartment,
                        city: formData.city,
                        state: formData.state,
                        zip: formData.zip,
                        country: formData.country
                    },
                    email: formData.email,
                    phone: formData.phone,

                    // Pricing
                    totalAmount: total,
                    discountCode: discountApplied?.code || null,
                    discountAmount: discountAmount || 0
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error('Shopify order creation failed:', data);
                // Don't throw - payment was successful, just log the error
                // Order can be created manually from Razorpay dashboard
                return { success: false, error: data.error };
            }

            console.log('✅ Shopify order created:', data.order);
            return { success: true, order: data.order };

        } catch (error) {
            console.error('Error creating Shopify order:', error);
            // Don't throw - payment was successful
            return { success: false, error: error.message };
        }
    };

    /**
     * Main Payment Handler
     * 1. Validate form
     * 2. Create Razorpay order
     * 3. Open Razorpay checkout modal
     * 4. On success: Create Shopify order silently
     * 5. Navigate to success page
     */
    const handlePayment = async () => {
        setPaymentError(null);

        // Validate form
        if (!validateForm()) {
            setPaymentError('Please fill in all required fields correctly.');
            return;
        }

        // Check Razorpay SDK
        if (!isRazorpayLoaded || !window.Razorpay) {
            setPaymentError('Payment gateway not ready. Please refresh.');
            return;
        }

        setIsProcessing(true);

        try {
            // Step 1: Create Razorpay order
            const order = await createRazorpayOrder();
            console.log('📦 Razorpay order created:', order.id);

            // Step 2: Configure Razorpay options
            const options = {
                key: RAZORPAY_CONFIG.key,
                amount: order.amount,
                currency: order.currency,
                name: RAZORPAY_CONFIG.name,
                description: `Order #${order.receipt}`,
                image: RAZORPAY_CONFIG.image,
                order_id: order.id,

                // Pre-fill customer details
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    contact: formData.phone
                },

                // Order notes
                notes: {
                    shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}`,
                    customer_email: formData.email
                },

                // DRS Dark Theme
                theme: {
                    color: '#0E0E0E',
                    backdrop_color: 'rgba(0, 0, 0, 0.9)'
                },

                // Payment success handler
                handler: async function (response) {
                    console.log('✅ Razorpay payment successful:', response.razorpay_payment_id);

                    // Step 3: Create order in Shopify (silently)
                    const shopifyResult = await createShopifyOrder(response, order.receipt);

                    // Step 4: Navigate to success page
                    navigate('/order-success', {
                        state: {
                            orderId: shopifyResult?.order?.name || order.receipt,
                            orderNumber: shopifyResult?.order?.order_number,
                            paymentId: response.razorpay_payment_id,
                            amount: total,
                            email: formData.email,
                            items: cartItems.length,
                            shopifyOrderId: shopifyResult?.order?.id,
                            orderStatusUrl: shopifyResult?.order?.order_status_url
                        }
                    });
                },

                // Modal settings
                modal: {
                    confirm_close: true,
                    escape: false,
                    animation: true,
                    ondismiss: function () {
                        console.log('⚠️ Payment modal closed');
                        setIsProcessing(false);
                        setPaymentError('Payment cancelled. Please try again.');
                    }
                },

                // Retry configuration
                retry: {
                    enabled: true,
                    max_count: 3
                }
            };

            // Step 5: Open Razorpay checkout
            const razorpay = new window.Razorpay(options);

            // Handle payment failure
            razorpay.on('payment.failed', function (response) {
                console.error('❌ Payment failed:', response.error);
                setIsProcessing(false);
                setPaymentError(
                    response.error.description ||
                    'Payment failed. Please try again or use a different payment method.'
                );
            });

            razorpay.open();

        } catch (error) {
            console.error('❌ Payment error:', error);
            setIsProcessing(false);
            setPaymentError(error.message || 'Something went wrong. Please try again.');
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // FLOATING LABEL INPUT COMPONENT
    // ─────────────────────────────────────────────────────────────────────────
    const FloatingInput = ({ name, label, type = 'text', autocomplete, required = false }) => {
        const value = formData[name];
        const isFocused = focusedField === name;
        const hasValue = value && value.length > 0;
        const isActive = isFocused || hasValue;
        const hasError = formErrors[name];

        return (
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    autoComplete={autocomplete}
                    required={required}
                    className={`
                        peer w-full px-4 pt-6 pb-2 
                        bg-transparent border rounded-md
                        text-[#F5F5F5] text-base font-sans
                        outline-none transition-all duration-200
                        placeholder-transparent
                        ${hasError
                            ? 'border-red-500/70 focus:border-red-400'
                            : isFocused
                                ? 'border-[#666] ring-1 ring-[#444]'
                                : 'border-[#333] hover:border-[#444]'
                        }
                    `}
                    placeholder={label}
                />
                <label
                    htmlFor={name}
                    className={`
                        absolute left-4 transition-all duration-200 pointer-events-none
                        ${isActive
                            ? `top-2 text-xs ${hasError ? 'text-red-400' : 'text-[#8E8E8E]'}`
                            : 'top-1/2 -translate-y-1/2 text-base text-[#666]'
                        }
                    `}
                >
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
                {hasError && (
                    <p className="text-red-400 text-xs mt-1.5 pl-1">{hasError}</p>
                )}
            </div>
        );
    };

    // ─────────────────────────────────────────────────────────────────────────
    // ORDER SUMMARY CONTENT
    // ─────────────────────────────────────────────────────────────────────────
    const OrderSummaryContent = () => (
        <div className="space-y-5">
            {/* Product List */}
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        {/* Thumbnail with Badge */}
                        <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#333]">
                                {item.variant?.image?.src ? (
                                    <img src={item.variant.image.src} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-[#555]" />
                                    </div>
                                )}
                            </div>
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#666] text-[#F5F5F5] text-xs font-bold rounded-full flex items-center justify-center">
                                {item.quantity}
                            </span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[#F5F5F5] text-sm font-medium truncate">{item.title}</p>
                            {item.variant?.title && item.variant.title !== 'Default Title' && (
                                <p className="text-[#8E8E8E] text-xs mt-0.5">{item.variant.title}</p>
                            )}
                            {item.customAttributes?.map((attr, idx) => (
                                <p key={idx} className="text-[#8E8E8E] text-xs">{attr.key}: {attr.value}</p>
                            ))}
                        </div>
                        {/* Price */}
                        <span className="text-[#F5F5F5] text-sm font-medium whitespace-nowrap">
                            {formatPrice(parseFloat(item.variant?.price?.amount || 0) * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Discount Code */}
            <div className="pt-4 border-t border-[#333]">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDiscountApply()}
                            placeholder="Discount code"
                            autoComplete="off"
                            className="w-full pl-10 pr-4 py-3 bg-[#0E0E0E] border border-[#333] rounded-lg text-[#F5F5F5] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#555] transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleDiscountApply}
                        className="px-5 py-3 bg-[#333] text-[#F5F5F5] text-sm font-medium rounded-lg hover:bg-[#444] transition-colors"
                    >
                        Apply
                    </button>
                </div>
                {discountError && <p className="text-red-400 text-xs mt-2">{discountError}</p>}
                {discountApplied && (
                    <div className="flex items-center justify-between mt-3 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">{discountApplied.code} (-{discountApplied.label})</span>
                        </div>
                        <button onClick={handleRemoveDiscount} className="text-[#666] hover:text-[#999] transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#333]">
                <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E8E]">Subtotal</span>
                    <span className="text-[#F5F5F5]">{formatPrice(subtotal)}</span>
                </div>
                {discountApplied && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-400">Discount</span>
                        <span className="text-green-400">-{formatPrice(discountAmount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E8E]">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-[#F5F5F5]'}>
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E8E]">Taxes (GST 18%)</span>
                    <span className="text-[#F5F5F5]">{formatPrice(taxes)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                <span className="text-[#8E8E8E] text-base">Total</span>
                <div className="text-right">
                    <span className="text-[#F5F5F5] text-2xl font-display font-bold">{formatPrice(total)}</span>
                    <p className="text-[#666] text-xs mt-0.5">INR</p>
                </div>
            </div>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // MOBILE ORDER SUMMARY ACCORDION
    // ─────────────────────────────────────────────────────────────────────────
    const OrderSummaryAccordion = () => (
        <div className="lg:hidden bg-[#1C1C1C] border-b border-[#333]">
            <button
                onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                className="w-full px-5 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#F5F5F5]" />
                    <span className="text-[#F5F5F5] text-sm font-medium">
                        {isOrderSummaryOpen ? 'Hide' : 'Show'} order summary
                    </span>
                    {isOrderSummaryOpen ? <ChevronUp className="w-4 h-4 text-[#8E8E8E]" /> : <ChevronDown className="w-4 h-4 text-[#8E8E8E]" />}
                </div>
                <span className="text-[#F5F5F5] font-semibold text-lg">{formatPrice(total)}</span>
            </button>
            <AnimatePresence>
                {isOrderSummaryOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5">
                            <OrderSummaryContent />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // MAIN RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0E0E0E]">
            {/* Mobile Order Summary */}
            <OrderSummaryAccordion />

            {/* Split Layout */}
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* ═══════════════════════════════════════════════════════════════
                    LEFT COLUMN - FORM SECTION (60%)
                    Background: Obsidian #0E0E0E
                    ═══════════════════════════════════════════════════════════ */}
                <div className="flex-1 lg:w-[60%] bg-[#0E0E0E]">
                    <div className="max-w-[540px] mx-auto px-6 py-10 lg:py-14 lg:pr-12 lg:ml-auto">

                        {/* DRS Logo */}
                        <Link to="/" className="inline-block mb-10">
                            <span className="text-2xl font-display font-bold text-[#F5F5F5] tracking-wider">
                                DRS
                            </span>
                        </Link>

                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-sm mb-10">
                            <Link to="/shop" className="text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors">Cart</Link>
                            <span className="text-[#444]">›</span>
                            <span className="text-[#F5F5F5] font-medium">Information</span>
                            <span className="text-[#444]">›</span>
                            <span className="text-[#555]">Payment</span>
                        </nav>

                        {/* ─────────────────────────────────────────────────────────
                            CONTACT SECTION
                            ───────────────────────────────────────────────────── */}
                        <section className="mb-10">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-[#F5F5F5] text-lg font-medium">Contact</h2>
                                {!isLoggedIn && (
                                    <p className="text-sm text-[#8E8E8E]">
                                        Have an account?{' '}
                                        <Link to="/" className="text-[#BFC2C7] hover:text-[#F5F5F5] underline transition-colors">
                                            Log in
                                        </Link>
                                    </p>
                                )}
                            </div>

                            <FloatingInput
                                name="email"
                                label="Email"
                                type="email"
                                autocomplete="email"
                                required
                            />

                            <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="newsletter"
                                    className="w-5 h-5 rounded border-[#444] bg-transparent text-[#F5F5F5] focus:ring-[#666] focus:ring-offset-[#0E0E0E] accent-[#F5F5F5]"
                                />
                                <span className="text-sm text-[#8E8E8E] group-hover:text-[#F5F5F5] transition-colors">
                                    Email me with news and offers
                                </span>
                            </label>
                        </section>

                        {/* ─────────────────────────────────────────────────────────
                            SHIPPING ADDRESS SECTION
                            ───────────────────────────────────────────────────── */}
                        <section className="mb-10">
                            <h2 className="text-[#F5F5F5] text-lg font-medium mb-5">Shipping address</h2>

                            <div className="space-y-4">
                                {/* Country */}
                                <div className="relative">
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        autoComplete="shipping country"
                                        className="w-full px-4 py-4 bg-transparent border border-[#333] rounded-md text-[#F5F5F5] text-base appearance-none cursor-pointer hover:border-[#444] focus:border-[#555] focus:outline-none transition-colors"
                                    >
                                        <option value="IN" className="bg-[#1C1C1C]">India</option>
                                        <option value="US" className="bg-[#1C1C1C]">United States</option>
                                        <option value="GB" className="bg-[#1C1C1C]">United Kingdom</option>
                                        <option value="AE" className="bg-[#1C1C1C]">UAE</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
                                    <label className="absolute left-4 top-1 text-xs text-[#8E8E8E]">Country/Region</label>
                                </div>

                                {/* Name Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FloatingInput name="firstName" label="First name" autocomplete="given-name" required />
                                    <FloatingInput name="lastName" label="Last name" autocomplete="family-name" required />
                                </div>

                                {/* Address */}
                                <FloatingInput name="address" label="Address" autocomplete="shipping street-address" required />
                                <FloatingInput name="apartment" label="Apartment, suite, etc. (optional)" autocomplete="address-line2" />

                                {/* City / State / ZIP */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FloatingInput name="city" label="City" autocomplete="shipping address-level2" required />

                                    {/* State Select */}
                                    <div className="relative">
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            autoComplete="shipping address-level1"
                                            className={`w-full px-4 py-4 bg-transparent border rounded-md text-[#F5F5F5] text-base appearance-none cursor-pointer hover:border-[#444] focus:border-[#555] focus:outline-none transition-colors ${formErrors.state ? 'border-red-500/70' : 'border-[#333]'}`}
                                        >
                                            <option value="" className="bg-[#1C1C1C]">Select...</option>
                                            <option value="MH" className="bg-[#1C1C1C]">Maharashtra</option>
                                            <option value="DL" className="bg-[#1C1C1C]">Delhi</option>
                                            <option value="KA" className="bg-[#1C1C1C]">Karnataka</option>
                                            <option value="TN" className="bg-[#1C1C1C]">Tamil Nadu</option>
                                            <option value="GJ" className="bg-[#1C1C1C]">Gujarat</option>
                                            <option value="RJ" className="bg-[#1C1C1C]">Rajasthan</option>
                                            <option value="UP" className="bg-[#1C1C1C]">Uttar Pradesh</option>
                                            <option value="WB" className="bg-[#1C1C1C]">West Bengal</option>
                                            <option value="TS" className="bg-[#1C1C1C]">Telangana</option>
                                            <option value="AP" className="bg-[#1C1C1C]">Andhra Pradesh</option>
                                            <option value="KL" className="bg-[#1C1C1C]">Kerala</option>
                                            <option value="PB" className="bg-[#1C1C1C]">Punjab</option>
                                            <option value="HR" className="bg-[#1C1C1C]">Haryana</option>
                                            <option value="MP" className="bg-[#1C1C1C]">Madhya Pradesh</option>
                                            <option value="BR" className="bg-[#1C1C1C]">Bihar</option>
                                            <option value="OR" className="bg-[#1C1C1C]">Odisha</option>
                                            <option value="JH" className="bg-[#1C1C1C]">Jharkhand</option>
                                            <option value="CT" className="bg-[#1C1C1C]">Chhattisgarh</option>
                                            <option value="UK" className="bg-[#1C1C1C]">Uttarakhand</option>
                                            <option value="HP" className="bg-[#1C1C1C]">Himachal Pradesh</option>
                                            <option value="AS" className="bg-[#1C1C1C]">Assam</option>
                                            <option value="GA" className="bg-[#1C1C1C]">Goa</option>
                                            <option value="JK" className="bg-[#1C1C1C]">Jammu & Kashmir</option>
                                            <option value="CH" className="bg-[#1C1C1C]">Chandigarh</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none" />
                                        <label className={`absolute left-4 top-1 text-xs ${formErrors.state ? 'text-red-400' : 'text-[#8E8E8E]'}`}>State *</label>
                                        {formErrors.state && <p className="text-red-400 text-xs mt-1.5 pl-1">{formErrors.state}</p>}
                                    </div>

                                    <FloatingInput name="zip" label="PIN code" autocomplete="shipping postal-code" required />
                                </div>

                                {/* Phone */}
                                <FloatingInput name="phone" label="Phone" type="tel" autocomplete="tel" required />
                            </div>

                            {/* Save Info */}
                            <label className="flex items-center gap-3 mt-5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="save_info"
                                    defaultChecked
                                    className="w-5 h-5 rounded border-[#444] bg-transparent text-[#F5F5F5] focus:ring-[#666] focus:ring-offset-[#0E0E0E] accent-[#F5F5F5]"
                                />
                                <span className="text-sm text-[#8E8E8E] group-hover:text-[#F5F5F5] transition-colors">
                                    Save this information for next time
                                </span>
                            </label>
                        </section>

                        {/* ─────────────────────────────────────────────────────────
                            ERROR ALERT
                            ───────────────────────────────────────────────────── */}
                        {paymentError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-400 text-sm">{paymentError}</p>
                                </div>
                                <button onClick={() => setPaymentError(null)} className="text-red-400/60 hover:text-red-400">
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* ─────────────────────────────────────────────────────────
                            RAZORPAY PAYMENT BUTTON
                            ───────────────────────────────────────────────────── */}
                        <motion.button
                            onClick={handlePayment}
                            disabled={isProcessing || !isRazorpayLoaded}
                            className={`
                                w-full py-4 px-8 rounded-md
                                text-base font-bold tracking-widest uppercase
                                flex items-center justify-center gap-3
                                transition-all duration-300
                                ${isProcessing || !isRazorpayLoaded
                                    ? 'bg-[#444] text-[#888] cursor-not-allowed'
                                    : 'bg-[#F5F5F5] text-black hover:bg-white hover:shadow-[0_0_40px_rgba(245,245,245,0.2)]'
                                }
                            `}
                            whileHover={!isProcessing && isRazorpayLoaded ? { scale: 1.01 } : {}}
                            whileTap={!isProcessing && isRazorpayLoaded ? { scale: 0.99 } : {}}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#666] border-t-[#999] rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : !isRazorpayLoaded ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#666] border-t-[#999] rounded-full animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    <span>Pay Securely with Razorpay</span>
                                </>
                            )}
                        </motion.button>

                        {/* Trust Row */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-[#333]">
                            <div className="flex items-center gap-2 text-[#8E8E8E] text-xs">
                                <Shield className="w-4 h-4" />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#8E8E8E] text-xs">
                                <CreditCard className="w-4 h-4" />
                                <span>UPI • Cards • Wallets</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#8E8E8E] text-xs">
                                <Truck className="w-4 h-4" />
                                <span>Free Shipping ₹999+</span>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-[#666]">
                            <Link to="/refund-policy" className="hover:text-[#F5F5F5] transition-colors">Refund policy</Link>
                            <Link to="/shipping-policy" className="hover:text-[#F5F5F5] transition-colors">Shipping policy</Link>
                            <Link to="/privacy-policy" className="hover:text-[#F5F5F5] transition-colors">Privacy policy</Link>
                            <Link to="/terms" className="hover:text-[#F5F5F5] transition-colors">Terms of service</Link>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    RIGHT COLUMN - ORDER SUMMARY (40%)
                    Background: Charcoal #1C1C1C
                    ═══════════════════════════════════════════════════════════ */}
                <div className="hidden lg:block lg:w-[40%] bg-[#1C1C1C] border-l border-[#333]">
                    <div className="sticky top-0 max-w-[400px] mx-auto px-8 py-14 h-screen overflow-y-auto scrollbar-hide">
                        <OrderSummaryContent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
