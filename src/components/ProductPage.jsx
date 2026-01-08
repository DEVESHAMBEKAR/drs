import { useState } from 'react';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';

const ProductPage = () => {
    // Shopify context
    const { addItemToCart, isLoading } = useShopify();

    // State management for customization
    const [selectedWood, setSelectedWood] = useState('walnut');
    const [customText, setCustomText] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Product images for gallery
    const productImages = [
        'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=2940&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2940&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=2940&auto=format&fit=crop',
    ];

    const [activeImage, setActiveImage] = useState(0);

    // Wood options
    const woodOptions = [
        { id: 'walnut', name: 'Walnut', color: '#5d4037' },
        { id: 'oak', name: 'Oak', color: '#d4a574' },
    ];

    // Handle text input with max 15 characters
    const handleTextChange = (e) => {
        const value = e.target.value;
        if (value.length <= 15) {
            setCustomText(value);
        }
    };

    // Add to cart with Shopify custom attributes
    const handleAddToCart = async () => {
        // TODO: Replace with your actual Shopify product variant ID
        const variantId = 'gid://shopify/ProductVariant/YOUR_VARIANT_ID';

        // Prepare custom attributes for Shopify
        // These will appear in your Shopify Admin Orders page
        const customAttributes = [
            {
                key: 'Engraving',
                value: customText || 'None',
            },
            {
                key: 'Wood Type',
                value: woodOptions.find(w => w.id === selectedWood)?.name || 'Walnut',
            },
        ];

        try {
            await addItemToCart(variantId, quantity, customAttributes);

            // Show success message
            alert(`Added to cart!\n\nWood: ${customAttributes[1].value}\nEngraving: ${customAttributes[0].value}\nQuantity: ${quantity}`);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f5] dark:bg-deep-charcoal">
            {/* Product Container - Split Screen Layout */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-20 lg:grid-cols-2 lg:gap-16">

                {/* LEFT SIDE - Image Gallery */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Main Image */}
                    <div className="relative aspect-square overflow-hidden bg-white dark:bg-soft-black">
                        <motion.img
                            key={activeImage}
                            src={productImages[activeImage]}
                            alt="Personalized Desk Organizer"
                            className="h-full w-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="flex gap-4">
                        {productImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`aspect-square w-24 overflow-hidden border-2 transition-all ${activeImage === index
                                    ? 'border-antique-brass'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`View ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT SIDE - Product Details & Customization */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Product Header */}
                    <div>
                        <h1 className="font-heading text-4xl text-zinc-900 dark:text-mist md:text-5xl">
                            Personalized Desk Organizer
                        </h1>
                        <p className="mt-4 font-body text-2xl text-antique-brass">$129.00</p>
                        <p className="mt-4 font-body text-lg leading-relaxed text-zinc-600 dark:text-smoke">
                            A handcrafted desk organizer made from premium hardwood. Keep your workspace tidy
                            while adding a personal touch with custom engraving.
                        </p>
                    </div>

                    {/* Wood Selection */}
                    <div>
                        <label className="mb-4 block font-body text-sm tracking-widest text-zinc-900 dark:text-mist">
                            SELECT WOOD TYPE
                        </label>
                        <div className="flex gap-4">
                            {woodOptions.map((wood) => (
                                <button
                                    key={wood.id}
                                    onClick={() => setSelectedWood(wood.id)}
                                    className="group flex flex-col items-center gap-2"
                                >
                                    {/* Wood Circle */}
                                    <div
                                        className={`relative h-16 w-16 rounded-full border-2 transition-all ${selectedWood === wood.id
                                            ? 'border-antique-brass scale-110'
                                            : 'border-smoke/30 hover:border-smoke'
                                            }`}
                                        style={{ backgroundColor: wood.color }}
                                    >
                                        {/* Checkmark for selected */}
                                        {selectedWood === wood.id && (
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <svg
                                                    className="h-8 w-8 text-antique-brass"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </div>
                                    <span
                                        className={`font-body text-sm ${selectedWood === wood.id ? 'text-antique-brass' : 'text-zinc-600 dark:text-smoke'
                                            }`}
                                    >
                                        {wood.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Engraving Input */}
                    <div>
                        <label
                            htmlFor="engraving"
                            className="mb-2 block font-body text-sm tracking-widest text-zinc-900 dark:text-mist"
                        >
                            ADD YOUR NAME (MAX 15 CHARS)
                        </label>
                        <input
                            id="engraving"
                            type="text"
                            value={customText}
                            onChange={handleTextChange}
                            placeholder="Enter your text..."
                            className="w-full border border-smoke/30 bg-white dark:bg-soft-black px-4 py-3 font-body text-zinc-900 dark:text-mist placeholder-smoke/50 transition-all focus:border-antique-brass focus:outline-none"
                            maxLength={15}
                        />
                        <p className="mt-1 font-body text-xs text-zinc-600 dark:text-smoke">
                            {customText.length}/15 characters
                        </p>
                    </div>

                    {/* Preview Box */}
                    <div className="border border-smoke/30 bg-white dark:bg-soft-black p-6">
                        <p className="mb-3 font-body text-xs tracking-widest text-smoke">
                            ENGRAVING PREVIEW
                        </p>
                        <div className="flex min-h-[80px] items-center justify-center bg-gray-200 dark:bg-deep-charcoal/50 p-4">
                            {customText ? (
                                <motion.p
                                    className="font-heading text-3xl tracking-wide text-antique-brass"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {customText}
                                </motion.p>
                            ) : (
                                <p className="font-body text-sm italic text-smoke/50">
                                    Your custom text will appear here
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div>
                        <label className="mb-2 block font-body text-sm tracking-widest text-zinc-900 dark:text-mist">
                            QUANTITY
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex h-10 w-10 items-center justify-center border border-smoke/30 bg-white dark:bg-soft-black text-zinc-900 dark:text-mist transition-all hover:border-antique-brass hover:text-antique-brass"
                            >
                                −
                            </button>
                            <span className="font-body text-lg text-mist">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center border border-smoke/30 bg-white dark:bg-soft-black text-zinc-900 dark:text-mist transition-all hover:border-antique-brass hover:text-antique-brass"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="w-full bg-antique-brass px-8 py-4 font-body text-sm tracking-widest text-deep-charcoal transition-all duration-300 hover:bg-antique-brass/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                        {isLoading ? 'ADDING TO CART...' : 'ADD TO CART'}
                    </motion.button>

                    {/* Product Features */}
                    <div className="border-t border-smoke/20 pt-8">
                        <h3 className="mb-4 font-body text-sm tracking-widest text-zinc-900 dark:text-mist">
                            PRODUCT FEATURES
                        </h3>
                        <ul className="space-y-2 font-body text-sm text-zinc-600 dark:text-smoke">
                            <li>✓ Premium hardwood construction</li>
                            <li>✓ Hand-finished with natural oil</li>
                            <li>✓ Laser-engraved personalization</li>
                            <li>✓ Multiple compartments for organization</li>
                            <li>✓ Dimensions: 10" × 6" × 3"</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductPage;
