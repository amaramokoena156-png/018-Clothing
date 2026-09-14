/**
 * Image processing and compression utility for 018 Bokone Bophirima.
 * Compresses local machine/phone photos to crisp, lightweight data URLs
 * optimized for fast loading and Firestore document storage limits.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  fileName: string;
}

export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (JPEG, PNG, WEBP, etc.)'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read local file from device.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image format.'));
      img.onload = () => {
        let { width, height } = img;

        // Scale down proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not initialize canvas context for image processing.'));
        }

        // Fill background white in case of transparent PNG being converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with chosen quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate approximate size in bytes: Base64 length * 0.75
        const head = 'data:image/jpeg;base64,';
        const base64Length = dataUrl.length - head.length;
        const compressedSize = Math.round(base64Length * 0.75);

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize,
          width,
          height,
          fileName: file.name,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
