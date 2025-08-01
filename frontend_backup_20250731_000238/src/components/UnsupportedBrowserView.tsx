
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface UnsupportedBrowserViewProps {
  onBack: () => void;
}

export const UnsupportedBrowserView: React.FC<UnsupportedBrowserViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 text-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          戻る
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">音声相談</h1>
          <Card className="w-full shadow-lg border border-red-200 rounded-3xl bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-4">音声機能をご利用いただけません</h2>
              <p className="text-lg text-red-600 mb-4">
                お使いのブラウザは音声認識に対応していません。
              </p>
              <p className="text-gray-600">
                Chrome、Edge、Safari の最新版をご利用ください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
