
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
