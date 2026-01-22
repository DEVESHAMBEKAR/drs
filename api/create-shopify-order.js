/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP ROOT STUDIOS - SHOPIFY ORDER CREATION API
 * Serverless function to create orders after Razorpay payment
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DEPLOYMENT: Vercel (place in /api/create-shopify-order.js)
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - SHOPIFY_STORE_URL: deep-root-studios.myshopify.com
 * - SHOPIFY_ACCESS_TOKEN: Admin API access token (shpat_xxx) OR Client Secret
 * - SHOPIFY_CLIENT_ID: (Optional) For OAuth token generation
 * - SHOPIFY_CLIENT_SECRET: (Optional) Client secret for OAuth
 * - RAZORPAY_KEY_SECRET: For payment signature verification
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || 'deep-root-studios.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const API_VERSION = '2024-10'; // Updated to latest stable version

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY SIGNATURE VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

/**
 * Verify Razorpay payment signature
 */
function verifyRazorpaySignature(orderId, paymentId, signature) {
    if (!RAZORPAY_KEY_SECRET) {
        console.log('⚠️ Razorpay secret not set, skipping verification');
        return true;
    }

    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    return expectedSignature === signature;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOPIFY ACCESS TOKEN MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

let cachedAccessToken = null;
let tokenExpiry = null;

/**
 * Get valid access token for Shopify API
 * Supports both legacy shpat_ tokens and OAuth client credentials
 */
async function getAccessToken() {
    // If we have a shpat_ token, use it directly
    if (SHOPIFY_ACCESS_TOKEN && SHOPIFY_ACCESS_TOKEN.startsWith('shpat_')) {
        return SHOPIFY_ACCESS_TOKEN;
    }

    // If we have a cached token that's not expired, use it
    if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedAccessToken;
    }

    // If we have Client ID and Secret, get token via OAuth
    if (SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET) {
        try {
            const tokenResponse = await fetch(
                `https://${SHOPIFY_STORE_URL}/admin/oauth/access_token`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_id: SHOPIFY_CLIENT_ID,
                        client_secret: SHOPIFY_CLIENT_SECRET,
                        grant_type: 'client_credentials'
                    })
                }
            );

            if (tokenResponse.ok) {
                const data = await tokenResponse.json();
                cachedAccessToken = data.access_token;
                // Token typically expires in 24 hours, refresh after 23 hours
                tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
                return cachedAccessToken;
            }
        } catch (error) {
            console.error('OAuth token fetch failed:', error);
        }
    }

    // Fall back to any provided token
    if (SHOPIFY_ACCESS_TOKEN) {
        return SHOPIFY_ACCESS_TOKEN;
    }

    throw new Error('No valid Shopify access token available');
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOPIFY ORDER CREATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create order in Shopify Admin API
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

    // Get valid access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error('SHOPIFY_ACCESS_TOKEN not configured');
    }

    // Map cart items to Shopify line_items format
    const lineItems = cartItems.map(item => {
        const variantId = extractVariantId(item.variant?.id);
        const price = parseFloat(item.variant?.price?.amount || item.variant?.price || 0);

        const lineItem = {
            quantity: item.quantity,
            price: price.toFixed(2),
            title: item.title || 'Product'
        };

        // Only add variant_id if valid
        if (variantId) {
            lineItem.variant_id = variantId;
        }

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
        first_name: customerAddress?.firstName || 'Customer',
        last_name: customerAddress?.lastName || '',
        address1: customerAddress?.address || '',
        address2: customerAddress?.apartment || '',
        city: customerAddress?.city || '',
        province: customerAddress?.state || '',
        country: customerAddress?.country || 'IN',
        zip: customerAddress?.zip || '',
        phone: phone || ''
    };

    // Build the order payload
    const orderPayload = {
        order: {
            email: email,
            phone: phone,
            financial_status: 'paid',
            fulfillment_status: null,

            line_items: lineItems,

            shipping_address: shippingAddress,
            billing_address: shippingAddress,

            // Payment details
            transactions: [{
                kind: 'sale',
                status: 'success',
                amount: parseFloat(totalAmount || 0).toFixed(2),
                gateway: 'Razorpay',
                authorization: paymentId || 'manual'
            }],

            // Tags for organization
            tags: 'Web Order, Razorpay, Headless',

            // Notes
            note: `Razorpay Payment ID: ${paymentId || 'N/A'}\nRazorpay Order ID: ${orderId || 'N/A'}`,
            note_attributes: [
                { name: 'razorpay_payment_id', value: paymentId || '' },
                { name: 'razorpay_order_id', value: orderId || '' },
                { name: 'source', value: 'Deep Root Studios Website' }
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
            amount: parseFloat(discountAmount).toFixed(2),
            type: 'percentage'
        }];
    }

    console.log('📦 Creating Shopify order...');
    console.log('Store URL:', SHOPIFY_STORE_URL);
    console.log('Line items:', lineItems.length);

    // Make API request to Shopify
    const response = await fetch(
        `https://${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}/orders.json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken
            },
            body: JSON.stringify(orderPayload)
        }
    );

    const responseText = await response.text();

    if (!response.ok) {
        console.error('Shopify API Error Status:', response.status);
        console.error('Shopify API Error Response:', responseText);

        let errorMessage = 'Failed to create Shopify order';
        try {
            const errorData = JSON.parse(responseText);
            if (errorData.errors) {
                if (typeof errorData.errors === 'string') {
                    errorMessage = errorData.errors;
                } else if (typeof errorData.errors === 'object') {
                    errorMessage = Object.entries(errorData.errors)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join('; ');
                }
            }
        } catch (e) {
            errorMessage = responseText || `HTTP ${response.status}`;
        }

        throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Shopify order created:', data.order?.id, data.order?.name);

    return data.order;
}

/**
 * Extract numeric variant ID from Shopify GID
 */
function extractVariantId(gid) {
    if (!gid) return null;
    if (typeof gid === 'number') return gid;

    // Handle GID format: gid://shopify/ProductVariant/123456789
    const match = String(gid).match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// API HANDLER (Vercel Compatible)
// ─────────────────────────────────────────────────────────────────────────────

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
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    // Check if Shopify is configured
    if (!SHOPIFY_ACCESS_TOKEN && !SHOPIFY_CLIENT_SECRET) {
        console.error('❌ Shopify credentials not configured');
        return res.status(500).json({
            success: false,
            error: 'Shopify API not configured. Please set SHOPIFY_ACCESS_TOKEN in environment variables.'
        });
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
        } = req.body || {};

        console.log('📥 Order request received');
        console.log('Payment ID:', razorpay_payment_id);
        console.log('Email:', email);
        console.log('Cart items:', cartItems?.length || 0);

        // Validate required fields
        if (!razorpay_payment_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing payment ID'
            });
        }

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Verify Razorpay signature (if signature provided)
        if (razorpay_signature && RAZORPAY_KEY_SECRET) {
            const isValid = verifyRazorpaySignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            if (!isValid) {
                console.error('❌ Invalid Razorpay signature');
                return res.status(400).json({
                    success: false,
                    error: 'Payment verification failed'
                });
            }
            console.log('✅ Razorpay signature verified');
        }

        // Create order in Shopify
        const shopifyOrder = await createShopifyOrder({
            cartItems,
            customerAddress,
            email,
            phone,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            totalAmount: totalAmount || 0,
            discountCode,
            discountAmount
        });

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
        console.error('❌ Order creation error:', error.message);
        console.error('Stack:', error.stack);

        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to create order'
        });
    }
};
