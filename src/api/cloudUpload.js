/**
 * Cloud Storage Upload Utility
 * Uploads files to Cloudinary and returns the secure URL
 * 
 * Cloudinary is used because:
 * - Free tier: 25GB storage + 25GB bandwidth/month
 * - No CORS issues
 * - Direct browser uploads supported
 * - Automatic image optimization
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'custom_blueprints';

/**
 * Upload a file (or data URL) to Cloudinary
 * @param {File|string} fileOrDataUrl - File object or base64 data URL
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadFileToCloud = async (fileOrDataUrl, folder = 'custom-blueprints') => {
    try {
        const formData = new FormData();

        // Handle File objects, data URLs, and blob URLs
        if (fileOrDataUrl instanceof File) {
            formData.append('file', fileOrDataUrl);
        } else if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
            // Data URL - convert to blob
            const response = await fetch(fileOrDataUrl);
            const blob = await response.blob();
            formData.append('file', blob, 'custom-design.png');
        } else if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('blob:')) {
            // Blob URL (from remove.bg) - fetch and convert
            const response = await fetch(fileOrDataUrl);
            const blob = await response.blob();
            formData.append('file', blob, 'custom-design.png');
        } else if (typeof fileOrDataUrl === 'string') {
            // Regular URL - pass directly to Cloudinary
            formData.append('file', fileOrDataUrl);
        } else {
            throw new Error('Invalid file format. Please upload an image.');
        }

        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);
        formData.append('timestamp', Date.now().toString());

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Cloudinary error response:', data);
            throw new Error(data.error?.message || `Upload failed (${response.status})`);
        }

        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
        };
    } catch (error) {
        console.error('Cloud upload error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload file to cloud storage',
        };
    }
};

/**
 * Alternative: Upload using base64 directly (for smaller files)
 */
export const uploadBase64ToCloud = async (base64Data, filename = 'custom-design') => {
    try {
        const formData = new FormData();
        formData.append('file', base64Data);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'custom-blueprints');
        formData.append('public_id', `${filename}_${Date.now()}`);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (data.secure_url) {
            return {
                success: true,
                url: data.secure_url,
            };
        }

        throw new Error(data.error?.message || 'Upload failed');
    } catch (error) {
        console.error('Cloud upload error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

export default uploadFileToCloud;
