import type { Patient } from './types';

export const patients: Omit<Patient, 'id'>[] = [
  {
    name: 'John Doe',
    age: 58,
    condition: 'Post-Stroke Hemiparesis',
    medicalHistory: 'History of hypertension and a cerebrovascular accident (CVA) 3 months ago, resulting in right-sided weakness.',
    therapyGoals: [
      'Improve active range of motion in the right shoulder and elbow.',
      'Increase muscle strength in the right arm.',
      'Enhance coordination for activities of daily living (ADLs).',
    ],
    sessions: [
      {
        id: 's001',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        notes: 'Patient showed good effort but fatigued quickly. Focus on endurance next session.',
        data: [
          { time: 5, rangeOfMotion: 30, robotResistance: 10, muscleLoad: 15 },
          { time: 10, rangeOfMotion: 35, robotResistance: 12, muscleLoad: 20 },
          { time: 15, rangeOfMotion: 40, robotResistance: 15, muscleLoad: 25 },
          { time: 20, rangeOfMotion: 38, robotResistance: 15, muscleLoad: 22 },
          { time: 25, rangeOfMotion: 35, robotResistance: 12, muscleLoad: 18 },
        ],
      },
      {
        id: 's002',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        notes: 'Improved endurance this session. Patient was able to maintain higher resistance for longer.',
        data: [
          { time: 5, rangeOfMotion: 35, robotResistance: 15, muscleLoad: 20 },
          { time: 10, rangeOfMotion: 42, robotResistance: 18, muscleLoad: 28 },
          { time: 15, rangeOfMotion: 45, robotResistance: 20, muscleLoad: 35 },
          { time: 20, rangeOfMotion: 48, robotResistance: 20, muscleLoad: 33 },
          { time: 25, rangeOfMotion: 45, robotResistance: 18, muscleLoad: 29 },
        ],
      },
    ],
  },
  {
    name: 'Jane Smith',
    age: 45,
    condition: 'Rotator Cuff Tear (Post-operative)',
    medicalHistory: 'Sustained a rotator cuff injury during a sports activity. Underwent arthroscopic surgery 6 weeks ago.',
    therapyGoals: [
      'Regain full passive range of motion.',
      'Strengthen rotator cuff and surrounding musculature.',
      'Return to pain-free overhead activities.',
    ],
    sessions: [
       {
        id: 's003',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        notes: 'Initial session focused on passive range of motion and pain management.',
        data: [
          { time: 10, rangeOfMotion: 60, robotResistance: 5, muscleLoad: 8 },
          { time: 20, rangeOfMotion: 65, robotResistance: 5, muscleLoad: 10 },
          { time: 30, rangeOfMotion: 70, robotResistance: 7, muscleLoad: 12 },
          { time: 40, rangeOfMotion: 68, robotResistance: 7, muscleLoad: 11 },
        ],
      },
       {
        id: 's004',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        notes: 'Good progress in range of motion. Introduced light strengthening exercises.',
        data: [
          { time: 10, rangeOfMotion: 75, robotResistance: 8, muscleLoad: 15 },
          { time: 20, rangeOfMotion: 80, robotResistance: 10, muscleLoad: 20 },
          { time: 30, rangeOfMotion: 85, robotResistance: 10, muscleLoad: 22 },
          { time: 40, rangeOfMotion: 82, robotResistance: 8, muscleLoad: 18 },
        ],
      },
    ],
  },
   {
    name: 'Samuel Green',
    age: 67,
    condition: 'Arthritis in Knee',
    medicalHistory: 'Long-standing osteoarthritis in the left knee, managing with conservative treatment.',
    therapyGoals: [
      'Increase joint mobility and reduce stiffness.',
      'Strengthen quadriceps and hamstrings to support the knee.',
      'Improve walking gait and balance.',
    ],
    sessions: [
       {
        id: 's005',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 25,
        notes: 'Patient reports less pain after the session. Focus on controlled movements.',
        data: [
          { time: 5, rangeOfMotion: 80, robotResistance: 10, muscleLoad: 12 },
          { time: 10, rangeOfMotion: 85, robotResistance: 12, muscleLoad: 15 },
          { time: 15, rangeOfMotion: 90, robotResistance: 12, muscleLoad: 18 },
          { time: 20, rangeOfMotion: 88, robotResistance: 10, muscleLoad: 16 },
        ],
      },
    ],
  },
];
