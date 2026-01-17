import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Package, AlertCircle, RefreshCw, ShoppingBag, Settings } from 'lucide-react';
import { fetchCustomerDossier, formatCurrency, formatDate } from '../api/shopify';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCustomerDossier = async () => {
            // Check for access token
            const accessToken = localStorage.getItem('customer_token');

            if (!accessToken) {
                // No token - redirect to home (will show login modal)
                navigate('/');
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchCustomerDossier(accessToken);
                setCustomer(data);
            } catch (err) {
                console.error('Failed to load customer dossier:', err);
                setError(err.message);

                // If token is invalid, clear it
                if (err.message.includes('expired') || err.message.includes('invalid')) {
                    localStorage.removeItem('customer_token');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadCustomerDossier();
    }, [navigate]);

    // Get payment status badge styling
    const getPaymentBadge = (status) => {
        const statusLower = status?.toLowerCase() || '';

        if (statusLower === 'paid') {
            return { className: 'text-green-400 bg-green-900/20 border-green-900/50', label: 'PAID' };
        } else if (statusLower === 'pending') {
            return { className: 'text-orange-400 bg-orange-900/20 border-orange-900/50', label: 'PENDING' };
        } else if (statusLower === 'refunded') {
            return { className: 'text-red-400 bg-red-900/20 border-red-900/50', label: 'REFUNDED' };
        }
        return { className: 'text-gray-400 bg-gray-900/20 border-gray-700', label: status?.toUpperCase() || 'UNKNOWN' };
    };

    // Get fulfillment status badge styling
    const getFulfillmentBadge = (status) => {
        const statusLower = status?.toLowerCase() || '';

        if (statusLower === 'fulfilled' || statusLower === 'shipped') {
            return { className: 'text-blue-400 bg-blue-900/20 border-blue-900/50', label: 'SHIPPED' };
        } else if (statusLower === 'in_progress' || statusLower === 'partial') {
            return { className: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/50', label: 'PROCESSING' };
        } else if (statusLower === 'unfulfilled') {
            return { className: 'text-white bg-white/10 border-white/20', label: 'PROCESSING' };
        }
        return { className: 'text-gray-400 bg-gray-900/20 border-gray-700', label: status?.toUpperCase() || 'PENDING' };
    };

    // Shimmer Skeleton Loader Component
    const ShimmerSkeleton = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card Skeleton */}
            <div className="border border-[#333] bg-[#0a0a0a] p-6 rounded-none">
                <div className="animate-pulse">
                    <div className="h-3 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-1/3 mb-6 shimmer"></div>
                    <div className="space-y-4">
                        <div className="h-6 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-2/3 shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-3/4 shimmer"></div>
                        <div className="h-px bg-[#333] my-6"></div>
                        <div className="h-3 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-1/4 shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-full shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-3/4 shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Orders List Skeleton */}
            <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-[#222] bg-[#0a0a0a] p-4 rounded-none animate-pulse">
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-5 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-24 shimmer"></div>
                            <div className="h-4 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-20 shimmer"></div>
                        </div>
                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="w-12 h-12 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded-none shimmer"></div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <div className="h-6 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-16 shimmer"></div>
                                <div className="h-6 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-20 shimmer"></div>
                            </div>
                            <div className="h-6 bg-gradient-to-r from-[#222] via-[#333] to-[#222] rounded w-24 shimmer"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Shimmer Animation Styles */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite linear;
                }
            `}</style>
        </div>
    );

    // Error State
    if (error && !isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-36">
                <div className="max-w-6xl mx-auto">
                    <div className="border border-red-900/50 bg-red-900/10 p-8 rounded-none flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="font-display text-2xl uppercase tracking-wider text-red-500 mb-2">
                            ACCESS DENIED
                        </h2>
                        <p className="text-gray-400 mb-6 font-mono text-sm">{error}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 rounded-none font-display uppercase tracking-wider text-sm"
                            >
                                <RefreshCw size={16} />
                                RETRY
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-colors duration-200 rounded-none font-display uppercase tracking-wider text-sm"
                            >
                                RETURN HOME
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-36">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
                        OPERATIVE DASHBOARD
                    </h1>
                    {!isLoading && customer && (
                        <p className="mt-3 text-gray-500 text-sm md:text-base font-mono">
                            Welcome back, <span className="text-neon-gold">{customer.firstName}</span>. Accessing secure records.
                        </p>
                    )}
                </motion.div>

                {isLoading ? (
                    <ShimmerSkeleton />
                ) : (
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* LEFT COLUMN: Profile Card */}
                        <div className="space-y-6">
                            {/* Operative Details Card */}
                            <div className="border border-[#333] bg-[#0a0a0a] p-6 rounded-none">
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="h-4 w-4 text-neon-gold" />
                                    <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                                        OPERATIVE DETAILS
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <p className="font-display text-2xl text-white">
                                            {customer?.firstName} {customer?.lastName}
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <p className="text-gray-400 text-sm break-all">
                                            {customer?.email}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    {customer?.phone && (
                                        <div>
                                            <p className="text-gray-400 text-sm">
                                                {customer.phone}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-[#333] my-6"></div>

                                {/* Base Location */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="h-4 w-4 text-neon-gold" />
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                                            BASE LOCATION
                                        </h3>
                                    </div>
                                    {customer?.defaultAddress ? (
                                        <div className="text-gray-300 text-sm leading-relaxed space-y-1">
                                            {customer.defaultAddress.map((line, index) => (
                                                <p key={index}>{line}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-sm italic">
                                            No base location configured
                                        </p>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-[#333] my-6"></div>

                                {/* Edit Protocols Button */}
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#333] text-gray-400 hover:border-white hover:text-white transition-colors duration-200 rounded-none font-display uppercase tracking-wider text-xs">
                                    <Settings size={14} />
                                    EDIT PROTOCOLS
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Order Feed (2/3) */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <Package className="h-4 w-4 text-neon-gold" />
                                <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                                    MISSION LOG // RECENT TRANSACTIONS
                                </h2>
                            </div>

                            {customer?.orders?.length > 0 ? (
                                <div className="space-y-4">
                                    {customer.orders.map((order) => {
                                        const paymentBadge = getPaymentBadge(order.financialStatus);
                                        const fulfillmentBadge = getFulfillmentBadge(order.fulfillmentStatus);

                                        return (
                                            <motion.div
                                                key={order.id}
                                                className="border border-[#222] bg-[#0a0a0a] p-4 md:p-5 rounded-none hover:border-white/50 transition-colors cursor-pointer group"
                                                whileHover={{ scale: 1.005 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {/* Top Row: Order ID & Date */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-mono text-neon-gold font-bold text-lg">
                                                        ORDER #{order.orderNumber}
                                                    </span>
                                                    <span className="text-gray-500 text-sm font-mono">
                                                        {formatDate(order.processedAt)}
                                                    </span>
                                                </div>

                                                {/* Middle Row: Product Thumbnails */}
                                                {order.lineItems?.length > 0 && (
                                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                                        {order.lineItems.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex-shrink-0 relative group/item"
                                                                title={item.title}
                                                            >
                                                                {item.imageUrl ? (
                                                                    <img
                                                                        src={item.imageUrl}
                                                                        alt={item.title}
                                                                        className="w-12 h-12 object-cover border border-[#333] group-hover:border-white/30 transition-colors"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                                                                        <ShoppingBag size={16} className="text-gray-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {order.lineItems.length > 4 && (
                                                            <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-gray-500 text-xs font-mono">
                                                                +{order.lineItems.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Bottom Row: Status Badges & Total */}
                                                <div className="flex flex-wrap justify-between items-center gap-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {/* Payment Status */}
                                                        <span className={`text-xs px-2 py-1 border rounded-none font-mono uppercase tracking-wider ${paymentBadge.className}`}>
                                                            {paymentBadge.label}
                                                        </span>
                                                        {/* Fulfillment Status */}
                                                        <span className={`text-xs px-2 py-1 border rounded-none font-mono uppercase tracking-wider ${fulfillmentBadge.className}`}>
                                                            {fulfillmentBadge.label}
                                                        </span>
                                                    </div>

                                                    {/* Total Price */}
                                                    <span className="font-display text-xl font-bold text-white">
                                                        {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className="border border-[#222] bg-[#0a0a0a] p-12 rounded-none text-center">
                                    <Package className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                                    <h3 className="font-display text-xl uppercase tracking-wider text-gray-400 mb-2">
                                        NO MISSIONS FOUND
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 font-mono">
                                        Your transaction log is empty.
                                    </p>
                                    <Link
                                        to="/shop"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-neon-gold transition-colors duration-200 rounded-none font-display uppercase tracking-wider text-sm font-bold"
                                    >
                                        <ShoppingBag size={18} />
                                        START A NEW ORDER
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
