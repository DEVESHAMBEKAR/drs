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
        initializeCheckout();
    }, []);

    // Create a new checkout
    const initializeCheckout = async () => {
        try {
            const newCheckout = await client.checkout.create();
            setCart(newCheckout);
            localStorage.setItem('checkoutId', newCheckout.id);
        } catch (error) {
            console.error('Error initializing checkout:', error);
        }
    };

    // Fetch existing checkout from localStorage
    const fetchCheckout = async (checkoutId) => {
        try {
            const checkout = await client.checkout.fetch(checkoutId);
            if (!checkout.completedAt) {
                setCart(checkout);
            } else {
                // If checkout is completed, create a new one
                initializeCheckout();
            }
        } catch (error) {
            console.error('Error fetching checkout:', error);
            initializeCheckout();
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
            // Ensure we have a checkout
            if (!cart) {
                await initializeCheckout();
            }

            // Prepare line items with custom attributes
            const lineItemsToAdd = [
                {
                    variantId,
                    quantity,
                    customAttributes, // This is the key addition for personalization!
                },
            ];

            // Add to checkout
            const updatedCheckout = await client.checkout.addLineItems(
                cart.id,
                lineItemsToAdd
            );

            setCart(updatedCheckout);
            setIsCartOpen(true);

            console.log('Item added to cart:', {
                variantId,
                quantity,
                customAttributes,
            });

            return updatedCheckout;
        } catch (error) {
            console.error('Error adding item to cart:', error);
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
