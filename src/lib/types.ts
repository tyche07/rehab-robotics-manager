export interface Biometrics {
  heartRate: number;
  muscleLoad: number;
  rangeOfMotion: number;
}

export interface Session {
  id: string;
  date: string;
  duration: number; // in minutes
  notes: string;
  data: {
    time: number; // minutes into session
    rangeOfMotion: number;
    robotResistance: number;
    muscleLoad: number;
  }[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  medicalHistory: string;
  therapyGoals: string[];
  avatarUrl: string;
  dataAiHint: string;
  sessions: Session[];
}
