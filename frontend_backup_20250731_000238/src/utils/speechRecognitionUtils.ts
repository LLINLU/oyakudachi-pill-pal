
import { toast } from 'sonner';
import { SpeechRecognitionConfig } from '@/types/speechRecognition';

export const createSpeechRecognition = (config: SpeechRecognitionConfig = {}) => {
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  if (!isSupported) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = config.continuous || false;
  recognition.interimResults = config.interimResults || true;
  recognition.lang = config.lang || 'ja-JP';
  recognition.maxAlternatives = config.maxAlternatives || 1;

  return recognition;
};

export const handleSpeechRecognitionError = (error: string) => {
  console.error('Speech recognition error:', error);
  
  switch (error) {
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

export const checkSpeechRecognitionSupport = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};
