import Tesseract from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export const processImageWithOCR = async (
  imageFile: File | Blob,
  onProgress?: (progress: OCRProgress) => void
): Promise<string> => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'jpn+eng', // Support both Japanese and English
      {
        logger: (m) => {
          if (onProgress) {
            onProgress({
              status: m.status,
              progress: m.progress || 0
            });
          }
        }
      }
    );
    
    return result.data.text;
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('OCR処理に失敗しました');
  }
};

export const captureImageFromVideo = (videoElement: HTMLVideoElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    ctx.drawImage(videoElement, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to capture image'));
      }
    }, 'image/jpeg', 0.8);
  });
};