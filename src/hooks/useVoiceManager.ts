
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface VoiceQueueItem {
  id: string;
  text: string;
  options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  };
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export const useVoiceManager = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechId, setCurrentSpeechId] = useState<string | null>(null);
  const queueRef = useRef<VoiceQueueItem[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessingQueueRef = useRef(false);

  const isSupported = 'speechSynthesis' in window;

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSpeechId(null);
    currentUtteranceRef.current = null;
    queueRef.current = [];
    isProcessingQueueRef.current = false;
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || queueRef.current.length === 0 || !isSupported) {
      return;
    }

    isProcessingQueueRef.current = true;
    const item = queueRef.current.shift();
    
    if (!item) {
      isProcessingQueueRef.current = false;
      return;
    }

    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = item.options?.lang || 'ja-JP';
    utterance.rate = item.options?.rate || 0.9;
    utterance.pitch = item.options?.pitch || 1;
    utterance.volume = item.options?.volume || 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeechId(item.id);
      item.onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeechId(null);
      currentUtteranceRef.current = null;
      item.onEnd?.();
      
      isProcessingQueueRef.current = false;
      // Process next item in queue
      setTimeout(() => processQueue(), 100);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setCurrentSpeechId(null);
      currentUtteranceRef.current = null;
      
      // Handle specific error types
      if (event.error !== 'interrupted') {
        item.onError?.(event);
        
        // Show user-friendly error message
        switch (event.error) {
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
            console.log('Speech interrupted or other non-critical error:', event.error);
        }
      }
      
      isProcessingQueueRef.current = false;
      // Process next item in queue even after error
      setTimeout(() => processQueue(), 100);
    };

    currentUtteranceRef.current = utterance;
    
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to start speech synthesis:', error);
      isProcessingQueueRef.current = false;
      item.onError?.(error as SpeechSynthesisErrorEvent);
    }
  }, [isSupported]);

  const speak = useCallback((
    text: string, 
    options?: {
      id?: string;
      lang?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      priority?: boolean;
    }
  ) => {
    if (!isSupported) {
      toast.error('お使いのブラウザは音声合成に対応していません');
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const id = options?.id || `speech-${Date.now()}-${Math.random()}`;
      
      const queueItem: VoiceQueueItem = {
        id,
        text,
        options,
        onStart: () => {
          console.log(`Started speaking: ${text.substring(0, 50)}...`);
        },
        onEnd: () => {
          console.log(`Finished speaking: ${text.substring(0, 50)}...`);
          resolve();
        },
        onError: (error) => {
          console.error('Speech error:', error);
          reject(error);
        }
      };

      if (options?.priority) {
        // Add to front of queue for priority items
        queueRef.current.unshift(queueItem);
        // Stop current speech to play priority item
        if (isSpeaking) {
          stopSpeaking();
        }
      } else {
        queueRef.current.push(queueItem);
      }

      processQueue();
    });
  }, [isSupported, isSpeaking, stopSpeaking, processQueue]);

  const speakMedicationReminder = useCallback((medicationName: string, time?: string) => {
    const message = time 
      ? `${time}です。${medicationName}をお飲みください。`
      : `お薬を飲む時間です。${medicationName}をお飲みください。`;
    
    return speak(message, { 
      id: `medication-${medicationName}`,
      priority: true 
    });
  }, [speak]);

  const speakNextMedicationInfo = useCallback((medicationName: string, time: string) => {
    const message = `次のお薬は${medicationName}です。時間は${time}です。`;
    return speak(message, { 
      id: `next-medication-${medicationName}`,
      priority: false 
    });
  }, [speak]);

  return {
    isSpeaking,
    currentSpeechId,
    isSupported,
    speak,
    stopSpeaking,
    speakMedicationReminder,
    speakNextMedicationInfo
  };
};
