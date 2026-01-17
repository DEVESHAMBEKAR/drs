import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShopify } from '../context/ShopifyContext';

// Shopify OAuth Configuration
const SHOP_DOMAIN = 'deep-root-studios.myshopify.com';
const CLIENT_ID = '4dae98198cc50eb2b64ab901e7910625'; // Storefront Access Token doubles as client ID for some flows
const CALLBACK_URL = typeof window !== 'undefined'
    ? `${window.location.origin}/account/callback`
    : 'https://deeprootstudios.in/account/callback';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const navigate = useNavigate();
    const { loginCustomer } = useShopify();
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
        window.location.href = `https://${SHOP_DOMAIN}/account/register`;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle Google/OAuth Sign In via Shopify Customer Account API
     * Uses OAuth 2.0 Authorization Code Flow
     */
    const handleGoogleSignIn = () => {
        setIsLoading(true);

        // Build the Shopify Customer Account API OAuth URL
        // This redirects to Shopify's login page which supports Google Sign-In
        const authUrl = new URL(`https://${SHOP_DOMAIN}/account/login`);

        // Add return URL so user comes back to our site after auth
        authUrl.searchParams.set('return_url', CALLBACK_URL);
        authUrl.searchParams.set('checkout_url', CALLBACK_URL);

        // Redirect to Shopify login (supports Google, Apple, etc.)
        window.location.href = authUrl.toString();
    };

    /**
     * Alternative: Direct Google OAuth via Shopify Multipass (if enabled)
     * This requires Shopify Plus and Multipass setup
     */
    const handleShopifyOAuth = () => {
        setIsLoading(true);

        // Generate a state parameter for security
        const state = Math.random().toString(36).substring(7);
        sessionStorage.setItem('oauth_state', state);

        // Shopify Customer Account API OAuth endpoint
        const oauthUrl = `https://shopify.com/authentication/${SHOP_DOMAIN.replace('.myshopify.com', '')}/oauth/authorize`;

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            scope: 'openid email customer-account-api:full',
            redirect_uri: CALLBACK_URL,
            response_type: 'code',
            state: state,
        });

        window.location.href = `${oauthUrl}?${params.toString()}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Deep Black */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md"
                    />

                    {/* Modal Container - Full Screen Centered */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-md border-t-4 border-t-white border border-[#27272a] bg-[#0a0a0a] p-8 rounded-none max-h-[90vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-[#666] transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            {/* Header - Industrial Typography */}
                            <div className="mb-8">
                                <h2 className="font-display text-2xl font-bold tracking-wider uppercase text-white">
                                    {isLoginMode ? 'ACCESS TERMINAL' : 'CREATE ACCOUNT'}
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    {isLoginMode
                                        ? 'Enter your credentials.'
                                        : 'Join the art collective.'}
                                </p>
                            </div>

                            {/* Social Login Section (Login only) */}
                            {isLoginMode && (
                                <>
                                    {/* Google Sign In Button - OAuth Flow */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignIn}
                                        disabled={isLoading}
                                        className="w-full mb-4 h-12 flex items-center justify-center gap-3 border border-[#333] bg-white text-black font-display font-bold tracking-wider rounded-none transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 18 18">
                                            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                                            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" />
                                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                                        </svg>
                                        CONTINUE WITH GOOGLE
                                    </button>

                                    {/* Divider - Industrial Style */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-[#333]"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-[#0a0a0a] px-4 text-xs text-gray-600 uppercase tracking-widest font-mono">
                                                — OR AUTHENTICATE WITH —
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* First Name (Signup only) */}
                                {!isLoginMode && (
                                    <div className="space-y-2">
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required={!isLoginMode}
                                                className="w-full h-12 border border-[#333] bg-[#121212] rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-white focus:outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Last Name (Signup only) */}
                                {!isLoginMode && (
                                    <div className="space-y-2">
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required={!isLoginMode}
                                                className="w-full h-12 border border-[#333] bg-[#121212] rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-white focus:outline-none"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                                            size={18}
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-12 border border-[#333] bg-[#121212] rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-white focus:outline-none"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                                            size={18}
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-12 border border-[#333] bg-[#121212] rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-white focus:outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="border-l-2 border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button - High Contrast */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-white text-black font-display font-bold tracking-wider uppercase rounded-none transition-all duration-300 hover:bg-neon-gold hover:text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading && (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black"></div>
                                    )}
                                    {isLoading
                                        ? 'Processing...'
                                        : isLoginMode
                                            ? 'AUTHENTICATE'
                                            : 'CREATE ACCOUNT'}
                                </button>
                            </form>

                            {/* Extra Links - Split Layout */}
                            {isLoginMode && (
                                <div className="mt-6 flex justify-between items-center text-xs">
                                    <a
                                        href={`https://${SHOP_DOMAIN}/account/login#recover`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-white underline-offset-4 hover:underline transition-colors"
                                    >
                                        Forgot Password?
                                    </a>
                                    <button
                                        onClick={() => {
                                            setIsLoginMode(false);
                                            setError('');
                                        }}
                                        className="text-gray-500 hover:text-white underline-offset-4 hover:underline transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}

                            {/* Toggle to Login (Signup mode) */}
                            {!isLoginMode && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => {
                                            setIsLoginMode(true);
                                            setError('');
                                        }}
                                        className="text-xs text-gray-500 hover:text-white underline-offset-4 hover:underline transition-colors"
                                    >
                                        Already have an account? Sign in
                                    </button>
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
