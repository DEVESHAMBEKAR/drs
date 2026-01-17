// Shopify Storefront API GraphQL Utilities - Headless Implementation

const SHOPIFY_DOMAIN = 'deep-root-studios.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '4dae98198cc50eb2b64ab901e7910625';

/**
 * Execute a GraphQL query against Shopify Storefront API
 * @param {string} query - GraphQL query string
 * @param {object} variables - Query variables
 * @returns {Promise<object>} - Query result
 */
const executeQuery = async (query, variables = {}) => {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
    }

    return response.json();
};

/**
 * Fetch Customer Dossier - Full Profile, Orders with Images, Address
 * @param {string} token - Customer access token from login
 * @returns {Promise<object>} - Customer data object
 */
export const fetchCustomerDossier = async (token) => {
    const query = `
        query getCustomerData($token: String!) {
            customer(customerAccessToken: $token) {
                firstName
                lastName
                email
                phone
                defaultAddress {
                    formatted
                }
                orders(first: 10, reverse: true) {
                    edges {
                        node {
                            id
                            orderNumber
                            processedAt
                            fulfillmentStatus
                            financialStatus
                            totalPrice { 
                                amount 
                                currencyCode 
                            }
                            lineItems(first: 5) {
                                edges {
                                    node {
                                        title
                                        variant { 
                                            image { 
                                                url 
                                            } 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const result = await executeQuery(query, { token });

    if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'Failed to fetch customer dossier');
    }

    if (!result.data?.customer) {
        throw new Error('Session expired. Please authenticate again.');
    }

    // Transform the data for easier consumption
    const customer = result.data.customer;
    return {
        firstName: customer.firstName || 'Operative',
        lastName: customer.lastName || '',
        email: customer.email,
        phone: customer.phone,
        defaultAddress: customer.defaultAddress?.formatted || null,
        orders: customer.orders?.edges?.map(edge => ({
            id: edge.node.id,
            orderNumber: edge.node.orderNumber,
            processedAt: edge.node.processedAt,
            totalPrice: edge.node.totalPrice,
            financialStatus: edge.node.financialStatus,
            fulfillmentStatus: edge.node.fulfillmentStatus,
            lineItems: edge.node.lineItems?.edges?.map(item => ({
                title: item.node.title,
                imageUrl: item.node.variant?.image?.url || null,
            })) || [],
        })) || [],
    };
};

/**
 * Format currency amount
 * @param {string|number} amount - Amount to format
 * @param {string} currencyCode - Currency code (e.g., 'INR', 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'INR') => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currencyCode,
    }).format(numAmount);
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default {
    fetchCustomerDossier,
    formatCurrency,
    formatDate,
};
