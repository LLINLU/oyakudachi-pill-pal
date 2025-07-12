import { useState, useCallback } from 'react';
import { OnboardingStep, OnboardingState, OnboardingActions, FamilyContact } from '@/types/onboarding';

const ONBOARDING_STORAGE_KEY = 'onboarding_completed';
const FAMILY_CONTACTS_STORAGE_KEY = 'family_contacts';

const steps: OnboardingStep[] = [
  'welcome',
  'permissions', 
  'introduction',
  'family-setup',
  'notification-method',
  'family-contact',
  'complete'
];

export const useOnboardingState = (): OnboardingState & OnboardingActions => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isCompleted, setIsCompleted] = useState(
    localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
  );
  const [permissions, setPermissions] = useState({
    camera: false,
    notifications: false
  });
  const [familySetup, setFamilySetupState] = useState({
    enabled: false,
    method: null as 'line' | 'email' | null
  });
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([]);

  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      let nextIndex = currentIndex + 1;
      
      // Skip family-contact step if family setup is disabled or LINE is selected
      if (steps[nextIndex] === 'family-contact' && 
          (!familySetup.enabled || familySetup.method === 'line')) {
        nextIndex++;
      }
      
      setCurrentStep(steps[nextIndex]);
    }
  }, [currentStep, familySetup]);

  const previousStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      let prevIndex = currentIndex - 1;
      
      // Skip family-contact step when going back
      if (steps[prevIndex] === 'family-contact' && 
          (!familySetup.enabled || familySetup.method === 'line')) {
        prevIndex--;
      }
      
      setCurrentStep(steps[prevIndex]);
    }
  }, [currentStep, familySetup]);

  const setPermission = useCallback((type: 'camera' | 'notifications', granted: boolean) => {
    setPermissions(prev => ({ ...prev, [type]: granted }));
  }, []);

  const setFamilySetup = useCallback((enabled: boolean, method?: 'line' | 'email') => {
    setFamilySetupState({
      enabled,
      method: enabled ? method || null : null
    });
  }, []);

  const addFamilyContact = useCallback((contact: Omit<FamilyContact, 'id'>) => {
    const newContact: FamilyContact = {
      ...contact,
      id: Date.now().toString()
    };
    setFamilyContacts(prev => [...prev, newContact]);
  }, []);

  const completeOnboarding = useCallback(() => {
    // Save family contacts to localStorage
    if (familyContacts.length > 0) {
      localStorage.setItem(FAMILY_CONTACTS_STORAGE_KEY, JSON.stringify(familyContacts));
    }
    
    // Mark onboarding as completed
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setIsCompleted(true);
    setCurrentStep('complete');
  }, [familyContacts]);

  return {
    currentStep,
    isCompleted,
    permissions,
    familySetup,
    familyContacts,
    nextStep,
    previousStep,
    setPermission,
    setFamilySetup,
    addFamilyContact,
    completeOnboarding
  };
};

export const isFirstTimeUser = (): boolean => {
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) !== 'true';
};

export const getFamilyContacts = (): FamilyContact[] => {
  const stored = localStorage.getItem(FAMILY_CONTACTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};