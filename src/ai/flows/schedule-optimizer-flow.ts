'use server';

/**
 * @fileoverview An AI agent that optimizes and generates conflict-free therapy schedules.
 *
 * - optimizeSchedule - A function that handles the schedule optimization process.
 * - ScheduleOptimizerInput - The input type for the optimizeSchedule function.
 * - ScheduleOptimizerOutput - The return type for the optimizeSchedule function.
 */

import { ai } from '@/ai/genkit';
import {
  ScheduleOptimizerInputSchema,
  ScheduleOptimizerOutputSchema,
  type ScheduleOptimizerInput,
  type ScheduleOptimizerOutput,
} from '@/lib/types';
import { z } from 'zod';
import {
  findAvailableSlots,
  FindAvailableSlotsSchema,
} from '@/lib/scheduling-tools';

// Define the tool for finding available slots. The AI will learn to call this.
const findSlotsTool = ai.defineTool(
  {
    name: 'find_available_slots',
    description:
      'Finds available time slots based on patient, therapist, and robot availability, excluding existing appointments.',
    inputSchema: FindAvailableSlotsSchema,
    outputSchema: z.array(z.object({
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
    })),
  },
  async (input) => findAvailableSlots(input)
);

const scheduleOptimizerPrompt = ai.definePrompt({
  name: 'scheduleOptimizerPrompt',
  input: { schema: ScheduleOptimizerInputSchema },
  output: { schema: ScheduleOptimizerOutputSchema },
  tools: [findSlotsTool],
  prompt: `You are an expert scheduling AI for a rehabilitation clinic. Your task is to generate an optimized, conflict-free schedule for the upcoming week based on provided availability and constraints.

  **Inputs:**
  - Patient Availability: {{JSON.stringify patientAvailability}}
  - Therapist Availability: {{JSON.stringify therapistAvailability}}
  - Robot Availability: {{JSON.stringify robotAvailability}}
  - Existing Appointments: {{JSON.stringify existingAppointments}}
  - Scheduling Goal: {{schedulingGoal}}
  - Constraints & Rules:
    {{#each constraints}}
    - {{this}}
    {{/each}}

  **Your Process:**
  1.  First, call the \`find_available_slots\` tool to get a list of all potential time slots that satisfy the availability of the patient, therapist, and robot, while avoiding existing appointment times.
  2.  From the list of available slots returned by the tool, select the best slots to create a suggested schedule that meets the 'schedulingGoal'.
  3.  When selecting slots, you MUST strictly adhere to all 'Constraints & Rules'.
  4.  Provide a clear 'justification' for why the suggested schedule is optimal, explaining how it respects the key constraints.

  Generate the final output in the specified JSON format.`,
});

export async function optimizeSchedule(
  input: ScheduleOptimizerInput
): Promise<ScheduleOptimizerOutput> {
  const { output } = await scheduleOptimizerPrompt(input);
  return output!;
}
