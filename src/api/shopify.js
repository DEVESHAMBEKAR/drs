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
 * Fetch Customer Dossier - Full Profile, Orders, and ALL Addresses
 * @param {string} token - Customer access token from login
 * @returns {Promise<object>} - Customer data object
 */
export const fetchCustomerDossier = async (token) => {
    const query = `
        query getCustomerDossier($token: String!) {
            customer(customerAccessToken: $token) {
                id
                firstName
                lastName
                email
                phone
                defaultAddress {
                    id
                    formatted
                }
                addresses(first: 10) {
                    edges {
                        node {
                            id
                            firstName
                            lastName
                            company
                            address1
                            address2
                            city
                            province
                            provinceCode
                            zip
                            country
                            countryCodeV2
                            phone
                            formatted
                        }
                    }
                }
                orders(first: 10, reverse: true) {
                    edges {
                        node {
                            id
                            orderNumber
                            name
                            processedAt
                            fulfillmentStatus
                            financialStatus
                            totalPrice { 
                                amount 
                                currencyCode 
                            }
                            shippingAddress {
                                city
                                province
                                country
                            }
                            successfulFulfillments(first: 5) {
                                trackingCompany
                                trackingInfo(first: 3) {
                                    number
                                    url
                                }
                            }
                            lineItems(first: 5) {
                                edges {
                                    node {
                                        title
                                        quantity
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
    const defaultAddressId = customer.defaultAddress?.id || null;

    return {
        id: customer.id,
        firstName: customer.firstName || 'Operative',
        lastName: customer.lastName || '',
        email: customer.email,
        phone: customer.phone,
        defaultAddressId: defaultAddressId,
        defaultAddress: customer.defaultAddress?.formatted || null,
        // Full addresses array with all details
        addresses: customer.addresses?.edges?.map(edge => ({
            id: edge.node.id,
            firstName: edge.node.firstName,
            lastName: edge.node.lastName,
            company: edge.node.company,
            address1: edge.node.address1,
            address2: edge.node.address2,
            city: edge.node.city,
            province: edge.node.province,
            provinceCode: edge.node.provinceCode,
            zip: edge.node.zip,
            country: edge.node.country,
            countryCode: edge.node.countryCodeV2,
            phone: edge.node.phone,
            formatted: edge.node.formatted,
            isDefault: edge.node.id === defaultAddressId,
        })) || [],
        orders: customer.orders?.edges?.map(edge => {
            // Extract tracking info from successful fulfillments
            const fulfillments = edge.node.successfulFulfillments || [];
            const trackingInfo = [];

            fulfillments.forEach(fulfillment => {
                const company = fulfillment.trackingCompany;
                fulfillment.trackingInfo?.forEach(info => {
                    if (info.number) {
                        trackingInfo.push({
                            company: company,
                            number: info.number,
                            url: info.url,
                        });
                    }
                });
            });

            return {
                id: edge.node.id,
                orderNumber: edge.node.orderNumber,
                name: edge.node.name,
                processedAt: edge.node.processedAt,
                totalPrice: edge.node.totalPrice,
                financialStatus: edge.node.financialStatus,
                fulfillmentStatus: edge.node.fulfillmentStatus,
                shippingAddress: edge.node.shippingAddress,
                trackingInfo: trackingInfo,
                lineItems: edge.node.lineItems?.edges?.map(item => ({
                    title: item.node.title,
                    quantity: item.node.quantity,
                    imageUrl: item.node.variant?.image?.url || null,
                })) || [],
            };
        }) || [],
    };
};

/**
 * Fetch the most recent order for a customer
 * Used to get real order details after checkout is complete
 * @param {string} token - Customer access token
 * @returns {Promise<object>} - Latest order data
 */
export const fetchLatestOrder = async (token) => {
    const query = `
        query getLatestOrder($token: String!) {
            customer(customerAccessToken: $token) {
                orders(first: 1, reverse: true) {
                    edges {
                        node {
                            id
                            orderNumber
                            name
                            processedAt
                            fulfillmentStatus
                            financialStatus
                            totalPrice { 
                                amount 
                                currencyCode 
                            }
                            subtotalPrice {
                                amount
                                currencyCode
                            }
                            totalShippingPrice {
                                amount
                                currencyCode
                            }
                            totalTax {
                                amount
                                currencyCode
                            }
                            shippingAddress {
                                firstName
                                lastName
                                address1
                                address2
                                city
                                province
                                zip
                                country
                                phone
                            }
                            email
                            phone
                            lineItems(first: 20) {
                                edges {
                                    node {
                                        title
                                        quantity
                                        customAttributes {
                                            key
                                            value
                                        }
                                        originalTotalPrice {
                                            amount
                                            currencyCode
                                        }
                                        variant { 
                                            title
                                            image { 
                                                url 
                                            } 
                                        }
                                    }
                                }
                            }
                            successfulFulfillments(first: 5) {
                                trackingCompany
                                trackingInfo(first: 3) {
                                    number
                                    url
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
        throw new Error(result.errors[0]?.message || 'Failed to fetch order');
    }

    const orderEdge = result.data?.customer?.orders?.edges?.[0];
    if (!orderEdge) {
        return null;
    }

    const order = orderEdge.node;

    // Extract tracking info
    const fulfillments = order.successfulFulfillments || [];
    const trackingInfo = [];
    fulfillments.forEach(fulfillment => {
        const company = fulfillment.trackingCompany;
        fulfillment.trackingInfo?.forEach(info => {
            if (info.number) {
                trackingInfo.push({
                    company: company,
                    number: info.number,
                    url: info.url,
                });
            }
        });
    });

    return {
        id: order.id,
        orderNumber: order.orderNumber,
        name: order.name,
        processedAt: order.processedAt,
        email: order.email,
        phone: order.phone,
        financialStatus: order.financialStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        totalPrice: order.totalPrice,
        subtotalPrice: order.subtotalPrice,
        shippingPrice: order.totalShippingPrice,
        taxPrice: order.totalTax,
        shippingAddress: order.shippingAddress,
        trackingInfo: trackingInfo,
        lineItems: order.lineItems?.edges?.map(item => ({
            title: item.node.title,
            quantity: item.node.quantity,
            variantTitle: item.node.variant?.title || '',
            imageUrl: item.node.variant?.image?.url || null,
            price: item.node.originalTotalPrice,
            customAttributes: item.node.customAttributes || [],
        })) || [],
    };
};

/**
 * Create a new customer address
 * @param {string} token - Customer access token
 * @param {object} address - Address data
 * @returns {Promise<object>} - Created address
 */
export const createCustomerAddress = async (token, address) => {
    const mutation = `
        mutation customerAddressCreate($token: String!, $address: MailingAddressInput!) {
            customerAddressCreate(customerAccessToken: $token, address: $address) {
                customerAddress {
                    id
                    firstName
                    lastName
                    address1
                    address2
                    city
                    province
                    zip
                    country
                    phone
                    formatted
                }
                customerUserErrors {
                    field
                    message
                }
            }
        }
    `;

    const addressInput = {
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        company: address.company || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        city: address.city || '',
        province: address.province || '',
        zip: address.zip || '',
        country: address.country || 'India',
        phone: address.phone || '',
    };

    const result = await executeQuery(mutation, { token, address: addressInput });

    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to create address');
    }

    const createResult = result.data?.customerAddressCreate;

    if (createResult?.customerUserErrors?.length > 0) {
        throw new Error(createResult.customerUserErrors[0].message);
    }

    return {
        success: true,
        address: createResult?.customerAddress,
    };
};

/**
 * Update an existing customer address
 * @param {string} token - Customer access token
 * @param {string} addressId - Address ID to update
 * @param {object} address - Updated address data
 * @returns {Promise<object>} - Updated address
 */
export const updateCustomerAddress = async (token, addressId, address) => {
    const mutation = `
        mutation customerAddressUpdate($token: String!, $id: ID!, $address: MailingAddressInput!) {
            customerAddressUpdate(customerAccessToken: $token, id: $id, address: $address) {
                customerAddress {
                    id
                    firstName
                    lastName
                    address1
                    address2
                    city
                    province
                    zip
                    country
                    phone
                    formatted
                }
                customerUserErrors {
                    field
                    message
                }
            }
        }
    `;

    const addressInput = {
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        company: address.company || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        city: address.city || '',
        province: address.province || '',
        zip: address.zip || '',
        country: address.country || 'India',
        phone: address.phone || '',
    };

    const result = await executeQuery(mutation, { token, id: addressId, address: addressInput });

    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to update address');
    }

    const updateResult = result.data?.customerAddressUpdate;

    if (updateResult?.customerUserErrors?.length > 0) {
        throw new Error(updateResult.customerUserErrors[0].message);
    }

    return {
        success: true,
        address: updateResult?.customerAddress,
    };
};

/**
 * Delete a customer address
 * @param {string} token - Customer access token
 * @param {string} addressId - Address ID to delete
 * @returns {Promise<object>} - Deletion result
 */
export const deleteCustomerAddress = async (token, addressId) => {
    const mutation = `
        mutation customerAddressDelete($token: String!, $id: ID!) {
            customerAddressDelete(customerAccessToken: $token, id: $id) {
                deletedCustomerAddressId
                customerUserErrors {
                    field
                    message
                }
            }
        }
    `;

    const result = await executeQuery(mutation, { token, id: addressId });

    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to delete address');
    }

    const deleteResult = result.data?.customerAddressDelete;

    if (deleteResult?.customerUserErrors?.length > 0) {
        throw new Error(deleteResult.customerUserErrors[0].message);
    }

    return {
        success: true,
        deletedId: deleteResult?.deletedCustomerAddressId,
    };
};

/**
 * Set an address as the default address
 * @param {string} token - Customer access token
 * @param {string} addressId - Address ID to set as default
 * @returns {Promise<object>} - Result
 */
export const setDefaultAddress = async (token, addressId) => {
    const mutation = `
        mutation customerDefaultAddressUpdate($token: String!, $addressId: ID!) {
            customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $addressId) {
                customer {
                    id
                    defaultAddress {
                        id
                        formatted
                    }
                }
                customerUserErrors {
                    field
                    message
                }
            }
        }
    `;

    const result = await executeQuery(mutation, { token, addressId });

    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to set default address');
    }

    const updateResult = result.data?.customerDefaultAddressUpdate;

    if (updateResult?.customerUserErrors?.length > 0) {
        throw new Error(updateResult.customerUserErrors[0].message);
    }

    return {
        success: true,
        defaultAddress: updateResult?.customer?.defaultAddress,
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
    fetchLatestOrder,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultAddress,
    formatCurrency,
    formatDate,
};
