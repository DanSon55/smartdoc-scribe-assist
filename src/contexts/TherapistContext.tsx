
import React, { createContext, useContext, useState } from 'react';
import { Therapist } from '@/types/therapist';

interface TherapistContextType {
  currentTherapist: Therapist | null;
  setCurrentTherapist: (therapist: Therapist | null) => void;
  updateTherapist: (data: Partial<Therapist>) => void;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTherapist, setCurrentTherapist] = useState<Therapist | null>(null);

  const updateTherapist = (data: Partial<Therapist>) => {
    if (!currentTherapist) return;
    
    setCurrentTherapist({
      ...currentTherapist,
      ...data
    });
    
    // Save to localStorage
    localStorage.setItem('therapist', JSON.stringify({
      ...currentTherapist,
      ...data
    }));
  };
  
  // Load therapist from localStorage on initial render
  React.useEffect(() => {
    const savedTherapist = localStorage.getItem('therapist');
    if (savedTherapist) {
      try {
        setCurrentTherapist(JSON.parse(savedTherapist));
      } catch (e) {
        console.error('Failed to parse therapist data', e);
      }
    }
  }, []);

  return (
    <TherapistContext.Provider value={{ currentTherapist, setCurrentTherapist, updateTherapist }}>
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};
