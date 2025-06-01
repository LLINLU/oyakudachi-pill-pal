import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useWebSpeechAPI } from '@/hooks/useWebSpeechAPI';

interface VoiceConversationPageProps {
  onBack: () => void;
}

export const VoiceConversationPage: React.FC<VoiceConversationPageProps> = ({ onBack }) => {
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  
  const { 
    isListening, 
    isSpeaking, 
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking,
    isSupported 
  } = useWebSpeechAPI();

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

  const generateResponse = (input: string) => {
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
    
    // Add response to conversation
    setConversation(prev => [...prev, { role: 'assistant', content: response }]);
    
    // Speak the response
    speak(response);
    
    toast.success('お答えしました', {
      description: '他にご質問があればお聞かせください'
    });
  };

  // Handle transcript changes
  useEffect(() => {
    if (transcript && !isListening) {
      // Add user input to conversation
      setConversation(prev => [...prev, { role: 'user', content: transcript }]);
      
      // Generate and speak response
      setTimeout(() => {
        generateResponse(transcript);
      }, 500);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    // Welcome message - only play once when component mounts
    setTimeout(() => {
      const welcomeMessage = 'こんにちは。どのようなことでお手伝いできますか？';
      setConversation([{ role: 'assistant', content: welcomeMessage }]);
      speak(welcomeMessage);
    }, 500);
  }, []); // Empty dependency array - runs only once

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
    } else if (isSpeaking) {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
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
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">音声相談</h1>
            <Card className="w-full shadow-lg border border-red-200 rounded-3xl bg-red-50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-700 mb-4">音声機能をご利用いただけません</h2>
                <p className="text-lg text-red-600 mb-4">
                  お使いのブラウザは音声認識に対応していません。
                </p>
                <p className="text-gray-600">
                  Chrome、Edge、Safari の最新版をご利用ください。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={handleVoiceButtonClick}
            className={`h-32 w-32 rounded-full text-white shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : isSpeaking
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
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
          {transcript && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">認識されたテキスト:</p>
              <p className="text-lg font-medium text-blue-800">{transcript}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
