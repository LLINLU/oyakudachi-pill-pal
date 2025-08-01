
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, CheckCircle, AlertTriangle, Zap, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface PillRecognitionProps {
  onBack: () => void;
}

const PillRecognition: React.FC<PillRecognitionProps> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const simulatePillRecognition = () => {
    setIsScanning(true);
    setRecognitionResult(null);

    // Simulate AI processing time
    setTimeout(() => {
      const mockResult = {
        name: '血圧の薬',
        englishName: 'Amlodipine 5mg',
        manufacturer: '第一三共',
        shape: '円形',
        color: '白',
        size: '5mm',
        isCorrect: Math.random() > 0.2, // 80% chance of correct identification
        scheduledTime: '08:00',
        instructions: '朝食後に1錠服用'
      };
      
      const confidenceLevel = Math.floor(Math.random() * 20) + 80; // 80-99%
      
      setRecognitionResult(mockResult);
      setConfidence(confidenceLevel);
      setIsScanning(false);

      if (mockResult.isCorrect && confidenceLevel > 85) {
        toast.success('お薬を正しく認識しました', {
          description: `${mockResult.name} - 信頼度 ${confidenceLevel}%`
        });
      } else if (!mockResult.isCorrect) {
        toast.error('このお薬は処方されていません', {
          description: '処方されたお薬と異なる可能性があります'
        });
      } else {
        toast.warning('認識の信頼度が低いです', {
          description: 'もう一度お薬をカメラに向けてください'
        });
      }
    }, 3000);
  };

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Camera access denied:', err);
          toast.error('カメラにアクセスできません', {
            description: 'カメラの使用を許可してください'
          });
        });
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const resetScan = () => {
    setRecognitionResult(null);
    setConfidence(0);
    setIsScanning(false);
  };

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
          <h1 className="text-2xl font-bold text-gray-800">お薬の確認</h1>
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
                    <div className="text-lg font-semibold">AI がお薬を確認中...</div>
                    <div className="text-sm opacity-75">しばらくお待ちください</div>
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
                お薬を枠の中に入れてください
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recognition Result */}
        {recognitionResult && (
          <Card className={`bg-white/90 backdrop-blur-sm border-0 shadow-xl ${
            recognitionResult.isCorrect && confidence > 85
              ? 'ring-2 ring-green-400'
              : !recognitionResult.isCorrect
              ? 'ring-2 ring-red-400'
              : 'ring-2 ring-orange-400'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">認識結果</span>
                <Badge 
                  variant={
                    recognitionResult.isCorrect && confidence > 85
                      ? "default"
                      : !recognitionResult.isCorrect
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-sm"
                >
                  {confidence}% 確信度
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {recognitionResult.name}
                  </h3>
                  <p className="text-gray-600">{recognitionResult.englishName}</p>
                  <p className="text-sm text-gray-500">{recognitionResult.manufacturer}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-800">{recognitionResult.shape}</div>
                  <div className="text-gray-500">形状</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{recognitionResult.color}</div>
                  <div className="text-gray-500">色</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{recognitionResult.size}</div>
                  <div className="text-gray-500">サイズ</div>
                </div>
              </div>

              {recognitionResult.isCorrect && confidence > 85 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                    <CheckCircle className="h-5 w-5" />
                    正しいお薬です
                  </div>
                  <p className="text-sm text-green-700">
                    {recognitionResult.scheduledTime}の服用予定: {recognitionResult.instructions}
                  </p>
                </div>
              ) : !recognitionResult.isCorrect ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    処方されていないお薬
                  </div>
                  <p className="text-sm text-red-700">
                    このお薬は現在の処方には含まれていません。お医者様または薬剤師にご相談ください。
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800 font-semibold mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    確認をお勧めします
                  </div>
                  <p className="text-sm text-orange-700">
                    認識の確信度が低いです。薬剤師または家族に確認していただくことをお勧めします。
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isScanning && !recognitionResult && (
            <Button
              onClick={simulatePillRecognition}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xl font-semibold rounded-2xl"
            >
              <Camera className="h-8 w-8 mr-3" />
              お薬を確認する
            </Button>
          )}

          {recognitionResult && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={resetScan}
                variant="outline"
                className="h-12 text-lg border-2 border-gray-200 hover:bg-gray-50 rounded-xl"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                もう一度
              </Button>
              
              {recognitionResult.isCorrect && confidence > 85 && (
                <Button
                  onClick={() => {
                    toast.success('服用を記録しました', {
                      description: 'ご家族に通知を送信しました'
                    });
                    setTimeout(onBack, 1500);
                  }}
                  className="h-12 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  服用完了
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <Card className="bg-blue-50/80 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 space-y-1">
                <div className="font-semibold">認識のコツ</div>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• 明るい場所でお薬を撮影してください</li>
                  <li>• お薬を平らな面に置いてください</li>
                  <li>• 枠の中にお薬全体が入るようにしてください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PillRecognition;
