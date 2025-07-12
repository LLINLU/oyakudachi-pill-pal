import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
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
          <h1 className="text-2xl font-bold text-foreground japanese-text">
            FamMed
          </h1>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground japanese-text">
            お薬の管理を<br />かんたんに
          </h2>
          <p className="text-muted-foreground japanese-text leading-relaxed">
            処方箋の撮影からお薬リマインダー、<br />
            ご家族への通知まで、<br />
            すべてをサポートします
          </p>
        </div>

        {/* Start Button */}
        <Button
          onClick={onNext}
          size="lg"
          className="w-full h-20 text-xl font-semibold japanese-text bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-300"
        >
          始める
        </Button>
      </Card>
    </div>
  );
};