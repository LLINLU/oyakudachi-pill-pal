
import { toast } from 'sonner';

export const createUtterance = (text: string, options?: {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}): SpeechSynthesisUtterance => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options?.lang || 'ja-JP';
  utterance.rate = options?.rate || 0.9;
  utterance.pitch = options?.pitch || 1;
  utterance.volume = options?.volume || 1;
  return utterance;
};

export const handleSpeechError = (error: SpeechSynthesisErrorEvent) => {
  console.error('Speech synthesis error:', error.error);
  
  // Handle specific error types
  if (error.error !== 'interrupted') {
    // Show user-friendly error message
    switch (error.error) {
      case 'network':
        toast.error('ネットワークエラー', {
          description: '音声合成でネットワークエラーが発生しました'
        });
        break;
      case 'synthesis-failed':
        toast.error('音声合成に失敗しました', {
          description: 'しばらく経ってから再度お試しください'
        });
        break;
      case 'synthesis-unavailable':
        toast.error('音声合成が利用できません', {
          description: 'ブラウザが音声合成に対応していません'
        });
        break;
      default:
        console.log('Speech interrupted or other non-critical error:', error.error);
    }
  }
};

export const stopAllSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const waitForSpeechToStop = (ms: number = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
