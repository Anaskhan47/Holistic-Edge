import { Condition } from '../types';

export const conditionsData: Condition[] = [
  {
    id: 'back-pain',
    slug: 'back-pain',
    title: 'Back Pain',
    category: 'Spine',
    shortDescription: 'Acute and chronic lumbar pain caused by spinal misalignments, postural strain, disc compression, or facet joint dysfunction.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Dull aching or sharp stabbing pain in the lower or mid back',
      'Stiffness and difficulty standing up straight after sitting',
      'Muscle spasms across lumbar paraspinal muscles',
      'Pain worsening with bending, lifting, or prolonged standing'
    ],
    whenToSeekHelp: [
      'Pain persists for more than 7–10 days despite rest',
      'Discomfort radiates down the buttocks into the legs',
      'Morning stiffness significantly limits your daily routine',
      'Pain is recurrent and progressively worsening'
    ],
    treatmentApproach: [
      'Targeted spinal adjustment to correct lumbar subluxations and reduce facet joint stress',
      'Fascial decompression and cupping to release hypertonic muscle spasms',
      'A.M.M Method stage 3 core and spinal stabilizer strengthening'
    ],
    relatedServices: ['amm-method', 'chiropractic-care', 'cupping-therapy'],
    recoveryTimelineExpectation: 'Many patients report measurable relief in the initial 2–4 sessions, followed by structured stabilization.',
    faqs: [
      {
        question: 'Can back pain be relieved without surgery or heavy medication?',
        answer: 'Yes. In the majority of non-emergency musculoskeletal cases, correcting spinal alignment, reducing nerve compression, and strengthening core stabilizers can resolve pain without surgery or drugs.'
      }
    ]
  },
  {
    id: 'neck-pain',
    slug: 'neck-pain',
    title: 'Neck Pain & Cervical Strain',
    category: 'Spine',
    shortDescription: 'Cervical stiffness, tech-neck syndrome, and restricted head rotation resulting from postural stress or cervical facet irritation.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f4f5a34e062?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Sharp pain or persistent tightness across the neck and upper shoulders',
      'Difficulty turning the head when driving or looking sideways',
      'Tension headaches originating at the base of the skull',
      'Radiating tingling or heaviness into the shoulders or arms'
    ],
    whenToSeekHelp: [
      'Neck tightness is accompanied by frequent tension headaches',
      'You experience pins-and-needles sensation down your arms or fingers',
      'Pain prevents restful sleep or concentration during work'
    ],
    treatmentApproach: [
      'Gentle cervical spinal alignment and occipital base release',
      'Acupuncture to modulate irritated cervical nerve pathways and release trigger points',
      'Postural retraining and deep neck flexor rehabilitation'
    ],
    relatedServices: ['chiropractic-care', 'acupuncture', 'amm-method'],
    recoveryTimelineExpectation: 'Noticeable range-of-motion improvement often achieved within the first few sessions.',
    faqs: [
      {
        question: 'Is cervical adjustment safe for neck stiffness?',
        answer: 'At Holistic Edge, cervical adjustments are preceded by careful physical examination. Dr. Abdul Mallik applies gentle, controlled techniques calibrated specifically to your cervical spine structure.'
      }
    ]
  },
  {
    id: 'sciatica',
    slug: 'sciatica',
    title: 'Sciatica & Nerve Compression',
    category: 'Nerves',
    shortDescription: 'Radiating nerve pain, burning, or tingling that travels from the lower back through the buttock and down the leg along the sciatic nerve pathway.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Electric, burning, or shooting pain radiating down one leg',
      'Numbness or pins-and-needles in the calf, ankle, or foot',
      'Pain that intensifies when sitting, coughing, or sneezing',
      'Weakness when lifting the foot or walking'
    ],
    whenToSeekHelp: [
      'Leg pain is more severe than the accompanying backache',
      'Numbness persists or impairs walking and balance',
      'Pain disrupts sleep or work consistently'
    ],
    treatmentApproach: [
      'Lumbar and sacroiliac realignment to relieve direct nerve root compression',
      'Acupuncture to down-regulate sciatic nerve inflammation and pain signals',
      'Nerve flossing and piriformis muscle decompression'
    ],
    relatedServices: ['amm-method', 'chiropractic-care', 'acupuncture'],
    recoveryTimelineExpectation: 'Gradual reduction of radiating symptoms (centralization) typically progresses over structured multi-week care.',
    faqs: [
      {
        question: 'How does chiropractic help sciatica?',
        answer: 'By restoring alignment to the lower lumbar vertebrae and pelvis, we take direct pressure off the compressed sciatic nerve root, allowing the nerve to calm down and heal naturally.'
      }
    ]
  },
  {
    id: 'scoliosis',
    slug: 'scoliosis',
    title: 'Scoliosis Management',
    category: 'Spine',
    shortDescription: 'Non-surgical structural management, pain reduction, and muscular balancing for abnormal lateral curvature of the spine.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Uneven shoulders, shoulder blade prominence, or uneven waistline',
      'Chronic muscular ache along one side of the spine due to muscle compensation',
      'Fatigue and difficulty maintaining upright posture during long days',
      'Rib cage asymmetry and localized back stiffness'
    ],
    whenToSeekHelp: [
      'You notice visible postural asymmetry or curvature progression',
      'Chronic muscular fatigue impairs daily activities',
      'You are seeking conservative, non-surgical support to manage curvature pain'
    ],
    treatmentApproach: [
      'Asymmetric spinal mobilization and gentle corrective alignment',
      'Targeted strengthening of weakened postural muscles on the concave side',
      'Myofascial release on tight, overworked compensatory muscle groups'
    ],
    relatedServices: ['amm-method', 'chiropractic-care', 'alternative-therapies'],
    recoveryTimelineExpectation: 'Ongoing structural support aimed at reducing discomfort and halting functional decline.',
    faqs: [
      {
        question: 'Can chiropractic care help adults with scoliosis?',
        answer: 'While adult structural curves cannot be completely straightened overnight, chiropractic adjustments and muscular rehabilitation significantly relieve scoliosis-associated chronic pain, improve posture, and enhance functional mobility.'
      }
    ]
  },
  {
    id: 'spondylitis',
    slug: 'spondylitis',
    title: 'Spondylitis & Spondylosis',
    category: 'Spine',
    shortDescription: 'Cervical and lumbar age-related degenerative changes, facet stiffness, and spinal joint inflammation.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Persistent morning stiffness in the neck or lower back',
      'Grinding or clicking sensation when turning the head or bending',
      'Loss of spinal flexibility and restricted range of motion',
      'Occasional dizziness or nerve tingling in cervical cases'
    ],
    whenToSeekHelp: [
      'Stiffness takes more than 30–45 minutes to ease in the morning',
      'Pain begins interfering with neck movement or driving',
      'Degenerative diagnosis confirmed on X-ray/MRI and seeking conservative management'
    ],
    treatmentApproach: [
      'Gentle low-force joint mobilization to preserve disc space and mobility',
      'Acupuncture and cupping to enhance microcirculation around degenerative joints',
      'Non-impact isometric strengthening to stabilize arthritic segments'
    ],
    relatedServices: ['amm-method', 'acupuncture', 'alternative-therapies'],
    recoveryTimelineExpectation: 'Focus on reducing inflammation, halting stiffness progression, and restoring comfortable movement.',
    faqs: [
      {
        question: 'Is chiropractic safe for diagnosed spondylosis?',
        answer: 'Yes. We utilize gentle mobilization and low-force techniques adapted for degenerative changes, avoiding aggressive high-force maneuvers on compromised segments.'
      }
    ]
  },
  {
    id: 'knee-pain',
    slug: 'knee-pain',
    title: 'Knee Pain & Osteoarthritis Support',
    category: 'Joints',
    shortDescription: 'Conservative, non-invasive support for knee joint stiffness, patellar tracking issues, and age-related wear-and-tear.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Aching or sharp pain while climbing stairs, squatting, or walking',
      'Joint stiffness after periods of rest or sitting',
      'Crepitus (clicking or cracking) inside the knee joint',
      'Swelling and restricted bending ability'
    ],
    whenToSeekHelp: [
      'Knee pain limits independent walking or stair climbing',
      'You are looking to delay or avoid knee replacement surgery through conservative care',
      'Pain persists despite oral anti-inflammatory medications'
    ],
    treatmentApproach: [
      'Pelvic, hip, and ankle alignment to eliminate abnormal gait shearing forces on the knee',
      'Acupuncture to decrease joint capsule inflammation and stimulate circulation',
      'Quadriceps and hamstring neuromuscular balancing'
    ],
    relatedServices: ['alternative-therapies', 'acupuncture', 'amm-method'],
    recoveryTimelineExpectation: 'Progressive improvement in load tolerance and walking comfort within structured protocols.',
    faqs: [
      {
        question: 'How can spine and pelvis alignment affect knee pain?',
        answer: 'An unlevel pelvis or misaligned hip places uneven weight distribution across the knee joint, accelerating cartilage wear. Realigning the kinetic chain relieves excessive pressure on the knee.'
      }
    ]
  },
  {
    id: 'frozen-shoulder',
    slug: 'frozen-shoulder',
    title: 'Frozen Shoulder (Adhesive Capsulitis)',
    category: 'Joints',
    shortDescription: 'Progressive shoulder stiffness, intense night pain, and severely restricted glenohumeral and scapular mobility.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Severe difficulty raising the arm overhead or reaching behind the back',
      'Deep, persistent dull ache in the shoulder, often worsening at night',
      'Stiffness that progressively freezes joint movement',
      'Compensatory neck and upper back pain on the affected side'
    ],
    whenToSeekHelp: [
      'Unable to dress, comb hair, or reach overhead without severe pain',
      'Shoulder mobility has been steadily decreasing for several weeks',
      'Pain interrupts sleep when lying on the affected shoulder'
    ],
    treatmentApproach: [
      'Gentle glenohumeral and scapulothoracic joint mobilization',
      'Cupping therapy to decompress dense fascial adhesions around the deltoid and rotator cuff',
      'Acupuncture to interrupt the neurogenic inflammation loop'
    ],
    relatedServices: ['cupping-therapy', 'acupuncture', 'amm-method'],
    recoveryTimelineExpectation: 'Gradual stage-by-stage thawing of joint adhesions over consistent weekly sessions.',
    faqs: [
      {
        question: 'Can cupping and acupuncture help frozen shoulder?',
        answer: 'Yes. Cupping lifts tightened fascia around the shoulder capsule, while acupuncture modulates the severe pain reflex, allowing mobilization techniques to restore movement much faster.'
      }
    ]
  },
  {
    id: 'migraine',
    slug: 'migraine',
    title: 'Migraine & Tension Headaches',
    category: 'Head & Neck',
    shortDescription: 'Cervicogenic headaches, chronic tension bands, and migraine attacks triggered by cervical misalignment and suboccipital tension.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Throbbing pain on one or both sides of the head or behind the eyes',
      'Tight band-like constriction around the temples and forehead',
      'Sensitivity to light, sound, or prolonged screen exposure',
      'Headache directly accompanied by upper neck stiffness'
    ],
    whenToSeekHelp: [
      'Headaches occur multiple times per week or require daily pain pills',
      'Pain originates at the base of your skull and spreads forward',
      'Headaches coincide with desk work, screen time, or poor posture'
    ],
    treatmentApproach: [
      'Upper cervical alignment (C1/C2 atlas-axis) to relieve suboccipital nerve tension',
      'Acupuncture on validated head/neck meridian points to calm vasospasms',
      'Ergonomic analysis and tension-release protocols'
    ],
    relatedServices: ['acupuncture', 'chiropractic-care', 'alternative-therapies'],
    recoveryTimelineExpectation: 'Reduction in headache frequency and intensity typically reported within 3–5 treatment visits.',
    faqs: [
      {
        question: 'Are migraines related to the neck?',
        answer: 'Many chronic headaches are cervicogenic — meaning they originate from irritated nerves and compressed joints in the upper neck. Correcting cervical alignment removes this underlying trigger.'
      }
    ]
  },
  {
    id: 'slip-disc',
    slug: 'slip-disc',
    title: 'Slip Disc & Herniated Disc',
    category: 'Spine',
    shortDescription: 'Disc protrusions, bulges, and herniations causing severe spinal pain and radiating nerve irritation.',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Intense, sharp lower back pain aggravated by coughing, sitting, or bending',
      'Sciatic nerve radiation with tingling or numbness down the leg',
      'Severe spinal stiffness and muscle spasms locking the back',
      'Antalgic lean (body tilting to one side to avoid nerve pinching)'
    ],
    whenToSeekHelp: [
      'Diagnosed with disc bulge/herniation on MRI and looking for non-surgical care',
      'Unable to sit comfortably for more than 10 minutes',
      'Experiencing radiating leg pain or foot numbness'
    ],
    treatmentApproach: [
      'Non-surgical mechanical decompression and gentle spinal realignment',
      'Cupping and soft tissue decompression to relax reactive muscle splinting',
      'A.M.M Method stage 3 core stabilization to protect the damaged disc segment'
    ],
    relatedServices: ['amm-method', 'chiropractic-care', 'cupping-therapy'],
    recoveryTimelineExpectation: 'Structured conservative protocol aiming to retract disc pressure and resolve nerve impingement.',
    faqs: [
      {
        question: 'Can a slipped disc heal without surgery?',
        answer: 'Yes, in up to 90% of cases, non-surgical conservative treatments (chiropractic realignment, decompression, and rehabilitation) relieve symptoms and allow the disc to stabilize naturally.'
      }
    ]
  },
  {
    id: 'sports-injuries',
    slug: 'sports-injuries',
    title: 'Sports & Musculoskeletal Injuries',
    category: 'Muscles',
    shortDescription: 'Muscle strains, ligament sprains, postural imbalances, and repetitive stress injuries in active individuals and athletes.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop',
    symptoms: [
      'Acute muscle pulls, tendon tightness, or restricted joint range',
      'Decreased athletic performance due to biomechanical compensations',
      'Post-workout stiffness that lingers longer than normal DOMS',
      'Recurrent ankle, shoulder, or hamstring strains'
    ],
    whenToSeekHelp: [
      'Injury is preventing you from training or participating in sports',
      'Recurring strains happen repeatedly on the same side of the body',
      'You want to restore optimal kinetic alignment for peak performance'
    ],
    treatmentApproach: [
      'Comprehensive kinetic chain assessment and joint realignment',
      'Cupping therapy for rapid lactic clearance and fascial knot release',
      'Functional rehabilitation and eccentric muscle strengthening'
    ],
    relatedServices: ['amm-method', 'cupping-therapy', 'chiropractic-care'],
    recoveryTimelineExpectation: 'Accelerated recovery protocols to return safely and quickly to active lifestyle.',
    faqs: [
      {
        question: 'When should an athlete visit after an injury?',
        answer: 'Once acute swelling is managed, conservative care can be initiated to prevent scar tissue adhesions and restore symmetrical biomechanics.'
      }
    ]
  }
];
