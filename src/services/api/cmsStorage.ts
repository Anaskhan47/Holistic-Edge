// CMS & Data Storage Service — Real Management Source of Truth

export type ContentStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
export type ReviewSource = 'GOOGLE' | 'WEBSITE_DIRECT' | 'MANUAL_IMPORT' | 'PATIENT_FEEDBACK';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CONTENT_EDITOR';

export interface AuditLogItem {
  id: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: string;
  timestamp: string;
}

export interface TestimonialItem {
  id: string;
  displayName: string;
  patientName: string;
  condition: string;
  service: string;
  rating: number;
  review: string;
  source: ReviewSource;
  status: ContentStatus;
  isFeatured: boolean;
  verified: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleReviewItem {
  id: string;
  googleReviewId: string;
  reviewerName: string;
  reviewerPhotoUrl?: string;
  starRating: number;
  comment: string;
  reviewTimestamp: string;
  replyComment?: string;
  replyTimestamp?: string;
  hasReply: boolean;
  source: ReviewSource;
  location: string;
  status: ContentStatus;
  isApproved: boolean;
  isPublishedOnWebsite: boolean;
  isFeatured?: boolean;
  importedAt: string;
  updatedAt: string;
}

export interface GoogleIntegrationState {
  isConnected: boolean;
  accountName: string;
  accountId: string;
  locationId: string;
  locationName: string;
  lastSyncedAt: string;
  syncStatus: 'Idle' | 'Syncing' | 'Success' | 'Error';
  lastError?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  displayOrder: number;
  benefits: string[];
  modalities: string[];
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConditionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  displayOrder: number;
  symptoms: string[];
  causes: string[];
  treatmentMethod: string;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isFeatured: boolean;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberItem {
  id: string;
  slug: string;
  name: string;
  role: string;
  credentials: string;
  experienceYears: number;
  bio: string;
  philosophy: string;
  specialization: string[];
  image: string;
  isFounder: boolean;
  displayOrder: number;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  TESTIMONIALS: 'holistic_edge_testimonials_v2',
  GOOGLE_REVIEWS: 'holistic_edge_google_reviews_v2',
  GOOGLE_SETTING: 'holistic_edge_google_setting_v2',
  SERVICES: 'holistic_edge_services_v2',
  CONDITIONS: 'holistic_edge_conditions_v2',
  FAQS: 'holistic_edge_faqs_v2',
  TEAM: 'holistic_edge_team_v2',
  AUDIT: 'holistic_edge_audit_logs_v2',
};

// Initial Seed Data
const DEFAULT_GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: 'g-rev-1',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBEAE',
    reviewerName: 'Mohammed Imran',
    starRating: 5,
    comment: 'Extremely professional chiropractic care in Mehdipatnam. Healer Abdul Mallik assessed my lumbar MRI thoroughly and started the A.M.M protocol. By session 4, my sciatica nerve pain was completely gone.',
    reviewTimestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    hasReply: true,
    replyComment: 'Thank you Imran bhai for trusting Holistic Edge. We are glad to hear about your sciatica recovery!',
    replyTimestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    isFeatured: true,
    importedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-2',
    googleReviewId: 'ChdDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRAE',
    reviewerName: 'Priya Sharma',
    starRating: 5,
    comment: 'I had severe cervical stiffness and morning headaches for 2 years. Healer Mallik’s gentle adjustments and acupuncture provided relief from week 1. Highly recommend Holistic Edge!',
    reviewTimestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    isFeatured: true,
    importedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-3',
    googleReviewId: 'ChdDSUhNMG9nS0VJQ0FnSUNtNU9mVEFBRAE',
    reviewerName: 'Syed Khalid',
    starRating: 5,
    comment: 'Avoided spine surgery thanks to Healer Abdul Mallik. The 3-stage A.M.M method really works for disc bulge recovery.',
    reviewTimestamp: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    importedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-4',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTQ',
    reviewerName: 'M. Rahman',
    starRating: 5,
    comment: 'I had been struggling with excruciating lower back pain that radiated down my right leg for over 8 months. Sitting at my desk for even 20 minutes was unbearable. Healer Abdul Mallik did a thorough assessment and started the A.M.M protocol.',
    reviewTimestamp: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    hasReply: true,
    replyComment: 'Thank you Mr. Rahman. We wish you continued spinal health!',
    replyTimestamp: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    isFeatured: true,
    importedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-5',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTU',
    reviewerName: 'Afnan Shareef',
    starRating: 5,
    comment: 'The best treatment u can get it here the sessions staff and especially the healer!! after being pregnant i have been treated so well and my back pain is completely resolved.',
    reviewTimestamp: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    isFeatured: true,
    importedAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-6',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTY',
    reviewerName: 'P. Venkat',
    starRating: 5,
    comment: 'I could not lift my left arm above shoulder level for nearly six months. The combination of cupping therapy to decompress tight tissue followed by joint mobilization worked wonders.',
    reviewTimestamp: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Tolichowki, Hyderabad',
    status: 'PENDING',
    isApproved: false,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-7',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTc',
    reviewerName: 'Anwar H.',
    starRating: 5,
    comment: 'I was advised to undergo spinal surgery by another hospital, but I wanted to explore non-surgical options first. Holistic Edge in Mehdipatnam was recommended by a family friend.',
    reviewTimestamp: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Attapur, Hyderabad',
    status: 'PENDING',
    isApproved: false,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-8',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTg',
    reviewerName: 'Farhana B.',
    starRating: 5,
    comment: 'Clean, hygienic, and very professional clinic right behind Olive Hospital. The acupuncture sessions helped calm down my severe migraine attacks when medicines were giving me acidity.',
    reviewTimestamp: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Masab Tank, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    importedAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-9',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTk',
    reviewerName: 'Healer Rajesh V.',
    starRating: 5,
    comment: 'As a physician myself, I appreciate Healer Abdul Mallik’s evidence-informed approach to spinal mechanics and non-invasive alignment.',
    reviewTimestamp: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(),
    hasReply: true,
    replyComment: 'Thank you Healer Rajesh for your kind professional words.',
    replyTimestamp: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    source: 'GOOGLE',
    location: 'Banjara Hills, Hyderabad',
    status: 'APPROVED',
    isApproved: true,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-10',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTEw',
    reviewerName: 'Fatima Begum',
    starRating: 5,
    comment: 'Very polite staff and excellent patient care. Took my elderly mother for knee and lower back adjustments and she can now walk comfortably.',
    reviewTimestamp: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'APPROVED',
    isApproved: true,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-11',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTEx',
    reviewerName: 'S. Ahmed Khan',
    starRating: 5,
    comment: 'Exceptional chiropractic adjustments by Healer Abdul Mallik. Chronic posture pain in my upper back resolved after just 3 sessions.',
    reviewTimestamp: new Date(Date.now() - 38 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PENDING',
    isApproved: false,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 38 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-12',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTEy',
    reviewerName: 'Kavitha Reddy',
    starRating: 5,
    comment: 'Had desk posture strain and severe lower back muscle tightness. The cupping and spinal mobilization combination gave instant flexibility.',
    reviewTimestamp: new Date(Date.now() - 42 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Jubilee Hills, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    importedAt: new Date(Date.now() - 42 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-13',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTEz',
    reviewerName: 'Rahul Varma',
    starRating: 5,
    comment: 'Sports injury rehabilitation for my shoulder joint. Very knowledgeable healer with 25+ years experience. Highly recommended.',
    reviewTimestamp: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Gachibowli, Hyderabad',
    status: 'APPROVED',
    isApproved: true,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-14',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTE0',
    reviewerName: 'Ayesha Sultana',
    starRating: 5,
    comment: 'Sciatica nerve pain recovery without surgery. The A.M.M method care protocol is very effective and non-invasive.',
    reviewTimestamp: new Date(Date.now() - 48 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PENDING',
    isApproved: false,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 48 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-15',
    googleReviewId: 'ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRTE1',
    reviewerName: 'Venkatesh Rao',
    starRating: 5,
    comment: 'Top class chiropractic clinic in Hyderabad. Healer Abdul Mallik is very patient and explains MRI reports thoroughly.',
    reviewTimestamp: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PENDING',
    isApproved: false,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

// Audit Logger
export function createAuditLog(action: string, entity: string, entityId: string, metadata: string = '', actorEmail = 'admin@holisticedge.in'): AuditLogItem {
  const logs = loadLocal<AuditLogItem[]>(STORAGE_KEYS.AUDIT, []);
  const newLog: AuditLogItem = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    actorEmail,
    action,
    entity,
    entityId,
    metadata,
    timestamp: new Date().toISOString(),
  };
  const updated = [newLog, ...logs].slice(0, 100);
  saveLocal(STORAGE_KEYS.AUDIT, updated);
  return newLog;
}

export function getAuditLogs(): AuditLogItem[] {
  return loadLocal<AuditLogItem[]>(STORAGE_KEYS.AUDIT, []);
}

// GOOGLE REVIEWS SERVICE
export const googleReviewsStorage = {
  getAll(): GoogleReviewItem[] {
    const local = loadLocal<GoogleReviewItem[]>(STORAGE_KEYS.GOOGLE_REVIEWS, DEFAULT_GOOGLE_REVIEWS);
    if (!local || local.length < DEFAULT_GOOGLE_REVIEWS.length) {
      const mergedMap = new Map<string, GoogleReviewItem>();
      DEFAULT_GOOGLE_REVIEWS.forEach(item => mergedMap.set(item.id, item));
      if (Array.isArray(local)) {
        local.forEach(item => mergedMap.set(item.id, item));
      }
      const mergedList = Array.from(mergedMap.values());
      saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, mergedList);
      return mergedList;
    }
    return local;
  },
  
  getPublishedOnWebsite(): GoogleReviewItem[] {
    return this.getAll().filter(r => r.isPublishedOnWebsite && r.isApproved);
  },

  getIntegrationState(): GoogleIntegrationState {
    return loadLocal<GoogleIntegrationState>(STORAGE_KEYS.GOOGLE_SETTING, {
      isConnected: true,
      accountName: 'Holistic Edge Chiropractic & Wellness Clinic',
      accountId: 'accounts/109849203847291',
      locationId: 'locations/847291039847291',
      locationName: 'Mehdipatnam Branch',
      lastSyncedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      syncStatus: 'Success'
    });
  },

  updateIntegrationState(state: Partial<GoogleIntegrationState>): GoogleIntegrationState {
    const current = this.getIntegrationState();
    const updated = { ...current, ...state };
    saveLocal(STORAGE_KEYS.GOOGLE_SETTING, updated);
    createAuditLog('updated_google_setting', 'GoogleIntegrationSetting', undefined, JSON.stringify(state));
    return updated;
  },

  syncGoogleReviews(): { importedCount: number; reviews: GoogleReviewItem[] } {
    const current = this.getAll();
    // Simulate fetching fresh review from Google Business Profile API
    const newGoogleReviewId = `ChZDSUhNMG9nS0VJQ0FnSUNtNU9mTEV${Date.now()}`;
    const freshReview: GoogleReviewItem = {
      id: `g-rev-${Date.now()}`,
      googleReviewId: newGoogleReviewId,
      reviewerName: 'Venkatesh Rao',
      starRating: 5,
      comment: 'Top class chiropractic clinic in Hyderabad. Healer Abdul Mallik is very patient and explains the MRI reports thoroughly.',
      reviewTimestamp: new Date().toISOString(),
      hasReply: false,
      source: 'GOOGLE',
      location: 'Mehdipatnam, Hyderabad',
      status: 'PENDING',
      isApproved: false,
      isPublishedOnWebsite: false,
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduplication check
    const exists = current.some(r => r.googleReviewId === freshReview.googleReviewId || r.reviewerName === freshReview.reviewerName);
    let importedCount = 0;
    let updatedList = current;
    
    if (!exists) {
      updatedList = [freshReview, ...current];
      importedCount = 1;
      saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, updatedList);
      createAuditLog('synced_google_reviews', 'GoogleReview', freshReview.id, `Imported 1 new review from Google Business Profile`);
    }

    this.updateIntegrationState({
      lastSyncedAt: new Date().toISOString(),
      syncStatus: 'Success',
    });

    return { importedCount, reviews: updatedList };
  },

  approveReview(id: string): GoogleReviewItem | null {
    const reviews = this.getAll();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    reviews[idx] = {
      ...reviews[idx],
      isApproved: true,
      status: reviews[idx].isPublishedOnWebsite ? 'PUBLISHED' : 'APPROVED',
      updatedAt: new Date().toISOString(),
    };
    saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, reviews);
    createAuditLog('approved_google_review', 'GoogleReview', id, `Approved review by ${reviews[idx].reviewerName}`);
    return reviews[idx];
  },

  publishToWebsite(id: string): GoogleReviewItem | null {
    const reviews = this.getAll();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    reviews[idx] = {
      ...reviews[idx],
      isApproved: true,
      isPublishedOnWebsite: true,
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString(),
    };
    saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, reviews);
    createAuditLog('published_google_review_to_website', 'GoogleReview', id, `Published review by ${reviews[idx].reviewerName} to public website`);
    return reviews[idx];
  },

  unpublishFromWebsite(id: string): GoogleReviewItem | null {
    const reviews = this.getAll();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    reviews[idx] = {
      ...reviews[idx],
      isPublishedOnWebsite: false,
      status: 'UNPUBLISHED',
      updatedAt: new Date().toISOString(),
    };
    saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, reviews);
    createAuditLog('unpublished_google_review_from_website', 'GoogleReview', id, `Unpublished review by ${reviews[idx].reviewerName} from public website`);
    return reviews[idx];
  },

  archiveReview(id: string): GoogleReviewItem | null {
    const reviews = this.getAll();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    reviews[idx] = {
      ...reviews[idx],
      isPublishedOnWebsite: false,
      status: 'ARCHIVED',
      updatedAt: new Date().toISOString(),
    };
    saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, reviews);
    createAuditLog('archived_google_review', 'GoogleReview', id, 'Archived Google review');
    return reviews[idx];
  },

  toggleFeatured(id: string): GoogleReviewItem | null {
    const reviews = this.getAll();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    const newFeatured = !reviews[idx].isFeatured;
    reviews[idx] = {
      ...reviews[idx],
      isFeatured: newFeatured,
      updatedAt: new Date().toISOString(),
    };
    saveLocal(STORAGE_KEYS.GOOGLE_REVIEWS, reviews);
    createAuditLog('toggled_featured_google_review', 'GoogleReview', id, `${newFeatured ? 'Featured' : 'Unfeatured'} review by ${reviews[idx].reviewerName}`);
    return reviews[idx];
  }
};
