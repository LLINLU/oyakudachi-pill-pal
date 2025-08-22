
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, CheckCircle, RefreshCw, Plus, Clock, AlertCircle, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { ScannedMedication } from '@/types/medication';
import { processImageWithOCR, captureImageFromVideo, OCRProgress } from '@/utils/ocrService';
import { parseMedicationFromText } from '@/utils/medicationParser';


interface MedicationHandbookScannerProps {
  onBack: () => void;
  onMedicationsScanned: (medications: ScannedMedication[]) => void;
}

const MedicationHandbookScanner: React.FC<MedicationHandbookScannerProps> = ({
  onBack,
  onMedicationsScanned
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedMedications, setScannedMedications] = useState<ScannedMedication[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [ocrFailed, setOcrFailed] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress>({ status: '', progress: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('このデバイスはカメラをサポートしていません');
      return;
    }

    try {
      // Try rear camera first (environment)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Rear camera not available, trying fallback:', err);
      try {
        // Fallback to any available camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        toast.info('前面カメラを使用しています', {
          description: 'より良い結果のために背面カメラを使用することをお勧めします'
        });
      } catch (fallbackErr) {
        console.error('Camera access denied:', fallbackErr);
        toast.error('カメラにアクセスできません', {
          description: 'カメラの使用を許可してください'
        });
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Fix: Store video reference to prevent cleanup issues
      const video = videoRef.current;
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    };
  }, []); // Removed videoRef dependency to fix React warning

  const handleHandbookScan = async () => {
    if (!videoRef.current) {
      toast.error("カメラが利用できません");
      return;
    }
    
    setIsScanning(true);
    setOcrProgress({ status: '画像を処理中...', progress: 0 });
    
    try {
      // Capture image from video
      const imageBlob = await captureImageFromVideo(videoRef.current);
      
      // Process with OCR
      const ocrText = await processImageWithOCR(imageBlob, (progress) => {
        setOcrProgress(progress);
      });
      
      // Parse medication data from OCR text
      const medications = parseMedicationFromText(ocrText);
      
      if (medications.length === 0) {
        setOcrFailed(true);
        setShowResults(true);
        toast.error("薬の認識ができませんでした", {
          description: "もう一度スキャンするか、手動で入力してください。"
        });
      } else {
        setScannedMedications(medications);
        setOcrFailed(false);
        setShowResults(true);
        toast.success(`${medications.length}件の薬を認識しました`);
      }
    } catch (error) {
      console.error('OCR scan failed:', error);
      toast.error("スキャンに失敗しました");
    } finally {
      setIsScanning(false);
      setOcrProgress({ status: '', progress: 0 });
    }
  };

  const handleConfirmMedications = () => {
    onMedicationsScanned(scannedMedications);
    toast.success('お薬リストを更新しました', {
      description: 'リマインダーが設定されました'
    });
    onBack();
  };

  const resetScan = () => {
    setScannedMedications([]);
    setShowResults(false);
    setOcrFailed(false);
    setIsScanning(false);
  };

  if (showResults) {
    if (ocrFailed) {
      // OCR Failed view
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
          <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-600 p-2"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">スキャン結果</h1>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">薬の認識ができませんでした</h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  お薬手帳の文字を正しく読み取ることができませんでした。<br />
                  もう一度スキャンするか、手動で入力してください。
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={resetScan}
                className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xl font-semibold rounded-2xl"
              >
                <Camera className="h-6 w-6 mr-3" />
                もう一度スキャン
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full h-12 text-lg border-2 border-gray-200 hover:bg-gray-50 rounded-xl"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                手動で入力
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Success results view
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={resetScan}
              variant="ghost"
              className="text-gray-600 p-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">スキャン結果</h1>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-6 w-6" />
                認識されたお薬
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scannedMedications.map((med, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{med.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {med.dosage}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {med.frequency} - {med.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {med.instructions}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmMedications}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xl font-semibold rounded-2xl"
            >
              <Plus className="h-6 w-6 mr-3" />
              リマインダーに追加
            </Button>
            
            <Button
              onClick={resetScan}
              variant="outline"
              className="w-full h-12 text-lg border-2 border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              もう一度スキャン
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 p-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">薬手帳をスキャン</h1>
        </div>

        {/* Camera View */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gray-900 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-center text-white space-y-4">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-lg font-semibold">{ocrProgress.status || 'OCRで処理中...'}</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${ocrProgress.progress * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm opacity-75">{Math.round(ocrProgress.progress * 100)}%</div>
                  </div>
                </div>
              )}

              {/* Scan Frame */}
              <div className="absolute inset-8 border-2 border-white/60 rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4 text-center text-white text-sm bg-black/50 rounded-lg p-2">
                薬手帳のページを枠の中に入れてください
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {!isScanning && (
          <Button
            onClick={handleHandbookScan}
            className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xl font-semibold rounded-2xl"
          >
            <Camera className="h-8 w-8 mr-3" />
            薬手帳をスキャン
          </Button>
        )}

        {/* Tips */}
        <Card className="bg-blue-50/80 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="text-sm text-blue-800 space-y-2">
              <div className="font-semibold">スキャンのコツ</div>
              <ul className="text-xs space-y-1 text-blue-700">
                <li>• 薬手帳のページ全体が見えるように撮影してください</li>
                <li>• 明るい場所で、影が入らないようにしてください</li>
                <li>• お薬の名前と用法・用量が鮮明に写るようにしてください</li>
                <li>• ページが平らになるようにしてください</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicationHandbookScanner;
