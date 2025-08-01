
export interface VoiceQueueItem {
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

export interface SpeakOptions {
  id?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  priority?: boolean;
}
