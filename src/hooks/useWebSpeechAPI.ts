
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

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
      }
    };

    recognition.onend = () => {
      setIsListening(false);
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

    try {
      recognitionRef.current = initializeSpeechRecognition();
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast.error('音声認識を開始できませんでした');
    }
  }, [initializeSpeechRecognition, isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('お使いのブラウザは音声合成に対応していません');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error('Speech synthesis error:', event.error);
      toast.error('音声合成エラーが発生しました');
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported
  };
};
