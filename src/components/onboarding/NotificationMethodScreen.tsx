import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MessageCircle, Badge } from 'lucide-react';

interface NotificationMethodScreenProps {
  onSelectLine: () => void;
  onSelectEmail: () => void;
}

export const NotificationMethodScreen = ({ onSelectLine, onSelectEmail }: NotificationMethodScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground japanese-text">
            通知方法の選択
          </h2>
          <p className="text-muted-foreground japanese-text">
            どの方法でお知らせしますか？
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* LINE Option */}
          <Card 
            className="p-4 border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-all duration-200"
            onClick={onSelectLine}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-green-900 japanese-text">
                    LINEで家族に通知
                  </h3>
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs japanese-text">
                    かんたん設定
                  </div>
                </div>
                <p className="text-sm text-green-700 japanese-text">
                  LINEアプリを使って簡単に通知
                </p>
              </div>
            </div>
          </Card>

          {/* Email Option */}
          <Card 
            className="p-4 border-2 border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-all duration-200"
            onClick={onSelectEmail}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 japanese-text">
                  メールで家族に通知
                </h3>
                <p className="text-sm text-blue-700 japanese-text">
                  メールアドレス入力が必要です
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800 japanese-text">
            💡 どちらの方法も後から変更できます
          </p>
        </div>
      </Card>
    </div>
  );
};