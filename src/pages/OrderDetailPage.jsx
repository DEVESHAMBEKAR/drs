import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Loader2,
    Home,
    PackageCheck,
    RefreshCw,
    XCircle,
    RotateCcw
} from 'lucide-react';
import { fetchCustomerDossier, formatCurrency, formatDate } from '../api/shopify';
import {
    getDeliveryStageFromStatus,
    getStatusDisplay,
    isOrderDelivered,
    isOrderOutForDelivery,
    isOrderCancelled,
    detectCarrier,
    fetchLiveTrackingStatus,
    setManualTrackingStatus,
    setOrderCancelled,
    storeCancellationRequest,
    getCancellationRequest,
    sendCancellationNotification,
    DELIVERY_STATUS,
} from '../api/tracking';

/**
 * Delivery Status Stages
 */
const DELIVERY_STAGES = {
    ORDERED: { label: 'Order Placed', icon: ShoppingBag, step: 1 },
    PROCESSING: { label: 'Processing', icon: Package, step: 2 },
    SHIPPED: { label: 'Shipped', icon: Truck, step: 3 },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: Truck, step: 4 },
    DELIVERED: { label: 'Delivered', icon: PackageCheck, step: 5 },
};

/**
 * Carrier Status Events Component - Shows tracking history
 */
const TrackingEvents = ({ events }) => {
    if (!events || events.length === 0) return null;

    return (
        <div className="mt-4 pt-4 border-t border-[#222]">
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">
                TRACKING HISTORY
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.map((event, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-gray-300">{event.status}</p>
                            <p className="text-xs text-gray-600 font-mono">
                                {event.location && `${event.location} • `}
                                {event.time && new Date(event.time).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Live Tracking Timeline Component
 */
const TrackingTimeline = ({ order, currentStage, trackingEvents, isCancelled }) => {
    // If cancelled, show cancelled timeline
    if (isCancelled || currentStage === 0) {
        return (
            <div className="space-y-1">
                {/* Order Placed - Completed */}
                <div className="relative">
                    <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white bg-white">
                                <ShoppingBag size={18} className="text-black" />
                            </div>
                            <div className="absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2 bg-red-500" />
                        </div>
                        <div className="flex-1 pb-8">
                            <p className="font-display text-sm uppercase tracking-wider text-white">
                                Order Placed
                            </p>
                            {order?.processedAt && (
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                    {formatDate(order.processedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cancelled - Final State */}
                <div className="relative">
                    <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-red-500 bg-red-500"
                            >
                                <XCircle size={18} className="text-white" />
                            </motion.div>
                        </div>
                        <div className="flex-1 pb-0">
                            <p className="font-display text-sm uppercase tracking-wider text-red-400">
                                Order Cancelled
                            </p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1"
                            >
                                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                                CANCELLED
                            </motion.p>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                                Refund will be processed within 5-7 business days
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normal timeline for non-cancelled orders
    const stages = [
        { key: 'ORDERED', ...DELIVERY_STAGES.ORDERED, completed: currentStage >= 1, active: currentStage === 1 },
        { key: 'PROCESSING', ...DELIVERY_STAGES.PROCESSING, completed: currentStage >= 2, active: currentStage === 2 },
        { key: 'SHIPPED', ...DELIVERY_STAGES.SHIPPED, completed: currentStage >= 3, active: currentStage === 3 },
        { key: 'OUT_FOR_DELIVERY', ...DELIVERY_STAGES.OUT_FOR_DELIVERY, completed: currentStage >= 4, active: currentStage === 4 },
        { key: 'DELIVERED', ...DELIVERY_STAGES.DELIVERED, completed: currentStage >= 5, active: currentStage === 5 },
    ];

    // Get latest event for each stage from tracking events
    const getStageEvent = (stageKey) => {
        if (!trackingEvents || trackingEvents.length === 0) return null;

        // Map stage keys to status patterns
        const patterns = {
            ORDERED: ['order', 'placed', 'received', 'created'],
            PROCESSING: ['processing', 'prepared', 'packing', 'packed'],
            SHIPPED: ['shipped', 'dispatched', 'picked', 'manifested', 'transit'],
            OUT_FOR_DELIVERY: ['out for delivery', 'ofd', 'delivery'],
            DELIVERED: ['delivered', 'dlvd', 'pod'],
        };

        const stagePatterns = patterns[stageKey] || [];
        for (const event of trackingEvents) {
            const statusLower = (event.status || '').toLowerCase();
            if (stagePatterns.some(p => statusLower.includes(p))) {
                return event;
            }
        }
        return null;
    };

    return (
        <div className="space-y-1">
            {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isLast = index === stages.length - 1;
                const stageEvent = getStageEvent(stage.key);

                return (
                    <div key={stage.key} className="relative">
                        <div className="flex items-start gap-4">
                            {/* Icon Circle */}
                            <div className="relative flex-shrink-0">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: stage.active ? [1, 1.1, 1] : 1,
                                        backgroundColor: stage.completed
                                            ? stage.key === 'DELIVERED' ? '#22c55e' : '#ffffff'
                                            : '#333333'
                                    }}
                                    transition={{
                                        scale: { repeat: stage.active ? Infinity : 0, duration: 2 },
                                        backgroundColor: { duration: 0.3 }
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${stage.completed
                                        ? stage.key === 'DELIVERED'
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-white bg-white'
                                        : 'border-[#333] bg-[#111]'
                                        }`}
                                >
                                    <Icon
                                        size={18}
                                        className={stage.completed
                                            ? stage.key === 'DELIVERED' ? 'text-white' : 'text-black'
                                            : 'text-gray-600'
                                        }
                                    />
                                </motion.div>

                                {/* Connecting Line */}
                                {!isLast && (
                                    <div className="absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: '100%' }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className={stage.completed ? 'bg-white' : 'bg-[#333]'}
                                            style={{ width: '2px', height: '100%' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Stage Content */}
                            <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
                                <p className={`font-display text-sm uppercase tracking-wider ${stage.completed ? 'text-white' : 'text-gray-500'
                                    }`}>
                                    {stage.label}
                                </p>
                                {stage.active && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-green-400 font-mono mt-1 flex items-center gap-1"
                                    >
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        CURRENT STATUS
                                    </motion.p>
                                )}
                                {/* Show event details if available */}
                                {stageEvent && stage.completed && (
                                    <div className="mt-1">
                                        {stageEvent.location && (
                                            <p className="text-xs text-gray-400">
                                                📍 {stageEvent.location}
                                            </p>
                                        )}
                                        {stageEvent.time && (
                                            <p className="text-xs text-gray-500 font-mono">
                                                {new Date(stageEvent.time).toLocaleString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {stage.key === 'ORDERED' && order?.processedAt && !stageEvent && (
                                    <p className="text-xs text-gray-500 font-mono mt-1">
                                        {formatDate(order.processedAt)}
                                    </p>
                                )}
                                {stage.key === 'DELIVERED' && stage.completed && (
                                    <p className="text-xs text-green-400 font-mono mt-1">
                                        ✓ Successfully delivered
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Live Status Banner Component
 */
const LiveStatusBanner = ({ status, isDelivered, isOutForDelivery, isFailed, isRTO, isCancelled, lastLocation }) => {
    if (isCancelled) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 p-4 mb-6 flex items-center gap-3"
            >
                <XCircle className="h-6 w-6 text-red-400" />
                <div>
                    <p className="text-red-400 font-display uppercase tracking-wider text-sm">
                        ORDER CANCELLED
                    </p>
                    <p className="text-red-300/70 text-xs font-mono">
                        This order has been cancelled. A refund will be processed if applicable.
                    </p>
                </div>
            </motion.div>
        );
    }

    if (isDelivered) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 p-4 mb-6 flex items-center gap-3"
            >
                <PackageCheck className="h-6 w-6 text-green-400" />
                <div>
                    <p className="text-green-400 font-display uppercase tracking-wider text-sm">
                        DELIVERED
                    </p>
                    <p className="text-green-300/70 text-xs font-mono">
                        Your order has been successfully delivered
                    </p>
                </div>
            </motion.div>
        );
    }

    if (isFailed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 p-4 mb-6 flex items-center gap-3"
            >
                <XCircle className="h-6 w-6 text-red-400" />
                <div>
                    <p className="text-red-400 font-display uppercase tracking-wider text-sm">
                        DELIVERY FAILED
                    </p>
                    <p className="text-red-300/70 text-xs font-mono">
                        Delivery attempt was unsuccessful. Re-attempt will be made.
                    </p>
                </div>
            </motion.div>
        );
    }

    if (isRTO) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-500/20 border border-orange-500/50 p-4 mb-6 flex items-center gap-3"
            >
                <RotateCcw className="h-6 w-6 text-orange-400" />
                <div>
                    <p className="text-orange-400 font-display uppercase tracking-wider text-sm">
                        RETURNING TO ORIGIN
                    </p>
                    <p className="text-orange-300/70 text-xs font-mono">
                        Package is being returned to the seller.
                    </p>
                </div>
            </motion.div>
        );
    }

    if (isOutForDelivery) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/20 border border-blue-500/50 p-4 mb-6 flex items-center gap-3"
            >
                <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <Truck className="h-6 w-6 text-blue-400" />
                </motion.div>
                <div className="flex-1">
                    <p className="text-blue-400 font-display uppercase tracking-wider text-sm">
                        OUT FOR DELIVERY
                    </p>
                    <p className="text-blue-300/70 text-xs font-mono">
                        Your package is on its way to you today!
                        {lastLocation && ` • Last seen at: ${lastLocation}`}
                    </p>
                </div>
            </motion.div>
        );
    }

    return null;
};

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [carrierStatus, setCarrierStatus] = useState(null);
    const [trackingEvents, setTrackingEvents] = useState([]);

    /**
     * Simulate carrier tracking status (in production, use real API)
     * This updates the status based on Shopify fulfillment + simulated carrier data
     */
    const updateCarrierStatus = useCallback((orderData) => {
        if (!orderData?.trackingInfo?.length) return;

        const tracking = orderData.trackingInfo[0];
        const carrier = detectCarrier(tracking.company);

        // Get current stage from Shopify status
        let stage = getDeliveryStageFromStatus(orderData.fulfillmentStatus);

        // In production, you would fetch from carrier API here
        // For now, we'll use Shopify's fulfillment status
        // which should be updated by Shopify when carrier updates status

        const statusDisplay = getStatusDisplay(stage);

        setCarrierStatus({
            carrier: carrier,
            carrierName: tracking.company,
            trackingNumber: tracking.number,
            trackingUrl: tracking.url,
            stage: stage,
            display: statusDisplay,
            lastUpdate: new Date().toISOString(),
        });

        // Simulate tracking events based on current stage
        const events = [];
        const now = new Date();

        if (stage >= 1) {
            events.push({
                status: 'Order Placed',
                time: orderData.processedAt,
                location: 'Online',
            });
        }
        if (stage >= 2) {
            events.push({
                status: 'Order Confirmed & Processing',
                time: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Warehouse',
            });
        }
        if (stage >= 3) {
            events.push({
                status: `Shipped via ${tracking.company || 'Carrier'}`,
                time: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Dispatch Hub',
            });
            events.push({
                status: 'In Transit',
                time: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
                location: 'Local Hub',
            });
        }
        if (stage >= 4) {
            events.push({
                status: 'Out for Delivery',
                time: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
                location: orderData.shippingAddress?.city || 'Delivery Area',
            });
        }
        if (stage >= 5) {
            events.push({
                status: 'Delivered',
                time: now.toISOString(),
                location: orderData.shippingAddress?.city || 'Delivery Address',
            });
        }

        setTrackingEvents(events.reverse()); // Most recent first
    }, []);

    /**
     * Load order data
     */
    const loadOrder = useCallback(async (showLoader = true) => {
        const accessToken = localStorage.getItem('customer_token');

        if (!accessToken) {
            navigate('/');
            return;
        }

        try {
            if (showLoader) setIsLoading(true);
            setIsRefreshing(!showLoader);

            const data = await fetchCustomerDossier(accessToken);

            // Find the specific order
            const foundOrder = data.orders?.find(o =>
                o.orderNumber.toString() === orderId ||
                o.id === orderId ||
                o.id.includes(orderId)
            );

            if (foundOrder) {
                setOrder(foundOrder);
                setLastUpdated(new Date());

                // Update carrier status
                updateCarrierStatus(foundOrder);
            } else {
                setError('Order not found');
            }
        } catch (err) {
            console.error('Failed to load order:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [orderId, navigate, updateCarrierStatus]);

    // Initial load
    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    // Auto-refresh every 30 seconds for live tracking
    useEffect(() => {
        const interval = setInterval(() => {
            loadOrder(false);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [loadOrder]);

    /**
     * Determine current delivery stage
     */
    const getCurrentStage = () => {
        if (carrierStatus?.stage) {
            return carrierStatus.stage;
        }
        return getDeliveryStageFromStatus(order?.fulfillmentStatus);
    };

    /**
     * Check delivery status flags
     */
    const checkDeliveryFlags = () => {
        const stage = getCurrentStage();
        const status = (order?.fulfillmentStatus || '').toLowerCase();
        const financial = (order?.financialStatus || '').toLowerCase();

        return {
            isCancelled: stage === 0 || isOrderCancelled(status, financial),
            isDelivered: stage >= 5 || isOrderDelivered(status),
            isOutForDelivery: stage === 4 || isOrderOutForDelivery(status),
            isFailed: status.includes('failed'),
            isRTO: status.includes('rto') || status.includes('return'),
        };
    };

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
            // Use carrier status if available
            if (carrierStatus?.display) {
                return {
                    icon: carrierStatus.stage >= 5 ? PackageCheck : Truck,
                    color: carrierStatus.display.color,
                    bg: carrierStatus.display.bg,
                    label: carrierStatus.display.label,
                };
            }

            // Fallback to Shopify status
            if (statusLower === 'delivered' || statusLower === 'complete' || statusLower === 'completed') {
                return { icon: PackageCheck, color: 'text-green-400', bg: 'bg-green-900/20', label: 'DELIVERED' };
            } else if (statusLower === 'out_for_delivery' || statusLower === 'out for delivery' || statusLower === 'in_transit') {
                return { icon: Truck, color: 'text-blue-400', bg: 'bg-blue-900/20', label: 'OUT FOR DELIVERY' };
            } else if (statusLower === 'fulfilled' || statusLower === 'shipped' || statusLower === 'in_progress') {
                return { icon: Truck, color: 'text-blue-400', bg: 'bg-blue-900/20', label: 'SHIPPED' };
            } else if (statusLower === 'partial') {
                return { icon: Package, color: 'text-yellow-400', bg: 'bg-yellow-900/20', label: 'PARTIAL' };
            }
        }
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-900/20', label: status?.toUpperCase() || 'PROCESSING' };
    };

    // Manual refresh handler
    const handleRefresh = () => {
        loadOrder(false);
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
    const currentStage = getCurrentStage();
    const { isCancelled, isDelivered, isOutForDelivery, isFailed, isRTO } = checkDeliveryFlags();
    const lastLocation = trackingEvents[0]?.location;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-6 lg:p-12 pt-28 md:pt-32">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6 md:mb-8"
                >
                    <button
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-sm h-12 active:scale-95"
                    >
                        <ArrowLeft size={16} />
                        BACK TO DASHBOARD
                    </button>
                </motion.div>

                {/* Live Status Banner */}
                <LiveStatusBanner
                    status={order.fulfillmentStatus}
                    isCancelled={isCancelled}
                    isDelivered={isDelivered}
                    isOutForDelivery={isOutForDelivery}
                    isFailed={isFailed}
                    isRTO={isRTO}
                    lastLocation={lastLocation}
                />

                {/* Order Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 md:mb-8"
                >
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-white">
                            ORDER #{order.orderNumber}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <span className={`flex items-center gap-1 px-2 md:px-3 py-1 text-xs font-mono uppercase tracking-wider ${paymentStatus.color} ${paymentStatus.bg} border border-current/30`}>
                                <PaymentIcon size={12} />
                                {paymentStatus.label}
                            </span>
                            <span className={`flex items-center gap-1 px-2 md:px-3 py-1 text-xs font-mono uppercase tracking-wider ${fulfillmentStatus.color} ${fulfillmentStatus.bg} border border-current/30 ${isOutForDelivery ? 'animate-pulse' : ''}`}>
                                <FulfillmentIcon size={12} />
                                {fulfillmentStatus.label}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-gray-500 font-mono text-sm flex items-center gap-2">
                            <Calendar size={14} />
                            Placed on {formatDate(order.processedAt)}
                        </p>
                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                        >
                            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                            {isRefreshing ? 'Updating...' : 'Refresh'}
                        </button>
                        {lastUpdated && (
                            <span className="text-xs text-gray-600 font-mono">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column: Line Items + Tracking (2/3) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Live Tracking Timeline */}
                        <div className={`border ${isCancelled ? 'border-red-500/30' : 'border-[#333]'} bg-[#0a0a0a] p-5 md:p-6`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    {isCancelled ? (
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    ) : (
                                        <Truck className="h-5 w-5 text-white" />
                                    )}
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                        {isCancelled ? 'ORDER STATUS' : 'LIVE TRACKING'}
                                    </h2>
                                </div>
                                {isCancelled ? (
                                    <div className="flex items-center gap-1 text-xs text-red-400 font-mono">
                                        <span className="w-2 h-2 rounded-full bg-red-400" />
                                        CANCELLED
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-xs text-green-400 font-mono">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        LIVE
                                    </div>
                                )}
                            </div>

                            <TrackingTimeline
                                order={order}
                                currentStage={currentStage}
                                trackingEvents={trackingEvents}
                                isCancelled={isCancelled}
                            />
                        </div>

                        {/* Carrier Tracking Section */}
                        {order.trackingInfo?.length > 0 && (
                            <div className="border border-[#333] bg-[#0a0a0a] p-5 md:p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <ExternalLink className="h-5 w-5 text-white" />
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                        CARRIER TRACKING
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {order.trackingInfo.map((tracking, idx) => (
                                        <div key={idx}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#111] border border-[#222]">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1 flex items-center gap-2">
                                                        {tracking.company || 'Shipping Carrier'}
                                                        {carrierStatus?.carrier && carrierStatus.carrier !== 'UNKNOWN' && (
                                                            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px]">
                                                                {carrierStatus.carrier}
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-lg md:text-xl text-white font-mono tracking-wider break-all">
                                                        {tracking.number}
                                                    </p>
                                                </div>
                                                {tracking.url && (
                                                    <a
                                                        href={tracking.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 h-12 bg-white text-black font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all"
                                                    >
                                                        <ExternalLink size={16} />
                                                        TRACK ON CARRIER SITE
                                                    </a>
                                                )}
                                            </div>

                                            {/* Manual Status Update - for when carrier shows delivered but Shopify doesn't */}
                                            {!isDelivered && (
                                                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30">
                                                    <p className="text-xs text-yellow-400/80 font-mono mb-3">
                                                        ⚠️ If the carrier shows your order as delivered but the status here doesn't match, you can manually update it:
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setManualTrackingStatus(tracking.number, DELIVERY_STATUS.DELIVERED);
                                                            // Force refresh to show updated status
                                                            setCarrierStatus(prev => ({
                                                                ...prev,
                                                                stage: 5,
                                                                display: getStatusDisplay(5),
                                                            }));
                                                            setTrackingEvents(prev => [
                                                                {
                                                                    status: 'Marked as Delivered (Manual)',
                                                                    time: new Date().toISOString(),
                                                                    location: order.shippingAddress?.city || 'Delivery Address',
                                                                },
                                                                ...prev,
                                                            ]);
                                                        }}
                                                        className="flex items-center justify-center gap-2 px-4 py-2.5 h-10 bg-green-600 text-white font-bold uppercase tracking-wider text-xs hover:bg-green-500 active:scale-95 transition-all"
                                                    >
                                                        <PackageCheck size={14} />
                                                        MARK AS DELIVERED
                                                    </button>
                                                </div>
                                            )}

                                            {/* Tracking Events History */}
                                            <TrackingEvents events={trackingEvents} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Items Section */}
                        <div className="border border-[#333] bg-[#0a0a0a] p-5 md:p-6">
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
                                                    className="w-16 h-16 md:w-20 md:h-20 object-cover border border-[#333]"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                                                    <Package size={24} className="text-gray-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <h3 className="font-display text-white text-base md:text-lg mb-1">
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
                    </motion.div>

                    {/* Right Column: Summary (1/3) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Order Total Card */}
                        <div className="border border-white/30 bg-[#0a0a0a] p-5 md:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="h-5 w-5 text-white" />
                                <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                    ORDER TOTAL
                                </h2>
                            </div>
                            <p className="font-display text-3xl md:text-4xl font-bold text-white">
                                {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                            </p>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                            <div className="border border-[#333] bg-[#0a0a0a] p-5 md:p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Home className="h-5 w-5 text-white" />
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                        DELIVERY ADDRESS
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

                        {/* Delivery Status Card - Only show when shipped (stage >= 3) and not cancelled */}
                        {!isCancelled && currentStage >= 3 && (
                            <div className={`border p-5 md:p-6 ${isDelivered
                                ? 'border-green-500/50 bg-green-500/5'
                                : isFailed
                                    ? 'border-red-500/50 bg-red-500/5'
                                    : 'border-[#333] bg-[#0a0a0a]'
                                }`}>
                                <div className="flex items-center gap-2 mb-4">
                                    {isDelivered ? (
                                        <PackageCheck className="h-5 w-5 text-green-400" />
                                    ) : isFailed ? (
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-white" />
                                    )}
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400">
                                        DELIVERY STATUS
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full ${isDelivered
                                        ? 'bg-green-500'
                                        : isFailed
                                            ? 'bg-red-500'
                                            : isOutForDelivery
                                                ? 'bg-blue-500 animate-pulse'
                                                : 'bg-yellow-500'
                                        }`}
                                    />
                                    <p className={`font-display text-lg uppercase tracking-wider ${isDelivered
                                        ? 'text-green-400'
                                        : isFailed
                                            ? 'text-red-400'
                                            : isOutForDelivery
                                                ? 'text-blue-400'
                                                : 'text-white'
                                        }`}>
                                        {isDelivered ? 'Delivered' : isFailed ? 'Delivery Failed' : isOutForDelivery ? 'Out for Delivery' : 'In Transit'}
                                    </p>
                                </div>
                                {carrierStatus?.lastUpdate && (
                                    <p className="text-xs text-gray-600 font-mono mt-2">
                                        Status updated: {new Date(carrierStatus.lastUpdate).toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Order Actions - Cancel Request */}
                        {!isCancelled && !isDelivered && !isOutForDelivery && currentStage < 3 && (
                            <div className="border border-[#333] bg-[#0a0a0a] p-5 md:p-6">
                                <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400 mb-4">
                                    ORDER ACTIONS
                                </h2>
                                <p className="text-gray-500 text-sm mb-4">
                                    Need to cancel this order? You can request cancellation before it's shipped.
                                </p>
                                <button
                                    onClick={async () => {
                                        const reason = prompt('Please provide a reason for cancellation (optional):');
                                        if (reason !== null) {
                                            // Store cancellation request
                                            storeCancellationRequest(order.id, order.orderNumber, reason);

                                            // Mark as cancelled locally
                                            const trackingNum = order.trackingInfo?.[0]?.number || `order-${order.orderNumber}`;
                                            setOrderCancelled(trackingNum);

                                            // Update UI
                                            setCarrierStatus(prev => ({
                                                ...prev,
                                                stage: 0,
                                                display: getStatusDisplay(0),
                                            }));
                                            setTrackingEvents(prev => [
                                                {
                                                    status: 'Cancellation Requested',
                                                    time: new Date().toISOString(),
                                                    location: 'System',
                                                },
                                                ...prev,
                                            ]);

                                            // Format shipping address for notification
                                            const address = order.shippingAddress;
                                            const formattedAddress = address
                                                ? `${address.address1 || ''}, ${address.city || ''}, ${address.province || ''}, ${address.country || ''}`
                                                : 'N/A';

                                            // Send notification to seller
                                            try {
                                                await sendCancellationNotification({
                                                    orderNumber: order.orderNumber,
                                                    customerName: address?.name || 'Customer',
                                                    customerEmail: localStorage.getItem('customerEmail') || '',
                                                    reason: reason,
                                                    orderTotal: formatCurrency(order.totalPrice),
                                                    shippingAddress: formattedAddress,
                                                });
                                                alert('Cancellation request submitted! The seller has been notified.');
                                            } catch (err) {
                                                console.error('Failed to send notification:', err);
                                                alert('Cancellation request submitted. Please also contact the seller directly.');
                                            }
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 h-12 bg-red-600 text-white font-bold uppercase tracking-wider hover:bg-red-500 active:scale-95 transition-all text-sm"
                                >
                                    <XCircle size={16} />
                                    REQUEST CANCELLATION
                                </button>
                            </div>
                        )}

                        {/* Cancellation Pending Notice */}
                        {isCancelled && (
                            <div className="border border-red-500/30 bg-red-500/5 p-5 md:p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-5 w-5 text-red-400" />
                                    <h2 className="font-mono text-sm uppercase tracking-widest text-red-400">
                                        ORDER CANCELLED
                                    </h2>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    This order has been cancelled. Refund will be processed within 5-7 business days if applicable.
                                </p>
                            </div>
                        )}

                        {/* Need Help */}
                        <div className="border border-[#333] bg-[#0a0a0a] p-5 md:p-6">
                            <h2 className="font-mono text-sm uppercase tracking-widest text-gray-400 mb-4">
                                NEED HELP?
                            </h2>
                            <p className="text-gray-500 text-sm mb-4">
                                Contact our support team for any questions about your order.
                            </p>
                            <Link
                                to="/contact"
                                className="block w-full text-center py-3 h-12 border border-[#333] text-gray-400 hover:border-white hover:text-white active:scale-95 transition-all font-mono text-sm uppercase tracking-wider"
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
