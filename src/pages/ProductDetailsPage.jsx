import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { client, addItemToCart, isLoading: cartLoading } = useShopify();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customText, setCustomText] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

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

    // Handle add to cart with custom attributes
    const handleAddToCart = async () => {
        if (!product || !product.variants || product.variants.length === 0) {
            alert('Product variant not available');
            return;
        }

        const variantId = product.variants[0].id;

        // Prepare custom attributes for Shopify
        const customAttributes = [
            {
                key: 'Custom Engraving',
                value: customText || 'None',
            },
        ];

        try {
            await addItemToCart(variantId, quantity, customAttributes);
            alert(`Added to cart!\n\nProduct: ${product.title}\nEngraving: ${customText || 'None'}\nQuantity: ${quantity}`);
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add to cart. Please try again.');
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-deep-charcoal pt-28">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-smoke/20 border-t-antique-brass mx-auto"></div>
                    <p className="font-body text-lg text-smoke">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-deep-charcoal pt-28">
                <div className="text-center">
                    <p className="mb-4 font-body text-lg text-smoke">{error || 'Product not found'}</p>
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
        <div className="min-h-screen bg-deep-charcoal pt-20">
            {/* Back to Shop Link */}
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 font-body text-sm tracking-widest text-smoke transition-colors hover:text-antique-brass"
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
                    <div className="relative aspect-square overflow-hidden bg-soft-black">
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
                                <span className="font-body text-smoke">No image available</span>
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
                                        alt={`View ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
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
                        <h1 className="font-heading text-4xl text-mist md:text-5xl">
                            {product.title}
                        </h1>

                        {product.variants && product.variants.length > 0 && (
                            <p className="mt-4 font-body text-3xl text-antique-brass">
                                ₹{parseFloat(product.variants[0].price.amount).toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Product Description */}
                    {product.descriptionHtml && (
                        <div
                            className="prose prose-invert max-w-none font-body text-smoke"
                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                        />
                    )}

                    {/* Custom Engraving Input */}
                    <div>
                        <label
                            htmlFor="engraving"
                            className="mb-2 block font-body text-sm tracking-widest text-mist"
                        >
                            CUSTOM ENGRAVING (OPTIONAL)
                        </label>
                        <input
                            id="engraving"
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            placeholder="Enter your custom text..."
                            maxLength={15}
                            className="w-full border border-smoke/30 bg-soft-black px-4 py-3 font-body text-mist placeholder-smoke/50 transition-all focus:border-antique-brass focus:outline-none"
                        />
                        <p className="mt-1 font-body text-xs text-smoke">
                            {customText.length}/15 characters
                        </p>
                    </div>

                    {/* Engraving Preview */}
                    {customText && (
                        <motion.div
                            className="border border-smoke/30 bg-soft-black p-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="mb-3 font-body text-xs tracking-widest text-smoke">
                                ENGRAVING PREVIEW
                            </p>
                            <div className="flex min-h-[60px] items-center justify-center bg-deep-charcoal/50 p-4">
                                <p className="font-heading text-2xl tracking-wide text-antique-brass">
                                    {customText}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Quantity Selector */}
                    <div>
                        <label className="mb-2 block font-body text-sm tracking-widest text-mist">
                            QUANTITY
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex h-10 w-10 items-center justify-center border border-smoke/30 bg-soft-black text-mist transition-all hover:border-antique-brass hover:text-antique-brass"
                            >
                                −
                            </button>
                            <span className="font-body text-lg text-mist">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center border border-smoke/30 bg-soft-black text-mist transition-all hover:border-antique-brass hover:text-antique-brass"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        onClick={handleAddToCart}
                        disabled={cartLoading}
                        className="w-full bg-antique-brass px-8 py-4 font-body text-sm tracking-widest text-deep-charcoal transition-all duration-300 hover:bg-antique-brass/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!cartLoading ? { scale: 1.02 } : {}}
                        whileTap={!cartLoading ? { scale: 0.98 } : {}}
                    >
                        {cartLoading ? 'ADDING TO CART...' : 'ADD TO CART'}
                    </motion.button>

                    {/* Product Features */}
                    <div className="border-t border-smoke/20 pt-8">
                        <h3 className="mb-4 font-body text-sm tracking-widest text-mist">
                            PRODUCT FEATURES
                        </h3>
                        <ul className="space-y-2 font-body text-sm text-smoke">
                            <li>✓ Premium handcrafted quality</li>
                            <li>✓ Personalized engraving available</li>
                            <li>✓ Natural wood finish</li>
                            <li>✓ Made to order</li>
                            <li>✓ Eco-friendly materials</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
