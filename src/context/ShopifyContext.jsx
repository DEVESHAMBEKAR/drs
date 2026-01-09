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
    }, []);

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
            setCart(newCheckout);
            localStorage.setItem('checkoutId', newCheckout.id);
            console.log('New checkout created:', newCheckout.id);
            return newCheckout; // Return the checkout for immediate use
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
