
export interface Therapist {
  id: string;
  name: string;
  email: string;
  specialty: string;
  bio: string;
  avatarUrl: string;
  phone?: string;
  experience?: number;
}

export interface TherapistFormData {
  name: string;
  specialty: string;
  bio: string;
  phone?: string;
  experience?: number;
}
