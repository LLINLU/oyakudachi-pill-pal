import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, PlusCircle, Pill } from 'lucide-react';
interface EmptyStateHomeScreenProps {
  onScanHandbook: () => void;
  onManualInput: () => void;
}
export const EmptyStateHomeScreen: React.FC<EmptyStateHomeScreenProps> = ({
  onScanHandbook,
  onManualInput
}) => {
  return <div className="w-full max-w-md">
      <Card className="w-full rounded-3xl overflow-hidden bg-white border-0 shadow-none">
        <CardContent className="p-6 text-center space-y-6">
          {/* Welcome message */}
          

          {/* Empty state illustration */}
          <div className="bg-gray-50 rounded-3xl p-8 space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <Pill className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-700">
                お薬が登録されていません
              </h2>
              <p className="text-sm text-gray-500">
                薬手帳をスキャンするか、手動でお薬を追加してください
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button onClick={onScanHandbook} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 text-white">
              <Camera className="h-5 w-5 mr-3" />
              薬手帳をスキャン
            </Button>

            <Button onClick={onManualInput} variant="outline" className="w-full h-12 hover:bg-blue-50 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-blue-700 border-blue-200">
              <PlusCircle className="h-5 w-5 mr-3" />
              手動でお薬を追加
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};