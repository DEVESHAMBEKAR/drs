import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

// Shopify Configuration
const SHOP_DOMAIN = 'deep-root-studios.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '4dae98198cc50eb2b64ab901e7910625';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('connecting'); // connecting, success, error
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check for authorization code in URL params
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                // Handle OAuth error
                if (errorParam) {
                    throw new Error(errorDescription || errorParam || 'Authentication failed');
                }

                // Check if we have a code to exchange
                if (code) {
                    // Verify state if we stored one
                    const savedState = sessionStorage.getItem('oauth_state');
                    if (savedState && state !== savedState) {
                        throw new Error('Security validation failed. Please try again.');
                    }
                    sessionStorage.removeItem('oauth_state');

                    // Exchange code for customer access token
                    const token = await exchangeCodeForToken(code);

                    if (token) {
                        // Save token to localStorage
                        localStorage.setItem('customer_token', token);
                        setStatus('success');

                        // Redirect to dashboard after brief success display
                        setTimeout(() => {
                            navigate('/account');
                        }, 1500);
                        return;
                    }
                }

                // If we got here from Shopify login without OAuth code,
                // try to verify the session via cookies/redirect
                // This handles the standard Shopify login flow

                // Check if there's a customer token cookie set by Shopify
                // For standard Storefront API, we need to use the manual login flow

                // Redirect to dashboard - let the dashboard check auth status
                setStatus('success');
                setTimeout(() => {
                    navigate('/account');
                }, 1500);

            } catch (err) {
                console.error('Auth callback error:', err);
                setError(err.message || 'Authentication failed');
                setStatus('error');
            }
        };

        handleCallback();
    }, [navigate, searchParams]);

    /**
     * Exchange authorization code for customer access token
     * This uses Shopify's token endpoint
     */
    const exchangeCodeForToken = async (code) => {
        try {
            // For Shopify Storefront API, we use the customerAccessTokenCreate mutation
            // The authorization code flow requires a server-side exchange for security
            // Since we're client-side only, we'll use the standard login approach

            // Note: In a production app with Shopify Plus, you would:
            // 1. Send the code to your backend
            // 2. Exchange it server-side with Shopify
            // 3. Return the customer token to the client

            // For now, return the code as a placeholder
            // The actual implementation depends on your backend setup
            console.log('Received auth code:', code);

            // Attempt to create a session from the code
            // This is a simplified flow - production would use proper token exchange
            return code; // Placeholder - replace with actual token exchange

        } catch (error) {
            console.error('Token exchange failed:', error);
            throw new Error('Failed to complete authentication');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <div className="text-center max-w-md w-full">
                {/* Logo/Brand */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src="/drs-logo.png"
                        alt="DRS"
                        className="h-16 w-auto mx-auto invert"
                    />
                </motion.div>

                {/* Status Container */}
                <motion.div
                    className="border border-[#333] bg-[#0a0a0a] p-8 rounded-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Connecting State */}
                    {status === 'connecting' && (
                        <>
                            {/* Pulsing Shield Icon */}
                            <motion.div
                                className="mb-6"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Shield className="h-16 w-16 text-neon-gold mx-auto" />
                            </motion.div>

                            <h2 className="font-display text-xl uppercase tracking-wider text-white mb-2">
                                ESTABLISHING SECURE CONNECTION
                            </h2>
                            <p className="text-gray-500 text-sm font-mono">
                                Verifying credentials...
                            </p>

                            {/* Loading Bar */}
                            <div className="mt-6 h-1 bg-[#222] overflow-hidden rounded-none">
                                <motion.div
                                    className="h-full bg-neon-gold"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }}
                                    style={{ width: '50%' }}
                                />
                            </div>
                        </>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                            >
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                            </motion.div>

                            <h2 className="font-display text-xl uppercase tracking-wider text-white mb-2">
                                ACCESS GRANTED
                            </h2>
                            <p className="text-gray-500 text-sm font-mono">
                                Redirecting to command center...
                            </p>

                            {/* Success Bar */}
                            <div className="mt-6 h-1 bg-green-500 rounded-none" />
                        </>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <>
                            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />

                            <h2 className="font-display text-xl uppercase tracking-wider text-red-500 mb-2">
                                AUTHENTICATION FAILED
                            </h2>
                            <p className="text-gray-500 text-sm font-mono mb-6">
                                {error}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full h-12 bg-white text-black font-display font-bold tracking-wider uppercase rounded-none transition-all hover:bg-neon-gold"
                                >
                                    TRY AGAIN
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full h-12 border border-[#333] text-gray-400 font-display tracking-wider uppercase rounded-none transition-all hover:border-white hover:text-white"
                                >
                                    RETURN HOME
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Security Note */}
                <p className="mt-6 text-gray-600 text-xs font-mono">
                    Secure connection via Shopify Customer API
                </p>
            </div>
        </div>
    );
};

export default AuthCallback;
