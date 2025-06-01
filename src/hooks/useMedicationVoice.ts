
import { useState } from 'react';
import { toast } from 'sonner';
import { Medication } from '@/types/medication';

export const useMedicationVoice = () => {
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  const playVoiceReminder = (medication: Medication) => {
    setIsVoicePlaying(true);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const message = `お薬を飲む時間です。${medication.name}をお飲みください。`;
      const utterance = new SpeechSynthesisUtterance(message);
      
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        toast.success('音声でお知らせしています', {
          description: medication.name,
          duration: 3000
        });
      };

      utterance.onend = () => {
        setIsVoicePlaying(false);
      };

      utterance.onerror = () => {
        setIsVoicePlaying(false);
        toast.error('音声が再生できませんでした', {
          description: 'ブラウザが音声合成に対応していません'
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsVoicePlaying(false);
      toast.info('「お薬を飲む時間です」', {
        description: `${medication.name}をお飲みください`,
        duration: 4000
      });
    }
  };

  const playHomePageVoiceReminder = (nextMedication: Medication | null) => {
    if (!nextMedication) return;
    
    setIsVoicePlaying(true);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const message = `次のお薬は${nextMedication.name}です。時間は${nextMedication.time}です。`;
      const utterance = new SpeechSynthesisUtterance(message);
      
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        console.log('Home page voice reminder started');
      };

      utterance.onend = () => {
        setIsVoicePlaying(false);
      };

      utterance.onerror = () => {
        setIsVoicePlaying(false);
        console.error('Home page voice synthesis error');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsVoicePlaying(false);
      toast.info(`次のお薬は${nextMedication.name}です`, {
        description: `時間は${nextMedication.time}です`,
        duration: 4000
      });
    }
  };

  return {
    isVoicePlaying,
    playVoiceReminder,
    playHomePageVoiceReminder
  };
};
