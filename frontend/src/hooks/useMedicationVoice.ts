
import { toast } from 'sonner';
import { Medication } from '@/types/medication';
import { useVoiceManager } from './useVoiceManager';

export const useMedicationVoice = () => {
  const { isSpeaking, speakMedicationReminder, speakNextMedicationInfo } = useVoiceManager();

  const playVoiceReminder = async (medication: Medication) => {
    try {
      toast.success('音声でお知らせしています', {
        description: medication.name,
        duration: 3000
      });

      // Include pill count in the voice message
      await speakMedicationReminder(medication.name, medication.time, true);
    } catch (error) {
      console.error('Voice reminder error:', error);
      // Fallback to toast notification
      toast.info('「お薬を飲む時間です」', {
        description: `${medication.name}をお飲みください`,
        duration: 4000
      });
    }
  };

  const playHomePageVoiceReminder = async (nextMedication: Medication | null) => {
    if (!nextMedication) return;
    
    try {
      await speakNextMedicationInfo(nextMedication.name, nextMedication.time);
    } catch (error) {
      console.error('Home page voice reminder error:', error);
      // Fallback to toast notification
      toast.info(`次のお薬は${nextMedication.name}です`, {
        description: `時間は${nextMedication.time}です`,
        duration: 4000
      });
    }
  };

  return {
    isVoicePlaying: isSpeaking,
    playVoiceReminder,
    playHomePageVoiceReminder
  };
};
