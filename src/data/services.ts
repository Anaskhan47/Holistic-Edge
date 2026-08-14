import { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'chiropractic-care',
    slug: 'chiropractic-care',
    title: 'Chiropractic Care',
    subtitle: 'Precision spinal adjustments & neuromuscular realignment',
    shortDescription: 'Hands-on spinal adjustments and joint manipulations designed to relieve nerve compression, restore spinal alignment, and enhance natural mobility without surgery or drugs.',
    fullDescription: 'At Holistic Edge, our Chiropractic Care is built upon 25 years of specialized clinical practice led by Dr. Abdul Mallik. We address subluxations, postural misalignments, and spinal biomechanical dysfunctions that cause radiating pain, stiffness, and restricted movement. Through safe, controlled, and targeted adjustments, we alleviate mechanical stress on spinal discs and surrounding nervous tissues.',
    iconName: 'Activity',
    accentColor: '#0066CC',
    durationMinutes: '30 - 45 Mins',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop',
    benefits: [
      'Alleviates mechanical pressure on spinal nerves and nerve roots',
      'Improves joint range of motion and overall spinal flexibility',
      'Reduces chronic muscle guarding and localized tension',
      'Assists postural restoration for desk workers and active individuals',
      'Provides non-invasive, drug-free pain relief for spine-related conditions'
    ],
    howItWorks: [
      'Comprehensive spinal palpation and range-of-motion assessment',
      'Precise high-velocity, low-amplitude (HVLA) manual adjustments',
      'Gentle joint mobilization for sensitive or degenerative segments',
      'Ergonomic and postural correction advice tailored to daily routine'
    ],
    whoIsItFor: [
      'Individuals suffering from acute or chronic lower back pain',
      'Patients experiencing neck stiffness, cervical pain, or tech-neck',
      'People with disc bulges, sciatica, or radiating leg/arm numbness',
      'Athletes seeking to restore optimal biomechanical movement'
    ],
    whatToExpect: [
      'Detailed discussion of your medical history and specific pain triggers',
      'Physical spine examination assessing posture, curvature, and tenderness',
      'Targeted, gentle manual adjustment on specialized chiropractic tables',
      'Post-treatment movement test and immediate mobility review'
    ],
    safetyNotes: [
      'Adjustments are performed only after careful clinical screening',
      'A mild release sound ("cavitation") may occur, which is normal gas release within the joint capsule',
      'Mild soreness can occasionally occur for 24 hours, similar to a new exercise session'
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'sciatica', 'scoliosis', 'slip-disc'],
    faqs: [
      {
        question: 'Is chiropractic adjustment painful?',
        answer: 'Most patients feel immediate relief and lightness following an adjustment. While slight muscle tenderness may occasionally occur following the first session as muscles adjust to realignment, the adjustment itself is gentle and controlled.'
      },
      {
        question: 'How many chiropractic sessions will I need?',
        answer: 'Treatment frequency depends on whether your condition is acute (recent strain) or chronic (longstanding postural misalignment). An individualized recommendation is provided following your initial consultation and assessment.'
      }
    ]
  },
  {
    id: 'acupuncture',
    slug: 'acupuncture',
    title: 'Acupuncture',
    subtitle: 'Targeted meridian & neuro-fascial pathway stimulation',
    shortDescription: 'Sterile, ultra-fine needle therapy designed to stimulate specific anatomical points, modulate pain perception pathways, improve local microcirculation, and trigger natural healing.',
    fullDescription: 'Our clinical acupuncture integrates traditional meridian knowledge with contemporary neuro-anatomical understanding. By stimulating key acupoints, acupuncture promotes local blood flow, encourages the release of natural endorphins, and calms overstimulated pain pathways across the central nervous system.',
    iconName: 'Zap',
    accentColor: '#00A896',
    durationMinutes: '35 - 50 Mins',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1512290900672-1f4f5a34e062?q=80&w=900&auto=format&fit=crop',
    benefits: [
      'Calms hyperactive pain pathways and nervous system tension',
      'Enhances microcirculation and oxygenation in tense or inflamed tissues',
      'Promotes deep neuromuscular relaxation and stress relief',
      'Assists in treating chronic headaches, migraines, and nerve irritation',
      'Complements spinal adjustments by releasing deep myofascial trigger points'
    ],
    howItWorks: [
      'Identification of exact meridian points and myofascial trigger zones',
      'Insertion of single-use, pre-sterilized, ultra-fine medical needles',
      'Retention of needles in a calm, therapeutic environment for 20-30 minutes',
      'Gentle removal followed by relaxation assessment'
    ],
    whoIsItFor: [
      'Individuals dealing with persistent tension headaches or migraines',
      'Patients with chronic fibromyalgia, neck stiffness, or joint discomfort',
      'Those seeking holistic pain modulation without heavy reliance on painkillers',
      'Patients needing nervous system calming alongside physical rehabilitation'
    ],
    whatToExpect: [
      'Minimal sensation upon needle placement — most patients report a slight tingling or deep dull ache',
      'A deeply relaxing 20–30 minute rest session during needle retention',
      'A calm, unhurried treatment setting designed for patient comfort'
    ],
    safetyNotes: [
      'Only 100% single-use, sterile, disposable needles are used',
      'Treatment is administered by trained, certified practitioners',
      'Patients on specific anticoagulant medications will undergo prior suitability screening'
    ],
    relatedConditions: ['migraine', 'neck-pain', 'frozen-shoulder', 'knee-pain', 'sciatica'],
    faqs: [
      {
        question: 'Do acupuncture needles hurt?',
        answer: 'Acupuncture needles are hair-thin, significantly finer than medical injection needles. Most patients feel only a faint tap or mild warmth when inserted.'
      },
      {
        question: 'Is acupuncture safe and hygienic at Holistic Edge?',
        answer: 'Yes. We strictly adhere to single-use, disposable medical-grade needles unpacked in front of the patient in sanitized clinical suites.'
      }
    ]
  },
  {
    id: 'cupping-therapy',
    slug: 'cupping-therapy',
    title: 'Cupping Therapy',
    subtitle: 'Deep tissue decompression & localized circulation enhancement',
    shortDescription: 'Specialized therapeutic suction applied to muscular and fascial zones to decompress tissue, draw fresh circulation, clear stagnant metabolites, and release stubborn knots.',
    fullDescription: 'Cupping Therapy creates negative pressure (decompression) on the skin and underlying fascia. Unlike standard massage which applies positive pressure inward, cupping lifts connective tissue, dramatically improving microvascular blood flow, clearing metabolic waste, and releasing deep fibrous adhesions that limit joint range.',
    iconName: 'Shield',
    accentColor: '#FF6B35',
    durationMinutes: '30 - 40 Mins',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop',
    benefits: [
      'Decompresses stiff fascia and deep muscular trigger knots',
      'Accelerates local lymph drainage and metabolic waste clearance',
      'Relieves intense shoulder, upper back, and lumbar tightness',
      'Improves tissue elasticity and joint range of motion',
      'Prepares deep tissues for spinal alignment and mobility protocols'
    ],
    howItWorks: [
      'Target area skin preparation and clinical assessment of muscle tone',
      'Application of specialized medical suction cups over targeted tension zones',
      'Controlled static or gliding suction tailored to patient tolerance',
      'Post-cup soothing tissue application and movement check'
    ],
    whoIsItFor: [
      'Desk workers with intense trapezius, neck, and upper back tightness',
      'Athletes with localized muscle stiffness and delayed recovery',
      'Patients with chronic lumbar tightness resistant to standard stretching',
      'Individuals with frozen shoulder or restricted scapular movement'
    ],
    whatToExpect: [
      'A soothing suction sensation that lifts tension away from deep muscle beds',
      'Temporary circular discoloration (petechiae) which naturally fades in 3–7 days',
      'Noticeable lightness and reduced muscular resistance following the session'
    ],
    safetyNotes: [
      'Suction pressure is strictly monitored and adapted to individual skin sensitivity',
      'Marks left on the skin are the result of microcirculation suction, not bruises or burns',
      'Treated areas should be kept warm and shielded from direct cold drafts for 24 hours'
    ],
    relatedConditions: ['frozen-shoulder', 'back-pain', 'neck-pain', 'sports-injuries'],
    faqs: [
      {
        question: 'Why does cupping leave circular marks?',
        answer: 'The suction draws stagnant blood and metabolic fluids from deep muscle layers toward the surface, allowing new oxygenated blood to flood the area. These marks are non-painful and fade naturally in a few days.'
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
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=900&auto=format&fit=crop',
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
      'A thorough, patient-centered consultation focused on your daily habits',
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
        question: 'Can alternative therapies be combined with other medical treatments?',
        answer: 'Yes. Our non-invasive therapies are designed to complement overall wellness. We encourage patients to share any ongoing medical history during the initial consultation.'
      }
    ]
  },
  {
    id: 'amm-method',
    slug: 'amm-method',
    title: 'The A.M.M Method™',
    subtitle: 'Adjustment • Mobilization • Muscle Strengthening',
    shortDescription: 'Our signature 3-phase clinical protocol developed through 25 years of practice, addressing joint alignment, soft tissue mobility, and structural muscle stabilization for lasting pain relief.',
    fullDescription: 'The A.M.M Method™ is Holistic Edge’s signature clinical framework formulated by Dr. Abdul Mallik over 25 years of treating 12,000+ patients. Rather than offering short-lived symptom relief, the A.M.M Method integrates three sequential pillars: (1) Adjustment of structural misalignments, (2) Mobilization of restricted joints and fascia, and (3) Muscle Strengthening to secure lasting biomechanical stability.',
    iconName: 'Layers',
    accentColor: '#0066CC',
    durationMinutes: '45 - 60 Mins',
    isFlagship: true,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=900&auto=format&fit=crop',
    benefits: [
      'Addresses both structural misalignment and muscular root causes',
      'Prevents recurrent pain by strengthening supporting stabilizers',
      'Step-by-step progress tracking across all three recovery phases',
      'Eliminates reliance on short-term pain suppressants or risky surgeries',
      'Proven through 25 years of clinical refinement in Mehdipatnam, Hyderabad'
    ],
    howItWorks: [
      'Stage 1 (A - Adjustment): Realignment of spinal vertebrae and peripheral joints to remove nerve impingement',
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
        question: 'Why is the A.M.M Method different from standard therapy?',
        answer: 'Many therapies only address one aspect — either cracking a joint or doing exercises. If you strengthen a misaligned spine, you reinforce dysfunction. If you adjust without strengthening, the pain returns. The A.M.M Method aligns first, mobilizes tissue second, and reinforces muscle third for sustainable wellness.'
      }
    ]
  }
];
