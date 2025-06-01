
import { useState } from 'react';
import { toast } from 'sonner';
import { Medication, ScannedMedication } from '@/types/medication';

export const useMedicationData = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: '血圧の薬',
      time: '08:00',
      image: '/lovable-uploads/c00a51fc-e53a-4810-932b-44be26439c5f.png',
      taken: true,
      postponed: false
    },
    {
      id: 2,
      name: '糖尿病の薬',
      time: '12:00',
      image: '/lovable-uploads/c00a51fc-e53a-4810-932b-44be26439c5f.png',
      taken: false,
      postponed: false
    },
    {
      id: 3,
      name: 'ビタミン剤',
      time: '18:00',
      image: '/lovable-uploads/c00a51fc-e53a-4810-932b-44be26439c5f.png',
      taken: false,
      postponed: false
    }
  ]);

  const getNextMedication = () => {
    return medications.find(med => !med.taken) || null;
  };

  const areAllMedicationsTaken = () => {
    return medications.every(med => med.taken);
  };

  const markMedicationTaken = (medicationId: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, taken: true }
          : med
      )
    );
  };

  const markMedicationPostponed = (medicationId: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, postponed: true }
          : med
      )
    );
  };

  const addScannedMedications = (scannedMeds: ScannedMedication[]) => {
    const newMedications: Medication[] = scannedMeds.map((scanned, index) => ({
      id: Date.now() + index,
      name: `${scanned.name} (${scanned.dosage})`,
      time: scanned.time.split(',')[0],
      image: '/lovable-uploads/c00a51fc-e53a-4810-932b-44be26439c5f.png',
      taken: false,
      postponed: false
    }));

    setMedications(prev => [...prev, ...newMedications]);
    
    toast.success('薬手帳から追加しました', {
      description: `${newMedications.length}種類のお薬が追加されました`,
      duration: 4000
    });
  };

  return {
    medications,
    getNextMedication,
    areAllMedicationsTaken,
    markMedicationTaken,
    markMedicationPostponed,
    addScannedMedications
  };
};
