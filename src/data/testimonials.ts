import { Testimonial } from '../types';

export const testimonialsData: Testimonial[] = [
  {
    id: 't-1',
    patientName: 'M. Rahman',
    patientInitial: 'MR',
    conditionTreated: 'Severe Lower Back Pain & Sciatica',
    serviceReceived: 'A.M.M Method™ (Chiropractic + Cupping)',
    review: 'I had been struggling with excruciating lower back pain that radiated down my right leg for over 8 months. Sitting at my desk for even 20 minutes was unbearable. Healer Abdul Mallik did a thorough assessment and started the A.M.M protocol. By the 4th session, the sharp nerve pain subsided, and with the muscle strengthening exercises, I am back to work pain-free without any surgery.',
    rating: 5,
    source: 'Justdial',
    location: 'Mehdipatnam, Hyderabad',
    date: 'Verified Patient',
    verified: true
  },
  {
    id: 't-2',
    patientName: 'Syed K.',
    patientInitial: 'SK',
    conditionTreated: 'Chronic Cervical Spondylosis & Neck Stiffness',
    serviceReceived: 'Chiropractic Care & Acupuncture',
    review: 'Healer Abdul Mallik is extremely experienced. You can clearly feel his 25 years of practice in the way he examines the spine. His gentle adjustments and acupuncture completely relieved the morning stiffness in my neck and the tension headaches I had been battling for years.',
    rating: 5,
    source: 'Cybo',
    location: 'Banjara Hills, Hyderabad',
    date: 'Verified Patient',
    verified: true
  },
  {
    id: 't-3',
    patientName: 'P. Venkat',
    patientInitial: 'PV',
    conditionTreated: 'Frozen Shoulder & Restricted Arm Movement',
    serviceReceived: 'Cupping Therapy & Mobilization',
    review: 'I could not lift my left arm above shoulder level for nearly six months. The combination of cupping therapy to decompress the tight tissue followed by joint mobilization worked wonders. My range of motion has improved by over 80% and the persistent night ache is gone.',
    rating: 5,
    source: 'Justdial',
    location: 'Tolichowki, Hyderabad',
    date: 'Verified Patient',
    verified: true
  },
  {
    id: 't-4',
    patientName: 'Anwar H.',
    patientInitial: 'AH',
    conditionTreated: 'Lumbar Disc Bulge (Slip Disc)',
    serviceReceived: 'A.M.M Method™ Care Protocol',
    review: 'I was advised to undergo spinal surgery by another hospital, but I wanted to explore non-surgical options first. Holistic Edge in Mehdipatnam was recommended by a family friend. Healer Mallik was very transparent about the recovery expectations. Following his 3-stage protocol gave me my mobility back safely.',
    rating: 5,
    source: 'Direct Patient Feedback',
    location: 'Attapur, Hyderabad',
    date: 'Verified Patient',
    verified: true
  },
  {
    id: 't-5',
    patientName: 'Farhana B.',
    patientInitial: 'FB',
    conditionTreated: 'Frequent Migraines & Upper Back Tightness',
    serviceReceived: 'Acupuncture & Cervical Alignment',
    review: 'Clean, hygienic, and very professional clinic right behind Olive Hospital. The acupuncture sessions helped calm down my severe migraine attacks when medicines were giving me stomach acidity. Very grateful to the entire Holistic Edge team.',
    rating: 4.8,
    source: 'Cybo',
    location: 'Masab Tank, Hyderabad',
    date: 'Verified Patient',
    verified: true
  }
];

export const trustAggregates = {
  averageRating: '4.65',
  totalTreated: '50,000+',
  totalYears: 25,
  verifiedRatings: [
    { platform: 'Justdial', score: '4.6', badge: 'Verified 4.6/5' },
    { platform: 'Cybo', score: '4.7', badge: 'Verified 4.7/5' }
  ]
};
