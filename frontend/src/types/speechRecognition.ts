
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionError {
  error: string;
  message: string;
}

export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}
