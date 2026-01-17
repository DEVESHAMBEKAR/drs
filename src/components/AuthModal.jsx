import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShopify } from '../context/ShopifyContext';

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { isLoggedIn, customer, loginCustomer, fetchCustomerInfo } = useShopify();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check if already logged in when modal opens
    useEffect(() => {
        if (isOpen && isLoggedIn) {
            setSuccess(true);
            fetchCustomerInfo?.();
            setTimeout(() => {
                onClose();
                navigate('/account');
            }, 1000);
        }
    }, [isOpen, isLoggedIn]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ email: '', password: '', firstName: '', lastName: '' });
            setError('');
            setSuccess(false);
            setIsLoginMode(true);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // Clear error on input change
    };

    /**
     * Handle Login - Authenticate with Shopify Storefront API
     */
    const handleLogin = async () => {
        const result = await loginCustomer(formData.email, formData.password);

        if (result === true) {
            setSuccess(true);
            fetchCustomerInfo?.();
            setTimeout(() => {
                onClose();
                navigate('/account');
            }, 1500);
        } else {
            // Improve error messages
            let errorMessage = result || 'Invalid email or password.';

            if (errorMessage.toLowerCase().includes('unidentified')) {
                errorMessage = "Account not found. Please check your email or create a new account.";
            } else if (errorMessage.toLowerCase().includes('password')) {
                errorMessage = "Incorrect password. Please try again.";
            }

            setError(errorMessage);
        }
    };

    /**
     * Handle Signup - Create account with Shopify Storefront API
     */
    const handleSignup = async () => {
        const SHOP_DOMAIN = 'deep-root-studios.myshopify.com';
        const STOREFRONT_TOKEN = '4dae98198cc50eb2b64ab901e7910625';

        const mutation = `
            mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                    customer {
                        id
                        email
                        firstName
                        lastName
                    }
                    customerUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            input: {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                acceptsMarketing: true
            }
        };

        const response = await fetch(`https://${SHOP_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
            },
            body: JSON.stringify({ query: mutation, variables })
        });

        const result = await response.json();

        if (result.data?.customerCreate?.customerUserErrors?.length > 0) {
            const err = result.data.customerCreate.customerUserErrors[0];
            throw new Error(err.message);
        }

        if (result.data?.customerCreate?.customer) {
            // Account created - now log them in
            const loginResult = await loginCustomer(formData.email, formData.password);

            if (loginResult === true) {
                setSuccess(true);
                fetchCustomerInfo?.();
                setTimeout(() => {
                    onClose();
                    navigate('/account');
                }, 1500);
            } else {
                // Account created but auto-login failed
                setIsLoginMode(true);
                setFormData(prev => ({ ...prev, password: '' }));
                setError('Account created! Please sign in with your new password.');
            }
        }
    };

    /**
     * Form Submit Handler
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                await handleLogin();
            } else {
                await handleSignup();
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setFormData({ email: '', password: '', firstName: '', lastName: '' });
        onClose();
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
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-md border-2 border-neon-gold/20 bg-[#0a0a0a] p-8 rounded-none max-h-[90vh] overflow-y-auto shadow-2xl shadow-neon-gold/5"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            {/* Success State */}
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 mx-auto bg-neon-gold/20 border-2 border-neon-gold rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-neon-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <h2 className="font-heading text-xl font-bold tracking-wider uppercase text-neon-gold mb-2">
                                        {isLoggedIn && customer?.firstName
                                            ? `WELCOME, ${customer.firstName.toUpperCase()}!`
                                            : 'LOGIN SUCCESSFUL'}
                                    </h2>

                                    <p className="text-gray-400 text-sm">
                                        Redirecting to your dashboard...
                                    </p>

                                    <div className="mt-4">
                                        <div className="w-6 h-6 mx-auto border-2 border-neon-gold border-t-transparent rounded-full animate-spin" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="mb-8 text-center">
                                        <h2 className="font-heading text-2xl font-bold tracking-wider uppercase text-white">
                                            {isLoginMode ? 'SIGN IN' : 'CREATE ACCOUNT'}
                                        </h2>
                                        <p className="mt-2 text-sm text-zinc-500">
                                            {isLoginMode
                                                ? 'Access your DRS dashboard'
                                                : 'Join the art collective'}
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* First Name (Signup only) */}
                                        {!isLoginMode && (
                                            <div className="space-y-2">
                                                <label className="block text-xs text-neon-gold/80 uppercase tracking-wider font-semibold">
                                                    First Name
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-gold/50"
                                                        size={18}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        required={!isLoginMode}
                                                        className="w-full h-12 border border-luxury-border bg-luxury-card rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-neon-gold focus:outline-none"
                                                        placeholder="John"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Last Name (Signup only) */}
                                        {!isLoginMode && (
                                            <div className="space-y-2">
                                                <label className="block text-xs text-neon-gold/80 uppercase tracking-wider font-semibold">
                                                    Last Name
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-gold/50"
                                                        size={18}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        required={!isLoginMode}
                                                        className="w-full h-12 border border-luxury-border bg-luxury-card rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-neon-gold focus:outline-none"
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider font-semibold">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-gold/50"
                                                    size={18}
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    autoFocus
                                                    className="w-full h-12 border border-luxury-border bg-luxury-card rounded-none py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-neon-gold focus:outline-none"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider font-semibold">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-gold/50"
                                                    size={18}
                                                />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    minLength={5}
                                                    className="w-full h-12 border border-luxury-border bg-luxury-card rounded-none py-3 pl-10 pr-12 text-white placeholder-gray-600 transition-colors focus:border-neon-gold focus:outline-none"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {!isLoginMode && (
                                                <p className="text-xs text-gray-600">
                                                    Minimum 5 characters
                                                </p>
                                            )}
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="border-l-2 border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
                                                {error}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full h-12 bg-neon-gold text-black font-bold tracking-wider uppercase rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                            ) : (
                                                <>
                                                    {isLoginMode ? 'SIGN IN' : 'CREATE ACCOUNT'}
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Forgot Password */}
                                    {isLoginMode && (
                                        <div className="mt-4 text-center">
                                            <a
                                                href="https://deep-root-studios.myshopify.com/account/login#recover"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-gray-500 hover:text-neon-gold transition-colors underline-offset-4 hover:underline"
                                            >
                                                Forgot Password?
                                            </a>
                                        </div>
                                    )}

                                    {/* Toggle Login/Signup */}
                                    <div className="mt-6 pt-6 border-t border-luxury-border text-center">
                                        <p className="text-sm text-gray-500">
                                            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsLoginMode(!isLoginMode);
                                                setError('');
                                                setFormData({ email: '', password: '', firstName: '', lastName: '' });
                                            }}
                                            className="mt-2 text-neon-gold hover:text-white transition-colors font-bold uppercase tracking-wider text-sm"
                                        >
                                            {isLoginMode ? 'CREATE ACCOUNT' : 'SIGN IN'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
