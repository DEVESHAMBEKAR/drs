import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';
import AccordionItem from '../components/AccordionItem';
import RecommendedSection from '../components/RecommendedSection';
import ReviewsSection from '../components/ReviewsSection';
import { Truck, Wrench, Zap, Play, PenLine } from 'lucide-react';

const ProductDetailsPage = () => {
    // Extract full product ID from URL path (handles Shopify GIDs with slashes)
    const location = useLocation();
    // Decode the URL-encoded product ID to restore the original GID format
    const id = decodeURIComponent(location.pathname.replace('/product/', ''));
    const { client, addItemToCart } = useShopify();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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

    // Handle add to cart with custom attributes
    const handleAddToCart = async () => {
        if (!product || !product.variants || product.variants.length === 0) {
            console.error('Product or variant not available');
            alert('Product variant not available');
            return;
        }

        setIsAdding(true);
        const variantId = product.variants[0].id;

        // Debug logging
        console.log('Adding variant:', variantId);
        console.log('Product:', product.title);
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
        if (!product || !product.variants || product.variants.length === 0) {
            console.error('Product or variant not available');
            alert('Product variant not available');
            return;
        }

        setIsAdding(true);
        const variantId = product.variants[0].id;

        // Debug logging
        console.log('Buy Now - Adding variant:', variantId);

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

    // Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] dark:bg-deep-charcoal pt-28">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 dark:border-smoke/20 border-t-antique-brass mx-auto"></div>
                    <p className="font-body text-lg text-zinc-600 dark:text-smoke">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] dark:bg-deep-charcoal pt-28">
                <div className="text-center">
                    <p className="mb-4 font-body text-lg text-zinc-600 dark:text-smoke">{error || 'Product not found'}</p>
                    <Link
                        to="/shop"
                        className="inline-block border border-antique-brass px-6 py-2 font-body text-sm tracking-widest text-antique-brass transition-all hover:bg-antique-brass hover:text-deep-charcoal"
                    >
                        BACK TO SHOP
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f4f5] dark:bg-deep-charcoal pt-28">
            {/* Back to Shop Link */}
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 font-body text-sm tracking-widest text-zinc-900 dark:text-mist transition-colors hover:text-antique-brass dark:hover:text-antique-brass"
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
                        <h1 className="font-heading text-4xl text-antique-brass md:text-5xl">
                            {product.title}
                        </h1>

                        {product.variants && product.variants.length > 0 && (
                            <>
                                <p className="mt-4 font-body text-3xl text-zinc-900 dark:text-mist">
                                    ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                                </p>

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

                    {/* Personalization Station */}
                    <div className="border border-[#c0a060] bg-[#1a1a1a] p-5 rounded-lg">
                        {/* Header */}
                        <div className="mb-4">
                            <h3 className="font-heading text-xl text-[#c0a060] mb-1">
                                Make it Theirs
                            </h3>
                            <p className="font-body text-sm text-smoke">
                                Laser engrave a name or message permanently into the wood.
                            </p>
                        </div>

                        {/* Checkbox Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group mb-4">
                            <input
                                type="checkbox"
                                checked={isEngravingEnabled}
                                onChange={(e) => setIsEngravingEnabled(e.target.checked)}
                                className="w-5 h-5 accent-[#c0a060] cursor-pointer"
                            />
                            <div>
                                <span className="font-body text-sm text-mist group-hover:text-[#c0a060] transition-colors">
                                    Add Custom Engraving
                                </span>
                                <span className="font-body text-sm text-[#c0a060] font-semibold ml-2">
                                    (+₹200)
                                </span>
                            </div>
                        </label>

                        {/* Conditional Controls */}
                        {isEngravingEnabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {/* Input Field */}
                                <div>
                                    <label
                                        htmlFor="engraving-text"
                                        className="block font-body text-xs tracking-widest text-smoke mb-2"
                                    >
                                        ENTER NAME/MESSAGE
                                    </label>
                                    <input
                                        id="engraving-text"
                                        type="text"
                                        value={engravingText}
                                        onChange={(e) => setEngravingText(e.target.value)}
                                        placeholder="e.g., 'To Dad, With Love'"
                                        maxLength={30}
                                        className="w-full border border-[#c0a060]/50 bg-[#0a0a0a] px-4 py-3 font-body text-sm text-mist placeholder-smoke/50 transition-all focus:border-[#c0a060] focus:outline-none rounded"
                                    />
                                    <p className="mt-1 font-body text-xs text-smoke text-right">
                                        {engravingText.length}/30 characters
                                    </p>
                                </div>

                                {/* Font Selector */}
                                <div>
                                    <label
                                        htmlFor="font-style"
                                        className="block font-body text-xs tracking-widest text-smoke mb-2"
                                    >
                                        SELECT FONT STYLE
                                    </label>
                                    <select
                                        id="font-style"
                                        value={fontStyle}
                                        onChange={(e) => setFontStyle(e.target.value)}
                                        className="w-full border border-[#c0a060]/50 bg-[#0a0a0a] px-4 py-3 font-body text-sm text-mist transition-all focus:border-[#c0a060] focus:outline-none rounded appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23c0a060'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 12px center',
                                            backgroundSize: '20px'
                                        }}
                                    >
                                        <option value="classic">Classic (Serif)</option>
                                        <option value="modern">Modern (Sans)</option>
                                    </select>
                                </div>

                                {/* Visual Preview */}
                                <div className="border border-[#333] bg-[#0a0a0a] p-4 rounded">
                                    <p className="font-body text-xs tracking-widest text-smoke mb-3">
                                        PREVIEW — Your text will appear like this on the product
                                    </p>
                                    <div className="flex min-h-[70px] items-center justify-center bg-gradient-to-br from-[#2a2218] to-[#1a1510] rounded p-4 border border-[#3a2a1a]">
                                        {engravingText ? (
                                            <p
                                                className={`text-2xl tracking-wide text-[#c0a060] ${fontStyle === 'classic'
                                                    ? 'font-heading italic'
                                                    : 'font-body font-light'
                                                    }`}
                                            >
                                                {engravingText}
                                            </p>
                                        ) : (
                                            <p className="font-body text-sm text-smoke/50 italic">
                                                Your engraving preview will appear here...
                                            </p>
                                        )}
                                    </div>
                                    {/* Wood texture hint */}
                                    <p className="mt-2 font-body text-xs text-smoke/60 text-center">
                                        🪵 Engraved on premium wood surface
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div>
                        <label className="mb-2 block font-body text-sm tracking-widest text-zinc-700 dark:text-mist">
                            QUANTITY
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex h-10 w-10 items-center justify-center border border-zinc-300 dark:border-smoke/30 bg-white dark:bg-soft-black text-zinc-900 dark:text-mist transition-all hover:border-antique-brass hover:text-antique-brass"
                            >
                                −
                            </button>
                            <span className="font-body text-lg text-zinc-900 dark:text-mist">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center border border-zinc-300 dark:border-smoke/30 bg-white dark:bg-soft-black text-zinc-900 dark:text-mist transition-all hover:border-antique-brass hover:text-antique-brass"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Pincode Checker */}
                    <div>
                        <label className="mb-2 block font-body text-sm tracking-widest text-zinc-700 dark:text-mist">
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
                                className="flex-1 border border-zinc-300 dark:border-smoke/30 bg-white dark:bg-soft-black px-4 py-2 font-body text-zinc-900 dark:text-mist placeholder-zinc-400 dark:placeholder-smoke/50 transition-all focus:border-antique-brass focus:outline-none"
                            />
                            <button
                                onClick={handleCheckPincode}
                                disabled={isCheckingPincode}
                                className="border border-zinc-300 dark:border-smoke/30 bg-white dark:bg-soft-black px-6 py-2 font-body text-sm tracking-widest text-zinc-900 dark:text-mist transition-all hover:border-antique-brass hover:text-antique-brass disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Gifting Upgrade Section */}
                    <div className="border border-[#c0a060] bg-[#1a1a1a] p-4 rounded-lg">
                        <h3 className="font-heading text-lg text-[#c0a060] mb-4 flex items-center gap-2">
                            🎁 Is this a gift?
                        </h3>

                        <div className="flex items-start gap-4">
                            {/* Gift Box Thumbnail */}
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-[#333]">
                                <img
                                    src="/gift_box_preview.webp"
                                    alt="Premium wooden crate gift packaging"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] items-center justify-center hidden">
                                    <span className="text-3xl">🎁</span>
                                </div>
                            </div>

                            {/* Checkbox and Label */}
                            <div className="flex-1">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isGiftWrap}
                                        onChange={(e) => setIsGiftWrap(e.target.checked)}
                                        className="mt-1 w-5 h-5 accent-[#c0a060] cursor-pointer"
                                    />
                                    <div>
                                        <span className="font-body text-sm text-mist group-hover:text-[#c0a060] transition-colors">
                                            Add Premium Wooden Crate Packaging + Handwritten Note
                                        </span>
                                        <span className="font-body text-sm text-[#c0a060] font-semibold ml-2">
                                            (+₹150)
                                        </span>
                                        <p className="font-body text-xs text-smoke mt-1">
                                            Arrives gift-ready with elegant presentation
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Gift Message Textarea */}
                        {isGiftWrap && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4"
                            >
                                <label className="block font-body text-xs tracking-widest text-smoke mb-2">
                                    YOUR GIFT MESSAGE
                                </label>
                                <textarea
                                    value={giftMessage}
                                    onChange={(e) => setGiftMessage(e.target.value)}
                                    placeholder="Write your heartfelt message here... We'll handwrite it on a premium card."
                                    maxLength={200}
                                    rows={3}
                                    className="w-full border border-[#c0a060]/50 bg-[#0a0a0a] px-4 py-3 font-body text-sm text-mist placeholder-smoke/50 transition-all focus:border-[#c0a060] focus:outline-none rounded resize-none"
                                />
                                <p className="mt-1 font-body text-xs text-smoke text-right">
                                    {giftMessage.length}/200 characters
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Gift Note Section */}
                    <div className="border border-[#333] bg-[#1a1a1a] p-4 rounded-lg">
                        {/* Toggle Header */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isGiftNoteEnabled}
                                onChange={(e) => setIsGiftNoteEnabled(e.target.checked)}
                                className="w-5 h-5 accent-[#c0a060] cursor-pointer"
                            />
                            <PenLine className="w-5 h-5 text-[#c0a060]" />
                            <div>
                                <span className="font-body text-sm text-mist group-hover:text-[#c0a060] transition-colors">
                                    Add a Handwritten Gift Note
                                </span>
                                <span className="font-body text-sm text-green-500 font-semibold ml-2">
                                    (Free)
                                </span>
                            </div>
                        </label>

                        {/* Conditional Textarea */}
                        {isGiftNoteEnabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4"
                            >
                                <label className="block font-body text-xs tracking-widest text-smoke mb-2">
                                    YOUR MESSAGE
                                </label>
                                <textarea
                                    value={giftNoteText}
                                    onChange={(e) => setGiftNoteText(e.target.value)}
                                    placeholder="Write a thoughtful message for your recipient..."
                                    maxLength={100}
                                    rows={3}
                                    className="w-full border border-[#333] bg-[#0a0a0a] px-4 py-3 font-body text-sm text-mist placeholder-smoke/50 transition-all focus:border-[#c0a060] focus:outline-none rounded resize-none"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="font-body text-xs text-smoke/70 italic">
                                        📜 Printed on our signature thick textured paper and placed inside the box.
                                    </p>
                                    <p className="font-body text-xs text-smoke">
                                        {giftNoteText.length}/100
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Action Buttons Row */}
                    <div ref={buySectionRef} className="flex flex-col gap-4 sm:flex-row">
                        {/* Add to Cart Button - White Outline */}
                        <motion.button
                            onClick={handleAddToCart}
                            disabled={isLoading || isAdding || !product || !product.variants || product.variants.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-[#c0a060] bg-transparent px-8 py-4 font-body text-sm tracking-widest text-[#c0a060] transition-all duration-300 hover:bg-[#c0a060] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!(isLoading || isAdding) ? { scale: 1.02 } : {}}
                            whileTap={!(isLoading || isAdding) ? { scale: 0.98 } : {}}
                        >
                            {isAdding ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#c0a060]/20 border-t-[#c0a060]"></div>
                                    ADDING...
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    ADD TO CART
                                </>
                            )}
                        </motion.button>

                        {/* Buy It Now Button - Solid Gold */}
                        <motion.button
                            onClick={handleBuyNow}
                            disabled={isLoading || isAdding || !product || !product.variants || product.variants.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#c0a060] px-8 py-4 font-body text-sm tracking-widest text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!(isLoading || isAdding) ? { scale: 1.02 } : {}}
                            whileTap={!(isLoading || isAdding) ? { scale: 0.98 } : {}}
                        >
                            {isAdding ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
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
                                                <div className="relative aspect-video bg-[#1a1a1a] border border-[#333] rounded flex items-center justify-center group cursor-pointer hover:border-[#c0a060] transition-colors">
                                                    <div className="text-center">
                                                        <Play className="w-12 h-12 text-[#c0a060] mx-auto mb-2" />
                                                        <p className="font-body text-xs text-[#a3a3a3]">Assembly Demo</p>
                                                    </div>
                                                </div>

                                                {/* Assembly Info */}
                                                <div className="flex items-start gap-3">
                                                    <Wrench className="w-5 h-5 text-[#c0a060] flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-body text-sm text-[#e5e5e5] font-medium mb-1">
                                                            Tool-Free Assembly
                                                        </p>
                                                        <p className="font-body text-sm text-[#a3a3a3]">
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
                                                        <Zap className="w-5 h-5 text-[#c0a060] flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-body text-sm text-[#e5e5e5] font-medium mb-1">
                                                                Light Source
                                                            </p>
                                                            <p className="font-body text-sm text-[#a3a3a3]">
                                                                Warm White LED (3000K)
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Power */}
                                                    <div className="flex items-start gap-3">
                                                        <Zap className="w-5 h-5 text-[#c0a060] flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-body text-sm text-[#e5e5e5] font-medium mb-1">
                                                                Power
                                                            </p>
                                                            <p className="font-body text-sm text-[#a3a3a3]">
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
                        className="bg-[#c0a060] hover:bg-[#b09050] px-6 py-3 font-body text-sm tracking-widest text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isAdding ? 'ADDING...' : 'ADD TO CART'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetailsPage;
