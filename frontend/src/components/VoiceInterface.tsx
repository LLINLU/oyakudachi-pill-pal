
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');

  const japaneseGreetings = [
    'おはようございます',
    'お疲れ様です',
    'こんにちは',
    'いかがお過ごしですか'
  ];

  const voiceResponses = {
    medication: [
      'お薬の時間をお知らせします',
      '血圧のお薬をお飲みください',
      '服薬を確認いたします'
    ],
    confirmation: [
      'かしこまりました',
      'ご家族に連絡いたします',
      'お疲れ様でした'
    ],
    encouragement: [
      '素晴らしいですね',
      'きちんと飲めていて安心です',
      'ご家族も安心されています'
    ]
  };

  const simulateVoiceRecognition = () => {
    setIsListening(true);
    setVoiceCommand('');

    // Simulate listening time
    setTimeout(() => {
      const commands = [
        'お薬を飲みました',
        'いつものお薬はどれですか',
        '家族に連絡してください',
        '今日のお薬を確認してください'
      ];
      
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setVoiceCommand(randomCommand);
      setIsListening(false);
      
      // Process the command
      processVoiceCommand(randomCommand);
    }, 2000);
  };

  const processVoiceCommand = (command: string) => {
    setIsSpeaking(true);
    
    let response = '';
    if (command.includes('飲みました') || command.includes('飲んだ')) {
      response = voiceResponses.confirmation[Math.floor(Math.random() * voiceResponses.confirmation.length)];
      toast.success('音声で確認しました', {
        description: '服薬を記録し、ご家族に通知しました'
      });
    } else if (command.includes('確認') || command.includes('どれ')) {
      response = voiceResponses.medication[Math.floor(Math.random() * voiceResponses.medication.length)];
      toast.info('お薬をご案内します', {
        description: '処方されたお薬を表示します'
      });
    } else if (command.includes('家族') || command.includes('連絡')) {
      response = voiceResponses.confirmation[Math.floor(Math.random() * voiceResponses.confirmation.length)];
      toast.success('ご家族に連絡しました', {
        description: '現在の状況をお知らせしました'
      });
    } else {
      response = voiceResponses.encouragement[Math.floor(Math.random() * voiceResponses.encouragement.length)];
    }

    // Simulate speech synthesis
    setTimeout(() => {
      setIsSpeaking(false);
      toast.success(`「${response}」`, {
        description: '音声でお答えしました'
      });
    }, 2000);
  };

  const speakWelcomeMessage = () => {
    setIsSpeaking(true);
    const greeting = japaneseGreetings[Math.floor(Math.random() * japaneseGreetings.length)];
    
    setTimeout(() => {
      setIsSpeaking(false);
      toast.success(`「${greeting}」`, {
        description: 'お薬のことでしたらお声をかけてください'
      });
    }, 1500);
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={isListening ? () => setIsListening(false) : simulateVoiceRecognition}
        className={`h-24 bg-gradient-to-br rounded-2xl shadow-lg transition-all duration-300 ${
          isListening 
            ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
            : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
        }`}
        disabled={isSpeaking}
      >
        <div className="text-center space-y-2 text-white">
          {isListening ? (
            <>
              <MicOff className="h-8 w-8 mx-auto animate-pulse" />
              <div className="text-sm font-medium">聞いています...</div>
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 className="h-8 w-8 mx-auto animate-bounce" />
              <div className="text-sm font-medium">お話ししています</div>
            </>
          ) : (
            <>
              <Mic className="h-8 w-8 mx-auto" />
              <div className="text-sm font-medium">音声で話す</div>
            </>
          )}
        </div>
      </Button>

      {voiceCommand && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">音声認識</Badge>
            <Volume2 className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-sm font-medium text-gray-800">
            「{voiceCommand}」
          </div>
        </div>
      )}

      <Button
        onClick={speakWelcomeMessage}
        variant="outline"
        size="sm"
        className="w-full text-xs text-gray-600 border-gray-200 hover:bg-gray-50"
        disabled={isSpeaking || isListening}
      >
        <Volume2 className="h-3 w-3 mr-1" />
        ご挨拶を聞く
      </Button>
    </div>
  );
};

export default VoiceInterface;
