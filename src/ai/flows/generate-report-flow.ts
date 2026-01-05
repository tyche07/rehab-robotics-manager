'use server';

/**
 * @fileOverview An AI agent that generates a comprehensive therapy progress report.
 *
 * - generateTherapyReport - A function that handles the report generation process.
 * - GenerateReportInput - The input type for the generateTherapyReport function.
 * - GenerateReportOutput - The return type for the generateTherapyReport function.
 */

import { ai } from '@/ai/genkit';
import {
    GenerateReportInputSchema,
    GenerateReportOutputSchema,
    type GenerateReportInput,
    ProcessedGenerateReportInputSchema
} from '@/lib/types';


export type { GenerateReportInput, GenerateReportOutput } from '@/lib/types';


export async function generateTherapyReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}


const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: { schema: ProcessedGenerateReportInputSchema },
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
    - Peak Range of Motion: {{peakRangeOfMotion}}°
    - Peak Robot Resistance: {{peakRobotResistance}}%
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
    // Pre-process the session data to calculate max values before sending to the prompt.
    const processedSessions = input.sessions.map(session => ({
        ...session,
        peakRangeOfMotion: Math.max(0, ...session.data.map(d => d.rangeOfMotion)),
        peakRobotResistance: Math.max(0, ...session.data.map(d => d.robotResistance)),
    }));

    const processedInput = {
        patient: input.patient,
        sessions: processedSessions,
    }

    const { output } = await generateReportPrompt(processedInput);
    return output!;
  }
);
