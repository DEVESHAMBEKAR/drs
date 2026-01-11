import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';
import { Package, LogOut } from 'lucide-react';

const AccountPage = () => {
    const navigate = useNavigate();
    const { customerToken, userOrders, fetchCustomerOrders, logoutCustomer } = useShopify();

    // Check authentication and fetch orders
    useEffect(() => {
        if (!customerToken) {
            navigate('/login');
        } else {
            // Fetch orders when component mounts
            fetchCustomerOrders();
        }
    }, [customerToken, navigate, fetchCustomerOrders]);

    const handleLogout = () => {
        logoutCustomer();
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatPrice = (amount, currency) => {
        return `${currency === 'INR' ? '₹' : '$'}${parseFloat(amount).toLocaleString('en-IN')}`;
    };

    if (!customerToken) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20">
            <div className="mx-auto max-w-5xl px-6">
                {/* Page Header */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-serif text-4xl md:text-5xl text-[#c0a060]">
                        Order History
                    </h1>
                </motion.div>

                {/* Order List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    {userOrders.length === 0 ? (
                        // Empty State
                        <div className="border border-[#333] bg-[#18181b] p-12 text-center">
                            <Package className="mx-auto mb-6 h-16 w-16 text-[#c0a060]" />
                            <p className="font-serif text-2xl text-[#e5e5e5] mb-8">
                                No orders yet
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block bg-[#c0a060] px-10 py-4 font-body text-sm tracking-widest text-black transition-all hover:bg-[#d4b574]"
                            >
                                START COLLECTION
                            </Link>
                        </div>
                    ) : (
                        // Orders List
                        <div className="space-y-4">
                            {userOrders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    className="border border-[#333] bg-[#18181b] p-6 transition-all hover:border-[#c0a060]/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -2 }}
                                >
                                    {/* Order Header - Order Number and Price */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-body text-lg font-bold text-white">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <p className="mt-1 font-body text-sm text-[#a3a3a3]">
                                                {formatDate(order.processedAt)}
                                            </p>
                                        </div>
                                        <p className="font-heading text-2xl text-[#c0a060]">
                                            {formatPrice(
                                                order.totalPrice.amount,
                                                order.totalPrice.currencyCode
                                            )}
                                        </p>
                                    </div>

                                    {/* Order Items */}
                                    {order.lineItems?.edges?.length > 0 && (
                                        <div className="mb-4 border-t border-[#333] pt-4">
                                            {order.lineItems.edges.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between py-1 font-body text-sm text-[#e5e5e5]"
                                                >
                                                    <span>{item.node.title}</span>
                                                    <span className="text-[#a3a3a3]">
                                                        ×{item.node.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="flex justify-end">
                                        {order.fulfillmentStatus === 'FULFILLED' ? (
                                            <span className="inline-block bg-green-500/10 border border-green-500/30 px-4 py-2 font-body text-xs tracking-widest text-green-400">
                                                DISPATCHED
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 font-body text-xs tracking-widest text-yellow-400">
                                                IN PRODUCTION
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Logout Button */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 border-2 border-[#a3a3a3] bg-transparent px-8 py-3 font-body text-sm tracking-widest text-[#a3a3a3] transition-all hover:border-[#c0a060] hover:text-[#c0a060]"
                    >
                        <LogOut className="h-4 w-4" />
                        SIGN OUT
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default AccountPage;
