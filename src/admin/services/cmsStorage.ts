import { servicesData, type ServiceItem } from '../../data/services';
import { conditionsData } from '../../data/conditions';
import { teamData } from '../../data/team';
import type { Condition, TeamMember } from '../../types';
import { clinicInfo } from '../../data/clinicInfo';
import { auditStorage } from './adminStorage';
import type { AdminUser } from '../types/admin.types';

export type CmsContentType = 'service' | 'condition' | 'faq' | 'team' | 'clinic' | 'offer';
export type CmsStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';

export const CMS_UPDATED_EVENT = 'he_cms_updated';

export function notifyCmsChanged(contentType: CmsContentType, contentId: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(CMS_UPDATED_EVENT, {
        detail: { contentType, contentId, timestamp: Date.now() },
      })
    );
  }
}

export function sanitizeLocalStorageHealer() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith('he_') || key.startsWith('admin_') || key.startsWith('holistic_edge_')) {
        const val = localStorage.getItem(key);
        if (val && (val.includes('Healer ') || val.includes('Dr '))) {
          const sanitized = val
            .replace(/Dr\.\s*Abdul\s*Mallik/gi, 'Healer Abdul Mallik')
            .replace(/Dr\.\s*Mallik/gi, 'Healer Mallik')
            .replace(/Dr\.\s*Shah/gi, 'Healer Shah')
            .replace(/Dr\.\s*/gi, 'Healer ')
            .replace(/Dr\s+Abdul\s+Mallik/gi, 'Healer Abdul Mallik')
            .replace(/Dr\s+Mallik/gi, 'Healer Mallik');
          localStorage.setItem(key, sanitized);
        }
      }
    }
  } catch (e) {
    console.error('Local storage sanitation error', e);
  }
}

// Auto-run sanitation immediately on module initialization
sanitizeLocalStorageHealer();

// --------------------------------------------------------------------------
// 1. SERVICES
// --------------------------------------------------------------------------

export interface AdminServiceCms {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  icon: string;
  whatItIs: string;
  howItWorks: string[];
  benefits: string[];
  whoItsFor: string[];
  whatToExpect: ({ step: string; title: string; description: string } | string)[];
  relatedConditions: string[];
  faq: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: CmsStatus;
  publishedAt: string;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

const SERVICES_STORAGE_KEY = 'he_cms_services_v1';

export const servicesCmsStorage = {
  getAll(): AdminServiceCms[] {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) {
      const initial: AdminServiceCms[] = servicesData.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        subtitle: s.subtitle,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        heroImage: s.image,
        icon: (s as any).iconName || (s as any).icon || 'Activity',
        whatItIs: s.shortDescription,
        howItWorks: s.howItWorks,
        benefits: s.benefits,
        whoItsFor: (s as any).whoIsItFor || (s as any).whoItsFor || [],
        whatToExpect: Array.isArray(s.whatToExpect)
          ? s.whatToExpect.map((w: any, idx: number) => typeof w === 'string' ? { step: `Step ${idx + 1}`, title: w, description: w } : w)
          : [],
        relatedConditions: s.relatedConditions,
        faq: (s as any).faqs || (s as any).faq || [],
        seoTitle: s.title,
        seoDescription: s.shortDescription,
        featured: true,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }));
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      const items: AdminServiceCms[] = JSON.parse(raw);
      const updated = items
        .filter(item => item.id !== 'cupping-therapy' && item.slug !== 'cupping-therapy')
        .map(item => {
          const seed = servicesData.find(s => s.id === item.id || s.slug === item.slug);
          if (seed && seed.image) {
            return { ...item, heroImage: seed.image, image: seed.image };
          }
          return item;
        });
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return servicesData.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        subtitle: s.subtitle,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        heroImage: s.image,
        icon: (s as any).iconName || (s as any).icon || 'Activity',
        whatItIs: s.shortDescription,
        howItWorks: s.howItWorks,
        benefits: s.benefits,
        whoItsFor: (s as any).whoIsItFor || (s as any).whoItsFor || [],
        whatToExpect: Array.isArray(s.whatToExpect)
          ? s.whatToExpect.map((w: any, idx: number) => typeof w === 'string' ? { step: `Step ${idx + 1}`, title: w, description: w } : w)
          : [],
        relatedConditions: s.relatedConditions,
        faq: (s as any).faqs || (s as any).faq || [],
        seoTitle: s.title,
        seoDescription: s.shortDescription,
        featured: true,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }));
    }
  },

  getById(id: string): AdminServiceCms | null {
    return this.getAll().find(s => s.id === id) || null;
  },

  getBySlug(slug: string): AdminServiceCms | null {
    return this.getAll().find(s => s.slug === slug) || null;
  },

  saveDraft(item: Omit<AdminServiceCms, 'id' | 'createdAt' | 'updatedAt' | 'version'> & { id: string }): AdminServiceCms {
    const all = this.getAll();
    const now = new Date().toISOString();
    let result: AdminServiceCms;

    if (item.id && all.some(s => s.id === item.id)) {
      all.forEach((s, idx) => {
        if (s.id === item.id) {
          all[idx] = {
            ...s,
            ...item,
            id: s.id,
            status: 'DRAFT',
            updatedAt: now,
            version: s.version + 1,
          };
          result = all[idx];
        }
      });
    } else {
      result = {
        ...item,
        id: item.id || `srv_${Date.now()}`,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        version: 1,
      };
      all.unshift(result);
    }

    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('service', result!.id);
    return result!;
  },

  publish(id: string, actor: AdminUser): { success: boolean; item?: AdminServiceCms; error?: string } {
    const all = this.getAll();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, error: 'Service not found' };

    all[idx].status = 'PUBLISHED';
    all[idx].publishedAt = new Date().toISOString();
    all[idx].publishedBy = actor?.name || 'Admin';
    all[idx].updatedAt = new Date().toISOString();
    all[idx].version += 1;

    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('service', id);
    return { success: true, item: all[idx] };
  },

  unpublish(id: string): AdminServiceCms | null {
    const all = this.getAll();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return null;

    all[idx].status = 'UNPUBLISHED';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('service', id);
    return all[idx];
  },

  archive(id: string): AdminServiceCms | null {
    const all = this.getAll();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return null;

    all[idx].status = 'ARCHIVED';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('service', id);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(s => s.id !== id);
    if (filtered.length === all.length) return false;
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(filtered));
    notifyCmsChanged('service', id);
    return true;
  }
};

// --------------------------------------------------------------------------
// 2. CONDITIONS
// --------------------------------------------------------------------------

export interface AdminConditionCms {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  overview: string;
  symptoms: string[];
  treatmentApproach: string[];
  relatedServices: string[];
  faq: { question: string; answer: string }[];
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: CmsStatus;
  publishedAt: string;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

const CONDITIONS_STORAGE_KEY = 'he_cms_conditions_v1';

export const conditionsCmsStorage = {
  getAll(): AdminConditionCms[] {
    const raw = localStorage.getItem(CONDITIONS_STORAGE_KEY);
    if (!raw) {
      const initial: AdminConditionCms[] = conditionsData.map(c => ({
        id: c.id,
        name: c.title,
        slug: c.slug,
        category: c.category,
        shortDescription: c.shortDescription,
        overview: (c as any).overview || (c as any).fullDescription || (c as any).description || '',
        symptoms: c.symptoms,
        treatmentApproach: c.treatmentApproach,
        relatedServices: c.relatedServices,
        faq: (c as any).faqs || (c as any).faq || [],
        heroImage: c.image,
        seoTitle: (c as any).seoTitle || c.title,
        seoDescription: (c as any).seoDescription || c.shortDescription,
        featured: true,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }));
      localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      const items: AdminConditionCms[] = JSON.parse(raw);
      const updated = items.map(item => {
        const seed = conditionsData.find(c => c.id === item.id || c.slug === item.slug);
        if (seed && seed.image) {
          return { ...item, heroImage: seed.image, image: seed.image };
        }
        return item;
      });
      localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return conditionsData.map(c => ({
        id: c.id,
        name: c.title,
        slug: c.slug,
        category: c.category,
        shortDescription: c.shortDescription,
        overview: (c as any).overview || (c as any).fullDescription || (c as any).description || '',
        symptoms: c.symptoms,
        treatmentApproach: c.treatmentApproach,
        relatedServices: c.relatedServices,
        faq: (c as any).faq || (c as any).faqs || [],
        heroImage: c.image,
        seoTitle: (c as any).seoTitle || c.title,
        seoDescription: (c as any).seoDescription || c.shortDescription,
        featured: true,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }));
    }
  },

  getById(id: string): AdminConditionCms | null {
    return this.getAll().find(c => c.id === id) || null;
  },

  getBySlug(slug: string): AdminConditionCms | null {
    return this.getAll().find(c => c.slug === slug) || null;
  },

  saveDraft(item: Omit<AdminConditionCms, 'id' | 'createdAt' | 'updatedAt' | 'version'> & { id: string }): AdminConditionCms {
    const all = this.getAll();
    const now = new Date().toISOString();
    let result: AdminConditionCms;

    if (item.id && all.some(c => c.id === item.id)) {
      all.forEach((c, idx) => {
        if (c.id === item.id) {
          all[idx] = {
            ...c,
            ...item,
            id: c.id,
            status: 'DRAFT',
            updatedAt: now,
            version: c.version + 1,
          };
          result = all[idx];
        }
      });
    } else {
      result = {
        ...item,
        id: item.id || `cond_${Date.now()}`,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        version: 1,
      };
      all.unshift(result);
    }

    localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('condition', result!.id);
    return result!;
  },

  publish(id: string, actor: AdminUser): { success: boolean; item?: AdminConditionCms; error?: string } {
    const all = this.getAll();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return { success: false, error: 'Condition not found' };

    all[idx].status = 'PUBLISHED';
    all[idx].publishedAt = new Date().toISOString();
    all[idx].publishedBy = actor?.name || 'Admin';
    all[idx].updatedAt = new Date().toISOString();
    all[idx].version += 1;

    localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('condition', id);
    return { success: true, item: all[idx] };
  },

  unpublish(id: string): AdminConditionCms | null {
    const all = this.getAll();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return null;

    all[idx].status = 'UNPUBLISHED';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('condition', id);
    return all[idx];
  },

  archive(id: string): AdminConditionCms | null {
    const all = this.getAll();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return null;

    all[idx].status = 'ARCHIVED';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('condition', id);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(c => c.id !== id);
    if (filtered.length === all.length) return false;
    localStorage.setItem(CONDITIONS_STORAGE_KEY, JSON.stringify(filtered));
    notifyCmsChanged('condition', id);
    return true;
  }
};

// --------------------------------------------------------------------------
// 3. FAQ
// --------------------------------------------------------------------------

export interface AdminFaqCms {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  featured: boolean;
  status: CmsStatus;
  publishedAt: string;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
}

const FAQ_STORAGE_KEY = 'he_cms_faq_v1';

const INITIAL_FAQS: Omit<AdminFaqCms, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    question: 'How is Holistic Edge different from a typical spine or physiotherapy clinic•',
    answer: 'Holistic Edge focuses on non-surgical, non-medicinal root-cause realignment through our signature A.M.M Method™, precision chiropractic adjustments, and integrated therapies led by Healer Abdul Mallik.',
    category: 'General',
    sortOrder: 1,
    featured: true,
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    publishedBy: 'System Seed',
  },
  {
    question: 'Is chiropractic treatment safe•',
    answer: 'Yes. Chiropractic care at Holistic Edge is performed by experienced, certified practitioners following exhaustive clinical safety protocols and personalized biomechanical evaluations.',
    category: 'Safety',
    sortOrder: 2,
    featured: true,
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    publishedBy: 'System Seed',
  },
  {
    question: 'Do I need a doctor referral or prior MRI/X-ray•',
    answer: 'No referral is needed. If you have recent X-rays or MRI reports, please bring them to your consultation for a more comprehensive structural assessment.',
    category: 'Appointments',
    sortOrder: 3,
    featured: true,
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    publishedBy: 'System Seed',
  },
  {
    question: 'What happens during my first consultation•',
    answer: 'Your first visit includes a detailed medical history intake, physical postural and spinal palpation exam, mobility testing, and an honest discussion of your personalized treatment protocol.',
    category: 'Appointments',
    sortOrder: 4,
    featured: false,
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    publishedBy: 'System Seed',
  },
];

export const faqCmsStorage = {
  getAll(): AdminFaqCms[] {
    const raw = localStorage.getItem(FAQ_STORAGE_KEY);
    if (!raw) {
      const initial: AdminFaqCms[] = INITIAL_FAQS.map((f, i) => ({
        ...f,
        id: `faq_${i + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FAQS.map((f, i) => ({
        ...f,
        id: `faq_${i + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
  },

  getById(id: string): AdminFaqCms | null {
    return this.getAll().find(f => f.id === id) || null;
  },

  saveDraft(item: Omit<AdminFaqCms, 'id' | 'createdAt' | 'updatedAt'> & { id: string }): AdminFaqCms {
    const all = this.getAll();
    const now = new Date().toISOString();
    let result: AdminFaqCms;

    if (item.id && all.some(f => f.id === item.id)) {
      all.forEach((f, idx) => {
        if (f.id === item.id) {
          all[idx] = {
            ...f,
            ...item,
            id: f.id,
            status: 'DRAFT',
            updatedAt: now,
          };
          result = all[idx];
        }
      });
    } else {
      result = {
        ...item,
        id: item.id || `faq_${Date.now()}`,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
      };
      all.push(result);
    }

    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('faq', result!.id);
    return result!;
  },

  publish(id: string, actor: AdminUser): { success: boolean; item?: AdminFaqCms; error?: string } {
    const all = this.getAll();
    const idx = all.findIndex(f => f.id === id);
    if (idx === -1) return { success: false, error: 'FAQ not found' };

    all[idx].status = 'PUBLISHED';
    all[idx].publishedAt = new Date().toISOString();
    all[idx].publishedBy = actor?.name || 'Admin';
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('faq', id);
    return { success: true, item: all[idx] };
  },

  unpublish(id: string): AdminFaqCms | null {
    const all = this.getAll();
    const idx = all.findIndex(f => f.id === id);
    if (idx === -1) return null;

    all[idx].status = 'UNPUBLISHED';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('faq', id);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(f => f.id !== id);
    if (filtered.length === all.length) return false;
    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(filtered));
    notifyCmsChanged('faq', id);
    return true;
  }
};

// --------------------------------------------------------------------------
// 4. TEAM
// --------------------------------------------------------------------------

export interface AdminTeamCms {
  id: string;
  name: string;
  role: string;
  profilePhoto: string;
  bio: string;
  qualifications: string[];
  experience: string;
  specializations: string[];
  profileSlug: string;
  displayOrder: number;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  status: CmsStatus;
  publishedAt: string;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
}

const TEAM_STORAGE_KEY = 'he_cms_team_v1';

export const teamCmsStorage = {
  getAll(): AdminTeamCms[] {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) {
      const initial: AdminTeamCms[] = teamData.map((m, i) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        profilePhoto: '/healer-abdul-mallik-desk.jpg',
        bio: m.bio,
        qualifications: [m.qualifications],
        experience: String(m.experienceYears),
        specializations: m.specialization,
        profileSlug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: i + 1,
        featured: i === 0,
        seoTitle: `${m.name} | Holistic Edge Team`,
        seoDescription: m.bio.substring(0, 150),
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return teamData.map((m, i) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        profilePhoto: '/healer-abdul-mallik-desk.jpg',
        bio: m.bio,
        qualifications: [m.qualifications],
        experience: String(m.experienceYears),
        specializations: m.specialization,
        profileSlug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: i + 1,
        featured: i === 0,
        seoTitle: `${m.name} | Holistic Edge Team`,
        seoDescription: m.bio.substring(0, 150),
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
  },

  getById(id: string): AdminTeamCms | null {
    return this.getAll().find(m => m.id === id) || null;
  },

  saveDraft(item: Omit<AdminTeamCms, 'id' | 'createdAt' | 'updatedAt'> & { id: string }): AdminTeamCms {
    const all = this.getAll();
    const now = new Date().toISOString();
    let result: AdminTeamCms;

    if (item.id && all.some(m => m.id === item.id)) {
      all.forEach((m, idx) => {
        if (m.id === item.id) {
          all[idx] = {
            ...m,
            ...item,
            id: m.id,
            status: 'DRAFT',
            updatedAt: now,
          };
          result = all[idx];
        }
      });
    } else {
      result = {
        ...item,
        id: item.id || `team_${Date.now()}`,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
      };
      all.push(result);
    }

    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('team', result!.id);
    return result!;
  },

  publish(id: string, actor: AdminUser): { success: boolean; item?: AdminTeamCms; error?: string } {
    const all = this.getAll();
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) return { success: false, error: 'Team member not found' };

    all[idx].status = 'PUBLISHED';
    all[idx].publishedAt = new Date().toISOString();
    all[idx].publishedBy = actor?.name || 'Admin';
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('team', id);
    return { success: true, item: all[idx] };
  },

  unpublish(id: string): AdminTeamCms | null {
    const all = this.getAll();
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) return null;

    all[idx].status = 'UNPUBLISHED';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(all));
    notifyCmsChanged('team', id);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(m => m.id !== id);
    if (filtered.length === all.length) return false;
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(filtered));
    notifyCmsChanged('team', id);
    return true;
  }
};

// --------------------------------------------------------------------------
// 5. CLINIC INFO
// --------------------------------------------------------------------------

export interface AdminClinicCms {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  freeConsultationNotice: string;
  openingHours: { days: string; hours: string }[];
  facilities: string[];
  googleMapsUrl: string;
  clinicPhoto: string;
  galleryImages: string[];
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string;
  publishedBy: string;
  updatedAt: string;
}

const CLINIC_STORAGE_KEY = 'he_cms_clinic_v1';

export const clinicCmsStorage = {
  get(): AdminClinicCms {
    const raw = localStorage.getItem(CLINIC_STORAGE_KEY);
    if (!raw) {
      const initial: AdminClinicCms = {
        name: clinicInfo.name,
        tagline: clinicInfo.tagline,
        description: (clinicInfo as any).description || 'Specialized Chiropractic & Non-Surgical Joint Restoration Care',
        phone: clinicInfo.phone,
        phoneRaw: clinicInfo.phoneRaw,
        whatsapp: clinicInfo.whatsapp,
        email: (clinicInfo as any).email || 'holisticedges@gmail.com',
        address: clinicInfo.address,
        city: clinicInfo.city,
        pincode: clinicInfo.pincode,
        freeConsultationNotice: clinicInfo.freeConsultationNotice,
        openingHours: [
          { days: 'Monday – Saturday', hours: '10:00 AM – 8:00 PM' },
          { days: 'Sunday', hours: '10:00 AM – 2:00 PM (By Appointment)' },
        ],
        facilities: [
          'Advanced Spinal Decompression Unit',
          'Private Treatment Suites',
          'Digital Posture Assessment Zone',
          'Zero-Wait Reception Protocol',
        ],
        googleMapsUrl: 'https://maps.google.com',
        clinicPhoto: '/brand/holistic-edge-official-logo.png',
        galleryImages: [],
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Seed',
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return clinicInfo as any;
    }
  },

  save(data: Partial<AdminClinicCms>, publish = true, actor: AdminUser): AdminClinicCms {
    const current = this.get();
    const updated: AdminClinicCms = {
      ...current,
      ...data,
      status: publish ? 'PUBLISHED' : 'DRAFT',
      publishedAt: publish ? new Date().toISOString() : current.publishedAt,
      publishedBy: publish ? actor?.name || 'Admin' : current.publishedBy,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(updated));
    notifyCmsChanged('clinic', 'clinic_info');
    return updated;
  }
};

// --------------------------------------------------------------------------
// 6. PUBLIC DATA GETTERS (Only PUBLISHED items returned)
// --------------------------------------------------------------------------

export function getPublishedServices(): AdminServiceCms[] {
  return servicesCmsStorage.getAll().filter(s => s.status === 'PUBLISHED');
}

export function getPublishedServiceBySlug(slug: string): AdminServiceCms | null {
  if (!slug) return null;
  const norm = slug.toLowerCase().trim();
  const all = getPublishedServices();
  const found = all.find(s => s.slug?.toLowerCase().trim() === norm || s.id?.toLowerCase().trim() === norm);
  if (found) return found;

  const staticMatch = servicesData.find(s => s.slug.toLowerCase().trim() === norm || s.id.toLowerCase().trim() === norm);
  if (staticMatch) {
    return {
      ...staticMatch,
      name: staticMatch.title,
      heroImage: staticMatch.image,
      featured: true,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    } as any;
  }
  return null;
}

export function getPublishedConditions(): AdminConditionCms[] {
  return conditionsCmsStorage.getAll().filter(c => c.status === 'PUBLISHED');
}

export function getPublishedConditionBySlug(slug: string): AdminConditionCms | null {
  if (!slug) return null;
  const norm = slug.toLowerCase().trim();
  const all = getPublishedConditions();
  const found = all.find(c => c.slug?.toLowerCase().trim() === norm || c.id?.toLowerCase().trim() === norm);
  if (found) return found;

  const staticMatch = conditionsData.find(c => c.slug.toLowerCase().trim() === norm || c.id.toLowerCase().trim() === norm);
  if (staticMatch) {
    return {
      id: staticMatch.id,
      name: staticMatch.title,
      slug: staticMatch.slug,
      category: staticMatch.category,
      shortDescription: staticMatch.shortDescription,
      overview: staticMatch.shortDescription,
      symptoms: staticMatch.symptoms,
      treatmentApproach: staticMatch.treatmentApproach,
      relatedServices: staticMatch.relatedServices,
      faq: (staticMatch.faqs || []).map((f: any) => ({ question: f.question, answer: f.answer })),
      heroImage: staticMatch.image,
      featured: true,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      title: staticMatch.title,
      image: staticMatch.image,
      whenToSeekHelp: (staticMatch as any).whenToSeekHelp,
      recoveryTimelineExpectation: staticMatch.recoveryTimelineExpectation,
      faqs: staticMatch.faqs,
    } as any;
  }
  return null;
}

export function getPublishedFaqs(): AdminFaqCms[] {
  return faqCmsStorage.getAll().filter(f => f.status === 'PUBLISHED').sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedTeam(): AdminTeamCms[] {
  return teamCmsStorage.getAll().filter(m => m.status === 'PUBLISHED').sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getPublishedClinic(): AdminClinicCms {
  return clinicCmsStorage.get();
}


