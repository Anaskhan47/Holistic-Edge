// ============================================================
// HOLISTIC EDGE — Centralized Upload Configuration
// ============================================================

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_FILE_SIZE_LABEL: '10 MB',
  ACCEPTED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
  ] as const,
  ACCEPTED_EXTENSIONS: 'JPG · PNG · WebP · AVIF',
  INPUT_ACCEPT: '.jpg,.jpeg,.png,.webp,.avif',
} as const;

export const PLACEMENT_GUIDANCE: Record<string, { label: string; recommend: string }> = {
  offer: { label: 'Offer Image', recommend: 'Recommended: 800×600px or wider (landscape)' },
  'hero-image': { label: 'Hero Image', recommend: 'Recommended: 1280×720px or wider (16:9)' },
  'service-hero': { label: 'Service Hero', recommend: 'Recommended: 1200×800px or wider' },
  condition: { label: 'Condition Image', recommend: 'Recommended: 800×600px or wider' },
  portrait: { label: 'Team Portrait', recommend: 'Recommended: 400×400px square' },
  clinic: { label: 'Clinic Photo', recommend: 'Recommended: 1200×800px or wider' },
  gallery: { label: 'Gallery Photo', recommend: 'Recommended: 1200×800px or wider' },
  general: { label: 'Image', recommend: 'Recommended: at least 800px wide' },
};

export type UploadPlacement = keyof typeof PLACEMENT_GUIDANCE;
