// CMS & Data Storage Service — Real Management Source of Truth

export type ContentStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
export type ReviewSource = 'GOOGLE' | 'WEBSITE_DIRECT' | 'MANUAL_IMPORT' | 'PATIENT_FEEDBACK';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CONTENT_EDITOR';

export interface AuditLogItem {
  id: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: string;
  timestamp: string;
}

export interface TestimonialItem {
  id: string;
  displayName: string;
  patientName: string;
  condition: string;
  service?: string;
  rating: number;
  review: string;
  source: ReviewSource;
  status: ContentStatus;
  isFeatured: boolean;
  verified: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleReviewItem {
  id: string;
  googleReviewId: string;
  reviewerName: string;
  reviewerPhotoUrl?: string;
  starRating: number;
  comment?: string;
  reviewTimestamp: string;
  replyComment?: string;
  replyTimestamp?: string;
  hasReply: boolean;
  source: ReviewSource;
  location: string;
  status: ContentStatus;
  isApproved: boolean;
  isPublishedOnWebsite: boolean;
  importedAt: string;
  updatedAt: string;
}

export interface GoogleIntegrationState {
  isConnected: boolean;
  accountName?: string;
  accountId?: string;
  locationId?: string;
  locationName?: string;
  lastSyncedAt?: string;
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
  publishedAt?: string;
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
  publishedAt?: string;
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
  publishedAt?: string;
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
  philosophy?: string;
  specialization: string[];
  image: string;
  isFounder: boolean;
  displayOrder: number;
  status: ContentStatus;
  publishedAt?: string;
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
    comment: 'Extremely professional chiropractic care in Mehdipatnam. Dr. Abdul Mallik assessed my lumbar MRI thoroughly and started the A.M.M protocol. By session 4, my sciatica nerve pain was completely gone.',
    reviewTimestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    hasReply: true,
    replyComment: 'Thank you Imran bhai for trusting Holistic Edge. We are glad to hear about your sciatica recovery!',
    replyTimestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    importedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-2',
    googleReviewId: 'ChdDSUhNMG9nS0VJQ0FnSUNtNU9mTEVBRAE',
    reviewerName: 'Priya Sharma',
    starRating: 5,
    comment: 'I had severe cervical stiffness and morning headaches for 2 years. Dr. Mallik’s gentle adjustments and acupuncture provided relief from week 1. Highly recommend Holistic Edge!',
    reviewTimestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    importedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-rev-3',
    googleReviewId: 'ChdDSUhNMG9nS0VJQ0FnSUNtNU9mVEFBRAE',
    reviewerName: 'Syed Khalid',
    starRating: 5,
    comment: 'Avoided spine surgery thanks to Dr. Abdul Mallik. The 3-stage A.M.M method really works for disc bulge recovery.',
    reviewTimestamp: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'APPROVED',
    isApproved: true,
    isPublishedOnWebsite: false,
    importedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
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
export function createAuditLog(action: string, entity: string, entityId?: string, metadata?: string, actorEmail = 'admin@holisticedge.in'): AuditLogItem {
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
    return loadLocal<GoogleReviewItem[]>(STORAGE_KEYS.GOOGLE_REVIEWS, DEFAULT_GOOGLE_REVIEWS);
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
      comment: 'Top class chiropractic clinic in Hyderabad. Dr. Abdul Mallik is very patient and explains the MRI reports thoroughly.',
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
    createAuditLog('archived_google_review', 'GoogleReview', id);
    return reviews[idx];
  }
};
