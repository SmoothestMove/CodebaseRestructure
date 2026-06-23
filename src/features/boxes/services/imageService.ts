import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/main';

// Max dimensions for compressed images
const MAX_IMAGE_WIDTH = 800;
const MAX_IMAGE_HEIGHT = 800;
const JPEG_QUALITY = 0.7;

/**
 * Check if a URL is a valid web image URL (not file:/// or placeholder).
 * Accepts https://, http://, and data:image URIs.
 */
export const isValidWebImageUrl = (url?: string): boolean => {
  if (!url) return false;
  if (url.startsWith('file:///')) return false;
  if (url.includes('picsum.photos')) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image');
};

/**
 * Compress an image file using canvas. Returns a compressed JPEG Blob.
 * Resizes to fit within MAX_IMAGE_WIDTH x MAX_IMAGE_HEIGHT while maintaining aspect ratio.
 */
export const compressImage = (file: File | Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if needed, preserving aspect ratio
      if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
        const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
};

/**
 * Convert a data URL (base64) string to a Blob.
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64Data] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mime });
};

/**
 * Upload a box image to Firebase Storage.
 * Path: moves/{moveId}/boxes/{boxId}/{timestamp}_{random}.jpg
 * 
 * @returns The public download URL for the uploaded image
 */
export const uploadBoxImage = async (
  moveId: string,
  boxId: string,
  file: File | Blob
): Promise<string> => {
  // Compress the image before uploading
  const compressedBlob = await compressImage(file);

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const storagePath = `moves/${moveId}/boxes/${boxId}/${timestamp}_${random}.jpg`;

  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, compressedBlob, {
    contentType: 'image/jpeg',
    customMetadata: {
      boxId,
      moveId,
      uploadedAt: new Date().toISOString(),
    },
  });

  return getDownloadURL(storageRef);
};

/**
 * Upload a box image from a base64 data URL.
 * Converts to blob, compresses, and uploads to Storage.
 * 
 * @returns The public download URL for the uploaded image
 */
export const uploadBoxImageFromDataUrl = async (
  moveId: string,
  boxId: string,
  dataUrl: string
): Promise<string> => {
  const blob = dataUrlToBlob(dataUrl);
  return uploadBoxImage(moveId, boxId, blob);
};

/**
 * Delete a box image from Firebase Storage by its download URL.
 * Silently succeeds if the image doesn't exist.
 */
export const deleteBoxImage = async (imageUrl: string): Promise<void> => {
  try {
    // Only attempt to delete Firebase Storage URLs
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
      return;
    }
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error: unknown) {
    // Ignore "object not found" errors — image may already be deleted
    if (error instanceof Error && error.message.includes('object-not-found')) {
      return;
    }
    console.warn('Failed to delete box image:', error);
  }
};
