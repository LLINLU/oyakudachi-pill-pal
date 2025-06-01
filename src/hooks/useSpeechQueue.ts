
import { useState, useRef, useCallback } from 'react';
import { VoiceQueueItem } from '@/types/voice';
import { createUtterance, handleSpeechError, stopAllSpeech, waitForSpeechToStop } from '@/utils/speechSynthesisUtils';

export const useSpeechQueue = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechId, setCurrentSpeechId] = useState<string | null>(null);
  const queueRef = useRef<VoiceQueueItem[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessingQueueRef = useRef(false);

  const stopSpeaking = useCallback(() => {
    stopAllSpeech();
    setIsSpeaking(false);
    setCurrentSpeechId(null);
    currentUtteranceRef.current = null;
    queueRef.current = [];
    isProcessingQueueRef.current = false;
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || queueRef.current.length === 0) {
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
      await waitForSpeechToStop();
    }

    const utterance = createUtterance(item.text, item.options);

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
      handleSpeechError(event);
      setIsSpeaking(false);
      setCurrentSpeechId(null);
      currentUtteranceRef.current = null;
      
      if (event.error !== 'interrupted') {
        item.onError?.(event);
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
  }, []);

  const addToQueue = useCallback((item: VoiceQueueItem, priority: boolean = false) => {
    if (priority) {
      // Add to front of queue for priority items
      queueRef.current.unshift(item);
      // Stop current speech to play priority item
      if (isSpeaking) {
        stopSpeaking();
      }
    } else {
      queueRef.current.push(item);
    }

    processQueue();
  }, [isSpeaking, stopSpeaking, processQueue]);

  return {
    isSpeaking,
    currentSpeechId,
    stopSpeaking,
    addToQueue
  };
};
