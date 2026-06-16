import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'innerlight') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Get Cloudinary URL
 */
export const getCloudinaryUrl = (publicId, transformations = {}) => {
  try {
    return cloudinary.url(publicId, transformations);
  } catch (error) {
    console.error('Error generating Cloudinary URL:', error);
    return null;
  }
};

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (fileBuffer, folder = 'innerlight/avatars') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
};