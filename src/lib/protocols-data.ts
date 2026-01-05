
export type ProtocolPhase = {
  weeks: string;
  phaseName: string;
  rom: string;
  resistance: string;
  reps: string;
};

export type Protocol = {
  id: string;
  name: string;
  condition: string;
  bodyPart: string;
  duration: string;
  difficulty: string;
  isAiAdaptive: boolean;
  safetyLevel: 'Low' | 'Medium' | 'High';
  createdBy: string;
  lastUpdated: string;
  timeline: ProtocolPhase[];
};

export const mockProtocols: Protocol[] = [
  {
    id: 'p1',
    name: 'Stroke_UL_v3',
    condition: 'Post-Stroke Hemiparesis',
    bodyPart: 'Upper Limb',
    duration: '6 Weeks',
    difficulty: 'Progressive',
    isAiAdaptive: true,
    safetyLevel: 'High',
    createdBy: 'Dr. Rao',
    lastUpdated: '2024-01-12',
    timeline: [
      {
        weeks: '1–2',
        phaseName: 'Passive Mobilization',
        rom: '20°–60°',
        resistance: 'Low',
        reps: '10 × 3 sets',
      },
      {
        weeks: '3–4',
        phaseName: 'Assisted Active',
        rom: '30°–90°',
        resistance: 'Medium',
        reps: '12 × 3 sets',
      },
      {
        weeks: '5–6',
        phaseName: 'Active Resistance',
        rom: '45°–120°',
        resistance: 'Adaptive',
        reps: 'AI Optimized',
      },
    ],
  },
  {
    id: 'p2',
    name: 'Ortho_Knee_ACL_v2',
    condition: 'ACL Reconstruction',
    bodyPart: 'Knee',
    duration: '12 Weeks',
    difficulty: 'Progressive',
    isAiAdaptive: true,
    safetyLevel: 'High',
    createdBy: 'Dr. Chen',
    lastUpdated: '2024-03-22',
    timeline: [
      {
        weeks: '1–4',
        phaseName: 'Early Mobilization & Healing',
        rom: '0°–90°',
        resistance: 'Minimal (Passive)',
        reps: '15 × 2 sets',
      },
      {
        weeks: '5–8',
        phaseName: 'Strength Building',
        rom: '0°–120°',
        resistance: 'Low to Medium',
        reps: '10 × 3 sets',
      },
      {
        weeks: '9–12',
        phaseName: 'Functional Return',
        rom: 'Full',
        resistance: 'Medium to High',
        reps: 'AI Optimized',
      },
    ],
  },
  {
    id: 'p3',
    name: 'SCI_Gait_Training_v1',
    condition: 'Spinal Cord Injury (Incomplete)',
    bodyPart: 'Lower Limb',
    duration: '16 Weeks',
    difficulty: 'Adaptive',
    isAiAdaptive: true,
    safetyLevel: 'High',
    createdBy: 'Dr. Mehta',
    lastUpdated: '2024-05-10',
    timeline: [
      {
        weeks: '1-4',
        phaseName: 'Weight Bearing Acclimation',
        rom: 'Assisted Steps',
        resistance: 'None (Bodyweight)',
        reps: '5-10 min sessions'
      },
      {
        weeks: '5-10',
        phaseName: 'Gait Pattern Development',
        rom: 'Guided Trajectory',
        resistance: 'Low Assist/Resist',
        reps: '15-20 min sessions'
      },
      {
        weeks: '11-16',
        phaseName: 'Endurance & Correction',
        rom: 'Variable Trajectory',
        resistance: 'Adaptive AI',
        reps: 'Up to 30 min'
      }
    ]
  }
];
