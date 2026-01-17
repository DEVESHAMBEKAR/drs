import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LayoutDashboard, Package, MapPin, LogOut } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';

const UserDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logoutCustomer } = useShopify();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutCustomer();
        setIsOpen(false);
        navigate('/');
    };

    const menuItems = [
        {
            label: 'DASHBOARD',
            path: '/account',
            icon: LayoutDashboard,
        },
        {
            label: 'ORDER HISTORY',
            path: '/account/orders',
            icon: Package,
        },
        {
            label: 'ADDRESS BOOK',
            path: '/account/addresses',
            icon: MapPin,
        },
    ];

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button
                className="group flex items-center gap-2 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <User className="h-5 w-5 text-smoke transition-colors group-hover:text-white" />
                <span className="hidden font-display text-sm tracking-widest text-smoke transition-colors group-hover:text-white sm:inline uppercase">
                    ACCOUNT
                </span>
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-0 w-64 border border-[#333] bg-[#0a0a0a] rounded-none shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] z-50"
                    >
                        <ul>
                            {/* Menu Items */}
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full text-left px-6 py-4 text-sm font-display uppercase tracking-wider text-gray-400 border-b border-[#222] hover:bg-white hover:text-black transition-colors duration-200"
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}

                            {/* Logout Button */}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full text-left px-6 py-4 text-sm font-display uppercase tracking-wider text-red-500 hover:bg-red-600 hover:text-white transition-colors duration-200"
                                >
                                    <LogOut size={16} />
                                    LOGOUT
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown;
