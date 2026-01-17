/**
 * Shipment Tracking Service
 * Fetches LIVE tracking status from carrier APIs
 * Supports major Indian carriers: Delhivery, BlueDart, DTDC, Ekart, etc.
 */

// Carrier Detection Patterns
const CARRIER_PATTERNS = {
    EKART: /ekart|flipkart|fmpp/i,
    DELHIVERY: /delhivery/i,
    BLUEDART: /bluedart|blue dart/i,
    DTDC: /dtdc/i,
    ECOM_EXPRESS: /ecom express|ecom/i,
    XPRESSBEES: /xpressbees|xpress bees/i,
    SHADOWFAX: /shadowfax/i,
    INDIA_POST: /india post|speed post/i,
    FEDEX: /fedex/i,
    DHL: /dhl/i,
    SHIPROCKET: /shiprocket/i,
};

// Delivery Status Mapping
export const DELIVERY_STATUS = {
    CANCELLED: { stage: 0, label: 'Cancelled', status: 'cancelled' },
    ORDERED: { stage: 1, label: 'Order Placed', status: 'ordered' },
    PROCESSING: { stage: 2, label: 'Processing', status: 'processing' },
    SHIPPED: { stage: 3, label: 'Shipped', status: 'shipped' },
    IN_TRANSIT: { stage: 3, label: 'In Transit', status: 'in_transit' },
    OUT_FOR_DELIVERY: { stage: 4, label: 'Out for Delivery', status: 'out_for_delivery' },
    DELIVERED: { stage: 5, label: 'Delivered', status: 'delivered' },
    FAILED: { stage: 4, label: 'Delivery Failed', status: 'failed' },
    RTO: { stage: 4, label: 'Return to Origin', status: 'rto' },
};

// Local storage key for cached tracking data
const TRACKING_CACHE_KEY = 'tracking_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Detect carrier from company name or tracking number
 */
export const detectCarrier = (companyName, trackingNumber = '') => {
    if (!companyName && !trackingNumber) return 'UNKNOWN';

    // Check company name first
    if (companyName) {
        for (const [carrier, pattern] of Object.entries(CARRIER_PATTERNS)) {
            if (pattern.test(companyName)) {
                return carrier;
            }
        }
    }

    // Check tracking number patterns
    const trackingUpper = (trackingNumber || '').toUpperCase();
    if (trackingUpper.startsWith('FMPP') || trackingUpper.startsWith('FMPR')) {
        return 'EKART';
    }
    if (/^\d{11}$/.test(trackingNumber)) {
        return 'DELHIVERY';
    }

    return 'UNKNOWN';
};

/**
 * Parse tracking status from various carrier response formats
 */
const parseTrackingStatus = (status, details = '') => {
    const statusLower = (status || '').toLowerCase().trim();
    const detailsLower = (details || '').toLowerCase().trim();
    const combined = `${statusLower} ${detailsLower}`;

    // Delivered statuses - Check first as it's the final state
    if (
        combined.includes('delivered') ||
        combined.includes('dlvd') ||
        statusLower === 'dl' ||
        statusLower === 'pod' ||
        combined.includes('received by') ||
        combined.includes('handed over')
    ) {
        return DELIVERY_STATUS.DELIVERED;
    }

    // Out for delivery statuses
    if (
        combined.includes('out for delivery') ||
        combined.includes('ofd') ||
        combined.includes('out-for-delivery') ||
        combined.includes('with delivery boy') ||
        combined.includes('dispatched to customer') ||
        combined.includes('on vehicle for delivery')
    ) {
        return DELIVERY_STATUS.OUT_FOR_DELIVERY;
    }

    // In transit statuses
    if (
        combined.includes('in transit') ||
        combined.includes('in-transit') ||
        combined.includes('reached') ||
        combined.includes('arrived') ||
        combined.includes('departed') ||
        combined.includes('forwarded') ||
        combined.includes('hub') ||
        combined.includes('received at') ||
        combined.includes('facility')
    ) {
        return DELIVERY_STATUS.IN_TRANSIT;
    }

    // Shipped/Picked up statuses
    if (
        combined.includes('shipped') ||
        combined.includes('picked up') ||
        combined.includes('pickup') ||
        combined.includes('manifested') ||
        combined.includes('dispatched') ||
        combined.includes('shipment created')
    ) {
        return DELIVERY_STATUS.SHIPPED;
    }

    // Failed delivery statuses
    if (
        combined.includes('failed') ||
        combined.includes('undelivered') ||
        combined.includes('refused') ||
        combined.includes('not delivered') ||
        combined.includes('delivery attempt')
    ) {
        return DELIVERY_STATUS.FAILED;
    }

    // RTO statuses
    if (
        combined.includes('rto') ||
        combined.includes('return to origin') ||
        combined.includes('returning') ||
        combined.includes('cancelled')
    ) {
        return DELIVERY_STATUS.RTO;
    }

    // Default to processing
    return DELIVERY_STATUS.PROCESSING;
};

/**
 * Get cached tracking data
 */
const getCachedTracking = (trackingNumber) => {
    try {
        const cache = JSON.parse(localStorage.getItem(TRACKING_CACHE_KEY) || '{}');
        const cached = cache[trackingNumber];

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
    } catch (e) {
        console.log('Cache read error:', e);
    }
    return null;
};

/**
 * Save tracking data to cache
 */
const setCachedTracking = (trackingNumber, data) => {
    try {
        const cache = JSON.parse(localStorage.getItem(TRACKING_CACHE_KEY) || '{}');
        cache[trackingNumber] = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(TRACKING_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.log('Cache write error:', e);
    }
};

/**
 * Fetch tracking status from Ekart
 * Uses web scraping approach via proxy or direct API
 */
const fetchEkartStatus = async (trackingNumber) => {
    try {
        // Try fetching from a CORS proxy or your backend
        const response = await fetch(
            `https://ekartlogistics.com/ws/getTrackingDetails?trackingId=${trackingNumber}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Ekart direct API not accessible:', error.message);
    }
    return null;
};

/**
 * Fetch tracking from TrackingMore API (free tier)
 */
const fetchFromTrackingAPI = async (trackingNumber, carrier) => {
    // This would require an API key in production
    // For now, we'll return null and use fallback
    return null;
};

/**
 * Main function to fetch live tracking status
 * This will fetch from carrier APIs and return normalized status
 */
export const fetchLiveTrackingStatus = async (trackingNumber, carrierName, shopifyStatus = '') => {
    const carrier = detectCarrier(carrierName, trackingNumber);

    // Check cache first
    const cached = getCachedTracking(trackingNumber);
    if (cached) {
        console.log('📦 Using cached tracking data for:', trackingNumber);
        return cached;
    }

    let trackingData = null;

    // Try carrier-specific APIs
    if (carrier === 'EKART') {
        trackingData = await fetchEkartStatus(trackingNumber);
    }

    // Try universal tracking API
    if (!trackingData) {
        trackingData = await fetchFromTrackingAPI(trackingNumber, carrier);
    }

    // If we got tracking data, parse it
    if (trackingData) {
        const result = {
            success: true,
            carrier: carrier,
            trackingNumber: trackingNumber,
            status: parseTrackingStatus(trackingData.currentStatus, trackingData.statusDetails),
            lastUpdate: trackingData.lastUpdate || new Date().toISOString(),
            location: trackingData.currentLocation || '',
            deliveryDate: trackingData.deliveryDate,
            events: trackingData.events || [],
        };

        setCachedTracking(trackingNumber, result);
        return result;
    }

    // Fallback: Parse status from Shopify fulfillment status
    const fallbackStatus = parseStatusFromShopify(shopifyStatus);
    const result = {
        success: false,
        carrier: carrier,
        trackingNumber: trackingNumber,
        status: fallbackStatus,
        lastUpdate: new Date().toISOString(),
        location: '',
        events: [],
        isFallback: true,
    };

    return result;
};

/**
 * Parse Shopify fulfillment status to our status format
 */
const parseStatusFromShopify = (shopifyStatus) => {
    const status = (shopifyStatus || '').toLowerCase();

    if (status === 'delivered' || status === 'complete' || status === 'completed') {
        return DELIVERY_STATUS.DELIVERED;
    }
    if (status === 'out_for_delivery' || status === 'out for delivery') {
        return DELIVERY_STATUS.OUT_FOR_DELIVERY;
    }
    if (status === 'in_transit') {
        return DELIVERY_STATUS.IN_TRANSIT;
    }
    if (status === 'fulfilled' || status === 'shipped') {
        return DELIVERY_STATUS.SHIPPED;
    }
    if (status === 'in_progress' || status === 'partial') {
        return DELIVERY_STATUS.PROCESSING;
    }

    return DELIVERY_STATUS.PROCESSING;
};

/**
 * Get delivery stage from fulfillment status string
 */
export const getDeliveryStageFromStatus = (fulfillmentStatus, trackingResult = null) => {
    // If we have live tracking result, use that
    if (trackingResult?.status?.stage) {
        return trackingResult.status.stage;
    }

    const parsed = parseStatusFromShopify(fulfillmentStatus);
    return parsed.stage;
};

/**
 * Transform carrier status to display format
 */
export const getStatusDisplay = (stage) => {
    switch (stage) {
        case 0:
            return {
                label: 'CANCELLED',
                color: 'text-red-400',
                bg: 'bg-red-900/20',
                border: 'border-red-500/50',
                icon: 'x-circle',
            };
        case 5:
            return {
                label: 'DELIVERED',
                color: 'text-green-400',
                bg: 'bg-green-900/20',
                border: 'border-green-500/50',
                icon: 'check',
            };
        case 4:
            return {
                label: 'OUT FOR DELIVERY',
                color: 'text-blue-400',
                bg: 'bg-blue-900/20',
                border: 'border-blue-500/50',
                icon: 'truck',
                animate: true,
            };
        case 3:
            return {
                label: 'SHIPPED',
                color: 'text-blue-400',
                bg: 'bg-blue-900/20',
                border: 'border-blue-500/50',
                icon: 'truck',
            };
        case 2:
            return {
                label: 'PROCESSING',
                color: 'text-white',
                bg: 'bg-white/10',
                border: 'border-white/30',
                icon: 'package',
            };
        default:
            return {
                label: 'ORDER PLACED',
                color: 'text-gray-400',
                bg: 'bg-gray-900/20',
                border: 'border-gray-700',
                icon: 'shopping-bag',
            };
    }
};

/**
 * Create tracking URL for carrier
 */
export const getCarrierTrackingUrl = (trackingNumber, carrierName) => {
    const carrier = detectCarrier(carrierName, trackingNumber);

    switch (carrier) {
        case 'EKART':
            return `https://ekartlogistics.com/track/${trackingNumber}`;
        case 'DELHIVERY':
            return `https://www.delhivery.com/track/package/${trackingNumber}`;
        case 'BLUEDART':
            return `https://www.bluedart.com/tracking/${trackingNumber}`;
        case 'DTDC':
            return `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${trackingNumber}`;
        case 'ECOM_EXPRESS':
            return `https://ecomexpress.in/tracking/?awb_field=${trackingNumber}`;
        case 'XPRESSBEES':
            return `https://www.xpressbees.com/track?awbNo=${trackingNumber}`;
        case 'INDIA_POST':
            return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
        case 'FEDEX':
            return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
        case 'DHL':
            return `https://www.dhl.com/in-en/home/tracking.html?tracking-id=${trackingNumber}`;
        default:
            return null;
    }
};

/**
 * Check if order is delivered
 */
export const isOrderDelivered = (fulfillmentStatus, trackingResult = null) => {
    if (trackingResult?.status?.stage === 5) {
        return true;
    }

    const status = (fulfillmentStatus || '').toLowerCase();
    return status === 'delivered' || status === 'complete' || status === 'completed';
};

/**
 * Check if order is out for delivery
 */
export const isOrderOutForDelivery = (fulfillmentStatus, trackingResult = null) => {
    if (trackingResult?.status?.stage === 4) {
        return true;
    }

    const status = (fulfillmentStatus || '').toLowerCase();
    return status === 'out_for_delivery' || status === 'out for delivery' || status === 'in_transit';
};

/**
 * Manually update tracking status (for when carrier shows delivered but Shopify doesn't)
 * This stores the override in localStorage
 */
export const setManualTrackingStatus = (trackingNumber, status) => {
    const result = {
        success: true,
        carrier: 'MANUAL',
        trackingNumber: trackingNumber,
        status: status,
        lastUpdate: new Date().toISOString(),
        isManual: true,
    };

    setCachedTracking(trackingNumber, result);
    return result;
};

/**
 * Clear tracking cache for a specific tracking number
 */
export const clearTrackingCache = (trackingNumber) => {
    try {
        const cache = JSON.parse(localStorage.getItem(TRACKING_CACHE_KEY) || '{}');
        delete cache[trackingNumber];
        localStorage.setItem(TRACKING_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.log('Cache clear error:', e);
    }
};

/**
 * Check if order is cancelled
 */
export const isOrderCancelled = (fulfillmentStatus, financialStatus, trackingResult = null) => {
    if (trackingResult?.status?.stage === 0) {
        return true;
    }

    const fulfillment = (fulfillmentStatus || '').toLowerCase();
    const financial = (financialStatus || '').toLowerCase();

    return (
        fulfillment === 'cancelled' ||
        fulfillment === 'canceled' ||
        fulfillment === 'restocked' ||
        financial === 'refunded' ||
        financial === 'voided'
    );
};

// Cancellation requests storage key
const CANCELLATION_REQUESTS_KEY = 'cancellation_requests';

/**
 * Store a cancellation request
 */
export const storeCancellationRequest = (orderId, orderNumber, reason = '') => {
    try {
        const requests = JSON.parse(localStorage.getItem(CANCELLATION_REQUESTS_KEY) || '{}');
        requests[orderId] = {
            orderId,
            orderNumber,
            reason,
            requestedAt: new Date().toISOString(),
            status: 'pending',
        };
        localStorage.setItem(CANCELLATION_REQUESTS_KEY, JSON.stringify(requests));
        return true;
    } catch (e) {
        console.error('Failed to store cancellation request:', e);
        return false;
    }
};

/**
 * Check if cancellation was requested for an order
 */
export const getCancellationRequest = (orderId) => {
    try {
        const requests = JSON.parse(localStorage.getItem(CANCELLATION_REQUESTS_KEY) || '{}');
        return requests[orderId] || null;
    } catch (e) {
        return null;
    }
};

/**
 * Mark order as cancelled (manual update)
 */
export const setOrderCancelled = (orderIdentifier) => {
    const result = {
        success: true,
        carrier: 'MANUAL',
        trackingNumber: orderIdentifier,
        status: DELIVERY_STATUS.CANCELLED,
        lastUpdate: new Date().toISOString(),
        isManual: true,
        isCancelled: true,
    };

    setCachedTracking(orderIdentifier, result);
    return result;
};

// Seller notification email
const SELLER_EMAIL = 'thedeeprootstudios@gmail.com';

/**
 * Send cancellation notification to seller
 * Uses Web3Forms for email delivery (free, no backend required)
 * Falls back to mailto link if API fails
 */
export const sendCancellationNotification = async (orderDetails) => {
    const {
        orderNumber,
        customerName,
        customerEmail,
        reason,
        orderTotal,
        shippingAddress,
    } = orderDetails;

    // Format the message
    const subject = `[URGENT] Cancellation Request - Order #${orderNumber}`;
    const message = `
CANCELLATION REQUEST

Order Details:
- Order Number: #${orderNumber}
- Order Total: ${orderTotal || 'N/A'}
- Date Requested: ${new Date().toLocaleString('en-IN')}

Customer Details:
- Name: ${customerName || 'Customer'}
- Email: ${customerEmail || 'N/A'}

Shipping Address:
${shippingAddress || 'N/A'}

Reason for Cancellation:
${reason || 'No reason provided'}

---
Please process this cancellation request as soon as possible.
If the order has already been shipped, please initiate the return process.

This is an automated message from Deep Root Studios website.
    `.trim();

    try {
        // Try Web3Forms (free email API - get access key from https://web3forms.com/)
        // Replace with your actual access key if you have one
        const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

        if (WEB3FORMS_KEY) {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: subject,
                    from_name: customerName || 'Website Customer',
                    email: customerEmail || 'no-reply@deeprootstudios.com',
                    message: message,
                    to: SELLER_EMAIL,
                }),
            });

            if (response.ok) {
                console.log('✅ Cancellation notification sent successfully');
                return { success: true, method: 'api' };
            }
        }
    } catch (error) {
        console.log('Web3Forms API failed, using fallback:', error.message);
    }

    // Fallback: Open mailto link
    const mailtoLink = `mailto:${SELLER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    // Open in new window/tab
    window.open(mailtoLink, '_blank');

    return { success: true, method: 'mailto' };
};

export default {
    detectCarrier,
    fetchLiveTrackingStatus,
    getDeliveryStageFromStatus,
    getStatusDisplay,
    getCarrierTrackingUrl,
    isOrderDelivered,
    isOrderOutForDelivery,
    isOrderCancelled,
    setManualTrackingStatus,
    setOrderCancelled,
    storeCancellationRequest,
    getCancellationRequest,
    sendCancellationNotification,
    clearTrackingCache,
    DELIVERY_STATUS,
};
