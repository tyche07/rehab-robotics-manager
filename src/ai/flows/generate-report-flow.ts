'use server';

/**
 * @fileOverview An AI agent that generates a comprehensive therapy progress report.
 *
 * - generateTherapyReport - A function that handles the report generation process.
 * - GenerateReportInput - The input type for the generateTherapyReport function.
 * - GenerateReportOutput - The return type for the generateTherapyReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Patient, Session } from '@/lib/types';

// We can't pass the full patient object because of circular references with session data.
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


export const GenerateReportOutputSchema = z.object({
  executiveSummary: z.string().describe("A high-level summary of the patient's progress, condition, and therapy engagement. Should be 2-3 sentences."),
  progressAnalysis: z.string().describe("A detailed analysis of the patient's progress over the provided sessions. Comment on trends in range of motion, resistance tolerance, and muscle load. Identify areas of improvement and plateaus."),
  futureRecommendations: z.string().describe("Provide concrete recommendations for future therapy sessions. Suggest adjustments to goals, exercises, or robot parameters. Mention any potential areas to monitor closely."),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;


export async function generateTherapyReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}


const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: { schema: GenerateReportInputSchema },
  output: { schema: GenerateReportOutputSchema },
  prompt: `You are an expert physical therapist AI assistant creating a progress report.

  Analyze the provided patient information and session data to generate a comprehensive therapy progress report. The report should be professional, insightful, and actionable for a human therapist.

  Patient Information:
  - Name: {{patient.name}}
  - Age: {{patient.age}}
  - Condition: {{patient.condition}}
  - Therapy Goals:
  {{#each patient.therapyGoals}}
  - {{this}}
  {{/each}}

  Session History:
  {{#each sessions}}
  - Session on {{date}}:
    - Duration: {{duration}} minutes
    - Therapist Notes: "{{notes}}"
    - Peak Range of Motion: {{Math.max(...data.map(d => d.rangeOfMotion))}}°
    - Peak Robot Resistance: {{Math.max(...data.map(d => d.robotResistance))}}%
  {{/each}}

  Based on all this information, generate the report with an executive summary, a detailed progress analysis, and future recommendations. Be specific and use the data to back up your analysis.

  Output:
  {{outputSchema}}
  `,
});


const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    const { output } = await generateReportPrompt(input);
    return output!;
  }
);
