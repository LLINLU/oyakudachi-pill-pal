import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWebSpeechAPI } from '@/hooks/useWebSpeechAPI';
import { VoiceConversationHeader } from './VoiceConversationHeader';
import { ConversationHistory } from './ConversationHistory';
import { VoiceControlButton } from './VoiceControlButton';
import { VoiceInstructions } from './VoiceInstructions';
import { UnsupportedBrowserView } from './UnsupportedBrowserView';

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
    return <UnsupportedBrowserView onBack={onBack} />;
  }

  return (
    <div className="h-full bg-gray-50 p-3 flex flex-col">
      <VoiceConversationHeader onBack={onBack} />

      <div className="flex-1 flex flex-col space-y-4 max-w-sm mx-auto w-full overflow-hidden">
        {/* Conversation and Voice Control in the same row */}
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <ConversationHistory 
              conversation={conversation}
              isListening={isListening}
              isSpeaking={isSpeaking}
            />
          </div>
          
          <div className="flex-shrink-0">
            <VoiceControlButton
              isListening={isListening}
              isSpeaking={isSpeaking}
              onClick={handleVoiceButtonClick}
            />
          </div>
        </div>

        <VoiceInstructions transcript={transcript} />
      </div>
    </div>
  );
};
