import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    ChevronDown,
    ChevronUp,
    ShoppingBag,
    CreditCard,
    Truck,
    Shield,
    AlertCircle,
    Check,
    X
} from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const RAZORPAY_CONFIG = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    name: 'Deep Root Studios',
    description: 'Premium Handcrafted Objects',
    image: '/logo.png',
    theme: { color: '#1C1C1C' }
};

// Mock cart data for development
const MOCK_CART_ITEMS = [
    {
        id: 'mock-1',
        title: 'Geometric Night Lamp',
        variant: {
            id: 'gid://shopify/ProductVariant/123456789',
            title: 'Medium / Walnut',
            price: { amount: '2499.00', currencyCode: 'INR' },
            image: { src: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop' }
        },
        quantity: 1,
        customAttributes: []
    }
];

// Indian States
const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

// ═══════════════════════════════════════════════════════════════════════════
// CHECKOUT PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, isLoggedIn, customer, clearCart, fetchCustomerInfo } = useShopify();

    // Use real cart or mock data
    const cartItems = cart?.lineItems?.length > 0 ? cart.lineItems : MOCK_CART_ITEMS;

    // ─────────────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────────────
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

    const [formErrors, setFormErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [isMobileOrderOpen, setIsMobileOrderOpen] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // ─────────────────────────────────────────────────────────────────────────
    // RAZORPAY SDK LOADING
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
        script.onerror = () => setPaymentError('Payment gateway failed to load.');
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // AUTO-FILL FROM LOGGED-IN USER
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isLoggedIn && fetchCustomerInfo) {
            fetchCustomerInfo();
        }
    }, [isLoggedIn]);

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

    const shipping = 0; // Free shipping
    const total = subtotal + shipping; // No GST
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
    // FORM HANDLING
    // ─────────────────────────────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

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

    const isFormValid = formData.email && formData.firstName && formData.lastName &&
        formData.address && formData.city && formData.state &&
        formData.zip && formData.phone;

    // ─────────────────────────────────────────────────────────────────────────
    // RAZORPAY ORDER CREATION
    // ─────────────────────────────────────────────────────────────────────────
    const createRazorpayOrder = async () => {
        const API_URL = import.meta.env.VITE_API_URL || '';

        try {
            const response = await fetch(`${API_URL}/api/razorpay/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(total * 100),
                    currency: 'INR',
                    receipt: 'DRS_' + Date.now()
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Real order from API
                return { ...data, isRealOrder: true };
            }
        } catch (e) {
            console.log('Backend API not available - using test mode without order_id');
        }

        // Fallback for LOCAL TEST mode (no backend)
        // Don't include order_id - Razorpay test mode works without it
        return {
            id: null, // No order_id for test mode
            receipt: 'DRS_' + Date.now(),
            amount: Math.round(total * 100),
            currency: 'INR',
            isRealOrder: false
        };
    };

    // ─────────────────────────────────────────────────────────────────────────
    // SHOPIFY ORDER CREATION
    // ─────────────────────────────────────────────────────────────────────────
    const createShopifyOrder = async (razorpayResponse, orderReceipt) => {
        const API_URL = import.meta.env.VITE_API_URL || '';

        try {
            const response = await fetch(`${API_URL}/api/shopify/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,
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
                    totalAmount: total
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                return { success: false, error: data.error };
            }

            return { success: true, order: data.order };

        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // PAYMENT HANDLER
    // ─────────────────────────────────────────────────────────────────────────
    const handlePayment = async () => {
        setPaymentError(null);

        if (!validateForm()) {
            setPaymentError('Please fill in all required fields correctly.');
            return;
        }

        if (!isRazorpayLoaded || !window.Razorpay) {
            setPaymentError('Payment gateway not ready. Please refresh.');
            return;
        }

        const isRazorpayConfigured = RAZORPAY_CONFIG.key &&
            !RAZORPAY_CONFIG.key.includes('YOUR_KEY') &&
            RAZORPAY_CONFIG.key.startsWith('rzp_');

        if (!isRazorpayConfigured) {
            setPaymentError('Razorpay is not configured. Please add your Razorpay Key ID.');
            return;
        }

        setIsProcessing(true);

        try {
            const order = await createRazorpayOrder();
            console.log('📦 Razorpay order:', order.isRealOrder ? order.id : 'TEST MODE (no order_id)');

            // Build Razorpay options
            const options = {
                key: RAZORPAY_CONFIG.key,
                amount: order.amount,
                currency: order.currency,
                name: RAZORPAY_CONFIG.name,
                description: `Order #${order.receipt}`,
                image: RAZORPAY_CONFIG.image,
                // Only include order_id for real orders (from backend API)
                // Test mode works WITHOUT order_id
                ...(order.isRealOrder && order.id ? { order_id: order.id } : {}),

                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone
                },

                theme: RAZORPAY_CONFIG.theme,

                handler: async function (response) {
                    console.log('✅ Payment successful:', response.razorpay_payment_id);

                    const shopifyResult = await createShopifyOrder(response, order.receipt);

                    if (shopifyResult.success) {
                        if (clearCart) clearCart();
                        navigate('/order-success', {
                            state: {
                                orderCreated: true,
                                orderId: shopifyResult.order?.id,
                                orderNumber: shopifyResult.order?.order_number,
                                paymentId: response.razorpay_payment_id,
                                amount: total,
                                email: formData.email,
                                shopifyOrderId: shopifyResult.order?.name,
                                cartItems: cartItems.map(item => ({
                                    title: item.title,
                                    quantity: item.quantity,
                                    variantTitle: item.variant?.title || '',
                                    imageUrl: item.variant?.image?.src || null,
                                    price: { amount: parseFloat(item.variant?.price?.amount || 0) * item.quantity }
                                })),
                                shippingAddress: {
                                    firstName: formData.firstName,
                                    lastName: formData.lastName,
                                    address1: formData.address,
                                    address2: formData.apartment,
                                    city: formData.city,
                                    province: formData.state,
                                    zip: formData.zip,
                                    country: formData.country === 'IN' ? 'India' : formData.country,
                                    phone: formData.phone
                                }
                            }
                        });
                    } else {
                        navigate('/order-success', {
                            state: {
                                orderCreated: false,
                                orderError: shopifyResult?.error || 'Failed to create order',
                                paymentId: response.razorpay_payment_id,
                                amount: total,
                                email: formData.email
                            }
                        });
                    }
                },

                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                },

                retry: { enabled: true, max_count: 3 }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on('payment.failed', function (response) {
                setIsProcessing(false);
                setPaymentError(response.error.description || 'Payment failed. Please try again.');
            });

            razorpay.open();

        } catch (error) {
            setIsProcessing(false);
            setPaymentError(error.message || 'Something went wrong. Please try again.');
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // INPUT COMPONENT
    // ─────────────────────────────────────────────────────────────────────────
    const renderInput = (name, label, type = 'text', autocomplete = '', required = true) => {
        const value = formData[name] || '';
        const hasError = formErrors[name];
        const isFocused = focusedField === name;
        const hasValue = value.length > 0;

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
                    className={`
                        w-full h-14 px-4 pt-5 pb-2 
                        bg-[#1C1C1C] border-2 rounded-lg
                        text-[#F5F5F5] text-base font-medium
                        transition-all duration-200
                        focus:outline-none
                        ${hasError
                            ? 'border-red-500'
                            : isFocused
                                ? 'border-white'
                                : 'border-[#333] hover:border-[#555]'
                        }
                    `}
                    placeholder=" "
                />
                <label
                    htmlFor={name}
                    className={`
                        absolute left-4 transition-all duration-200 pointer-events-none
                        ${(isFocused || hasValue)
                            ? 'top-2 text-xs text-[#888]'
                            : 'top-1/2 -translate-y-1/2 text-sm text-[#666]'
                        }
                    `}
                >
                    {label}{required && ' *'}
                </label>
                {hasError && (
                    <p className="mt-1 text-xs text-red-400">{hasError}</p>
                )}
            </div>
        );
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0E0E0E]">
            {/* Mobile Order Summary Toggle */}
            <div className="lg:hidden sticky top-0 z-40 bg-[#1C1C1C] border-b border-[#333]">
                <button
                    onClick={() => setIsMobileOrderOpen(!isMobileOrderOpen)}
                    className="w-full flex items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-[#888]" />
                        <span className="text-[#F5F5F5] text-sm">
                            {isMobileOrderOpen ? 'Hide' : 'Show'} order summary
                        </span>
                        {isMobileOrderOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#888]" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-[#888]" />
                        )}
                    </div>
                    <span className="text-[#F5F5F5] font-bold text-lg">
                        {formatPrice(total)}
                    </span>
                </button>

                <AnimatePresence>
                    {isMobileOrderOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-[#1C1C1C] px-4 pb-4"
                        >
                            {/* Mobile Cart Items */}
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#2A2A2A] flex-shrink-0">
                                            {item.variant?.image?.src ? (
                                                <img
                                                    src={item.variant.image.src}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-[#555]" />
                                                </div>
                                            )}
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#888] text-white text-xs rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#F5F5F5] text-sm font-medium truncate">{item.title}</p>
                                            <p className="text-[#888] text-xs truncate">{item.variant?.title}</p>
                                        </div>
                                        <p className="text-[#F5F5F5] text-sm font-medium">
                                            {formatPrice(parseFloat(item.variant?.price?.amount || 0) * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row">

                {/* LEFT COLUMN - Form */}
                <div className="flex-1 lg:border-r lg:border-[#333]">
                    <div className="max-w-xl mx-auto px-6 py-8 lg:py-12 lg:px-12">

                        {/* Logo */}
                        <Link to="/" className="inline-block mb-8">
                            <h1 className="text-2xl font-bold text-[#F5F5F5] tracking-wider">
                                DEEP ROOT STUDIOS
                            </h1>
                        </Link>

                        {/* Contact Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">
                                Contact
                            </h2>
                            {renderInput('email', 'Email', 'email', 'email')}
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">
                                Shipping Address
                            </h2>

                            <div className="space-y-4">
                                {/* Country - Fixed to India */}
                                <div className="relative">
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full h-14 px-4 pt-5 pb-2 bg-[#1C1C1C] border-2 border-[#333] rounded-lg text-[#F5F5F5] text-base appearance-none focus:outline-none focus:border-white hover:border-[#555] transition-all"
                                    >
                                        <option value="IN">India</option>
                                    </select>
                                    <label className="absolute left-4 top-2 text-xs text-[#888]">
                                        Country/Region
                                    </label>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888] pointer-events-none" />
                                </div>

                                {/* Name Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {renderInput('firstName', 'First name', 'text', 'given-name')}
                                    {renderInput('lastName', 'Last name', 'text', 'family-name')}
                                </div>

                                {/* Address */}
                                {renderInput('address', 'Address', 'text', 'shipping street-address')}
                                {renderInput('apartment', 'Apartment, suite, etc.', 'text', 'shipping address-line2', false)}

                                {/* City, State, ZIP Row */}
                                <div className="grid grid-cols-3 gap-4">
                                    {renderInput('city', 'City', 'text', 'shipping address-level2')}

                                    {/* State Dropdown */}
                                    <div className="relative">
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('state')}
                                            onBlur={() => setFocusedField(null)}
                                            autoComplete="shipping address-level1"
                                            className={`
                                                w-full h-14 px-4 pt-5 pb-2 
                                                bg-[#1C1C1C] border-2 rounded-lg
                                                text-[#F5F5F5] text-base appearance-none
                                                transition-all duration-200 focus:outline-none
                                                ${formErrors.state
                                                    ? 'border-red-500'
                                                    : focusedField === 'state'
                                                        ? 'border-white'
                                                        : 'border-[#333] hover:border-[#555]'
                                                }
                                            `}
                                        >
                                            <option value="">Select...</option>
                                            {INDIAN_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        <label className="absolute left-4 top-2 text-xs text-[#888]">
                                            State *
                                        </label>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] pointer-events-none" />
                                        {formErrors.state && (
                                            <p className="mt-1 text-xs text-red-400">{formErrors.state}</p>
                                        )}
                                    </div>

                                    {renderInput('zip', 'PIN code', 'text', 'shipping postal-code')}
                                </div>

                                {/* Phone */}
                                {renderInput('phone', 'Phone', 'tel', 'tel')}
                            </div>
                        </div>

                        {/* Error Message */}
                        {paymentError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">{paymentError}</p>
                            </motion.div>
                        )}

                        {/* Payment Button */}
                        <motion.button
                            onClick={handlePayment}
                            disabled={!isFormValid || isProcessing || !isRazorpayLoaded}
                            className={`
                                w-full h-16 rounded-lg font-bold text-lg uppercase tracking-wider
                                flex items-center justify-center gap-3
                                transition-all duration-300
                                ${(!isFormValid || isProcessing || !isRazorpayLoaded)
                                    ? 'bg-[#333] text-[#666] cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-[#F0F0F0] hover:scale-[1.02]'
                                }
                            `}
                            whileTap={isFormValid && !isProcessing ? { scale: 0.98 } : {}}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#666] border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Secure Payment via Razorpay
                                </>
                            )}
                        </motion.button>

                        {/* Trust Badges */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[#666] text-xs">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <span>UPI • Cards • Wallets</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                <span>Free Shipping</span>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 pt-8 border-t border-[#333] flex flex-wrap justify-center gap-4 text-xs text-[#666]">
                            <Link to="/refund-policy" className="hover:text-[#F5F5F5] transition-colors">Refund Policy</Link>
                            <Link to="/shipping-policy" className="hover:text-[#F5F5F5] transition-colors">Shipping Policy</Link>
                            <Link to="/privacy-policy" className="hover:text-[#F5F5F5] transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-[#F5F5F5] transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Order Summary (Desktop) */}
                <div className="hidden lg:block w-[480px] bg-[#1C1C1C] min-h-screen sticky top-0">
                    <div className="p-8 lg:p-12">

                        {/* Cart Items */}
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#2A2A2A] flex-shrink-0 border border-[#333]">
                                        {item.variant?.image?.src ? (
                                            <img
                                                src={item.variant.image.src}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-[#555]" />
                                            </div>
                                        )}
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#888] text-white text-xs rounded-full flex items-center justify-center font-medium">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#F5F5F5] text-sm font-medium truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-[#888] text-xs truncate">
                                            {item.variant?.title}
                                        </p>
                                    </div>
                                    <p className="text-[#F5F5F5] text-sm font-medium whitespace-nowrap">
                                        {formatPrice(parseFloat(item.variant?.price?.amount || 0) * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#333] my-6" />

                        {/* Price Breakdown */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#888]">Subtotal</span>
                                <span className="text-[#F5F5F5]">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#888]">Shipping</span>
                                <span className="text-green-400">FREE</span>
                            </div>

                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#333] my-6" />

                        {/* Total */}
                        <div className="flex justify-between items-center">
                            <span className="text-[#888] text-base">Total</span>
                            <div className="text-right">
                                <span className="text-[#888] text-xs mr-2">INR</span>
                                <span className="text-[#F5F5F5] text-2xl font-bold">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
