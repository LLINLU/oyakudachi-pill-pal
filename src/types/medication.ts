
export interface Medication {
  id: number;
  name: string;
  time: string;
  image: string;
  taken: boolean;
  postponed: boolean;
}

export interface ScannedMedication {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
}

export interface MedicationFrequency {
  label: string;
  times: string[];
  defaultTimes: string[];
}

export interface MedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
}
