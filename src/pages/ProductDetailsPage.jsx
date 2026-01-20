import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';
import AccordionItem from '../components/AccordionItem';
import RecommendedSection from '../components/RecommendedSection';
import ReviewsSection from '../components/ReviewsSection';
import { Truck, Wrench, Zap, Play, PenLine, Globe, Shield } from 'lucide-react';

const ProductDetailsPage = () => {
    // Extract full product ID from URL path (handles Shopify GIDs with slashes)
    const location = useLocation();
    // Decode the URL-encoded product ID to restore the original GID format
    const id = decodeURIComponent(location.pathname.replace('/product/', ''));
    const { client, addItemToCart } = useShopify();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null); // Track selected variant
    const [engravingText, setEngravingText] = useState('');
    const [isEngravingEnabled, setIsEngravingEnabled] = useState(false);
    const [fontStyle, setFontStyle] = useState('classic');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [pincode, setPincode] = useState('');
    const [pincodeData, setPincodeData] = useState(null);
    const [pincodeStatus, setPincodeStatus] = useState('');
    const [isCheckingPincode, setIsCheckingPincode] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [isGiftWrap, setIsGiftWrap] = useState(false);
    const [giftMessage, setGiftMessage] = useState('');
    const [isGiftNoteEnabled, setIsGiftNoteEnabled] = useState(false);
    const [giftNoteText, setGiftNoteText] = useState('');

    // Ref to track the buy section
    const buySectionRef = useRef(null);

    // Fetch single product by ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const fetchedProduct = await client.product.fetch(id);
                setProduct(fetchedProduct);
                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, client]);

    // Initialize selected variant to first available variant
    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            // Find first available variant, or fallback to first variant
            const firstAvailable = product.variants.find(v => v.available) || product.variants[0];
            setSelectedVariant(firstAvailable);
        }
    }, [product]);

    // Scroll observer to show/hide sticky bar
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky bar when buy section is NOT visible
                setShowStickyBar(!entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: '0px'
            }
        );

        if (buySectionRef.current) {
            observer.observe(buySectionRef.current);
        }

        return () => {
            if (buySectionRef.current) {
                observer.unobserve(buySectionRef.current);
            }
        };
    }, [product]);

    // Handle variant selection
    const handleVariantChange = (variant) => {
        if (!variant) return;

        setSelectedVariant(variant);

        // Update image if variant has a specific image
        if (variant.image && product.images) {
            const imageIndex = product.images.findIndex(img => img.id === variant.image.id);
            if (imageIndex !== -1) {
                setSelectedImage(imageIndex);
            }
        }
    };

    // Handle add to cart with custom attributes
    const handleAddToCart = async () => {
        if (!product || !selectedVariant) {
            console.error('Product or variant not available');
            alert('Please select a product variant');
            return;
        }

        setIsAdding(true);
        const variantId = selectedVariant.id; // Use selected variant instead of first variant

        // Debug logging
        console.log('Adding variant:', variantId);
        console.log('Product:', product.title);
        console.log('Selected Variant:', selectedVariant.title);
        console.log('Quantity:', quantity);
        console.log('Engraving:', engravingText);

        // Prepare custom attributes for Shopify
        const customAttributes = [];

        // Add engraving attributes if enabled
        if (isEngravingEnabled && engravingText.trim()) {
            customAttributes.push({ key: 'Engraving_Text', value: engravingText.trim() });
            customAttributes.push({ key: 'Font_Style', value: fontStyle === 'classic' ? 'Classic (Serif)' : 'Modern (Sans)' });
        }

        // Add gift wrap attributes if selected
        if (isGiftWrap) {
            customAttributes.push({ key: 'Gift_Wrap', value: 'true' });
            if (giftMessage.trim()) {
                customAttributes.push({ key: 'Gift_Message', value: giftMessage.trim() });
            }
        }

        // Add gift note if enabled
        if (isGiftNoteEnabled && giftNoteText.trim()) {
            customAttributes.push({ key: 'Gift_Note', value: giftNoteText.trim() });
        }

        try {
            await addItemToCart(variantId, quantity, customAttributes);
        } catch (err) {
            console.error('Error adding to cart:', err);
            // Error alert is now handled in context
        } finally {
            setIsAdding(false);
        }
    };

    // Handle Buy Now - add to cart and redirect to checkout
    const handleBuyNow = async () => {
        if (!product || !selectedVariant) {
            console.error('Product or variant not available');
            alert('Please select a product variant');
            return;
        }

        setIsAdding(true);
        const variantId = selectedVariant.id; // Use selected variant

        // Debug logging
        console.log('Buy Now - Adding variant:', variantId);
        console.log('Selected Variant:', selectedVariant.title);

        // Prepare custom attributes for Shopify
        const customAttributes = [];

        // Add engraving attributes if enabled
        if (isEngravingEnabled && engravingText.trim()) {
            customAttributes.push({ key: 'Engraving_Text', value: engravingText.trim() });
            customAttributes.push({ key: 'Font_Style', value: fontStyle === 'classic' ? 'Classic (Serif)' : 'Modern (Sans)' });
        }

        // Add gift wrap attributes if selected
        if (isGiftWrap) {
            customAttributes.push({ key: 'Gift_Wrap', value: 'true' });
            if (giftMessage.trim()) {
                customAttributes.push({ key: 'Gift_Message', value: giftMessage.trim() });
            }
        }

        // Add gift note if enabled
        if (isGiftNoteEnabled && giftNoteText.trim()) {
            customAttributes.push({ key: 'Gift_Note', value: giftNoteText.trim() });
        }

        try {
            const checkout = await addItemToCart(variantId, quantity, customAttributes);
            // Redirect to Shopify checkout
            if (checkout && checkout.webUrl) {
                window.location.href = checkout.webUrl;
            }
        } catch (err) {
            console.error('Error processing buy now:', err);
            // Error alert is now handled in context
            setIsAdding(false);
        }
    };

    // Handle Pincode Check
    const handleCheckPincode = async () => {
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            setPincodeStatus('error');
            setPincodeData(null);
            return;
        }

        setIsCheckingPincode(true);
        setPincodeStatus('');
        setPincodeData(null);

        try {
            // Fetch pincode data from India Post API
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                const destinationCity = postOffice.District;
                const destinationState = postOffice.State;

                // Business location: Pune, Maharashtra
                const businessCity = 'Pune';
                const businessState = 'Maharashtra';

                // Calculate delivery dates based on location
                const today = new Date();
                let minDays, maxDays, deliveryType;

                // Determine delivery time based on distance from Pune
                if (destinationCity.toLowerCase().includes('pune')) {
                    // Local delivery within Pune
                    minDays = 1;
                    maxDays = 2;
                    deliveryType = 'Local';
                } else if (destinationState === businessState) {
                    // Within Maharashtra
                    minDays = 2;
                    maxDays = 4;
                    deliveryType = 'State';
                } else {
                    // Other states
                    minDays = 4;
                    maxDays = 7;
                    deliveryType = 'Interstate';
                }

                const minDeliveryDate = new Date(today);
                const maxDeliveryDate = new Date(today);

                minDeliveryDate.setDate(today.getDate() + minDays);
                maxDeliveryDate.setDate(today.getDate() + maxDays);

                const formatDate = (date) => {
                    const options = { day: 'numeric', month: 'short' };
                    return date.toLocaleDateString('en-IN', options);
                };

                setPincodeData({
                    city: destinationCity,
                    state: destinationState,
                    area: postOffice.Name,
                    deliveryRange: `${formatDate(minDeliveryDate)} - ${formatDate(maxDeliveryDate)}`,
                    deliveryDays: `${minDays}-${maxDays} days`,
                    deliveryType: deliveryType
                });
                setPincodeStatus('success');
            } else {
                setPincodeStatus('error');
                setPincodeData(null);
            }
        } catch (error) {
            console.error('Error fetching pincode data:', error);
            setPincodeStatus('error');
            setPincodeData(null);
        } finally {
            setIsCheckingPincode(false);
        }
    };

    // Helper function to get dimensions for variant
    const getDimensionsForVariant = (variantTitle) => {
        const dimensionsMap = {
            'Small': '12 x 12 inches',
            'Medium': '18 x 18 inches',
            'Large': '24 x 24 inches',
            'X-Large': '30 x 30 inches',
            'XL': '30 x 30 inches',
        };

        // Try to find exact match or partial match
        for (const [key, value] of Object.entries(dimensionsMap)) {
            if (variantTitle.includes(key)) {
                return `📐 Dimensions: ${value}`;
            }
        }

        return ''; // Return empty if no match found
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black pt-28">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white mx-auto"></div>
                    <p className="font-body text-lg text-zinc-600 dark:text-gray-400">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black pt-28">
                <div className="text-center">
                    <p className="mb-4 font-body text-lg text-zinc-600 dark:text-gray-400">{error || 'Product not found'}</p>
                    <Link
                        to="/shop"
                        className="inline-block border-2 border-black dark:border-white px-6 py-2 font-body text-sm tracking-widest text-black dark:text-white transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    >
                        BACK TO SHOP
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-16">
            {/* Back to Shop Link */}
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 font-body text-sm tracking-widest text-zinc-900 dark:text-white transition-colors hover:text-zinc-600 dark:hover:text-gray-300"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    BACK TO SHOP
                </Link>
            </div>

            {/* Split Screen Layout */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-20 lg:grid-cols-2 lg:gap-16">

                {/* LEFT SIDE - Product Images */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Main Image */}
                    <div className="relative aspect-square overflow-hidden bg-white dark:bg-soft-black">
                        {product.images && product.images.length > 0 ? (
                            <motion.img
                                key={selectedImage}
                                src={product.images[selectedImage].src}
                                alt={product.title}
                                className="h-full w-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <span className="font-body text-zinc-400 dark:text-smoke">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square w-20 overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? 'border-antique-brass'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={image.src}
                                        alt={`${product.title} - View ${index + 1}`}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* RIGHT SIDE - Product Details & Customization */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Product Header */}
                    <div>
                        <h1 className="font-heading text-2xl text-black dark:text-white md:text-4xl">
                            {product.title}
                        </h1>

                        {selectedVariant && (
                            <>
                                {/* Price Display with Dynamic Discount */}
                                {(() => {
                                    const currentPrice = parseFloat(selectedVariant.price.amount);
                                    const compareAtPrice = selectedVariant.compareAtPrice
                                        ? parseFloat(selectedVariant.compareAtPrice.amount)
                                        : null;
                                    const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
                                    const savedPercentage = hasDiscount
                                        ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
                                        : 0;

                                    return (
                                        <div className="mt-4">
                                            {hasDiscount ? (
                                                // With Discount - Show Compare Price, Current Price, and Badge
                                                <div className="flex items-end gap-3 mb-2">
                                                    {/* Current Price */}
                                                    <p className="text-3xl md:text-4xl font-display font-bold text-zinc-900 dark:text-white">
                                                        ₹{currentPrice.toFixed(2)}
                                                    </p>

                                                    {/* Compare At Price (Strikethrough) */}
                                                    <p className="text-lg text-gray-500 dark:text-gray-500 line-through decoration-gray-600 dark:decoration-gray-400 font-mono mb-1">
                                                        ₹{compareAtPrice.toFixed(2)}
                                                    </p>

                                                    {/* Discount Badge - Stock Market Aesthetic */}
                                                    <span className="px-2 py-0.5 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-xs font-bold tracking-wider uppercase mb-1">
                                                        SAVE {savedPercentage}%
                                                    </span>
                                                </div>
                                            ) : (
                                                // No Discount - Simple Price
                                                <p className="font-body text-3xl text-zinc-900 dark:text-white">
                                                    ₹{currentPrice.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Delivery Estimate */}
                                <div className="mt-3 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-green-600 dark:text-green-500" />
                                    <p className="font-body text-sm text-green-600 dark:text-green-500">
                                        Order now to get it by {(() => {
                                            const deliveryDate = new Date();
                                            deliveryDate.setDate(deliveryDate.getDate() + 5);
                                            return deliveryDate.toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'short'
                                            });
                                        })()}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Variant Selector - Industrial Dark Luxury Style */}
                    {product.variants && product.variants.length > 1 && (
                        <div>
                            <label className="mb-3 block font-body text-xs tracking-widest uppercase text-gray-500 dark:text-gray-400">
                                SELECT CONFIGURATION
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant) => {
                                    const isSelected = selectedVariant?.id === variant.id;
                                    const isAvailable = variant.available;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => isAvailable && handleVariantChange(variant)}
                                            disabled={!isAvailable}
                                            className={`
                                                h-12 min-w-[80px] px-6 flex items-center justify-center
                                                font-display uppercase tracking-widest text-sm
                                                transition-all duration-300 cursor-pointer
                                                ${isSelected
                                                    ? 'border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg'
                                                    : isAvailable
                                                        ? 'border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white hover:border-black dark:hover:border-white'
                                                        : 'border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed line-through opacity-40'
                                                }
                                            `}
                                        >
                                            {variant.title}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Dynamic Dimensions Display */}
                            {selectedVariant && (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 font-mono">
                                    {getDimensionsForVariant(selectedVariant.title)}
                                </p>
                            )}
                        </div>
                    )}


                    {/* Quantity Selector */}
                    <div>
                        <label className="mb-2 block font-body text-sm tracking-widest text-zinc-700 dark:text-white">
                            QUANTITY
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex h-10 w-10 items-center justify-center border-2 border-zinc-300 dark:border-white bg-white dark:bg-black text-zinc-900 dark:text-white transition-all hover:border-black dark:hover:border-gray-300"
                            >
                                −
                            </button>
                            <span className="font-body text-lg text-zinc-900 dark:text-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center border-2 border-zinc-300 dark:border-white bg-white dark:bg-black text-zinc-900 dark:text-white transition-all hover:border-black dark:hover:border-gray-300"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Pincode Checker */}
                    <div>
                        <label className="mb-2 block font-body text-sm tracking-widest text-zinc-700 dark:text-white">
                            CHECK DELIVERY
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => {
                                    setPincode(e.target.value);
                                    setPincodeStatus('');
                                    setPincodeData(null);
                                }}
                                placeholder="Enter Pincode"
                                maxLength={6}
                                className="flex-1 border-2 border-zinc-300 dark:border-white bg-white dark:bg-black px-4 py-2 font-body text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-gray-500 transition-all focus:border-black dark:focus:border-gray-300 focus:outline-none"
                            />
                            <button
                                onClick={handleCheckPincode}
                                disabled={isCheckingPincode}
                                className="border-2 border-zinc-300 dark:border-white bg-white dark:bg-black px-6 py-2 font-body text-sm tracking-widest text-zinc-900 dark:text-white transition-all hover:border-black dark:hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCheckingPincode ? 'CHECKING...' : 'CHECK'}
                            </button>
                        </div>
                        {pincodeStatus === 'success' && pincodeData && (
                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded">
                                <p className="font-body text-sm text-green-700 dark:text-green-400 font-medium">
                                    ✓ Delivery to {pincodeData.city}, {pincodeData.state}
                                </p>
                                <p className="font-body text-xs text-green-600 dark:text-green-500 mt-1">
                                    {pincodeData.area}
                                </p>
                                <p className="font-body text-sm text-green-700 dark:text-green-400 mt-2">
                                    Expected delivery: {pincodeData.deliveryRange}
                                </p>
                            </div>
                        )}
                        {pincodeStatus === 'error' && (
                            <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                Please enter a valid 6-digit pincode
                            </p>
                        )}
                    </div>


                    {/* Action Buttons Row */}
                    <div ref={buySectionRef} className="flex flex-col gap-4 sm:flex-row">
                        {/* Add to Cart Button - Secondary Style */}
                        <motion.button
                            onClick={handleAddToCart}
                            disabled={isLoading || isAdding || !product || !product.variants || product.variants.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-black dark:border-white bg-transparent px-8 py-4 rounded-md font-body text-sm tracking-widest text-black dark:text-white transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!(isLoading || isAdding) ? { scale: 1.02 } : {}}
                            whileTap={!(isLoading || isAdding) ? { scale: 0.98 } : {}}
                        >
                            {isAdding ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current"></div>
                                    ADDING...
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    ORDER OBJECT
                                </>
                            )}
                        </motion.button>

                        {/* Buy It Now Button - Primary Style */}
                        <motion.button
                            onClick={handleBuyNow}
                            disabled={isLoading || isAdding || !product || !product.variants || product.variants.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white px-8 py-4 rounded-full font-body text-sm tracking-widest text-white dark:text-black transition-all duration-300 ease-out hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!(isLoading || isAdding) ? { scale: 1.05 } : {}}
                            whileTap={!(isLoading || isAdding) ? { scale: 0.98 } : {}}
                        >
                            {isAdding ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current"></div>
                                    PROCESSING...
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    BUY IT NOW
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Trust Row - Service Assurance */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-6 border-y border-zinc-200 dark:border-zinc-700">
                        {/* Free Delivery */}
                        <div className="flex flex-col items-center text-center">
                            <Truck className="w-5 h-5 mb-2 text-black dark:text-white" />
                            <p className="font-mono text-xs tracking-wider uppercase text-gray-600 dark:text-gray-400">
                                FREE DELIVERY
                            </p>
                        </div>

                        {/* 1 Year Warranty */}
                        <div className="flex flex-col items-center text-center">
                            <Shield className="w-5 h-5 mb-2 text-black dark:text-white" />
                            <p className="font-mono text-xs tracking-wider uppercase text-gray-600 dark:text-gray-400">
                                1 YEAR WARRANTY
                            </p>
                        </div>

                        {/* Ready to Ship */}
                        <div className="flex flex-col items-center text-center">
                            <Zap className="w-5 h-5 mb-2 text-black dark:text-white" />
                            <p className="font-mono text-xs tracking-wider uppercase text-gray-600 dark:text-gray-400">
                                READY TO SHIP
                            </p>
                        </div>
                    </div>

                    {/* Details Accordions */}
                    <div className="border-t border-zinc-200 dark:border-[#333] pt-6">
                        {/* Description Accordion */}
                        <AccordionItem title="Description">
                            {product.descriptionHtml ? (
                                <div
                                    className="prose dark:prose-invert max-w-none font-body text-sm"
                                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                />
                            ) : (
                                <p className="font-body text-sm">No description available.</p>
                            )}
                        </AccordionItem>

                        {/* Assembly & Specs Accordion - Conditional Content */}
                        {(product.description?.toLowerCase().includes('flat-pack') ||
                            product.description?.toLowerCase().includes('lamp') ||
                            product.description?.toLowerCase().includes('light')) && (
                                <AccordionItem title="Assembly & Specs">
                                    <div className="space-y-4">
                                        {/* Flat-Pack Assembly Instructions */}
                                        {product.description?.toLowerCase().includes('flat-pack') && (
                                            <div className="space-y-3">
                                                {/* GIF Placeholder */}
                                                <div className="relative aspect-video bg-zinc-100 dark:bg-[#1a1a1a] border-2 border-zinc-200 dark:border-[#333] rounded flex items-center justify-center group cursor-pointer hover:border-black dark:hover:border-white transition-colors">
                                                    <div className="text-center">
                                                        <Play className="w-12 h-12 text-black dark:text-white mx-auto mb-2" />
                                                        <p className="font-body text-xs text-zinc-600 dark:text-gray-400">Assembly Demo</p>
                                                    </div>
                                                </div>

                                                {/* Assembly Info */}
                                                <div className="flex items-start gap-3">
                                                    <Wrench className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-body text-sm text-zinc-900 dark:text-white font-medium mb-1">
                                                            Tool-Free Assembly
                                                        </p>
                                                        <p className="font-body text-sm text-zinc-600 dark:text-gray-400">
                                                            Snaps together in seconds. No tools required.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lamp/Light Specifications */}
                                        {(product.description?.toLowerCase().includes('lamp') ||
                                            product.description?.toLowerCase().includes('light')) && (
                                                <div className="space-y-3">
                                                    {/* Light Source */}
                                                    <div className="flex items-start gap-3">
                                                        <Zap className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-body text-sm text-zinc-900 dark:text-white font-medium mb-1">
                                                                Light Source
                                                            </p>
                                                            <p className="font-body text-sm text-zinc-600 dark:text-gray-400">
                                                                Warm White LED (3000K)
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Power */}
                                                    <div className="flex items-start gap-3">
                                                        <Zap className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-body text-sm text-zinc-900 dark:text-white font-medium mb-1">
                                                                Power
                                                            </p>
                                                            <p className="font-body text-sm text-zinc-600 dark:text-gray-400">
                                                                USB-C Rechargeable
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </AccordionItem>
                            )}

                        {/* Manufacturer Details Accordion */}
                        <AccordionItem title="Manufacturer Details">
                            <p className="font-body text-sm">
                                Handcrafted at Deep Root Studios, Pune, MH. Material: Ethically sourced Walnut/Teak. Finish: Food-safe natural oil.
                            </p>
                        </AccordionItem>

                        {/* Shipping & Returns Accordion */}
                        <AccordionItem title="Shipping & Returns">
                            <p className="font-body text-sm">
                                Ships within 48 hours. 7-day replacement policy for damaged items.
                            </p>
                        </AccordionItem>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* TECHNICAL COMPOSITION GRID - THEME AWARE */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-charcoal">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-stone mb-6">
                            Technical Composition
                        </h3>
                        <div className="grid grid-cols-2 gap-0">
                            {/* Material */}
                            <div className="border-l border-zinc-300 dark:border-charcoal pl-4 py-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-stone mb-1">
                                    Material
                                </p>
                                <p className="font-body text-sm text-zinc-900 dark:text-ash">
                                    Premium MDF + Acrylic
                                </p>
                            </div>

                            {/* Finish */}
                            <div className="border-l border-zinc-300 dark:border-charcoal pl-4 py-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-stone mb-1">
                                    Finish
                                </p>
                                <p className="font-body text-sm text-zinc-900 dark:text-ash">
                                    Matte Black / Natural
                                </p>
                            </div>

                            {/* Light Source */}
                            <div className="border-l border-zinc-300 dark:border-charcoal pl-4 py-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-stone mb-1">
                                    Light Source
                                </p>
                                <p className="font-body text-sm text-zinc-900 dark:text-ash">
                                    LED Strip 3000K Warm
                                </p>
                            </div>

                            {/* Power */}
                            <div className="border-l border-zinc-300 dark:border-charcoal pl-4 py-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-stone mb-1">
                                    Power
                                </p>
                                <p className="font-body text-sm text-zinc-900 dark:text-ash">
                                    12V DC Adapter (Incl.)
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recommended Products Section - Full Width */}
            {product && <RecommendedSection currentProductId={product.id} />}

            {/* Divider */}
            <div className="border-t border-[#333]"></div>

            {/* Reviews Section - Full Width */}
            <ReviewsSection />

            {/* Sticky Bottom Bar - Mobile Only */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: showStickyBar ? '0%' : '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] border-t border-zinc-200 dark:border-[#333] shadow-lg md:hidden"
            >
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    {/* Left: Product Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-body text-sm font-medium text-zinc-900 dark:text-mist truncate">
                            {product?.title}
                        </h3>
                        {product?.variants && product.variants.length > 0 && (
                            <p className="font-body text-lg font-semibold text-zinc-900 dark:text-mist">
                                ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Right: Compact Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isLoading || isAdding}
                        className="bg-black dark:bg-white hover:opacity-90 px-6 py-3 rounded-full font-body text-sm tracking-widest text-white dark:text-black transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isAdding ? 'ADDING...' : 'ORDER OBJECT'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetailsPage;
