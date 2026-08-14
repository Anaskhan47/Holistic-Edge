export interface ClinicInfo {
  name: string;
  tagline: string;
  founder: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  experienceYears: number;
  patientsTreated: string;
  specialistsCount: number;
  ratings: {
    justdial: { score: number; max: number; source: string; verified: boolean };
    cybo: { score: number; max: number; source: string; verified: boolean };
  };
  openingHoursNote: string;
  emailNote: string;
  freeConsultationNotice: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  accentColor: string;
  isFlagship?: boolean;
  benefits: string[];
  howItWorks: string[];
  whoIsItFor: string[];
  whatToExpect: string[];
  safetyNotes: string[];
  durationMinutes: string;
  relatedConditions: string[];
  faqs: { question: string; answer: string }[];
  image: string;
}

export interface Condition {
  id: string;
  slug: string;
  title: string;
  category: 'Spine' | 'Joints' | 'Nerves' | 'Muscles' | 'Head & Neck';
  shortDescription: string;
  symptoms: string[];
  whenToSeekHelp: string[];
  treatmentApproach: string[];
  relatedServices: string[];
  recoveryTimelineExpectation: string;
  faqs: { question: string; answer: string }[];
  image: string;
}

export interface AmmStage {
  stepNumber: number;
  code: 'A' | 'M' | 'M2';
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  clinicalPurpose: string;
  modalities: string[];
  patientFeeling: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  isFounder?: boolean;
  experienceYears: number | string;
  specialization: string[];
  qualifications: string;
  bio: string;
  philosophy?: string;
  image: string;
  statusVerified: boolean;
}

export interface FaqItem {
  id: string;
  category: 'General' | 'Treatment' | 'Conditions' | 'Safety' | 'First Visit' | 'Cost & Booking';
  question: string;
  answer: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientInitial: string;
  conditionTreated: string;
  serviceReceived: string;
  review: string;
  rating: number;
  source: 'Justdial' | 'Cybo' | 'Direct Patient Feedback' | 'Verified Clinic Review';
  location: string;
  date: string;
  verified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Treatment Rooms' | 'Spine Care Equipment' | 'Therapy Suites' | 'Reception & Facility';
  description: string;
  imageUrl: string;
}

export interface TreatmentStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  icon: string;
}

export interface AppointmentRequest {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredService: string;
  primaryCondition: string;
  preferredDate: string;
  preferredTimeSlot: string;
  symptomDuration?: string;
  additionalNotes?: string;
  createdAt: string;
  status: 'Pending Review' | 'Confirmed' | 'Completed' | 'Rescheduled';
}

export interface ContactLead {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  reason: string;
  message?: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Closed';
}
