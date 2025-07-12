
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { createSpeechRecognition, handleSpeechRecognitionError, checkSpeechRecognitionSupport } from '@/utils/speechRecognitionUtils';
import { logger } from '@/utils/logger';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = checkSpeechRecognitionSupport();

  const initializeRecognition = useCallback(() => {
    const recognition = createSpeechRecognition({
      continuous: false,
      interimResults: true,
      lang: 'ja-JP',
      maxAlternatives: 1
    });

    if (!recognition) return null;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      logger.log('Speech recognition started');
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
        logger.log('Speech recognition result:', finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      logger.log('Speech recognition ended');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      handleSpeechRecognitionError(event.error);
    };

    return recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error('お使いのブラウザは音声認識に対応していません');
      return;
    }

    try {
      recognitionRef.current = initializeRecognition();
      recognitionRef.current?.start();
    } catch (error) {
      logger.error('Failed to start speech recognition:', error);
      toast.error('音声認識を開始できませんでした');
    }
  }, [initializeRecognition, isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported
  };
};
