import { uploadToCloudinary, deleteFromCloudinary } from '@/services/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

export const uploadDishImageService = async (
  buffer: Buffer,
  originalname: string,
  dishId?: string
): Promise<string> => {
  try {
    const publicId = dishId ? `dish-${dishId}` : `dish-${Date.now()}`;

    const result: UploadApiResponse = await uploadToCloudinary(buffer, {
      folder: 'bodegon/dishes',
      public_id: publicId,
      resource_type: 'image',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading dish image:', error);
    throw new Error('Error al subir la imagen del plato');
  }
};

export const deleteDishImageService = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  } catch (error) {
    console.error('Error deleting dish image:', error);
    // Don't throw error to avoid blocking other operations
  }
};

const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Extract public_id from cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.extension
    const matches = url.match(/\/v\d+\/(.+)\./);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};
