/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP ROOT STUDIOS - SHOPIFY ORDER CREATION API
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * POST /api/shopify/create-order
 * 
 * Creates an order in Shopify Admin after successful Razorpay payment.
 * 
 * Security:
 * - Verifies request method is POST
 * - Validates required fields
 * - Optionally verifies Razorpay signature
 * 
 * Request Body:
 * {
 *   razorpay_payment_id: string,
 *   razorpay_order_id?: string,
 *   razorpay_signature?: string,
 *   cartItems: Array<CartItem>,
 *   customerAddress: AddressObject,
 *   email: string,
 *   phone: string,
 *   totalAmount: number
 * }
 * 
 * Response:
 * - 200: { success: true, order: { id, name, order_number, ... } }
 * - 400: { success: false, error: "validation error" }
 * - 500: { success: false, error: "Shopify API error" }
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const crypto = require('crypto');

// ─────────────────────────────────────────────────────────────────────────────
// ENVIRONMENT VARIABLES
// ─────────────────────────────────────────────────────────────────────────────

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_URL || process.env.SHOPIFY_STORE_DOMAIN || 'deep-root-studios.myshopify.com';
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const SHOPIFY_API_VERSION = '2024-01';

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify Razorpay payment signature
 */
function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
    if (!secret || !signature) return true; // Skip if not configured

    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === signature;
}

/**
 * Map cart items to Shopify line_items structure
 */
function mapCartItemsToLineItems(cartItems) {
    return cartItems.map(item => {
        const lineItem = {
            title: item.title || 'Product',
            name: item.title || 'Product',
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.variant?.price?.amount || item.variant?.price || item.price || 0).toFixed(2),
            requires_shipping: true,
            taxable: true,
            fulfillment_status: null
        };

        // Add variant_id if available (for inventory tracking)
        if (item.variant?.id) {
            let variantId = item.variant.id;

            // Extract numeric ID from Shopify GID format
            if (typeof variantId === 'string' && variantId.includes('gid://')) {
                variantId = variantId.replace('gid://shopify/ProductVariant/', '');
            }

            if (variantId && !isNaN(parseInt(variantId))) {
                lineItem.variant_id = parseInt(variantId);
            }
        }

        // Add variant title
        if (item.variant?.title && item.variant.title !== 'Default Title') {
            lineItem.variant_title = item.variant.title;
        }

        // Add custom properties (engraving, gift wrap, etc.)
        if (item.customAttributes && Array.isArray(item.customAttributes) && item.customAttributes.length > 0) {
            lineItem.properties = item.customAttributes.map(attr => ({
                name: attr.key || attr.name,
                value: attr.value
            }));
        }

        return lineItem;
    });
}

/**
 * Map customer address to Shopify address format
 */
function mapToShopifyAddress(customerAddress, phone) {
    return {
        first_name: customerAddress?.firstName || customerAddress?.first_name || '',
        last_name: customerAddress?.lastName || customerAddress?.last_name || '',
        address1: customerAddress?.address || customerAddress?.address1 || '',
        address2: customerAddress?.apartment || customerAddress?.address2 || '',
        city: customerAddress?.city || '',
        province: customerAddress?.state || customerAddress?.province || '',
        province_code: getProvinceCode(customerAddress?.state || customerAddress?.province || ''),
        zip: customerAddress?.zip || customerAddress?.pincode || '',
        country: 'India',
        country_code: 'IN',
        phone: phone || customerAddress?.phone || ''
    };
}

/**
 * Get Indian state province code
 */
function getProvinceCode(stateName) {
    const stateCodes = {
        'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS',
        'Bihar': 'BR', 'Chhattisgarh': 'CT', 'Goa': 'GA', 'Gujarat': 'GJ',
        'Haryana': 'HR', 'Himachal Pradesh': 'HP', 'Jharkhand': 'JH',
        'Karnataka': 'KA', 'Kerala': 'KL', 'Madhya Pradesh': 'MP',
        'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
        'Mizoram': 'MZ', 'Nagaland': 'NL', 'Odisha': 'OR', 'Punjab': 'PB',
        'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN',
        'Telangana': 'TG', 'Tripura': 'TR', 'Uttar Pradesh': 'UP',
        'Uttarakhand': 'UK', 'West Bengal': 'WB', 'Delhi': 'DL',
        'Jammu and Kashmir': 'JK', 'Ladakh': 'LA', 'Puducherry': 'PY',
        'Chandigarh': 'CH', 'Andaman and Nicobar Islands': 'AN',
        'Dadra and Nagar Haveli and Daman and Diu': 'DN', 'Lakshadweep': 'LD'
    };
    return stateCodes[stateName] || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
    // ─────────────────────────────────────────────────────────────────────────
    // CORS HEADERS
    // ─────────────────────────────────────────────────────────────────────────
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECURITY: Verify POST method
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.'
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PARSE REQUEST BODY
    // ─────────────────────────────────────────────────────────────────────────
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        cartItems,
        customerAddress,
        email,
        phone,
        totalAmount
    } = req.body;

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📦 SHOPIFY ORDER CREATION REQUEST');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Email:', email);
    console.log('Items:', cartItems?.length || 0);

    // ─────────────────────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────────────────────
    if (!razorpay_payment_id) {
        console.error('❌ Missing razorpay_payment_id');
        return res.status(400).json({
            success: false,
            error: 'Missing razorpay_payment_id'
        });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        console.error('❌ Missing or empty cartItems');
        return res.status(400).json({
            success: false,
            error: 'Missing or empty cartItems'
        });
    }

    if (!email) {
        console.error('❌ Missing email');
        return res.status(400).json({
            success: false,
            error: 'Missing email'
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VERIFY SHOPIFY CREDENTIALS
    // ─────────────────────────────────────────────────────────────────────────
    if (!SHOPIFY_ADMIN_ACCESS_TOKEN || SHOPIFY_ADMIN_ACCESS_TOKEN.includes('YOUR_')) {
        console.error('❌ SHOPIFY_ACCESS_TOKEN not configured');
        return res.status(500).json({
            success: false,
            error: 'Shopify is not configured. Missing SHOPIFY_ACCESS_TOKEN environment variable.'
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VERIFY RAZORPAY SIGNATURE (if configured)
    // ─────────────────────────────────────────────────────────────────────────
    if (RAZORPAY_KEY_SECRET && razorpay_signature && razorpay_order_id) {
        const isValidSignature = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            RAZORPAY_KEY_SECRET
        );

        if (!isValidSignature) {
            console.error('❌ Invalid Razorpay signature');
            return res.status(400).json({
                success: false,
                error: 'Invalid payment signature. Payment verification failed.'
            });
        }
        console.log('✅ Razorpay signature verified');
    }

    try {
        // ─────────────────────────────────────────────────────────────────────
        // BUILD SHOPIFY ORDER
        // ─────────────────────────────────────────────────────────────────────
        const lineItems = mapCartItemsToLineItems(cartItems);
        const shippingAddress = mapToShopifyAddress(customerAddress, phone);
        const billingAddress = { ...shippingAddress };

        const shopifyOrderPayload = {
            order: {
                // Customer info
                email: email,
                phone: phone || customerAddress?.phone || '',

                // IMPORTANT: Mark as PAID
                financial_status: 'paid',

                // Fulfillment
                fulfillment_status: null, // Not fulfilled yet

                // Line items
                line_items: lineItems,

                // Addresses
                shipping_address: shippingAddress,
                billing_address: billingAddress,

                // Notes - Include Razorpay payment info
                note: `Paid via Razorpay (Payment ID: ${razorpay_payment_id})`,
                note_attributes: [
                    { name: 'razorpay_payment_id', value: razorpay_payment_id },
                    { name: 'razorpay_order_id', value: razorpay_order_id || 'N/A' },
                    { name: 'payment_method', value: 'Razorpay' },
                    { name: 'payment_verified', value: 'true' }
                ],

                // Tags for easy filtering
                tags: 'razorpay, online-payment, website-order',

                // Send notifications
                send_receipt: true,
                send_fulfillment_receipt: true,

                // Payment transaction
                transactions: [{
                    kind: 'sale',
                    status: 'success',
                    amount: totalAmount ? parseFloat(totalAmount).toFixed(2) : null,
                    gateway: 'Razorpay',
                    source_name: 'web'
                }].filter(t => t.amount) // Only include if amount is provided
            }
        };

        console.log('📤 Sending order to Shopify...');
        console.log('Line items:', lineItems.length);
        console.log('Total amount:', totalAmount);

        // ─────────────────────────────────────────────────────────────────────
        // CALL SHOPIFY ADMIN API
        // ─────────────────────────────────────────────────────────────────────
        const shopifyApiUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders.json`;

        const shopifyResponse = await fetch(shopifyApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN
            },
            body: JSON.stringify(shopifyOrderPayload)
        });

        // Get response text for parsing
        const responseText = await shopifyResponse.text();

        // ─────────────────────────────────────────────────────────────────────
        // HANDLE SHOPIFY RESPONSE
        // ─────────────────────────────────────────────────────────────────────
        if (!shopifyResponse.ok) {
            console.error('❌ Shopify API Error');
            console.error('Status:', shopifyResponse.status);
            console.error('Response:', responseText);

            let errorMessage = 'Failed to create order in Shopify';
            let errorDetails = null;

            try {
                const errorData = JSON.parse(responseText);
                if (errorData.errors) {
                    if (typeof errorData.errors === 'string') {
                        errorMessage = errorData.errors;
                    } else if (typeof errorData.errors === 'object') {
                        // Handle detailed error object
                        errorDetails = errorData.errors;
                        const errorKeys = Object.keys(errorData.errors);
                        if (errorKeys.length > 0) {
                            const firstError = errorData.errors[errorKeys[0]];
                            errorMessage = Array.isArray(firstError)
                                ? `${errorKeys[0]}: ${firstError.join(', ')}`
                                : `${errorKeys[0]}: ${firstError}`;
                        }
                    }
                }
            } catch (parseError) {
                errorMessage = responseText || 'Unknown Shopify error';
            }

            return res.status(shopifyResponse.status).json({
                success: false,
                error: errorMessage,
                details: errorDetails,
                shopifyStatus: shopifyResponse.status
            });
        }

        // Parse successful response
        const orderData = JSON.parse(responseText);
        const order = orderData.order;

        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ SHOPIFY ORDER CREATED SUCCESSFULLY');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('Order ID:', order.id);
        console.log('Order Name:', order.name);
        console.log('Order Number:', order.order_number);
        console.log('Total:', order.total_price, order.currency);
        console.log('Financial Status:', order.financial_status);

        // ─────────────────────────────────────────────────────────────────────
        // SUCCESS RESPONSE
        // ─────────────────────────────────────────────────────────────────────
        return res.status(200).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                name: order.name,
                order_number: order.order_number,
                total_price: order.total_price,
                subtotal_price: order.subtotal_price,
                total_tax: order.total_tax,
                currency: order.currency,
                financial_status: order.financial_status,
                fulfillment_status: order.fulfillment_status,
                order_status_url: order.order_status_url,
                created_at: order.created_at,
                customer: {
                    email: order.email,
                    phone: order.phone
                }
            }
        });

    } catch (error) {
        console.error('═══════════════════════════════════════════════════════════════');
        console.error('❌ EXCEPTION IN ORDER CREATION');
        console.error('═══════════════════════════════════════════════════════════════');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);

        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
            type: 'exception'
        });
    }
};
