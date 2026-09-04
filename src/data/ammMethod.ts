import { AmmStage } from '../types';

export const ammMethodStages: AmmStage[] = [
  {
    stepNumber: 1,
    code: 'A',
    name: 'Adjustment',
    shortName: 'Structural Realignment',
    tagline: 'Correcting the Foundation & Removing Nerve Interference',
    description: 'Precision spinal and joint adjustments to realign subluxated vertebrae, relieve direct pressure on compressed nerve roots, and restore natural biomechanical balance to the spine.',
    clinicalPurpose: 'Restores proper spinal joint position and clears neurological impingement so the body can initiate its self-healing cascade.',
    modalities: [
      'Specific chiropractic spinal adjustments',
      'Pelvic & sacroiliac joint rebalancing',
      'Cervical & lumbar facet decompression',
      'Extremity joint alignment (shoulders, knees, ankles)'
    ],
    patientFeeling: '• sense of instant lightness, reduced local tension, and uninhibited movement.',
    icon: 'Activity'
  },
  {
    stepNumber: 2,
    code: 'M',
    name: 'Mobilization',
    shortName: 'Fascial & Soft Tissue Release',
    tagline: 'Decompressing Fascia & Enhancing Blood Microcirculation',
    description: 'Targeted soft tissue release, therapeutic cupping, and clinical acupuncture to break down painful fibrous adhesions, clear metabolic waste, and hydrate stiff joint capsules.',
    clinicalPurpose: 'Prepares the muscular and fascial environment around the newly aligned joints, ensuring joints do not immediately get pulled back out of alignment by tense muscles.',
    modalities: [
      'Negative-pressure cupping therapy',
      'Clinical neuro-fascial acupuncture',
      'Passive & active joint articulation',
      'Deep myofascial trigger-point release'
    ],
    patientFeeling: 'Deep warmth, muscular relaxation, and unrestricted range of motion without stiffness.',
    icon: 'Zap'
  },
  {
    stepNumber: 3,
    code: 'M2',
    name: 'Muscle Strengthening',
    shortName: 'Stabilization & Relapse Prevention',
    tagline: 'Securing Long-Term Stability & Lasting Relief',
    description: 'Individualized rehabilitation exercises targeting deep postural stabilizers, multifidus, and core muscles to protect the corrected alignment and prevent pain relapse.',
    clinicalPurpose: 'Locks in the structural improvements achieved in Stages 1 and 2, transforming short-term pain relief into lasting musculoskeletal durability.',
    modalities: [
      'Deep spinal stabilizer activation',
      'Core & pelvic floor conditioning',
      'Ergonomic posture recalibration',
      'Prescribed home maintenance protocols'
    ],
    patientFeeling: 'Confidence in daily movements, enhanced stamina, resilience against physical fatigue.',
    icon: 'ShieldCheck'
  }
];

export const ammPhilosophy = {
  headline: 'Why A.M.M Method Works When Single-Modality Treatments Fail',
  intro: 'Most pain management clinics offer fragmented solutions: either only chiropractic cracking, only massage, or only exercise sheets. The A.M.M Method is built on the clinical reality that all three systems must be addressed in correct sequence.',
  points: [
    {
      title: 'Strengthening Without Aligning Reinforces Dysfunction',
      description: 'Doing gym exercises or physiotherapy on a misaligned spine strengthens the wrong movement patterns and aggravates joint wear.'
    },
    {
      title: 'Adjusting Without Soft Tissue Work Causes Quick Relapse',
      description: 'If tight, spasming muscles and fascial adhesions are not mobilized, they will quickly pull the realigned joint back out of place.'
    },
    {
      title: 'Sequential Integration Delivers Sustainable Recovery',
      description: 'Align first (A), mobilize soft tissues second (M), and strengthen stabilizing musculature third (M) for definitive results.'
    }
  ]
};
