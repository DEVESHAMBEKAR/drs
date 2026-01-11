import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShopify } from '../context/ShopifyContext';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const navigate = useNavigate();
    const { loginCustomer, loginWithGoogle } = useShopify();
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
        // Call Shopify authentication
        const result = await loginCustomer(formData.email, formData.password);

        if (result === true) {
            // Login successful - close modal and redirect
            onClose();
            navigate('/account');
        } else {
            // Login failed - show error message
            setError(result || 'Login failed. Please try again.');
        }
    };

    const handleSignup = async () => {
        // Redirect to Shopify's customer registration
        const shopDomain = 'deep-root-studios.myshopify.com';
        window.location.href = `https://${shopDomain}/account/register`;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        try {
            await loginWithGoogle();
            // Success - close modal and redirect
            onClose();
            navigate('/account');
        } catch (err) {
            setError(err || 'Google Sign-In failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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

                            {/* Google Sign In Button (Login only) */}
                            {isLoginMode && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignIn}
                                        disabled={isLoading}
                                        className="w-full mb-6 flex items-center justify-center gap-3 border border-[#a3a3a3]/30 bg-white py-3 font-medium text-[#1f1f1f] transition-all hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 18 18">
                                            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                                            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" />
                                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    {/* Divider */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-[#a3a3a3]/30"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="bg-[#121212] px-2 text-[#a3a3a3]">Or continue with email</span>
                                        </div>
                                    </div>
                                </>
                            )}

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
                                    className="w-full bg-[#c0a060] py-3 font-medium tracking-wide text-[#0a0a0a] transition-all hover:bg-[#d4b574] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading && (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a]"></div>
                                    )}
                                    {isLoading
                                        ? 'Processing...'
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
                                        href={`https://deep-root-studios.myshopify.com/account/login#recover`}
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
