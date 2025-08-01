
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useDeepLinkHandler = (onMedicationReminderNavigate: (medicationId: number) => void) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for medication reminder deep link
    const medicationId = searchParams.get('medicationId');
    const action = searchParams.get('action');
    
    if (medicationId && action === 'reminder') {
      console.log('Deep link detected for medication reminder:', medicationId);
      onMedicationReminderNavigate(parseInt(medicationId));
    }
  }, [searchParams, onMedicationReminderNavigate]);

  return {
    // Additional deep link utilities can be added here
  };
};
