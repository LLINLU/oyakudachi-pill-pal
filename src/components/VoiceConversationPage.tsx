
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceConversationPageProps {
  onBack: () => void;
}

export const VoiceConversationPage: React.FC<VoiceConversationPageProps> = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const responses = {
    medication: [
      'お薬について説明いたします。処方されたお薬を確認してください。',
      '血圧のお薬は毎日決まった時間に飲んでください。',
      'お薬の副作用が心配でしたら、医師にご相談ください。'
    ],
    health: [
      '体調はいかがですか？気になることがあれば遠慮なくお聞かせください。',
      '適度な運動と規則正しい生活が大切です。',
      '水分補給も忘れずにお願いします。'
    ],
    family: [
      'ご家族に連絡いたしましょうか？',
      'ご家族も心配されています。お元気な様子をお伝えします。',
      '何かあればすぐにご家族に連絡できます。'
    ],
    general: [
      'どのようなことでお困りですか？',
      'お話をお聞かせください。',
      'いつでもお手伝いいたします。'
    ]
  };

  const startListening = () => {
    setIsListening(true);
    setUserInput('');

    // Simulate voice recognition
    setTimeout(() => {
      const sampleInputs = [
        'お薬はいつ飲めばいいですか',
        '体調が悪いです',
        '家族に連絡してください',
        '今日のお薬を確認したいです',
        '血圧のお薬について教えてください'
      ];
      
      const randomInput = sampleInputs[Math.floor(Math.random() * sampleInputs.length)];
      setUserInput(randomInput);
      setIsListening(false);
      
      // Add to conversation and generate response
      setConversation(prev => [...prev, { role: 'user', content: randomInput }]);
      generateResponse(randomInput);
    }, 2000);
  };

  const generateResponse = (input: string) => {
    setIsSpeaking(true);
    
    let responseCategory = 'general';
    if (input.includes('薬') || input.includes('お薬')) {
      responseCategory = 'medication';
    } else if (input.includes('体調') || input.includes('気分') || input.includes('痛い')) {
      responseCategory = 'health';
    } else if (input.includes('家族') || input.includes('連絡')) {
      responseCategory = 'family';
    }
    
    const responseList = responses[responseCategory as keyof typeof responses];
    const response = responseList[Math.floor(Math.random() * responseList.length)];
    
    setTimeout(() => {
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setIsSpeaking(false);
      toast.success('お答えしました', {
        description: '他にご質問があればお聞かせください'
      });
    }, 1500);
  };

  useEffect(() => {
    // Welcome message
    setTimeout(() => {
      setConversation([{ role: 'assistant', content: 'こんにちは。どのようなことでお手伝いできますか？' }]);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with back button */}
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
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">音声相談</h1>
          <p className="text-xl text-gray-600">お話しください。お手伝いします</p>
        </div>

        {/* Conversation history */}
        <Card className="w-full shadow-lg border border-gray-200 rounded-3xl bg-white min-h-[400px]">
          <CardContent className="p-8">
            <div className="space-y-6 max-h-[500px] overflow-y-auto">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <p className="text-lg font-medium">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isListening && (
                <div className="flex justify-end">
                  <div className="bg-gray-200 text-gray-600 p-4 rounded-2xl animate-pulse">
                    <p className="text-lg">聞いています...</p>
                  </div>
                </div>
              )}
              
              {isSpeaking && (
                <div className="flex justify-start">
                  <div className="bg-green-500 text-white p-4 rounded-2xl animate-pulse">
                    <p className="text-lg">お答えしています...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Voice control */}
        <div className="flex justify-center">
          <Button
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={`h-32 w-32 rounded-full text-white shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : isSpeaking
                ? 'bg-green-500 hover:bg-green-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={isSpeaking}
          >
            <div className="text-center space-y-2">
              {isListening ? (
                <>
                  <MicOff className="h-12 w-12 mx-auto animate-pulse" />
                  <div className="text-sm font-medium">聞いています</div>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="h-12 w-12 mx-auto animate-bounce" />
                  <div className="text-sm font-medium">話しています</div>
                </>
              ) : (
                <>
                  <Mic className="h-12 w-12 mx-auto" />
                  <div className="text-sm font-medium">話しかける</div>
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-lg text-gray-600">
            ボタンを押してお話しください。お薬のこと、体調のこと、何でもご相談ください。
          </p>
        </div>
      </div>
    </div>
  );
};
