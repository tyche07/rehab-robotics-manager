import { z } from 'genkit';

export interface Biometrics {
  heartRate: number;
  muscleLoad: number;
  rangeOfMotion: number;
}

export interface SessionDataPoint {
    time: number;
    heartRate: number;
    muscleLoad: number;
    rangeOfMotion: number;
    robotResistance: number;
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
    heartRate: number;
  }[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  medicalHistory: string;
  therapyGoals: string[];
  sessions: Session[];
}

// Omit 'id' for creating new patients, as Firestore will generate it.
export type NewPatient = Omit<Patient, 'id'>;


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
  heartRate: z.number(),
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

// Schemas for AI Scheduler

const AvailabilitySchema = z.object({
  day: z.string().describe('Day of the week (e.g., "Monday") or "Any".'),
  startTime: z.string().describe('Start time in HH:MM AM/PM format.'),
  endTime: z.string().describe('End time in HH:MM AM/PM format.'),
});
export type Availability = z.infer<typeof AvailabilitySchema>;


const ExistingAppointmentSchema = z.object({
    patientName: z.string(),
    date: z.string().describe("Date of the appointment in 'yyyy-MM-dd' format."),
    time: z.string().describe("Start time of the appointment in 'hh:mm AM/PM' format."),
    duration: z.number().describe("Duration of the appointment in minutes."),
    therapistId: z.string(),
});

export const ScheduleOptimizerInputSchema = z.object({
  patientAvailability: z.array(z.any()),
  therapistAvailability: z.array(z.any()),
  robotAvailability: z.array(z.any()),
  existingAppointments: z.array(ExistingAppointmentSchema),
  schedulingGoal: z.string().describe('A high-level goal for the scheduler to achieve.'),
  constraints: z.array(z.string()).describe('A list of hard rules and constraints the schedule must follow.'),
  dateRange: z.object({
    start: z.string().describe("The start date for the search range in ISO format."),
    end: z.string().describe("The end date for the search range in ISO format."),
  }),
});
export type ScheduleOptimizerInput = z.infer<typeof ScheduleOptimizerInputSchema>;


const SuggestedSlotSchema = z.object({
    patientName: z.string().describe("The name of the patient for the appointment."),
    date: z.string().describe("The suggested date for the appointment in 'yyyy-MM-dd' format."),
    startTime: z.string().describe("The suggested start time in 'hh:mm AM/PM' format."),
    endTime: z.string().describe("The suggested end time in 'hh:mm AM/PM' format."),
    therapistId: z.string().describe("The ID of the assigned therapist."),
    robotId: z.string().describe("The ID of the assigned robot."),
});

export const ScheduleOptimizerOutputSchema = z.object({
    suggestedSlots: z.array(SuggestedSlotSchema).describe("An array of optimized appointment slots."),
    justification: z.string().describe("A brief explanation of why this schedule is optimal and how it respects the provided constraints.")
});
export type ScheduleOptimizerOutput = z.infer<typeof ScheduleOptimizerOutputSchema>;
