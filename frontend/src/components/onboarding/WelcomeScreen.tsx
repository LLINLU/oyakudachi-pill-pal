import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps) => {
  return (
    <MobileAppContainer>
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="w-full text-center space-y-6 animate-fade-in">
          {/* Logo */}
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground japanese-text">
              FamMed
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground japanese-text">
              お薬の管理を<br />かんたんに
            </h2>
            <p className="text-sm text-muted-foreground japanese-text leading-relaxed">
              処方箋の撮影からお薬リマインダー、<br />
              ご家族への通知まで、<br />
              すべてをサポートします
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={onNext}
            size="lg"
            className="w-full h-14 text-lg font-semibold japanese-text bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-300"
          >
            始める
          </Button>
        </div>
      </div>
    </MobileAppContainer>
  );
};