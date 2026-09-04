import { TreatmentStep } from '../types';

export const treatmentJourneySteps: TreatmentStep[] = [
  {
    stepNumber: 1,
    title: 'Initial Consultation',
    subtitle: 'Understand Your Condition and Options',
    description: '• focused initial discussion with Healer Abdul Mallik to review your pain history, examine relevant MRI/X-ray reports, and assess if Holistic Edge’s modalities are right for you.',
    details: [
      'Detailed discussion of pain triggers and daily limitations',
      'Initial spine, posture, and kinetic chain mobility screening',
      'Clear, honest guidance on whether conservative care is recommended'
    ],
    icon: 'MessageSquare'
  },
  {
    stepNumber: 2,
    title: 'Comprehensive Assessment',
    subtitle: 'Identifying the Root Biomechanical Dysfunction',
    description: 'In-depth physical palpation, orthopedic range-of-motion testing, and postural analysis to pinpoint the exact subluxations, fascial restrictions, or nerve compressions causing your symptoms.',
    details: [
      'Segmental spinal palpation and facet joint mobility check',
      'Neurological reflex & dermatome testing for radiating symptoms',
      'Postural asymmetry and leg-length discrepancy measurements'
    ],
    icon: 'Search'
  },
  {
    stepNumber: 3,
    title: 'Personalized Treatment Plan',
    subtitle: 'Tailored to Your Body & Lifestyle',
    description: 'We construct a customized care pathway mapping the exact sequence of Chiropractic Adjustments, Cupping, Acupuncture, or the A.M.M Method necessary for your recovery.',
    details: [
      'Transparent outline of recommended session phases',
      'Integration of synergistic modalities based on comfort',
      'Realistic timeline and milestone checkpoints'
    ],
    icon: 'FileText'
  },
  {
    stepNumber: 4,
    title: 'Active Treatment Sessions',
    subtitle: 'Gentle, Progressive Clinical Care',
    description: 'Hands-on clinical sessions in our calm, sanitized therapy suites in Mehdipatnam, systematically restoring alignment, freeing restricted tissue, and reducing pain.',
    details: [
      'Safe, controlled adjustments by Healer Abdul Mallik',
      'Myofascial decompression & targeted acupoint stimulation',
      'Immediate post-session mobility and relief assessment'
    ],
    icon: 'Activity'
  },
  {
    stepNumber: 5,
    title: 'Ongoing Stabilization & Support',
    subtitle: 'Long-Term Durability & Relapse Prevention',
    description: 'Stage 3 of the A.M.M Method: core stabilization exercises, ergonomic workspace recalibration, and preventive guidance so you remain active and pain-free.',
    details: [
      'Tailored home exercise and stretching program',
      'Ergonomic coaching for desk setup, driving, and sleep posture',
      'Periodic wellness checkups for lifelong spinal health'
    ],
    icon: 'ShieldCheck'
  }
];
