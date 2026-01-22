/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP ROOT STUDIOS - RAZORPAY ORDER CREATION API
 * Serverless function to create Razorpay orders
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

    // Check if Razorpay credentials are configured
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials not configured');
        return res.status(500).json({
            error: 'Razorpay not configured',
            message: 'Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET'
        });
    }

    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Create order via Razorpay API
        const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                amount: Math.round(amount), // Amount in paise
                currency: currency,
                receipt: receipt || `DRS_${Date.now()}`,
                payment_capture: 1 // Auto-capture payment
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Razorpay API Error:', errorData);
            return res.status(response.status).json({
                error: 'Failed to create Razorpay order',
                details: errorData
            });
        }

        const order = await response.json();
        console.log('✅ Razorpay order created:', order.id);

        return res.status(200).json({
            id: order.id,
            receipt: order.receipt,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error('❌ Error creating Razorpay order:', error);
        return res.status(500).json({
            error: 'Failed to create order',
            message: error.message
        });
    }
};
