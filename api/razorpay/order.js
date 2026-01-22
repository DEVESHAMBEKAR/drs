/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP ROOT STUDIOS - RAZORPAY ORDER CREATION API
 * POST /api/razorpay/order
 * Creates a Razorpay order and returns order_id
 * ═══════════════════════════════════════════════════════════════════════════
 */

const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // If Razorpay secret is not configured, return mock order for test mode
        if (!RAZORPAY_KEY_SECRET) {
            console.log('⚠️ Razorpay secret not configured - returning mock order');
            return res.status(200).json({
                id: 'order_' + Math.random().toString(36).substr(2, 14).toUpperCase(),
                entity: 'order',
                amount: Math.round(amount),
                amount_paid: 0,
                amount_due: Math.round(amount),
                currency: currency,
                receipt: receipt || `DRS_${Date.now()}`,
                status: 'created'
            });
        }

        // Create real order via Razorpay API
        const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                amount: Math.round(amount),
                currency: currency,
                receipt: receipt || `DRS_${Date.now()}`,
                payment_capture: 1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Razorpay API Error:', errorData);
            return res.status(response.status).json({
                error: 'Failed to create Razorpay order',
                details: errorData
            });
        }

        const order = await response.json();
        console.log('✅ Razorpay order created:', order.id);

        return res.status(200).json(order);

    } catch (error) {
        console.error('❌ Error creating Razorpay order:', error);
        return res.status(500).json({
            error: 'Failed to create order',
            message: error.message
        });
    }
};
