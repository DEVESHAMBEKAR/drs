import { createContext, useContext, useState, useEffect } from 'react';
import Client from 'shopify-buy';

// Create Shopify Context
const ShopifyContext = createContext();

// Shopify Client Configuration
// TODO: Replace with your actual Shopify store credentials
const client = Client.buildClient({
    domain: 'deep-root-studios.myshopify.com',
    storefrontAccessToken: '4dae98198cc50eb2b64ab901e7910625',
});

export const ShopifyProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customerToken, setCustomerToken] = useState(() => localStorage.getItem('customer_token') || null);
    const [userOrders, setUserOrders] = useState([]);
    const [customer, setCustomer] = useState(null);

    // Computed: Check if user is logged in
    const isLoggedIn = !!customerToken;

    // Initialize checkout/cart on mount
    useEffect(() => {
        const checkoutId = localStorage.getItem('checkoutId');

        if (checkoutId) {
            // Try to fetch existing checkout
            fetchCheckout(checkoutId);
        } else {
            // Create new checkout if none exists
            initializeCheckout();
        }

        // Check if returning from Shopify login
        checkAuthFromUrl();
    }, []);

    // Fetch orders and associate cart when customer logs in
    useEffect(() => {
        if (customerToken) {
            fetchCustomerOrders();
            fetchCustomerInfo();

            // Associate existing cart with logged-in customer
            if (cart && customer?.email) {
                client.checkout.updateEmail(cart.id, customer.email)
                    .then(updatedCheckout => {
                        setCart(updatedCheckout);
                        console.log('✅ Cart associated with customer:', customer.email);
                    })
                    .catch(err => console.warn('Could not associate cart:', err));
            }
        }
    }, [customerToken, customer?.email]);

    /**
     * Check if user is returning from Shopify's hosted login
     * Shopify may pass auth info in URL or cookies
     */
    const checkAuthFromUrl = () => {
        // Check URL for auth callback params
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('customer_posted') || urlParams.get('logged_in');

        if (authSuccess) {
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('✅ Customer returned from Shopify login');
        }
    };

    /**
     * Fetch Customer Info including all addresses
     */
    const fetchCustomerInfo = async () => {
        if (!customerToken) return;

        try {
            const query = `
                query {
                    customer(customerAccessToken: "${customerToken}") {
                        id
                        firstName
                        lastName
                        email
                        phone
                        defaultAddress {
                            id
                            firstName
                            lastName
                            address1
                            address2
                            city
                            province
                            provinceCode
                            country
                            countryCodeV2
                            zip
                            phone
                        }
                        addresses(first: 10) {
                            edges {
                                node {
                                    id
                                    firstName
                                    lastName
                                    address1
                                    address2
                                    city
                                    province
                                    provinceCode
                                    country
                                    countryCodeV2
                                    zip
                                    phone
                                }
                            }
                        }
                    }
                }
            `;

            const response = await fetch(`https://${client.config.domain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': client.config.storefrontAccessToken
                },
                body: JSON.stringify({ query })
            });

            const result = await response.json();

            if (result.data?.customer) {
                // Parse addresses from edges
                const customerData = result.data.customer;
                const addresses = customerData.addresses?.edges?.map(edge => edge.node) || [];

                setCustomer({
                    ...customerData,
                    addresses // Replace edges with flat array
                });
                console.log('✅ Customer info fetched:', customerData.email, '| Addresses:', addresses.length);
            }
        } catch (error) {
            console.error('❌ Error fetching customer info:', error);
        }
    };

    // Log cart updates for debugging
    useEffect(() => {
        if (cart) {
            console.log('Cart updated:', {
                id: cart.id,
                itemCount: cart.lineItems?.length || 0,
                lineItems: cart.lineItems,
                total: cart.totalPrice
            });
        }
    }, [cart]);

    // Create a new checkout
    const initializeCheckout = async () => {
        try {
            console.log('Creating new checkout...');
            const newCheckout = await client.checkout.create();

            // If customer is logged in, associate their email with the checkout
            if (customerToken && customer?.email) {
                try {
                    const updatedCheckout = await client.checkout.updateEmail(newCheckout.id, customer.email);
                    setCart(updatedCheckout);
                    localStorage.setItem('checkoutId', updatedCheckout.id);
                    console.log('✅ Checkout created and associated with customer:', customer.email);
                    return updatedCheckout;
                } catch (emailError) {
                    console.warn('Could not associate email with checkout:', emailError);
                    setCart(newCheckout);
                    localStorage.setItem('checkoutId', newCheckout.id);
                    return newCheckout;
                }
            }

            setCart(newCheckout);
            localStorage.setItem('checkoutId', newCheckout.id);
            console.log('New checkout created:', newCheckout.id);
            return newCheckout;
        } catch (error) {
            console.error('Error initializing checkout:', error);
            return null;
        }
    };

    // Fetch existing checkout from localStorage
    const fetchCheckout = async (checkoutId) => {
        try {
            console.log('Fetching existing checkout:', checkoutId);
            const checkout = await client.checkout.fetch(checkoutId);

            if (checkout && !checkout.completedAt) {
                setCart(checkout);
                console.log('Existing checkout loaded:', checkout.id);
                return checkout;
            } else {
                // If checkout is completed or null, create a new one
                console.log('Checkout completed or invalid, creating new one...');
                localStorage.removeItem('checkoutId');
                return await initializeCheckout();
            }
        } catch (error) {
            console.error('Error fetching checkout:', error);
            localStorage.removeItem('checkoutId');
            return await initializeCheckout();
        }
    };

    /**
     * Add item to cart with custom attributes (engraving, wood type, etc.)
     * @param {string} variantId - Shopify product variant ID
     * @param {number} quantity - Quantity to add
     * @param {Array} customAttributes - Array of {key, value} pairs for customization
     * Example: [{ key: "Engraving", value: "JOHN DOE" }, { key: "Wood Type", value: "Walnut" }]
     */
    const addItemToCart = async (variantId, quantity = 1, customAttributes = []) => {
        setIsLoading(true);

        try {
            console.log('Adding to cart:', { variantId, quantity, customAttributes });

            // Ensure we have a checkout
            let currentCart = cart;
            if (!currentCart || !currentCart.id) {
                console.log('No checkout found, creating new one...');
                currentCart = await initializeCheckout();

                // If still no cart, throw error
                if (!currentCart || !currentCart.id) {
                    throw new Error('Failed to create checkout');
                }
            }

            // Prepare line items with custom attributes
            const lineItemsToAdd = [
                {
                    variantId,
                    quantity,
                    customAttributes,
                },
            ];

            console.log('Adding line items to checkout:', currentCart.id);

            // Add to checkout
            const updatedCheckout = await client.checkout.addLineItems(
                currentCart.id,
                lineItemsToAdd
            );

            setCart(updatedCheckout);
            setIsCartOpen(true);

            console.log('✅ Item successfully added to cart');

            return updatedCheckout;
        } catch (error) {
            console.error('❌ Error adding item to cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update line item quantity
     */
    const updateCartItem = async (lineItemId, quantity) => {
        setIsLoading(true);

        try {
            const updatedCheckout = await client.checkout.updateLineItems(cart.id, [
                { id: lineItemId, quantity },
            ]);
            setCart(updatedCheckout);
        } catch (error) {
            console.error('Error updating cart item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Remove item from cart
     */
    const removeCartItem = async (lineItemId) => {
        setIsLoading(true);

        try {
            const updatedCheckout = await client.checkout.removeLineItems(cart.id, [
                lineItemId,
            ]);
            setCart(updatedCheckout);
        } catch (error) {
            console.error('Error removing cart item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clear entire cart
     */
    const clearCart = async () => {
        try {
            await initializeCheckout();
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    /**
     * Get cart total
     */
    const getCartTotal = () => {
        if (!cart || !cart.lineItems) return '0.00';
        return cart.totalPrice;
    };

    /**
     * Get cart item count
     */
    const getCartItemCount = () => {
        if (!cart || !cart.lineItems) return 0;
        return cart.lineItems.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * Customer Login - Authenticate with Shopify
     * @param {string} email - Customer email
     * @param {string} password - Customer password
     * @returns {Promise<boolean|string>} - true on success, error message on failure
     */
    const loginCustomer = async (email, password) => {
        try {
            const mutation = `
                mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                    customerAccessTokenCreate(input: $input) {
                        customerAccessToken {
                            accessToken
                            expiresAt
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
                    email,
                    password
                }
            };

            const response = await fetch(`https://${client.config.domain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': client.config.storefrontAccessToken
                },
                body: JSON.stringify({ query: mutation, variables })
            });

            const result = await response.json();
            console.log('Login response:', result);

            // Check for user errors
            if (result.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
                const error = result.data.customerAccessTokenCreate.customerUserErrors[0];
                return error.message || 'Login failed';
            }

            // Check for access token
            const accessToken = result.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

            if (accessToken) {
                // Save token to state and localStorage
                setCustomerToken(accessToken);
                localStorage.setItem('customer_token', accessToken);
                console.log('✅ Login successful');
                return true;
            }

            return 'Login failed. Please try again.';
        } catch (error) {
            console.error('❌ Login error:', error);
            return 'Network error. Please try again.';
        }
    };

    /**
     * Fetch Customer Orders
     * Retrieves order history for the logged-in customer
     */
    const fetchCustomerOrders = async () => {
        if (!customerToken) {
            console.warn('No customer token available');
            return;
        }

        try {
            const query = `
                query {
                    customer(customerAccessToken: "${customerToken}") {
                        orders(first: 10) {
                            edges {
                                node {
                                    id
                                    orderNumber
                                    processedAt
                                    fulfillmentStatus
                                    totalPrice {
                                        amount
                                        currencyCode
                                    }
                                    lineItems(first: 10) {
                                        edges {
                                            node {
                                                title
                                                quantity
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const response = await fetch(`https://${client.config.domain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': client.config.storefrontAccessToken
                },
                body: JSON.stringify({ query })
            });

            const result = await response.json();
            console.log('Orders response:', result);

            if (result.data?.customer?.orders?.edges) {
                const orders = result.data.customer.orders.edges.map(edge => edge.node);
                setUserOrders(orders);
                console.log('✅ Orders fetched:', orders.length);
            }
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
        }
    };

    /**
     * Logout Customer
     */
    const logoutCustomer = () => {
        setCustomerToken(null);
        setUserOrders([]);
        localStorage.removeItem('customer_token');
        console.log('✅ Logged out');
    };

    /**
     * Google Sign-In with Popup
     * Opens Shopify's OAuth login in a popup window
     */
    const loginWithGoogle = () => {
        return new Promise((resolve, reject) => {
            // Popup dimensions
            const width = 500;
            const height = 600;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            // Open Shopify login in popup
            const shopDomain = client.config.domain;
            const popup = window.open(
                `https://${shopDomain}/account/login`,
                'shopify-login',
                `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
            );

            if (!popup) {
                reject('Popup blocked. Please allow popups for this site.');
                return;
            }

            // Listen for messages from popup
            const handleMessage = (event) => {
                // Verify origin for security
                if (!event.origin.includes('myshopify.com') && event.origin !== window.location.origin) {
                    return;
                }

                if (event.data.type === 'shopify-login-success') {
                    // Close popup
                    if (popup && !popup.closed) {
                        popup.close();
                    }

                    // Save token
                    if (event.data.token) {
                        setCustomerToken(event.data.token);
                        localStorage.setItem('customer_token', event.data.token);
                        console.log('✅ Google Sign-In successful');
                        window.removeEventListener('message', handleMessage);
                        resolve(true);
                    }
                }
            };

            window.addEventListener('message', handleMessage);

            // Check if popup was closed without completing login
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', handleMessage);

                    // Check if we got a token from localStorage (Shopify might have set it)
                    const token = localStorage.getItem('customer_token');
                    if (token && token !== customerToken) {
                        setCustomerToken(token);
                        console.log('✅ Login completed via redirect');
                        resolve(true);
                    } else {
                        reject('Login cancelled');
                    }
                }
            }, 500);
        });
    };

    const value = {
        cart,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        addItemToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        getCartTotal,
        getCartItemCount,
        client, // Expose client for advanced usage
        // Customer authentication
        isLoggedIn,
        customer,
        customerToken,
        userOrders,
        loginCustomer,
        loginWithGoogle,
        fetchCustomerOrders,
        fetchCustomerInfo,
        logoutCustomer,
    };

    return (
        <ShopifyContext.Provider value={value}>
            {children}
        </ShopifyContext.Provider>
    );
};

// Custom hook to use Shopify context
export const useShopify = () => {
    const context = useContext(ShopifyContext);
    if (!context) {
        throw new Error('useShopify must be used within a ShopifyProvider');
    }
    return context;
};

export default ShopifyContext;
