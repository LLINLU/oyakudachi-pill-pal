import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MessageCircle, Badge } from 'lucide-react';
import { MobileAppContainer } from '@/components/MobileAppContainer';
import { useState } from 'react';
import { FamilyInviteQuickButton } from '@/components/FamilyInviteQuickButton';

interface NotificationMethodScreenProps {
  onSelectLine: () => void;
  onSelectEmail: () => void;
}

export const NotificationMethodScreen = ({ onSelectLine, onSelectEmail }: NotificationMethodScreenProps) => {
  const [showLineInvite, setShowLineInvite] = useState(false);

  // 如果显示LINE邀请界面，直接返回邀请组件
  if (showLineInvite) {
    return (
      <MobileAppContainer>
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50 p-4">
          <Card className="w-full max-w-sm p-5 space-y-5 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground japanese-text">
                LINE家族招待
              </h2>
              <p className="text-sm text-muted-foreground japanese-text">
                家族に招待リンクを送信して通知を設定
              </p>
            </div>

            {/* 邀请码生成组件 */}
            <FamilyInviteQuickButton ownerUserId={1} />

            {/* 返回按钮 */}
            <Button
              variant="outline"
              onClick={() => setShowLineInvite(false)}
              className="w-full"
            >
              戻る
            </Button>
          </Card>
        </div>
      </MobileAppContainer>
    );
  }

  return (
    <MobileAppContainer>
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-sm p-5 space-y-5 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-foreground japanese-text">
              通知方法の選択
            </h2>
            <p className="text-sm text-muted-foreground japanese-text">
              どの方法でお知らせしますか？
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* LINE Option */}
            <Card 
              className="p-3 border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-all duration-200"
              onClick={() => setShowLineInvite(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-green-900 japanese-text text-sm">
                      LINEで家族に通知
                    </h3>
                    <div className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs japanese-text">
                      かんたん設定
                    </div>
                  </div>
                  <p className="text-xs text-green-700 japanese-text">
                    LINEアプリを使って簡単に通知
                  </p>
                </div>
              </div>
            </Card>

            {/* Email Option */}
            <Card 
              className="p-3 border-2 border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-all duration-200"
              onClick={onSelectEmail}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 japanese-text text-sm">
                    メールで家族に通知
                  </h3>
                  <p className="text-xs text-blue-700 japanese-text">
                    メールアドレス入力が必要です
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 japanese-text">
              💡 どちらの方法も後から変更できます
            </p>
          </div>
        </Card>
      </div>
    </MobileAppContainer>
  );
};