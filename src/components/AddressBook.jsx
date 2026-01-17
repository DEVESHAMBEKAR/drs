import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Plus,
    Edit3,
    Trash2,
    Star,
    X,
    Check,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultAddress
} from '../api/shopify';

/**
 * AddressBook Component
 * Full CRUD operations with Shopify sync
 */
const AddressBook = ({ addresses = [], defaultAddressId, customerToken, onRefresh }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: 'India',
        phone: '',
        isDefault: false,
    });

    /**
     * Fetch city and state from pincode using Indian Postal API
     */
    const fetchLocationByPincode = async (pincode) => {
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            return;
        }

        setPincodeLoading(true);
        setPincodeError(null);

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    city: postOffice.District || postOffice.Block || '',
                    province: postOffice.State || '',
                }));
                console.log('✅ Pincode lookup successful:', postOffice.District, postOffice.State);
            } else {
                setPincodeError('Invalid pincode');
            }
        } catch (err) {
            console.error('Pincode lookup failed:', err);
            setPincodeError('Could not fetch location');
        } finally {
            setPincodeLoading(false);
        }
    };

    /**
     * Reset form and close modal
     */
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            company: '',
            address1: '',
            address2: '',
            city: '',
            province: '',
            zip: '',
            country: 'India',
            phone: '',
            isDefault: false,
        });
        setEditingAddress(null);
        setIsFormOpen(false);
        setError(null);
        setPincodeError(null);
    };

    /**
     * Open form for editing
     */
    const openEditForm = (address) => {
        setFormData({
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
            isDefault: address.isDefault || false,
        });
        setEditingAddress(address);
        setIsFormOpen(true);
        setPincodeError(null);
    };

    /**
     * Handle form input change
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Auto-fetch city/state when pincode is entered (India only)
        if (name === 'zip' && formData.country === 'India') {
            fetchLocationByPincode(value);
        }
    };

    /**
     * Handle form submission - Create or Update
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (editingAddress) {
                // UPDATE existing address
                await updateCustomerAddress(customerToken, editingAddress.id, formData);
                console.log('✅ Address updated successfully');
            } else {
                // CREATE new address
                const result = await createCustomerAddress(customerToken, formData);
                console.log('✅ Address created successfully');

                // If marked as default, set it
                if (formData.isDefault && result.address?.id) {
                    await setDefaultAddress(customerToken, result.address.id);
                    console.log('✅ Set as default address');
                }
            }

            // If marked as default (for edit), update default
            if (formData.isDefault && editingAddress?.id) {
                await setDefaultAddress(customerToken, editingAddress.id);
                console.log('✅ Set as default address');
            }

            // CRITICAL: Trigger refetch to sync with Shopify
            if (onRefresh) {
                await onRefresh();
            }

            resetForm();
        } catch (err) {
            console.error('Address save error:', err);
            setError(err.message || 'Failed to save address');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle address deletion
     */
    const handleDelete = async (addressId) => {
        setIsLoading(true);
        setError(null);

        try {
            await deleteCustomerAddress(customerToken, addressId);
            console.log('✅ Address deleted successfully');

            // Trigger refetch
            if (onRefresh) {
                await onRefresh();
            }

            setDeleteConfirmId(null);
        } catch (err) {
            console.error('Address delete error:', err);
            setError(err.message || 'Failed to delete address');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle set as default
     */
    const handleSetDefault = async (addressId) => {
        setIsLoading(true);
        setError(null);

        try {
            await setDefaultAddress(customerToken, addressId);
            console.log('✅ Default address updated');

            // Trigger refetch
            if (onRefresh) {
                await onRefresh();
            }
        } catch (err) {
            console.error('Set default error:', err);
            setError(err.message || 'Failed to set default address');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-neon-gold" />
                    <h2 className="font-mono text-sm uppercase tracking-widest text-neon-gold">
                        BASE COORDINATES ({addresses.length})
                    </h2>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Existing Addresses */}
                {addresses.map((address) => (
                    <motion.div
                        key={address.id}
                        className={`relative border p-5 bg-[#0a0a0a] ${address.isDefault
                            ? 'border-neon-gold/50'
                            : 'border-[#333] hover:border-[#555]'
                            } transition-colors`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Default Badge */}
                        {address.isDefault && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 text-neon-gold text-xs font-mono">
                                <Star size={12} fill="currentColor" />
                                PRIMARY
                            </div>
                        )}

                        {/* Address Content */}
                        <div className="pr-20">
                            <p className="font-display text-white text-sm mb-2">
                                {address.firstName} {address.lastName}
                            </p>
                            <div className="text-gray-400 text-xs space-y-1 font-mono">
                                {address.formatted?.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                            {address.phone && (
                                <p className="text-gray-500 text-xs mt-2 font-mono">
                                    📞 {address.phone}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-[#222]">
                            <button
                                onClick={() => openEditForm(address)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-[#333] hover:border-white transition-colors"
                            >
                                <Edit3 size={12} />
                                EDIT
                            </button>

                            {!address.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(address.id)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-neon-gold/70 hover:text-neon-gold border border-neon-gold/30 hover:border-neon-gold transition-colors"
                                >
                                    <Star size={12} />
                                    SET DEFAULT
                                </button>
                            )}

                            {deleteConfirmId === address.id ? (
                                <div className="flex gap-1 ml-auto">
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        disabled={isLoading}
                                        className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700"
                                    >
                                        {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'CONFIRM'}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="px-3 py-1.5 text-xs text-gray-400 border border-[#333]"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setDeleteConfirmId(address.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 ml-auto transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Add New Address Card */}
                <motion.button
                    onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                    }}
                    className="border-2 border-dashed border-[#333] hover:border-neon-gold/50 p-8 flex flex-col items-center justify-center gap-3 transition-colors group min-h-[200px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="w-12 h-12 rounded-full bg-[#111] border border-[#333] group-hover:border-neon-gold/50 flex items-center justify-center transition-colors">
                        <Plus className="h-6 w-6 text-gray-600 group-hover:text-neon-gold" />
                    </div>
                    <span className="font-mono text-xs text-gray-500 group-hover:text-neon-gold uppercase tracking-wider">
                        REGISTER NEW COORDINATES
                    </span>
                </motion.button>
            </div>

            {/* Address Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Form Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                        >
                            <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#333] p-6 md:p-8 my-8">
                                {/* Close Button */}
                                <button
                                    onClick={resetForm}
                                    className="absolute right-4 top-4 text-gray-500 hover:text-white"
                                >
                                    <X size={20} />
                                </button>

                                {/* Form Header */}
                                <h3 className="font-display text-xl text-white uppercase tracking-wider mb-6">
                                    {editingAddress ? 'EDIT COORDINATES' : 'NEW COORDINATES'}
                                </h3>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm focus:border-neon-gold focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm focus:border-neon-gold focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                                            Company (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm focus:border-neon-gold focus:outline-none"
                                        />
                                    </div>

                                    {/* Address Line 1 */}
                                    <div>
                                        <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                            Address Line 1
                                        </label>
                                        <input
                                            type="text"
                                            name="address1"
                                            value={formData.address1}
                                            onChange={handleChange}
                                            required
                                            placeholder="Street address, P.O. box"
                                            className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:border-neon-gold focus:outline-none"
                                        />
                                    </div>

                                    {/* Address Line 2 */}
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="address2"
                                            value={formData.address2}
                                            onChange={handleChange}
                                            placeholder="Apartment, suite, unit, building, floor"
                                            className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:border-neon-gold focus:outline-none"
                                        />
                                    </div>

                                    {/* PIN Code & Country Row - FIRST */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                                PIN / ZIP Code
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="zip"
                                                    value={formData.zip}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={6}
                                                    placeholder="6-digit PIN"
                                                    className={`w-full h-10 px-3 bg-[#111] border text-white text-sm focus:outline-none ${pincodeError
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-[#333] focus:border-neon-gold'
                                                        }`}
                                                />
                                                {pincodeLoading && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Loader2 className="h-4 w-4 animate-spin text-neon-gold" />
                                                    </div>
                                                )}
                                            </div>
                                            {pincodeError && (
                                                <p className="text-xs text-red-400 mt-1">{pincodeError}</p>
                                            )}
                                            {formData.country === 'India' && !pincodeError && !pincodeLoading && formData.zip?.length === 6 && formData.city && (
                                                <p className="text-xs text-green-500 mt-1">✓ City & State auto-filled</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                                Country
                                            </label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm focus:border-neon-gold focus:outline-none"
                                            >
                                                <option value="India">India</option>
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* City & State Row - Auto-filled from pincode */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                                City / District
                                                {pincodeLoading && <span className="ml-2 text-gray-500">(loading...)</span>}
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className={`w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm focus:border-neon-gold focus:outline-none ${pincodeLoading ? 'opacity-50' : ''
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                                State / Province
                                                {pincodeLoading && <span className="ml-2 text-gray-500">(loading...)</span>}
                                            </label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                required
                                                className={`w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm focus:border-neon-gold focus:outline-none ${pincodeLoading ? 'opacity-50' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone - MANDATORY */}
                                    <div>
                                        <label className="block text-xs text-neon-gold/80 uppercase tracking-wider mb-2">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full h-10 px-3 bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:border-neon-gold focus:outline-none"
                                        />
                                    </div>

                                    {/* Set as Default Checkbox */}
                                    <label className="flex items-center gap-3 p-3 bg-[#111] border border-[#333] cursor-pointer hover:border-neon-gold/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-neon-gold"
                                        />
                                        <div>
                                            <span className="text-sm text-white">Designate as Primary Base</span>
                                            <p className="text-xs text-gray-500">This address will be used for shipping by default</p>
                                        </div>
                                    </label>

                                    {/* Error in Form */}
                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-neon-gold text-black font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                SYNCING...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={18} />
                                                {editingAddress ? 'UPDATE COORDINATES' : 'SAVE COORDINATES'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div >
                    </>
                )}
            </AnimatePresence >
        </div >
    );
};

export default AddressBook;
