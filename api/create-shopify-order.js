/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP ROOT STUDIOS - SHOPIFY ORDER CREATION API
 * Serverless function to create orders after Razorpay payment
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DEPLOYMENT OPTIONS:
 * 1. Vercel: Place in /api/create-shopify-order.js
 * 2. Netlify: Place in /netlify/functions/create-shopify-order.js
 * 3. Express Server: Mount as route handler
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - SHOPIFY_STORE_URL: your-store.myshopify.com
 * - SHOPIFY_ACCESS_TOKEN: Admin API access token (shpat_xxx)
 * - RAZORPAY_KEY_SECRET: For payment verification
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const API_VERSION = '2024-01';

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY SIGNATURE VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID  
 * @param {string} signature - Razorpay signature
 * @returns {boolean}
 */
function verifyRazorpaySignature(orderId, paymentId, signature) {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    return expectedSignature === signature;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOPIFY ORDER CREATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create order in Shopify Admin API
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} - Created order
 */
async function createShopifyOrder(orderData) {
    const {
        cartItems,
        customerAddress,
        email,
        phone,
        paymentId,
        orderId,
        totalAmount,
        discountCode,
        discountAmount
    } = orderData;

    // Map cart items to Shopify line_items format
    const lineItems = cartItems.map(item => {
        const lineItem = {
            variant_id: extractVariantId(item.variant?.id),
            quantity: item.quantity,
            price: parseFloat(item.variant?.price?.amount || item.variant?.price || 0).toFixed(2)
        };

        // Add custom attributes (engraving, gift wrap, etc.)
        if (item.customAttributes && item.customAttributes.length > 0) {
            lineItem.properties = item.customAttributes.map(attr => ({
                name: attr.key,
                value: attr.value
            }));
        }

        return lineItem;
    });

    // Build shipping address for Shopify
    const shippingAddress = {
        first_name: customerAddress.firstName,
        last_name: customerAddress.lastName,
        address1: customerAddress.address,
        address2: customerAddress.apartment || '',
        city: customerAddress.city,
        province: customerAddress.state,
        country: customerAddress.country || 'IN',
        zip: customerAddress.zip,
        phone: phone
    };

    // Build the order payload
    const orderPayload = {
        order: {
            email: email,
            phone: phone,
            financial_status: 'paid', // Mark as paid since Razorpay collected payment
            fulfillment_status: null, // Unfulfilled - ready to ship

            line_items: lineItems,

            shipping_address: shippingAddress,
            billing_address: shippingAddress, // Same as shipping

            // Payment details
            transactions: [{
                kind: 'sale',
                status: 'success',
                amount: totalAmount.toFixed(2),
                gateway: 'Razorpay',
                authorization: paymentId
            }],

            // Tags for organization
            tags: 'Web Order, Razorpay, Headless',

            // Notes
            note: `Razorpay Payment ID: ${paymentId}\nRazorpay Order ID: ${orderId}`,
            note_attributes: [
                { name: 'razorpay_payment_id', value: paymentId },
                { name: 'razorpay_order_id', value: orderId },
                { name: 'source', value: 'Deep Root Studios Headless' }
            ],

            // Inventory behavior
            inventory_behaviour: 'decrement_obeying_policy',

            // Send notifications
            send_receipt: true,
            send_fulfillment_receipt: true
        }
    };

    // Add discount if applied
    if (discountCode && discountAmount > 0) {
        orderPayload.order.discount_codes = [{
            code: discountCode,
            amount: discountAmount.toFixed(2),
            type: 'percentage'
        }];
    }

    // Make API request to Shopify
    const response = await fetch(
        `https://${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}/orders.json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
            },
            body: JSON.stringify(orderPayload)
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Shopify API Error:', errorData);
        throw new Error(errorData.errors || 'Failed to create Shopify order');
    }

    const data = await response.json();
    return data.order;
}

/**
 * Extract numeric variant ID from Shopify GID
 * @param {string} gid - Shopify Global ID (gid://shopify/ProductVariant/123)
 * @returns {number}
 */
function extractVariantId(gid) {
    if (!gid) return null;
    if (typeof gid === 'number') return gid;

    // Handle GID format: gid://shopify/ProductVariant/123456789
    const match = gid.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : parseInt(gid, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// API HANDLER (Vercel/Netlify Compatible)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main API handler
 * POST /api/create-shopify-order
 * 
 * Request Body:
 * {
 *   razorpay_payment_id: string,
 *   razorpay_order_id: string,
 *   razorpay_signature: string,
 *   cartItems: Array,
 *   customerAddress: Object,
 *   email: string,
 *   phone: string,
 *   totalAmount: number,
 *   discountCode?: string,
 *   discountAmount?: number
 * }
 */
module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            cartItems,
            customerAddress,
            email,
            phone,
            totalAmount,
            discountCode,
            discountAmount
        } = req.body;

        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id) {
            return res.status(400).json({
                error: 'Missing payment credentials',
                success: false
            });
        }

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                error: 'Cart is empty',
                success: false
            });
        }

        if (!customerAddress || !email) {
            return res.status(400).json({
                error: 'Missing customer information',
                success: false
            });
        }

        // Verify Razorpay signature (skip in dev mode if secret not set)
        if (RAZORPAY_KEY_SECRET && razorpay_signature) {
            const isValid = verifyRazorpaySignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            if (!isValid) {
                console.error('Invalid Razorpay signature');
                return res.status(400).json({
                    error: 'Payment verification failed',
                    success: false
                });
            }
        }

        // Create order in Shopify
        const shopifyOrder = await createShopifyOrder({
            cartItems,
            customerAddress,
            email,
            phone,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            totalAmount,
            discountCode,
            discountAmount
        });

        console.log('✅ Shopify order created:', shopifyOrder.id, shopifyOrder.name);

        // Return success with order details
        return res.status(200).json({
            success: true,
            order: {
                id: shopifyOrder.id,
                name: shopifyOrder.name,
                order_number: shopifyOrder.order_number,
                confirmation_number: shopifyOrder.confirmation_number,
                total_price: shopifyOrder.total_price,
                created_at: shopifyOrder.created_at,
                order_status_url: shopifyOrder.order_status_url
            }
        });

    } catch (error) {
        console.error('❌ Order creation error:', error);

        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to create order'
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// NETLIFY FUNCTIONS EXPORT (if using Netlify)
// ─────────────────────────────────────────────────────────────────────────────

// Uncomment for Netlify deployment:
/*
exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders, body: '' };
    }
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const body = JSON.parse(event.body);
        // ... same logic as above
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            body: JSON.stringify({ success: true, order: shopifyOrder })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
*/
