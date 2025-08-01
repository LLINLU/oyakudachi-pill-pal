import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Bell, Check, X } from 'lucide-react';
import { useNotificationManager } from '@/hooks/useNotificationManager';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface PermissionScreenProps {
  onNext: () => void;
  onPermissionChange: (type: 'camera' | 'notifications', granted: boolean) => void;
}

export const PermissionScreen = ({ onNext, onPermissionChange }: PermissionScreenProps) => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
  const { initializeNotifications } = useNotificationManager();

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
      onPermissionChange('camera', true);
    } catch (error) {
      setCameraPermission(false);
      onPermissionChange('camera', false);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      await initializeNotifications();
      setNotificationPermission(true);
      onPermissionChange('notifications', true);
    } catch (error) {
      setNotificationPermission(false);
      onPermissionChange('notifications', false);
    }
  };

  const canProceed = cameraPermission !== null && notificationPermission !== null;

  const getPermissionIcon = (permission: boolean | null) => {
    if (permission === true) return <Check className="w-6 h-6 text-green-500" />;
    if (permission === false) return <X className="w-6 h-6 text-red-500" />;
    return null;
  };

  return (
    <MobileAppContainer>
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="w-full p-6 space-y-5 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-foreground japanese-text">
              アクセス許可
            </h2>
            <p className="text-muted-foreground text-sm japanese-text">
              アプリを使用するために必要な許可をお願いします
            </p>
          </div>

          <div className="space-y-3">
            {/* Camera Permission */}
            <Card className="p-3 border-2 border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground japanese-text text-sm">
                    カメラ
                  </h3>
                  <p className="text-xs text-muted-foreground japanese-text">
                    処方箋を撮影して読み取ります
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getPermissionIcon(cameraPermission)}
                  {cameraPermission === null && (
                    <Button
                      onClick={requestCameraPermission}
                      size="sm"
                      className="japanese-text text-xs h-8"
                    >
                      許可
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Notification Permission */}
            <Card className="p-3 border-2 border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground japanese-text text-sm">
                    通知
                  </h3>
                  <p className="text-xs text-muted-foreground japanese-text">
                    お薬の時間をお知らせします
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getPermissionIcon(notificationPermission)}
                  {notificationPermission === null && (
                    <Button
                      onClick={requestNotificationPermission}
                      size="sm"
                      className="japanese-text text-xs h-8"
                    >
                      許可
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Proceed Button */}
          <Button
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className="w-full japanese-text h-12"
          >
            次へ
          </Button>
        </div>
      </div>
    </MobileAppContainer>
  );
};