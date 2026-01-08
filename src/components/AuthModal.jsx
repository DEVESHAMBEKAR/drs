import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                // Login logic
                await handleLogin();
            } else {
                // Signup logic
                await handleSignup();
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        // For now, we'll redirect to Shopify's customer login
        // In production, you would use Shopify's Customer Account API
        const shopDomain = 'your-store.myshopify.com'; // TODO: Replace with your actual domain
        window.location.href = `https://${shopDomain}/account/login`;
    };

    const handleSignup = async () => {
        // Redirect to Shopify's customer registration
        const shopDomain = 'your-store.myshopify.com'; // TODO: Replace with your actual domain
        window.location.href = `https://${shopDomain}/account/register`;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-[#121212] p-8 shadow-2xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-[#a3a3a3] transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            {/* Header */}
                            <div className="mb-8 text-center">
                                <h2 className="font-serif text-3xl text-[#e5e5e5]">
                                    {isLoginMode ? 'Welcome Back' : 'Join the Atelier'}
                                </h2>
                                <p className="mt-2 text-sm text-[#a3a3a3]">
                                    {isLoginMode
                                        ? 'Sign in to your account'
                                        : 'Create your Deep Root Studios account'}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* First Name (Signup only) */}
                                {!isLoginMode && (
                                    <div className="space-y-2">
                                        <label className="block text-sm text-[#a3a3a3]">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required={!isLoginMode}
                                                className="w-full border border-[#a3a3a3]/30 bg-transparent py-3 pl-10 pr-4 text-[#e5e5e5] placeholder-[#a3a3a3] transition-colors focus:border-[#c0a060] focus:outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Last Name (Signup only) */}
                                {!isLoginMode && (
                                    <div className="space-y-2">
                                        <label className="block text-sm text-[#a3a3a3]">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required={!isLoginMode}
                                                className="w-full border border-[#a3a3a3]/30 bg-transparent py-3 pl-10 pr-4 text-[#e5e5e5] placeholder-[#a3a3a3] transition-colors focus:border-[#c0a060] focus:outline-none"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-sm text-[#a3a3a3]">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]"
                                            size={18}
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-[#a3a3a3]/30 bg-transparent py-3 pl-10 pr-4 text-[#e5e5e5] placeholder-[#a3a3a3] transition-colors focus:border-[#c0a060] focus:outline-none"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="block text-sm text-[#a3a3a3]">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]"
                                            size={18}
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-[#a3a3a3]/30 bg-transparent py-3 pl-10 pr-4 text-[#e5e5e5] placeholder-[#a3a3a3] transition-colors focus:border-[#c0a060] focus:outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="rounded bg-red-500/10 p-3 text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#c0a060] py-3 font-medium tracking-wide text-[#0a0a0a] transition-all hover:bg-[#d4b574] disabled:opacity-50"
                                >
                                    {isLoading
                                        ? 'Please wait...'
                                        : isLoginMode
                                            ? 'Sign In'
                                            : 'Create Account'}
                                </button>
                            </form>

                            {/* Toggle Mode */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => {
                                        setIsLoginMode(!isLoginMode);
                                        setError('');
                                    }}
                                    className="text-sm text-[#a3a3a3] transition-colors hover:text-[#c0a060]"
                                >
                                    {isLoginMode
                                        ? "Don't have an account? Sign up"
                                        : 'Already have an account? Sign in'}
                                </button>
                            </div>

                            {/* Forgot Password (Login only) */}
                            {isLoginMode && (
                                <div className="mt-4 text-center">
                                    <a
                                        href={`https://your-store.myshopify.com/account/login#recover`}
                                        className="text-sm text-[#a3a3a3] transition-colors hover:text-[#c0a060]"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
