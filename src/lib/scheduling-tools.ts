import { z } from 'zod';
import {
  parse,
  isWithinInterval,
  eachMinuteOfInterval,
  addMinutes,
  isBefore,
  isEqual,
  format,
} from 'date-fns';
import type { ScheduleOptimizerInput, Availability } from './types';


export const FindAvailableSlotsSchema = z.object({
  patientAvailability: z.array(z.any()),
  therapistAvailability: z.array(z.any()),
  robotAvailability: z.array(z.any()),
  existingAppointments: z.array(z.any()),
  sessionDuration: z.number().describe("The desired duration of the therapy session in minutes."),
  dateRange: z.object({
    start: z.string().describe("The start date for the search range in ISO format."),
    end: z.string().describe("The end date for the search range in ISO format."),
  }),
});

type Slot = { date: string; startTime: string; endTime: string };

export function findAvailableSlots(
  input: z.infer<typeof FindAvailableSlotsSchema>
): Slot[] {
  const {
    patientAvailability,
    therapistAvailability,
    robotAvailability,
    existingAppointments,
    sessionDuration,
    dateRange,
  } = input;

  const availableSlots: Slot[] = [];

  const searchInterval = {
    start: new Date(dateRange.start),
    end: new Date(dateRange.end),
  };

  const timeStringToDate = (timeStr: string, date: Date): Date => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };
  
  const availabilityToIntervals = (avail: Availability[], date: Date) => {
    return avail.map(a => ({
        start: timeStringToDate(a.startTime, date),
        end: timeStringToDate(a.endTime, date),
    }));
  };

  const allAppointments = existingAppointments.map(apt => ({
      start: timeStringToDate(apt.time, new Date(apt.date)),
      end: addMinutes(timeStringToDate(apt.time, new Date(apt.date)), apt.duration || 60)
  }));


  for (let day = searchInterval.start; isBefore(day, searchInterval.end) || isEqual(day, searchInterval.end); day.setDate(day.getDate() + 1)) {
    
    const dayOfWeek = format(day, 'EEEE');
    
    const patientIntervals = availabilityToIntervals(patientAvailability.filter(a => a.day === 'Any' || a.day === dayOfWeek), day);
    const therapistIntervals = availabilityToIntervals(therapistAvailability.filter(a => a.day === 'Any' || a.day === dayOfWeek), day);
    const robotIntervals = availabilityToIntervals(robotAvailability.filter(a => a.day === 'Any' || a.day === dayOfWeek), day);

    const checkAvailability = (time: Date) => {
      return patientIntervals.some(i => isWithinInterval(time, i)) &&
             therapistIntervals.some(i => isWithinInterval(time, i)) &&
             robotIntervals.some(i => isWithinInterval(time, i));
    };

    const combinedIntervals = [...patientIntervals, ...therapistIntervals, ...robotIntervals];
    if (combinedIntervals.length === 0) continue;

    const overallStart = new Date(Math.max(...combinedIntervals.map(i => i.start.getTime())));
    const overallEnd = new Date(Math.min(...combinedIntervals.map(i => i.end.getTime())));

    if (isBefore(overallEnd, overallStart)) continue;

    const potentialSlots = eachMinuteOfInterval({ start: overallStart, end: overallEnd }, { step: 15 });

    for (const slotStart of potentialSlots) {
        const slotEnd = addMinutes(slotStart, sessionDuration);

        if(!checkAvailability(slotStart) || !checkAvailability(addMinutes(slotEnd, -1))) continue;
        if(isAfter(slotEnd, overallEnd)) continue;


        const conflict = allAppointments.some(apt => 
            (isBefore(slotStart, apt.end) && isAfter(slotEnd, apt.start)) ||
            isEqual(slotStart, apt.start)
        );

        if (!conflict) {
            availableSlots.push({
                date: slotStart.toISOString().split('T')[0],
                startTime: format(slotStart, 'hh:mm a'),
                endTime: format(slotEnd, 'hh:mm a'),
            });
        }
    }
  }

  // Deduplicate slots
  const uniqueSlots = Array.from(new Set(availableSlots.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));

  return uniqueSlots;
}

function isAfter(date: Date | number, dateToCompare: Date | number): boolean {
    return new Date(date) > new Date(dateToCompare);
}

// This function provides mock data for the AI scheduler.
export function getSchedulingData(): ScheduleOptimizerInput {
    const today = new Date();
    const nextWeek = addDays(today, 7);
  return {
    patientAvailability: [
        { patientId: 'John Doe', day: 'Monday', startTime: '09:00 AM', endTime: '12:00 PM' },
        { patientId: 'John Doe', day: 'Wednesday', startTime: '09:00 AM', endTime: '12:00 PM' },
        { patientId: 'Jane Smith', day: 'Any', startTime: '10:00 AM', endTime: '04:00 PM' },
    ],
    therapistAvailability: [
        { therapistId: 'Dr. Roberts', day: 'Any', startTime: '08:00 AM', endTime: '05:00 PM'},
    ],
    robotAvailability: [
        { robotId: 'Robot-Arm-01', day: 'Any', startTime: '08:00 AM', endTime: '06:00 PM'},
    ],
    existingAppointments: [
        { patientName: 'Emily Brown', date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '01:00 PM', duration: 60, therapistId: 'Dr. Roberts' },
        { patientName: 'Samuel Green', date: format(addDays(today, 2), 'yyyy-MM-dd'), time: '02:00 PM', duration: 30, therapistId: 'Dr. Roberts' },
    ],
    schedulingGoal: 'Schedule two 45-minute sessions for John Doe and one 60-minute session for Jane Smith for the upcoming week.',
    constraints: [
        'All sessions must be scheduled between 8 AM and 5 PM.',
        'John Doe\'s sessions must have at least one day between them to allow for recovery.',
        'Jane Smith prefers her sessions to be in the afternoon if possible.',
        'Each session requires one therapist and one robot.',
        'Avoid booking back-to-back sessions for the same therapist without a 15-minute break.'
    ],
    dateRange: {
        start: today.toISOString(),
        end: nextWeek.toISOString(),
    }
  }
}
