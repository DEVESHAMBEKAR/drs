import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopify } from '../context/ShopifyContext';
import { uploadFileToCloud } from '../api/cloudUpload';

// Custom Commission Product Variant ID (Set this in your Shopify admin)
// The shopify-buy SDK needs the variant ID in base64-encoded GID format
const RAW_VARIANT_ID = import.meta.env.VITE_CUSTOM_PRODUCT_VARIANT_ID || '';
// Convert to base64 if it's a plain GID
const CUSTOM_PRODUCT_VARIANT_ID = RAW_VARIANT_ID.startsWith('gid://')
    ? btoa(RAW_VARIANT_ID)  // Encode to base64
    : RAW_VARIANT_ID;       // Already encoded or raw number
const CUSTOM_PRODUCT_PRICE = 2999; // ₹2,999

const CustomStudioPage = () => {
    const { addItemToCart, setIsCartOpen } = useShopify();

    // Core States
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null); // Keep original file for upload
    const [processedImage, setProcessedImage] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState('');

    // Purchase States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [purchaseError, setPurchaseError] = useState(null);

    // Filter States
    const [contrast, setContrast] = useState(150);
    const [brightness, setBrightness] = useState(100);
    const [isInverted, setIsInverted] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [glowColor, setGlowColor] = useState('white');
    const [bgRemoved, setBgRemoved] = useState(false);

    // Error State
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    // Glow color presets
    const glowColors = {
        white: { name: 'Warm White', value: 'rgba(255, 255, 255, 0.5)', hex: '#FFFFFF' },
        gold: { name: 'Gold', value: 'rgba(255, 200, 50, 0.5)', hex: '#FFC832' },
        red: { name: 'Red', value: 'rgba(255, 60, 60, 0.5)', hex: '#FF3C3C' },
        blue: { name: 'Cyan', value: 'rgba(0, 200, 255, 0.5)', hex: '#00C8FF' },
        green: { name: 'Green', value: 'rgba(0, 255, 120, 0.5)', hex: '#00FF78' },
    };

    // Handle Image Upload & Auto-Process
    const handleImageUpload = async (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (PNG, JPG)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Image size must be less than 10MB');
            return;
        }

        setError(null);
        setPurchaseError(null);
        setFileName(file.name);
        setUploadedFile(file); // Store original file for cloud upload
        setIsProcessing(true);
        setProcessingStep('Uploading image...');

        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageData = event.target.result;
            setUploadedImage(imageData);

            setProcessingStep('Processing image...');
            await removeBackgroundAuto(imageData);

            setIsProcessing(false);
            setProcessingStep('');
        };
        reader.readAsDataURL(file);
    };

    // Auto Process Image on Upload (Client-Side Only - No API Required)
    const removeBackgroundAuto = async (imageData) => {
        try {
            // Simply use the uploaded image and apply high contrast/brightness
            // This creates a silhouette effect without needing external API
            setProcessedImage(imageData);
            setContrast(200); // High contrast for silhouette effect
            setBrightness(110); // Slightly bright
            setBgRemoved(false); // Mark as not using API background removal
            console.log('✅ Image processed client-side (no API required)');
        } catch (err) {
            console.error('Image Processing Error:', err);
            setProcessedImage(imageData);
            setContrast(200);
            setBrightness(110);
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
    };

    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    // Get current display image
    const getCurrentImage = () => processedImage || uploadedImage;

    // Calculate silhouette filter styles
    const getSilhouetteStyle = () => ({
        filter: `grayscale(100%) contrast(${contrast}%) brightness(${brightness}%) ${isInverted ? 'invert(1)' : ''}`,
        transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
    });

    // Get glow effect style
    const getGlowStyle = () => ({
        filter: `drop-shadow(0 0 15px ${glowColors[glowColor].value}) drop-shadow(0 0 30px ${glowColors[glowColor].value})`,
    });

    // Reset
    const handleReset = () => {
        setUploadedImage(null);
        setUploadedFile(null);
        setProcessedImage(null);
        setFileName('');
        setContrast(150);
        setBrightness(100);
        setIsInverted(false);
        setIsFlipped(false);
        setGlowColor('white');
        setBgRemoved(false);
        setError(null);
        setPurchaseError(null);
    };

    /**
     * MAIN PURCHASE FLOW
     * 1. Upload processed image to cloud storage
     * 2. Add to cart with custom attributes
     * 3. Open cart drawer
     */
    const handleSecureSlot = async () => {
        if (!getCurrentImage()) {
            setPurchaseError('Please upload an image first');
            return;
        }

        setIsUploading(true);
        setPurchaseError(null);
        setUploadProgress(0);

        try {
            // Step 1: Upload to cloud storage
            console.log('📤 Step 1: Uploading to Cloudinary...');
            setUploadProgress(20);
            const imageToUpload = processedImage || uploadedImage;
            console.log('Image type:', typeof imageToUpload, imageToUpload?.substring?.(0, 50));

            const uploadResult = await uploadFileToCloud(imageToUpload);
            console.log('Upload result:', uploadResult);

            if (!uploadResult.success) {
                throw new Error(`Upload failed: ${uploadResult.error}`);
            }

            setUploadProgress(60);
            const designUrl = uploadResult.url;
            console.log('✅ Step 1 Complete - Design URL:', designUrl);

            // Step 2: Prepare custom attributes for the order
            console.log('🛒 Step 2: Adding to cart...');
            const customAttributes = [
                { key: 'Custom Design URL', value: designUrl },
                { key: 'Glow Color', value: glowColors[glowColor].name },
                { key: 'Contrast', value: `${contrast}%` },
                { key: 'Brightness', value: `${brightness}%` },
                { key: 'Inverted', value: isInverted ? 'Yes' : 'No' },
                { key: 'Flipped', value: isFlipped ? 'Yes' : 'No' },
                { key: 'Background Removed', value: bgRemoved ? 'Yes' : 'No' },
                { key: 'Original Filename', value: fileName },
            ];

            setUploadProgress(80);
            console.log('Variant ID:', CUSTOM_PRODUCT_VARIANT_ID);
            console.log('Custom Attributes:', customAttributes);

            // Step 3: Add to cart
            await addItemToCart(CUSTOM_PRODUCT_VARIANT_ID, 1, customAttributes);

            setUploadProgress(100);
            console.log('✅ Step 2 Complete - Item added to cart!');

            // Step 4: Open cart drawer
            setTimeout(() => {
                setIsUploading(false);
                setIsCartOpen(true);
            }, 500);

        } catch (err) {
            console.error('❌ Purchase error:', err);
            // Show the actual detailed error message
            const errorMessage = err.message || 'Unknown error occurred';
            setPurchaseError(errorMessage);
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-16 pb-20">
            <div className="mx-auto max-w-6xl px-6">
                {/* Page Header */}
                <motion.div
                    className="mb-10 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-heading text-4xl text-zinc-900 dark:text-white md:text-5xl mb-3">
                        Custom Blueprint Studio
                    </h1>
                    <p className="font-body text-base text-zinc-600 dark:text-gray-400 max-w-xl mx-auto">
                        Upload your design → Preview as halo-lit wall art → Secure your custom slot
                    </p>
                </motion.div>

                {/* Error Display */}
                {(error || purchaseError) && (
                    <div className="max-w-2xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 p-4 text-center">
                        <p className="text-red-400 font-body text-sm">{error || purchaseError}</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* Upload Dropzone */}
                    {!getCurrentImage() && !isProcessing ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`
                                    relative cursor-pointer bg-[#0a0a0a] p-16 text-center
                                    border-2 border-dashed transition-all duration-300
                                    ${isDragging
                                        ? 'border-neon-gold bg-neon-gold/5 scale-[1.02]'
                                        : 'border-[#333] hover:border-neon-gold'
                                    }
                                `}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="mb-6">
                                    <svg className={`w-20 h-20 mx-auto transition-colors duration-300 ${isDragging ? 'text-neon-gold' : 'text-[#555]'}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <h3 className="font-heading text-xl text-white mb-2">
                                    DROP YOUR IMAGE HERE
                                </h3>
                                <p className="font-body text-sm text-gray-500 mb-4">
                                    Logos, photos, sketches, vectors
                                </p>

                                <div className="inline-flex items-center gap-2 bg-neon-gold/10 border border-neon-gold/30 px-4 py-2 rounded">
                                    <span className="text-neon-gold text-lg">✨</span>
                                    <p className="font-body text-xs text-neon-gold">
                                        Silhouette auto-processed on upload
                                    </p>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="mt-6 text-center">
                                <p className="font-body text-xs text-gray-500">
                                    ⚠️ Please upload a reference image to proceed with your custom order
                                </p>
                            </div>

                            {/* Process Flow */}
                            <div className="mt-8 flex items-center justify-center gap-4">
                                {[
                                    { icon: '📤', label: 'Upload' },
                                    { icon: '⚡', label: 'Process' },
                                    { icon: '🎨', label: 'Customize' },
                                    { icon: '🛒', label: 'Add to Cart' },
                                ].map((step, i) => (
                                    <div key={step.label} className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-2">
                                                <span className="text-xl">{step.icon}</span>
                                            </div>
                                            <p className="font-body text-xs text-gray-500">{step.label}</p>
                                        </div>
                                        {i < 3 && <div className="text-gray-600">→</div>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : isProcessing ? (
                        /* Processing State */
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-md mx-auto text-center py-20"
                        >
                            <div className="w-16 h-16 border-4 border-[#333] border-t-neon-gold rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="font-heading text-xl text-white mb-2">Processing Your Image</h3>
                            <p className="font-body text-sm text-neon-gold">{processingStep}</p>
                        </motion.div>
                    ) : (
                        /* Editor */
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            {/* Left: Preview Canvas */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Wall Simulator */}
                                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] rounded-lg overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 opacity-20" style={{
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M50 50m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0\'/%3E%3C/g%3E%3C/svg%3E")',
                                    }} />

                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                        <div style={getGlowStyle()} className="max-w-full max-h-full">
                                            <img
                                                src={getCurrentImage()}
                                                alt="Preview"
                                                className="max-w-full max-h-[350px] object-contain transition-all duration-300"
                                                style={getSilhouetteStyle()}
                                            />
                                        </div>
                                    </div>

                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
                                            <p className="font-body text-xs text-white uppercase tracking-wider">Wall Preview</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
                                        <p className="font-body text-xs text-gray-300 truncate max-w-[200px]">{fileName}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleReset}
                                        disabled={isUploading}
                                        className="border border-[#333] text-gray-400 px-4 py-3 font-body text-xs tracking-widest hover:border-red-500 hover:text-red-500 transition-all duration-300 disabled:opacity-50"
                                    >
                                        UPLOAD NEW
                                    </button>

                                    {/* MAIN PURCHASE BUTTON */}
                                    <button
                                        onClick={handleSecureSlot}
                                        disabled={isUploading || !getCurrentImage()}
                                        className="flex-1 relative overflow-hidden bg-neon-gold text-black px-4 py-4 font-body text-sm tracking-widest hover:bg-neon-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? (
                                            <>
                                                {/* Progress Bar */}
                                                <div
                                                    className="absolute inset-0 bg-green-500/30 transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    UPLOADING BLUEPRINT TO SECURE SERVER...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                SECURE CUSTOM SLOT (₹{CUSTOM_PRODUCT_PRICE.toLocaleString('en-IN')})
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Price Info */}
                                <div className="bg-[#111] border border-[#222] p-4 rounded flex items-center justify-between">
                                    <div>
                                        <p className="font-body text-xs text-gray-500 uppercase tracking-wider">Custom Commission</p>
                                        <p className="font-heading text-lg text-white">₹{CUSTOM_PRODUCT_PRICE.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-body text-xs text-gray-500">Includes</p>
                                        <p className="font-body text-xs text-neon-gold">Design Review • Production • Shipping</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Adjustment Toolbar */}
                            <div className="space-y-4">
                                <div className="bg-[#0a0a0a] border border-[#222] p-5 space-y-5">
                                    <h3 className="font-heading text-base text-white border-b border-[#222] pb-3">
                                        Silhouette Engine
                                    </h3>

                                    {/* Contrast Slider */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-body text-xs text-gray-400">Contrast</label>
                                            <span className="font-body text-xs text-neon-gold">{contrast}%</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="300" value={contrast}
                                            onChange={(e) => setContrast(Number(e.target.value))}
                                            className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-neon-gold"
                                        />
                                    </div>

                                    {/* Brightness Slider */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-body text-xs text-gray-400">Brightness</label>
                                            <span className="font-body text-xs text-neon-gold">{brightness}%</span>
                                        </div>
                                        <input
                                            type="range" min="50" max="150" value={brightness}
                                            onChange={(e) => setBrightness(Number(e.target.value))}
                                            className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-neon-gold"
                                        />
                                    </div>

                                    {/* Transform Buttons */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setIsInverted(!isInverted)}
                                            className={`px-3 py-2.5 font-body text-xs tracking-wider transition-all duration-300 ${isInverted ? 'bg-neon-gold text-black' : 'border border-[#333] text-gray-400 hover:border-neon-gold'
                                                }`}
                                        >
                                            {isInverted ? '✓ INVERTED' : 'INVERT'}
                                        </button>
                                        <button
                                            onClick={() => setIsFlipped(!isFlipped)}
                                            className={`px-3 py-2.5 font-body text-xs tracking-wider transition-all duration-300 ${isFlipped ? 'bg-neon-gold text-black' : 'border border-[#333] text-gray-400 hover:border-neon-gold'
                                                }`}
                                        >
                                            {isFlipped ? '✓ FLIPPED' : 'FLIP'}
                                        </button>
                                    </div>

                                    {/* Glow Color Picker */}
                                    <div>
                                        <label className="block font-body text-xs text-gray-400 mb-3">Glow Color</label>
                                        <div className="flex gap-2 justify-between">
                                            {Object.entries(glowColors).map(([key, color]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setGlowColor(key)}
                                                    className={`w-9 h-9 rounded-full transition-all duration-200 ${glowColor === key
                                                        ? 'ring-2 ring-neon-gold ring-offset-2 ring-offset-[#0a0a0a] scale-110'
                                                        : 'hover:scale-105'
                                                        }`}
                                                    style={{
                                                        backgroundColor: color.hex,
                                                        boxShadow: glowColor === key ? `0 0 15px ${color.value}` : 'none'
                                                    }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* What's Included */}
                                <div className="bg-[#0a0a0a] border border-[#222] p-4 space-y-2">
                                    <h4 className="font-body text-xs text-gray-500 uppercase tracking-wider mb-3">
                                        What's Included
                                    </h4>
                                    {[
                                        'Design review by our team',
                                        'High-quality laser cutting',
                                        'Premium LED backlight',
                                        'Wall mount kit included',
                                        'Free shipping across India',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-neon-gold text-xs">✓</span>
                                            <span className="font-body text-xs text-gray-400">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pro Tip */}
                                <div className="bg-neon-gold/10 border border-neon-gold/30 p-3 rounded">
                                    <p className="font-body text-xs text-neon-gold">
                                        💡 Use INVERT for dark images on light backgrounds
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CustomStudioPage;
