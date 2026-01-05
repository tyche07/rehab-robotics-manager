import { z } from 'genkit';

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


// Schema for AI-generated reports

const PatientInfoSchema = z.object({
  name: z.string(),
  age: z.number(),
  condition: z.string(),
  therapyGoals: z.array(z.string()),
});

const SessionDataSchema = z.object({
  time: z.number(),
  rangeOfMotion: z.number(),
  robotResistance: z.number(),
  muscleLoad: z.number(),
});

const SessionInfoSchema = z.object({
  id: z.string(),
  date: z.string(),
  duration: z.number(),
  notes: z.string(),
  data: z.array(SessionDataSchema),
});

export const GenerateReportInputSchema = z.object({
  patient: PatientInfoSchema,
  sessions: z.array(SessionInfoSchema),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const ProcessedSessionInfoSchema = SessionInfoSchema.extend({
  peakRangeOfMotion: z.number(),
  peakRobotResistance: z.number(),
});

export const ProcessedGenerateReportInputSchema = z.object({
  patient: PatientInfoSchema,
  sessions: z.array(ProcessedSessionInfoSchema),
});


export const GenerateReportOutputSchema = z.object({
  executiveSummary: z.string().describe("A high-level summary of the patient's progress, condition, and therapy engagement. Should be 2-3 sentences."),
  progressAnalysis: z.string().describe("A detailed analysis of the patient's progress over the provided sessions. Comment on trends in range of motion, resistance tolerance, and muscleLoad. Identify areas of improvement and plateaus."),
  futureRecommendations: z.string().describe("Provide concrete recommendations for future therapy sessions. Suggest adjustments to goals, exercises, or robot parameters. Mention any potential areas to monitor closely."),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;
