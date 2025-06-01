
import { useCallback } from 'react';
import { toast } from 'sonner';
import { VoiceQueueItem, SpeakOptions } from '@/types/voice';
import { useSpeechQueue } from './useSpeechQueue';

export const useVoiceManager = () => {
  const { isSpeaking, currentSpeechId, stopSpeaking, addToQueue } = useSpeechQueue();

  const isSupported = 'speechSynthesis' in window;

  const speak = useCallback((
    text: string, 
    options?: SpeakOptions
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

      addToQueue(queueItem, options?.priority || false);
    });
  }, [isSupported, addToQueue]);

  const speakMedicationReminder = useCallback((medicationName: string, time?: string, includePillCount?: boolean) => {
    let message = '';
    
    if (includePillCount) {
      // Include pill count information for the "もう一度聞く" button
      message = `${medicationName}2粒お飲みください。`;
    } else {
      message = time 
        ? `${time}です。${medicationName}をお飲みください。`
        : `お薬を飲む時間です。${medicationName}をお飲みください。`;
    }
    
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
