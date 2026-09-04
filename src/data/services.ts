export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  accentColor: string;
  durationMinutes: string;
  isFlagship: boolean;
  heroImage?: string;
  image: string;
  benefits: string[];
  howItWorks: string[];
  whoIsItFor: string[];
  whatToExpect: string[];
  safetyNotes: string[];
  relatedConditions: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'chiropractic-care',
    slug: 'chiropractic-care',
    title: 'Chiropractic Care',
    subtitle: 'Precision spinal adjustments & neuromuscular realignment',
    shortDescription: 'Gentle, high-velocity low-amplitude (HVLA) spinal adjustments and joint manipulations designed to relieve spinal subluxation, reduce nerve compression, and restore natural posture.',
    fullDescription: 'Chiropractic Care at Holistic Edge focuses on diagnosing, treating, and preventing mechanical disorders of the musculoskeletal system, particularly the spine. Guided by Healer Abdul Mallik’s 25+ years of clinical expertise, each adjustment is preceded by a thorough spinal palpation and range-of-motion assessment.',
    iconName: 'Activity',
    accentColor: '#0F2747',
    durationMinutes: '20 - 30 Mins',
    isFlagship: false,
    image: '/Our Clinical Offerings/Chiropractic Care.jpg',
    benefits: [
      'Relieves nerve compression and nerve root irritation (e.g., Sciatica, Radiculopathy)',
      'Restores physiological joint range of motion across cervical, thoracic, and lumbar segments',
      'Corrects postural misalignments caused by prolonged sitting, desk work, or physical trauma',
      'Reduces chronic spinal inflammation without relying on oral anti-inflammatory drugs',
      'Enhances natural brain-to-body neurological pathways for overall vitality'
    ],
    howItWorks: [
      'Comprehensive clinical history, spinal range-of-motion test, and nerve pressure check',
      'Palpation of vertebral segments to pinpoint subluxations and biomechanical fixations',
      'Application of controlled, gentle spinal thrusts or instrument-assisted adjustments',
      'Post-adjustment postural check and immediate mobility re-assessment'
    ],
    whoIsItFor: [
      'Individuals suffering from chronic lower back pain, neck stiffness, or shoulder tension',
      'Patients diagnosed with Sciatica, Spondylosis, Disc Bulge, or Pinched Nerves',
      'Office workers and professionals with long desk hours experiencing postural fatigue',
      'Athletes and active individuals recovering from joint misalignments or sports injuries'
    ],
    whatToExpect: [
      '• focused clinical assessment and clear explanation before any spinal adjustment',
      'Audible release of trapped gas bubbles (joint cavitation) which is entirely normal and painless',
      'Immediate reduction in joint stiffness accompanied by a feeling of lightness across the spine'
    ],
    safetyNotes: [
      'All adjustments are personalized based on age, bone density, and diagnostic history',
      'Pediatric, geriatric, and hyper-sensitive patients receive ultra-gentle low-force techniques'
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'sciatica', 'spondylitis', 'slip-disc', 'headaches-migraines'],
    faqs: [
      {
        question: 'Is chiropractic adjustment safe•',
        answer: 'Yes. When performed by a qualified, experienced practitioner like Healer Abdul Mallik, chiropractic care is recognized worldwide as one of the safest non-invasive healthcare modalities for spine and joint conditions.'
      },
      {
        question: 'Does spinal adjustment hurt•',
        answer: 'Most patients feel immediate relief. You may hear a popping sound caused by nitrogen gas releasing from joint capsules, but the procedure itself is gentle and non-painful.'
      }
    ]
  },
  {
    id: 'acupuncture',
    slug: 'acupuncture',
    title: 'Acupuncture',
    subtitle: 'Targeted meridian & neuro-fascial pathway stimulation',
    shortDescription: 'Sterile, ultra-fine needle insertion at specific anatomical and neurological trigger points to stimulate natural endorphin release, clear energy blockages, and promote vascular healing.',
    fullDescription: 'Clinical Acupuncture at Holistic Edge integrates classical meridian science with modern neuro-anatomical trigger point therapy. By inserting single-use micro-needles into targeted neuro-vascular zones, acupuncture modulates pain signals along peripheral nerves, relaxes deep muscular spasms, and triggers local micro-circulation.',
    iconName: 'Zap',
    accentColor: '#1B4332',
    durationMinutes: '30 - 45 Mins',
    isFlagship: false,
    image: '/Our Clinical Offerings/Acupuncture.jfif',
    benefits: [
      'Triggers rapid endorphin and enkephalin release for immediate, drug-free pain relief',
      'Decompresses chronic muscle trigger points and deep fascial adhesions',
      'Enhances micro-vascular blood flow and cellular oxygen delivery to damaged tissues',
      'Calms hyperactive nervous system states, reducing stress, anxiety, and tension headaches',
      'Accelerates healing in stubborn tendonitis, ligament sprains, and nerve inflammations'
    ],
    howItWorks: [
      'Pulse and anatomical point assessment to map meridian and nerve pathways',
      'Sanitisation of targeted acupuncture zones using clinical-grade alcohol swabs',
      'Insertion of sterile, single-use micro-fine needles into specific trigger points',
      '20-30 minute rest phase allowing neuro-vascular stimulation and deep relaxation'
    ],
    whoIsItFor: [
      'Patients dealing with chronic persistent pain resistant to standard medication',
      'Individuals with tension headaches, migraines, facial pain, or trigeminal discomfort',
      'People with joint arthritis, knee pain, frozen shoulder, or plantar fasciitis',
      'Anyone seeking a deeply restorative treatment that balances nerve function and stress'
    ],
    whatToExpect: [
      '• virtually painless insertion process using needles as thin as a human hair',
      '• mild sensation of warmth, heaviness, or subtle tingling (known as De Qi)',
      '• profound state of muscular relaxation during and after the session'
    ],
    safetyNotes: [
      '100% single-use, pre-sterilized disposable needles opened in front of the patient',
      'No medication or chemical coating is used on the needles; action is purely physiological'
    ],
    relatedConditions: ['headaches-migraines', 'knee-pain', 'frozen-shoulder', 'neck-pain'],
    faqs: [
      {
        question: 'Are acupuncture needles painful•',
        answer: 'No. Acupuncture needles are micro-thin — far smaller than hypodermic injection needles. Most patients feel only a slight tap upon insertion followed by a relaxing sensation.'
      }
    ]
  },
  {
    id: 'alternative-therapies',
    slug: 'alternative-therapies',
    title: 'Alternative Therapies',
    subtitle: 'Holistic & integrative musculoskeletal support modalities',
    shortDescription: 'Synergistic modalities including myofascial release, therapeutic heat, acupressure, and corrective movement to support long-term pain resolution without pharmaceuticals.',
    fullDescription: 'At Holistic Edge, we recognize that musculoskeletal pain rarely exists in isolation. Our Alternative Therapies encompass supportive holistic modalities — such as targeted neuromuscular therapy, trigger point release, and postural alignment routines — tailored to reinforce the structural gains achieved through chiropractic adjustments.',
    iconName: 'HeartHandshake',
    accentColor: '#028071',
    durationMinutes: '30 - 45 Mins',
    isFlagship: false,
    image: '/Our Clinical Offerings/Alternative Therapies.jpg',
    benefits: [
      'Addresses soft tissue imbalances that pull joints out of alignment',
      'Supports natural tissue recovery without reliance on oral painkillers',
      'Empowers patients with tailored home movement and ergonomic regimens',
      'Provides a safe, non-invasive option for individuals with sensitive joints'
    ],
    howItWorks: [
      'Evaluation of connective tissue restrictions and movement compensations',
      'Application of targeted manual pressure and soft tissue release',
      'Guidance on corrective breathing, core engagement, and joint unloading',
      'Integration into your personalized Holistic Edge care pathway'
    ],
    whoIsItFor: [
      'Patients seeking a natural, non-medicinal approach to chronic body pain',
      'Individuals who want holistic lifestyle and postural coaching',
      'People recovering from chronic postural strain and muscle imbalances'
    ],
    whatToExpect: [
      '• thorough, patient-centered consultation focused on your daily habits',
      'Hands-on muscular and soft tissue therapy designed for your comfort level',
      'Practical takeaway advice on workspace ergonomics and daily stretching'
    ],
    safetyNotes: [
      'Every technique is customized to the patient’s age, tolerance, and health profile',
      'No aggressive force is applied; comfort and safety are strictly maintained'
    ],
    relatedConditions: ['spondylitis', 'knee-pain', 'sports-injuries', 'back-pain'],
    faqs: [
      {
        question: 'Can alternative therapies be combined with other medical treatments•',
        answer: 'Yes. Our non-invasive therapies are designed to complement overall wellness. We encourage patients to share any ongoing medical history during the initial consultation.'
      }
    ]
  },
  {
    id: 'amm-method',
    slug: 'amm-method',
    title: 'The A.M.M Method™',
    subtitle: 'Adjustment · Mobilization · Muscle Strengthening',
    shortDescription: 'Our signature 3-phase clinical protocol developed through 25 years of practice, addressing joint alignment, soft tissue mobility, and structural muscle stabilization for lasting pain relief.',
    fullDescription: 'The A.M.M Method™ is Holistic Edge’s signature clinical framework formulated by Healer Abdul Mallik over 25 years of treating 50,000+ patients. Rather than offering short-lived symptom relief, the A.M.M Method integrates three sequential pillars: (1) Adjustment of structural misalignments, (2) Mobilization of restricted joints and fascia, and (3) Muscle Strengthening to secure lasting biomechanical stability.',
    iconName: 'Layers',
    accentColor: '#0066CC',
    durationMinutes: '45 - 60 Mins',
    isFlagship: true,
    image: '/Our Clinical Offerings/A.M.M Method.jpg',
    benefits: [
      'Addresses both structural misalignment and muscular root causes',
      'Prevents recurrent pain by strengthening supporting stabilizers',
      'Step-by-step progress tracking across all three recovery phases',
      'Eliminates reliance on short-term pain suppressants or risky surgeries',
      'Proven through 25 years of clinical refinement in Mehdipatnam, Hyderabad'
    ],
    howItWorks: [
      'Stage 1 (• - Adjustment): Realignment of spinal vertebrae and peripheral joints to remove nerve impingement',
      'Stage 2 (M - Mobilization): Passive and active joint articulation to restore full physiological range',
      'Stage 3 (M - Muscle Strengthening): Isometric and functional rehabilitation of postural support muscles'
    ],
    whoIsItFor: [
      'Patients with chronic, recurring back or neck pain that returns after standard massage',
      'Individuals dealing with persistent sciatica, slip disc, or spondylosis',
      'Anyone seeking a complete, root-cause resolution rather than temporary relief'
    ],
    whatToExpect: [
      'Phased care where each session builds directly upon the previous foundation',
      'Clear milestones from acute pain relief to active muscular stabilization',
      'Empowering home exercise protocols to maintain spinal health independently'
    ],
    safetyNotes: [
      'Each stage is calibrated based on patient tolerance and tissue recovery rate',
      'Progress to Muscle Strengthening begins once acute inflammation and misalignment are resolved'
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'sciatica', 'spondylitis', 'scoliosis', 'slip-disc'],
    faqs: [
      {
        question: 'Why is the A.M.M Method different from standard therapy•',
        answer: 'Many therapies only address one aspect — either cracking a joint or doing exercises. If you strengthen a misaligned spine, you reinforce dysfunction. If you adjust without strengthening, the pain returns. The A.M.M Method aligns first, mobilizes tissue second, and reinforces muscle third for sustainable wellness.'
      }
    ]
  }
];
