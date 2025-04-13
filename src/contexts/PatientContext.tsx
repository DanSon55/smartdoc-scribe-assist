
import React, { createContext, useState, useContext } from 'react';

// Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  status?: 'pending' | 'active' | 'invited';
  price?: number;
  isPaid?: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  status: 'scheduled' | 'active' | 'completed';
  complaints?: string[];
  anamnesis?: string[];
  diagnosis?: string[];
  recommendations?: string[];
}

interface TranscriptSegment {
  speaker: 'doctor' | 'patient';
  text: string;
  timestamp: number;
}

interface RecordingData {
  isRecording: boolean;
  duration: number;
  transcript: TranscriptSegment[];
}

export type UserType = 'doctor' | 'patient' | null;

interface PatientContextType {
  currentPatient: Patient | null;
  currentAppointment: Appointment | null;
  patients: Patient[];
  appointments: Appointment[];
  recordingData: RecordingData;
  userType: UserType;
  setCurrentPatient: (patient: Patient) => void;
  setCurrentAppointment: (appointment: Appointment) => void;
  setUserType: (type: UserType) => void;
  startRecording: () => void;
  stopRecording: () => void;
  generateReport: () => void;
  deletePatient: (patientId: string) => void;
  sendInvitation: (patientId: string, price?: number) => void;
  acceptInvitation: (patientId: string) => void;
  structuredData: {
    complaints: string[];
    anamnesis: string[];
    diagnosis: string[];
    recommendations: string[];
  }
}

// Default mock data
const mockPatients: Patient[] = [
  { id: '1', name: 'Иванов Иван Иванович', age: 45, gender: 'male', status: 'active' },
  { id: '2', name: 'Петрова Анна Сергеевна', age: 32, gender: 'female', status: 'pending', price: 2500 },
  { id: '3', name: 'Сидоров Павел Николаевич', age: 58, gender: 'male', status: 'invited' },
  { id: '4', name: 'Козлова Мария Александровна', age: 29, gender: 'female' },
  { id: '5', name: 'Новиков Алексей Петрович', age: 41, gender: 'male', status: 'pending' },
  { id: '6', name: 'Морозова Екатерина Ивановна', age: 36, gender: 'female', status: 'active', price: 3500, isPaid: true }
];

const mockAppointments: Appointment[] = [
  { 
    id: '101', 
    patientId: '1', 
    date: '2025-04-12T10:00:00', 
    status: 'scheduled',
  },
  { 
    id: '102', 
    patientId: '2', 
    date: '2025-04-12T11:30:00', 
    status: 'active',
  },
  { 
    id: '103', 
    patientId: '3', 
    date: '2025-04-12T14:15:00', 
    status: 'completed',
    complaints: ['Боль в животе', 'Тошнота'],
    anamnesis: ['Началось после еды', 'Длительность — 2 дня', 'Температуры нет'],
    diagnosis: ['Гастрит (K29.7)', 'Пищевое отравление (A05.9)'],
    recommendations: ['Щадящая диета', 'Сорбенты', 'Приём жидкости', 'Контроль симптомов']
  }
];

const defaultTranscript = [
  { speaker: 'doctor' as const, text: 'Здравствуйте, расскажите что вас беспокоит?', timestamp: 0 },
  { speaker: 'patient' as const, text: 'Доктор, у меня болит живот последние 2 дня, началось после еды. Тошнит, температуры нет...', timestamp: 5 },
  { speaker: 'doctor' as const, text: 'Где именно болит? Когда последний раз был стул и мочеиспускание?', timestamp: 15 },
  { speaker: 'patient' as const, text: 'Болит в правом подреберье. Стул был сегодня утром, нормальный. С мочеиспусканием проблем нет.', timestamp: 25 }
];

// Create context
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Provider component
export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [recordingData, setRecordingData] = useState<RecordingData>({
    isRecording: false,
    duration: 0,
    transcript: []
  });
  
  // Structured data (simulated NLP results)
  const [structuredData, setStructuredData] = useState({
    complaints: ['Боль в животе', 'Тошнота'],
    anamnesis: ['Началось после еды', 'Длительность — 2 дня', 'Температуры нет', 'Боли в правом подреберье'],
    diagnosis: ['Гастрит (K29.7)', 'Пищевое отравление (A05.9)'],
    recommendations: ['Щадящая диета', 'Сорбенты', 'Приём жидкости', 'Контроль симптомов', 'ОАК', 'ОАМ', 'УЗИ брюшной полости']
  });

  // Delete patient function
  const deletePatient = (patientId: string) => {
    setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
    
    // If current patient is being deleted, reset current patient
    if (currentPatient?.id === patientId) {
      setCurrentPatient(null);
    }
  };
  
  // Send invitation function
  const sendInvitation = (patientId: string, price?: number) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: 'pending', price: price || 0 } 
          : patient
      )
    );
  };
  
  // Accept invitation function
  const acceptInvitation = (patientId: string) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: 'active' } 
          : patient
      )
    );
  };

  // Mock recording functions
  const startRecording = () => {
    setRecordingData({
      isRecording: true,
      duration: 0,
      transcript: []
    });
    
    // Simulate incrementing duration
    const timer = setInterval(() => {
      setRecordingData(prev => ({
        ...prev,
        duration: prev.duration + 1
      }));
    }, 1000);
    
    // After a few seconds, populate with mock transcript
    setTimeout(() => {
      setRecordingData(prev => ({
        ...prev,
        transcript: defaultTranscript
      }));
      clearInterval(timer);
    }, 5000);
  };

  const stopRecording = () => {
    setRecordingData(prev => ({
      ...prev,
      isRecording: false
    }));
  };

  // Generate report function
  const generateReport = () => {
    if (currentPatient && currentAppointment) {
      const updatedAppointment = {
        ...currentAppointment,
        status: 'completed' as const,
        complaints: structuredData.complaints,
        anamnesis: structuredData.anamnesis,
        diagnosis: structuredData.diagnosis,
        recommendations: structuredData.recommendations
      };
      
      setCurrentAppointment(updatedAppointment);
    }
  };

  // Load user type from localStorage on initial render
  React.useEffect(() => {
    const savedUserType = localStorage.getItem('userType');
    if (savedUserType === 'doctor' || savedUserType === 'patient') {
      setUserType(savedUserType);
    }
  }, []);

  // Create context value
  const contextValue: PatientContextType = {
    currentPatient,
    currentAppointment,
    patients,
    appointments,
    recordingData,
    userType,
    setCurrentPatient,
    setCurrentAppointment,
    setUserType,
    startRecording,
    stopRecording,
    generateReport,
    deletePatient,
    sendInvitation,
    acceptInvitation,
    structuredData
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
};

// Custom hook for using the context
export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
