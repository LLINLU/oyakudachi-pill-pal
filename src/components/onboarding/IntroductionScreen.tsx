import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Bell, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface IntroductionScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const introCards = [
  {
    icon: Camera,
    title: "処方箋を撮影",
    description: "カメラで処方箋を撮影するだけで、お薬の情報を自動で読み取ります",
    color: "blue"
  },
  {
    icon: Bell,
    title: "お薬リマインダー",
    description: "設定した時間にお薬の服用をお知らせします。飲み忘れを防げます",
    color: "green"
  },
  {
    icon: Users,
    title: "家族に安心をお届け",
    description: "お薬を服用したことをご家族に自動でお知らせできます",
    color: "purple"
  }
];

export const IntroductionScreen = ({ onNext, onSkip }: IntroductionScreenProps) => {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    if (currentCard < introCards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      onNext();
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const card = introCards[currentCard];
  const IconComponent = card.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'purple':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <MobileAppContainer>
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-sm p-5 space-y-5 animate-fade-in">
          {/* Skip Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground japanese-text text-sm h-8"
            >
              スキップ
            </Button>
          </div>

          {/* Main Card */}
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${getColorClasses(card.color)}`}>
              <IconComponent className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground japanese-text">
                {card.title}
              </h2>
              <p className="text-sm text-muted-foreground japanese-text leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2">
            {introCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentCard ? 'bg-primary w-6' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousCard}
              disabled={currentCard === 0}
              className="japanese-text h-10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              戻る
            </Button>

            <Button
              onClick={nextCard}
              className="japanese-text h-10"
            >
              {currentCard === introCards.length - 1 ? '開始' : '次へ'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </MobileAppContainer>
  );
};