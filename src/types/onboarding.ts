export type OnboardingStep = 
  | 'welcome' 
  | 'permissions' 
  | 'introduction' 
  | 'family-setup' 
  | 'notification-method'
  | 'family-contact'
  | 'line-contacts'
  | 'complete';

export interface OnboardingState {
  currentStep: OnboardingStep;
  isCompleted: boolean;
  permissions: {
    camera: boolean;
    notifications: boolean;
  };
  familySetup: {
    enabled: boolean;
    method: 'line' | 'email' | null;
  };
  familyContacts: FamilyContact[];
  lineContacts: FamilyContact[];
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  preferredMethod: 'email' | 'sms' | 'both';
}

export interface OnboardingActions {
  nextStep: () => void;
  previousStep: () => void;
  setPermission: (type: 'camera' | 'notifications', granted: boolean) => void;
  setFamilySetup: (enabled: boolean, method?: 'line' | 'email') => void;
  addFamilyContact: (contact: Omit<FamilyContact, 'id'>) => void;
  addLineContact: (contact: Omit<FamilyContact, 'id'>) => void;
  completeOnboarding: () => void;
}