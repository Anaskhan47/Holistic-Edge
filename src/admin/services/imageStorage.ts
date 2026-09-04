// ============================================================
// HOLISTIC EDGE — Image Storage Adapter
// Base64 + localStorage adapter. Swap this adapter to
// Vercel Blob / S3 / Cloudinary without changing any component.
// ============================================================

import { UPLOAD_CONFIG } from '../config/uploadConfig';
import clinicImg from '/holistic-edge-enhanced-clinic-room.svg';
import ammImg from '../../../AMM.svg';
import logoImg from '../../../Logo.png';

const STORAGE_KEY = 'he_admin_media_assets';
const MEDIA_UPDATED_EVENT = 'he_media_updated';

// ─── Types ────────────────────────────────────────────────────

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  url: string;           // base64 data URL (or CDN URL in production)
  storageKey: string;    // localStorage key or cloud path
  altText: string;
  caption: string;
  category: MediaCategory;
  usedIn: UsageRef[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived';
}

export type MediaCategory =
  | 'offers'
  | 'services'
  | 'conditions'
  | 'team'
  | 'clinic'
  | 'homepage'
  | 'amm-method'
  | 'other';

export interface UsageRef {
  module: string;   // e.g. 'offers', 'services'
  entityId: string;
  entityName: string;
}

// ─── Helpers ──────────────────────────────────────────────────

function generateId(): string {
  return `media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function read(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const now = new Date().toISOString();
      const initial: MediaAsset[] = [
        {
          id: 'media_clinic_01',
          filename: 'Clinc.png',
          originalName: 'Clinic Exterior & Reception',
          mimeType: 'image/png',
          sizeBytes: 2500561,
          width: 1200,
          height: 800,
          url: clinicImg,
          storageKey: 'media_clinic_01',
          altText: 'Holistic Edge Clinic facility and patient entrance',
          caption: 'Main clinic reception and treatment suites',
          category: 'clinic',
          usedIn: [],
          uploadedBy: 'Admin',
          createdAt: now,
          updatedAt: now,
          status: 'active',
        },
        {
          id: 'media_dr_mallik_01',
          filename: 'AMM.svg',
          originalName: 'Clinical Consultation Photo',
          mimeType: 'image/avif',
          sizeBytes: 149631,
          width: 800,
          height: 800,
          url: ammImg,
          storageKey: 'media_dr_mallik_01',
          altText: 'Healer Abdul Mallik performing spinal mobility evaluation',
          caption: 'Chief Chiropractic Director evaluating patient',
          category: 'team',
          usedIn: [],
          uploadedBy: 'Admin',
          createdAt: now,
          updatedAt: now,
          status: 'active',
        },
        {
          id: 'media_logo_01',
          filename: 'Logo.png',
          originalName: 'Official Clinic Logo Asset',
          mimeType: 'image/png',
          sizeBytes: 131476,
          width: 500,
          height: 500,
          url: logoImg,
          storageKey: 'media_logo_01',
          altText: 'Holistic Edge Brand Logo',
          caption: 'Primary brand logo asset',
          category: 'homepage',
          usedIn: [],
          uploadedBy: 'Admin',
          createdAt: now,
          updatedAt: now,
          status: 'active',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(assets: MediaAsset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    window.dispatchEvent(new CustomEvent(MEDIA_UPDATED_EVENT));
  } catch (e) {
    console.error('[ImageStorage] Write failed', e);
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ─── Validation ────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  if (!UPLOAD_CONFIG.ACCEPTED_MIME_TYPES.includes(file.type as never)) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type}". Accepted: ${UPLOAD_CONFIG.ACCEPTED_EXTENSIONS}`,
    };
  }
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `File is ${sizeMb} MB. Maximum allowed size is ${UPLOAD_CONFIG.MAX_FILE_SIZE_LABEL}.`,
    };
  }
  return { valid: true };
}

// ─── Main Storage API ─────────────────────────────────────────

export const imageStorage = {

  /** Upload a file and return a MediaAsset */
  async upload(
    file: File,
    options: Partial<{
      altText: string;
      caption: string;
      category: MediaCategory;
      uploadedBy: string;
    }> = {}
  ): Promise<MediaAsset> {
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const [base64, dimensions] = await Promise.all([
      fileToBase64(file),
      getImageDimensions(file),
    ]);

    const id = generateId();
    const asset: MediaAsset = {
      id,
      filename: id,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      width: dimensions.width,
      height: dimensions.height,
      url: base64,
      storageKey: id,
      altText: options.altText || '',
      caption: options.caption || '',
      category: options.category || 'other',
      usedIn: [],
      uploadedBy: options.uploadedBy || 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };

    const existing = read();
    write([...existing, asset]);
    return asset;
  },

  /** Get all active media assets */
  getAll(): MediaAsset[] {
    return read().filter(a => a.status === 'active');
  },

  /** Get a single asset by id */
  getById(id: string): MediaAsset | null {
    return read().find(a => a.id === id) || null;
  },

  /** Update alt text / caption / category on an asset */
  update(id: string, patch: Partial<Pick<MediaAsset, 'altText' | 'caption' | 'category'>>): void {
    const assets = read().map(a =>
      a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
    );
    write(assets);
  },

  /** Mark a usage reference on an asset */
  addUsage(assetId: string, ref: UsageRef): void {
    const assets = read().map(a => {
      if (a.id !== assetId) return a;
      const existing = a.usedIn.filter(
        u => !(u.module === ref.module && u.entityId === ref.entityId)
      );
      return { ...a, usedIn: [...existing, ref], updatedAt: new Date().toISOString() };
    });
    write(assets);
  },

  /** Remove a usage reference from an asset */
  removeUsage(assetId: string, module: string, entityId: string): void {
    const assets = read().map(a => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        usedIn: a.usedIn.filter(u => !(u.module === module && u.entityId === entityId)),
        updatedAt: new Date().toISOString(),
      };
    });
    write(assets);
  },

  /** Archive (soft-delete) — only if not actively used */
  archive(id: string): { success: boolean; usageCount: number } {
    const asset = read().find(a => a.id === id);
    if (!asset) return { success: false, usageCount: 0 };
    if (asset.usedIn.length > 0) {
      return { success: false, usageCount: asset.usedIn.length };
    }
    const assets = read().map(a =>
      a.id === id ? { ...a, status: 'archived' as const, updatedAt: new Date().toISOString() } : a
    );
    write(assets);
    return { success: true, usageCount: 0 };
  },

  /** Permanently delete an asset (use archive for safety) */
  delete(id: string): void {
    write(read().filter(a => a.id !== id));
  },

  /** Subscribe to media library changes */
  subscribe(handler: () => void): () => void {
    window.addEventListener(MEDIA_UPDATED_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(MEDIA_UPDATED_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },
};

export { MEDIA_UPDATED_EVENT };
