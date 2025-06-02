
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, FileText } from 'lucide-react';
import { MobileAppContainer } from '@/components/MobileAppContainer';

export const DemoHomePage: React.FC = () => {
  return (
    <MobileAppContainer>
      <div className="h-full bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="w-full rounded-3xl overflow-hidden bg-white border-0 shadow-none">
            <CardContent className="p-6 text-center space-y-6">
              {/* Welcome message */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                  お疲れ様でした
                </h1>
                <p className="text-lg text-gray-600">
                  今日も健康管理を頑張りましょう
                </p>
              </div>

              {/* Next medication info */}
              <div className="bg-blue-50 rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Pill className="h-6 w-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-800">
                    次のお薬
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-800">
                    コレステロールの薬
                  </div>
                  <div className="text-lg text-gray-600 flex items-center justify-center gap-2">
                    <span>スケジュール時間:</span>
                    20:00
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 text-white"
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    お薬の確認
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 hover:bg-[#016a5e]/10 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 text-[#016a5e] border-[#016a5e]"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    服薬記録を確認
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileAppContainer>
  );
};
