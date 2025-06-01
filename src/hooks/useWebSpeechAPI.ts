
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useVoiceManager } from './useVoiceManager';

interface UseWebSpeechAPIReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSupported: boolean;
}

export const useWebSpeechAPI = (): UseWebSpeechAPIReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceManager = useVoiceManager();

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const initializeSpeechRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        console.log('Speech recognition result:', finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          toast.error('音声が検出されませんでした', {
            description: 'もう一度お話しください'
          });
          break;
        case 'audio-capture':
          toast.error('マイクにアクセスできません', {
            description: 'マイクの許可を確認してください'
          });
          break;
        case 'not-allowed':
          toast.error('マイクの使用が許可されていません', {
            description: 'ブラウザの設定でマイクを許可してください'
          });
          break;
        default:
          toast.error('音声認識エラー', {
            description: 'しばらく経ってから再度お試しください'
          });
      }
    };

    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error('お使いのブラウザは音声認識に対応していません');
      return;
    }

    // Stop any current speech before starting to listen
    if (voiceManager.isSpeaking) {
      voiceManager.stopSpeaking();
    }

    try {
      recognitionRef.current = initializeSpeechRecognition();
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast.error('音声認識を開始できませんでした');
    }
  }, [initializeSpeechRecognition, isSupported, voiceManager]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    voiceManager.speak(text, { id: `conversation-${Date.now()}` });
  }, [voiceManager]);

  const stopSpeaking = useCallback(() => {
    voiceManager.stopSpeaking();
  }, [voiceManager]);

  return {
    isListening,
    isSpeaking: voiceManager.isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported: isSupported && voiceManager.isSupported
  };
};
