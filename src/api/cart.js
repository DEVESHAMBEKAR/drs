/**
 * Cart API - Shopify Storefront GraphQL Mutations
 * Handles cart buyer identity association and checkout operations
 */

const SHOP_DOMAIN = 'deep-root-studios.myshopify.com';
const STOREFRONT_TOKEN = '4dae98198cc50eb2b64ab901e7910625';
const API_VERSION = '2024-01';

/**
 * Execute a GraphQL query/mutation against Shopify Storefront API
 */
const shopifyFetch = async (query, variables = {}) => {
    const response = await fetch(
        `https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        }
    );

    const result = await response.json();

    if (result.errors) {
        console.error('Shopify API Error:', result.errors);
        throw new Error(result.errors[0]?.message || 'GraphQL Error');
    }

    return result.data;
};

/**
 * Associate customer with cart using cartBuyerIdentityUpdate mutation
 * This "stamps" the cart with customer details before checkout
 * 
 * @param {string} cartId - The Shopify cart/checkout ID
 * @param {string} accessToken - Customer access token
 * @param {object} userInfo - Customer info (email, address)
 * @returns {object} Updated cart with checkoutUrl
 */
export const associateCustomerWithCart = async (cartId, accessToken, userInfo = {}) => {
    // Note: Shopify's checkout API uses different mutation for checkout vs cart
    // For checkouts created via shopify-buy SDK, we use checkoutCustomerAssociateV2
    const mutation = `
        mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
            checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
                checkout {
                    id
                    webUrl
                    email
                    shippingAddress {
                        firstName
                        lastName
                        address1
                        address2
                        city
                        province
                        country
                        zip
                        phone
                    }
                }
                checkoutUserErrors {
                    field
                    message
                }
                customer {
                    id
                    email
                    firstName
                    lastName
                }
            }
        }
    `;

    const variables = {
        checkoutId: cartId,
        customerAccessToken: accessToken,
    };

    try {
        const data = await shopifyFetch(mutation, variables);

        if (data.checkoutCustomerAssociateV2?.checkoutUserErrors?.length > 0) {
            const error = data.checkoutCustomerAssociateV2.checkoutUserErrors[0];
            throw new Error(error.message);
        }

        return {
            success: true,
            checkout: data.checkoutCustomerAssociateV2?.checkout,
            checkoutUrl: data.checkoutCustomerAssociateV2?.checkout?.webUrl,
            customer: data.checkoutCustomerAssociateV2?.customer,
        };
    } catch (error) {
        console.error('Error associating customer with cart:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Update checkout email
 */
export const updateCheckoutEmail = async (checkoutId, email) => {
    const mutation = `
        mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {
            checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {
                checkout {
                    id
                    email
                    webUrl
                }
                checkoutUserErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = { checkoutId, email };

    try {
        const data = await shopifyFetch(mutation, variables);
        return {
            success: true,
            checkout: data.checkoutEmailUpdateV2?.checkout,
        };
    } catch (error) {
        console.error('Error updating checkout email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update checkout shipping address
 */
export const updateCheckoutShippingAddress = async (checkoutId, shippingAddress) => {
    const mutation = `
        mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
            checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
                checkout {
                    id
                    webUrl
                    shippingAddress {
                        firstName
                        lastName
                        address1
                        city
                        province
                        country
                        zip
                    }
                }
                checkoutUserErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = { checkoutId, shippingAddress };

    try {
        const data = await shopifyFetch(mutation, variables);

        if (data.checkoutShippingAddressUpdateV2?.checkoutUserErrors?.length > 0) {
            throw new Error(data.checkoutShippingAddressUpdateV2.checkoutUserErrors[0].message);
        }

        return {
            success: true,
            checkout: data.checkoutShippingAddressUpdateV2?.checkout,
        };
    } catch (error) {
        console.error('Error updating shipping address:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Complete checkout preparation - Associates customer and pre-fills address
 * This is the main function to call before redirecting to Shopify checkout
 */
export const prepareCheckoutForCustomer = async (checkoutId, customerToken, customerInfo) => {
    const results = {
        customerAssociated: false,
        addressUpdated: false,
        checkoutUrl: null,
        errors: [],
    };

    // Step 1: Associate customer with checkout
    if (customerToken) {
        const assocResult = await associateCustomerWithCart(checkoutId, customerToken);

        if (assocResult.success) {
            results.customerAssociated = true;
            results.checkoutUrl = assocResult.checkoutUrl;
            console.log('✅ Customer associated with checkout');
        } else {
            results.errors.push(assocResult.error);
            console.warn('⚠️ Could not associate customer:', assocResult.error);
        }
    }

    // Step 2: Update shipping address if provided
    if (customerInfo?.defaultAddress) {
        const addr = customerInfo.defaultAddress;
        const shippingAddress = {
            firstName: customerInfo.firstName || '',
            lastName: customerInfo.lastName || '',
            address1: addr.address1 || '',
            address2: addr.address2 || '',
            city: addr.city || '',
            province: addr.province || '',
            country: addr.country || 'IN',
            zip: addr.zip || '',
            phone: customerInfo.phone || '',
        };

        const addrResult = await updateCheckoutShippingAddress(checkoutId, shippingAddress);

        if (addrResult.success) {
            results.addressUpdated = true;
            results.checkoutUrl = addrResult.checkout?.webUrl || results.checkoutUrl;
            console.log('✅ Shipping address pre-filled');
        } else {
            results.errors.push(addrResult.error);
            console.warn('⚠️ Could not pre-fill address:', addrResult.error);
        }
    }

    // Step 3: Update email if not already set
    if (customerInfo?.email) {
        const emailResult = await updateCheckoutEmail(checkoutId, customerInfo.email);

        if (emailResult.success) {
            results.checkoutUrl = emailResult.checkout?.webUrl || results.checkoutUrl;
            console.log('✅ Email pre-filled');
        }
    }

    return results;
};

export default {
    associateCustomerWithCart,
    updateCheckoutEmail,
    updateCheckoutShippingAddress,
    prepareCheckoutForCustomer,
};
