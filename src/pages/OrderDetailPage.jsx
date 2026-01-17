import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Truck,
    MapPin,
    CreditCard,
    Calendar,
    ExternalLink,
    ShoppingBag,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { fetchCustomerDossier, formatCurrency, formatDate } from '../api/shopify';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrder = async () => {
            const accessToken = localStorage.getItem('customer_token');

            if (!accessToken) {
                navigate('/');
                return;
            }

            try {
                setIsLoading(true);
                const data = await fetchCustomerDossier(accessToken);

                // Find the specific order
                const foundOrder = data.orders?.find(o =>
                    o.orderNumber.toString() === orderId ||
                    o.id === orderId ||
                    o.id.includes(orderId)
                );

                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                console.error('Failed to load order:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrder();
    }, [orderId, navigate]);

    // Get status icon and color
    const getStatusInfo = (status, type) => {
        const statusLower = status?.toLowerCase() || '';

        if (type === 'payment') {
            if (statusLower === 'paid') {
                return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20', label: 'PAID' };
            } else if (statusLower === 'pending') {
                return { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-900/20', label: 'PENDING' };
            } else if (statusLower === 'refunded') {
                return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-900/20', label: 'REFUNDED' };
            }
        } else {
            if (statusLower === 'fulfilled' || statusLower === 'shipped') {
                return { icon: Truck, color: 'text-blue-400', bg: 'bg-blue-900/20', label: 'SHIPPED' };
            } else if (statusLower === 'in_progress' || statusLower === 'partial') {
                return { icon: Package, color: 'text-yellow-400', bg: 'bg-yellow-900/20', label: 'PROCESSING' };
            }
        }
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-900/20', label: status?.toUpperCase() || 'PENDING' };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
                    <p className="text-gray-500 font-mono text-sm">LOADING ORDER DATA...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-2">
                        ORDER NOT FOUND
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {error || 'The requested order could not be located.'}
                    </p>
                    <Link
                        to="/account"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft size={18} />
                        RETURN TO DASHBOARD
                    </Link>
                </div>
            </div>
        );
    }

    const paymentStatus = getStatusInfo(order.financialStatus, 'payment');
    const fulfillmentStatus = getStatusInfo(order.fulfillmentStatus, 'fulfillment');
    const PaymentIcon = paymentStatus.icon;
    const FulfillmentIcon = fulfillmentStatus.icon;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-32">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-sm"
                    >
                        <ArrowLeft size={16} />
                        BACK TO DASHBOARD
                    </button>
                </motion.div>

                {/* Order Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider text-white">
                            ORDER #{order.orderNumber}
                        </h1>
                        <div className="flex gap-2">
                            <span className={`flex items-center gap-1 px-3 py-1 text-xs font-mono uppercase tracking-wider ${paymentStatus.color} ${paymentStatus.bg} border border-current/30`}>
                                <PaymentIcon size={12} />
                                {paymentStatus.label}
                            </span>
                            <span className={`flex items-center gap-1 px-3 py-1 text-xs font-mono uppercase tracking-wider ${fulfillmentStatus.color} ${fulfillmentStatus.bg} border border-current/30`}>
                                <FulfillmentIcon size={12} />
                                {fulfillmentStatus.label}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-500 font-mono text-sm flex items-center gap-2">
                        <Calendar size={14} />
                        Placed on {formatDate(order.processedAt)}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Line Items (2/3) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        {/* Items Section */}
                        <div className="border border-[#333] bg-[#0a0a0a] p-6 mb-6">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingBag className="h-5 w-5 text-white" />
                                <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                    ORDER ITEMS ({order.lineItems?.length || 0})
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {order.lineItems?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 p-4 bg-[#111] border border-[#222]"
                                    >
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-20 h-20 object-cover border border-[#333]"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                                                    <Package size={24} className="text-gray-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <h3 className="font-display text-white text-lg mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-mono">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tracking Section */}
                        {order.trackingInfo?.length > 0 && (
                            <div className="border border-[#333] bg-[#0a0a0a] p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Truck className="h-5 w-5 text-white" />
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                        SHIPMENT TRACKING
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {order.trackingInfo.map((tracking, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#111] border border-[#222]"
                                        >
                                            <div>
                                                <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">
                                                    {tracking.company || 'Shipping Carrier'}
                                                </p>
                                                <p className="text-xl text-white font-mono tracking-wider">
                                                    {tracking.number}
                                                </p>
                                            </div>
                                            {tracking.url && (
                                                <a
                                                    href={tracking.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                                                >
                                                    <ExternalLink size={16} />
                                                    TRACK SHIPMENT
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Summary (1/3) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Order Total Card */}
                        <div className="border border-white/30 bg-[#0a0a0a] p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="h-5 w-5 text-white" />
                                <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                    ORDER TOTAL
                                </h2>
                            </div>
                            <p className="font-display text-4xl font-bold text-white">
                                {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                            </p>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                            <div className="border border-[#333] bg-[#0a0a0a] p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="h-5 w-5 text-white" />
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                        SHIPPING TO
                                    </h2>
                                </div>
                                <div className="text-gray-300 text-sm space-y-1">
                                    {order.shippingAddress.city && (
                                        <p>{order.shippingAddress.city}</p>
                                    )}
                                    {order.shippingAddress.province && (
                                        <p>{order.shippingAddress.province}</p>
                                    )}
                                    {order.shippingAddress.country && (
                                        <p>{order.shippingAddress.country}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Order Timeline */}
                        <div className="border border-[#333] bg-[#0a0a0a] p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="h-5 w-5 text-white" />
                                <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                    STATUS
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {/* Order Placed */}
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mt-1"></div>
                                    <div>
                                        <p className="text-white text-sm">Order Placed</p>
                                        <p className="text-gray-500 text-xs font-mono">
                                            {formatDate(order.processedAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${order.financialStatus?.toLowerCase() === 'paid'
                                            ? 'bg-green-500'
                                            : 'bg-yellow-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-white text-sm">
                                            Payment {order.financialStatus?.toLowerCase() === 'paid' ? 'Confirmed' : 'Pending'}
                                        </p>
                                    </div>
                                </div>

                                {/* Fulfillment */}
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${order.fulfillmentStatus?.toLowerCase() === 'fulfilled'
                                            ? 'bg-blue-500'
                                            : 'bg-gray-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-white text-sm">
                                            {order.fulfillmentStatus?.toLowerCase() === 'fulfilled'
                                                ? 'Shipped'
                                                : 'Awaiting Shipment'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="border border-[#333] bg-[#0a0a0a] p-6">
                            <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400 mb-4">
                                NEED HELP?
                            </h2>
                            <p className="text-gray-500 text-sm mb-4">
                                Contact our support team for any questions about your order.
                            </p>
                            <Link
                                to="/contact"
                                className="block w-full text-center py-3 border border-[#333] text-gray-400 hover:border-white hover:text-white transition-colors font-mono text-sm uppercase tracking-wider"
                            >
                                CONTACT SUPPORT
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
