
import { useCallback } from 'react';
import { useVoiceManager } from './useVoiceManager';
import { useSpeechRecognition } from './useSpeechRecognition';

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
  const voiceManager = useVoiceManager();
  const speechRecognition = useSpeechRecognition();

  const startListening = useCallback(() => {
    // Stop any current speech before starting to listen
    if (voiceManager.isSpeaking) {
      voiceManager.stopSpeaking();
    }
    speechRecognition.startListening();
  }, [voiceManager, speechRecognition]);

  const speak = useCallback((text: string) => {
    voiceManager.speak(text, { id: `conversation-${Date.now()}` });
  }, [voiceManager]);

  return {
    isListening: speechRecognition.isListening,
    isSpeaking: voiceManager.isSpeaking,
    transcript: speechRecognition.transcript,
    startListening,
    stopListening: speechRecognition.stopListening,
    speak,
    stopSpeaking: voiceManager.stopSpeaking,
    isSupported: speechRecognition.isSupported && voiceManager.isSupported
  };
};
