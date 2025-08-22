import Tesseract from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  attempt: number;
}

export const processImageWithOCR = async (
  imageFile: File | Blob,
  onProgress?: (progress: OCRProgress) => void,
  maxRetries: number = 2
): Promise<string> => {
  // Validate input image
  if (!imageFile || imageFile.size === 0) {
    throw new Error('画像ファイルが無効です');
  }

  if (imageFile.size < 1000) {
    throw new Error('画像が小さすぎます。より鮮明な画像を撮影してください');
  }

  if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('画像ファイルが大きすぎます');
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OCR attempt ${attempt + 1}/${maxRetries + 1}`);
      
      const result = await Tesseract.recognize(
        imageFile,
        'jpn+eng', // Support both Japanese and English
        {
          logger: (m) => {
            if (onProgress) {
              const status = attempt > 0 
                ? `再試行中... (${attempt + 1}/${maxRetries + 1}) - ${m.status}`
                : m.status;
              
              onProgress({
                status,
                progress: m.progress || 0
              });
            }
          }
        }
      );
      
      // Validate OCR result quality
      const confidence = result.data.confidence || 0;
      const text = result.data.text.trim();
      
      if (confidence < 30 && attempt < maxRetries) {
        throw new Error(`OCR信頼度が低すぎます (${Math.round(confidence)}%)`);
      }
      
      if (text.length < 3 && attempt < maxRetries) {
        throw new Error('認識されたテキストが短すぎます');
      }
      
      console.log(`OCR success on attempt ${attempt + 1}, confidence: ${Math.round(confidence)}%`);
      return text;
      
    } catch (error) {
      lastError = error as Error;
      console.warn(`OCR attempt ${attempt + 1} failed:`, error);
      
      if (attempt === maxRetries) {
        // Final attempt failed
        break;
      }
      
      // Wait before retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 3000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (onProgress) {
        onProgress({
          status: `再試行まで${delay / 1000}秒待機...`,
          progress: 0
        });
      }
    }
  }
  
  // All attempts failed
  const errorMessage = lastError?.message || 'OCR処理に失敗しました';
  throw new Error(`${errorMessage} (${maxRetries + 1}回試行)`);
};

export const captureImageFromVideo = (videoElement: HTMLVideoElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate video element
      if (!videoElement) {
        reject(new Error('Video element not available'));
        return;
      }

      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        reject(new Error('Video not ready - please wait for camera to initialize'));
        return;
      }

      if (videoElement.readyState < 2) {
        reject(new Error('Video not loaded properly'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Set canvas size to video size
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(videoElement, 0, 0);
      
      // Apply basic image preprocessing for better OCR
      preprocessImageForOCR(ctx, canvas.width, canvas.height);
      
      // Convert to blob with higher quality for OCR
      canvas.toBlob((blob) => {
        if (blob && blob.size > 0) {
          console.log(`Image captured: ${blob.size} bytes`);
          resolve(blob);
        } else {
          reject(new Error('Failed to capture image - blob is empty'));
        }
      }, 'image/jpeg', 0.9); // Higher quality for better OCR
      
    } catch (error) {
      reject(new Error(`Image capture failed: ${error}`));
    }
  });
};

// Basic image preprocessing to improve OCR accuracy
const preprocessImageForOCR = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Apply contrast enhancement and brightness adjustment
    for (let i = 0; i < data.length; i += 4) {
      // Get RGB values
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Apply contrast enhancement (factor of 1.3)
      const enhancedR = Math.min(255, Math.max(0, (r - 128) * 1.3 + 128));
      const enhancedG = Math.min(255, Math.max(0, (g - 128) * 1.3 + 128));
      const enhancedB = Math.min(255, Math.max(0, (b - 128) * 1.3 + 128));
      
      // Apply slight brightness increase for better text recognition
      data[i] = Math.min(255, enhancedR + 10);
      data[i + 1] = Math.min(255, enhancedG + 10);
      data[i + 2] = Math.min(255, enhancedB + 10);
      // Alpha channel remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
  } catch (error) {
    console.warn('Image preprocessing failed, using original image:', error);
    // Preprocessing failed, but we can still use the original image
  }
};