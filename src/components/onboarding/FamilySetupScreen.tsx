import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Heart } from 'lucide-react';

interface FamilySetupScreenProps {
  onSetupFamily: () => void;
  onSkipFamily: () => void;
}

export const FamilySetupScreen = ({ onSetupFamily, onSkipFamily }: FamilySetupScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground japanese-text">
            ご家族への通知
          </h2>
          <p className="text-muted-foreground japanese-text leading-relaxed">
            ご家族にお薬の状況を<br />
            お知らせしますか？
          </p>
        </div>

        {/* Benefits */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-blue-500 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 japanese-text">
                家族に安心を
              </h3>
              <p className="text-sm text-blue-700 japanese-text leading-relaxed">
                お薬を服用したことを自動で家族にお知らせします。離れていても安心です。
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onSetupFamily}
            size="lg"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white japanese-text"
          >
            🟢 はい、家族に知らせる
          </Button>

          <Button
            onClick={onSkipFamily}
            variant="outline"
            size="lg"
            className="w-full japanese-text"
          >
            ⚪ 今は設定しない
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground text-center japanese-text">
          後からアプリの設定で変更できます
        </p>
      </Card>
    </div>
  );
};