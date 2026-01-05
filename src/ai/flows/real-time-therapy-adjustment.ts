'use server';

/**
 * @fileOverview An AI agent that dynamically adjusts therapy parameters based on real-time patient data and safety metrics.
 *
 * - adjustTherapyParameters - A function that handles the adjustment of therapy parameters.
 * - TherapyParametersInput - The input type for the adjustTherapyParameters function.
 * - TherapyParametersOutput - The return type for the adjustTherapyParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TherapyParametersInputSchema = z.object({
  heartRate: z.number().describe('The patient\'s heart rate in beats per minute.'),
  muscleLoad: z.number().describe('The load on the patient\'s muscles during therapy, as a percentage.'),
  rangeOfMotion: z.number().describe('The current range of motion achieved by the patient in degrees.'),
  robotResistance: z.number().describe('The current resistance level of the robot, as a percentage.'),
  sessionStage: z.string().describe('The current stage of the therapy session (e.g., warm-up, active, cool-down).'),
  therapistNotes: z.string().optional().describe('Optional notes from the therapist about the patient\'s condition.'),
});
export type TherapyParametersInput = z.infer<typeof TherapyParametersInputSchema>;

const TherapyParametersOutputSchema = z.object({
  adjustedRobotResistance: z
    .number()
    .describe(
      'The adjusted resistance level of the robot, as a percentage. Should be within a safe and effective range.'
    ),
  adjustedRangeOfMotion: z
    .number()
    .describe(
      'The adjusted target range of motion for the patient in degrees.  Should be within a safe and effective range.'
    ),
  recommendation: z
    .string()
    .describe(
      'A recommendation for the therapist, including justification for the adjustments and any safety considerations.'
    ),
});
export type TherapyParametersOutput = z.infer<typeof TherapyParametersOutputSchema>;

export async function adjustTherapyParameters(
  input: TherapyParametersInput
): Promise<TherapyParametersOutput> {
  return adjustTherapyParametersFlow(input);
}

const adjustTherapyParametersPrompt = ai.definePrompt({
  name: 'adjustTherapyParametersPrompt',
  input: {schema: TherapyParametersInputSchema},
  output: {schema: TherapyParametersOutputSchema},
  prompt: `You are an AI assistant that helps physical therapists optimize rehabilitation sessions.

  Based on the patient's real-time data and the therapist's notes, recommend adjustments to the robot's resistance and the target range of motion.

  Patient Data:
  - Heart Rate: {{heartRate}} bpm
  - Muscle Load: {{muscleLoad}}%
  - Range of Motion: {{rangeOfMotion}} degrees
  - Robot Resistance: {{robotResistance}}%
  - Session Stage: {{sessionStage}}
  {{#if therapistNotes}}
  - Therapist Notes: {{therapistNotes}}
  {{/if}}

  Consider the following safety guidelines:
  - Avoid sudden increases in resistance or range of motion.
  - Monitor the patient's heart rate and muscle load to prevent overexertion.
  - Adjust parameters gradually based on the patient's progress and comfort level.

  Provide a recommendation for the therapist, including justification for the adjustments and any safety considerations.

  Output:
  {{outputSchema}}
  `,
});

const adjustTherapyParametersFlow = ai.defineFlow(
  {
    name: 'adjustTherapyParametersFlow',
    inputSchema: TherapyParametersInputSchema,
    outputSchema: TherapyParametersOutputSchema,
  },
  async input => {
    const {output} = await adjustTherapyParametersPrompt(input);
    return output!;
  }
);
