import { getActiveMediaProvider } from '../providers/index.js';
import { db } from '../db.js';

export const MEDIA_CATEGORIES = [
  'Brand',
  'Doctor',
  'Team',
  'Clinic',
  'Services',
  'Conditions',
  'Offers',
  'Homepage',
  'AMM_Method',
  'Other',
];

export async function uploadMediaAsset({ filename, mimeType, size, category, altText, caption, uploadedBy }) {
  const mediaProvider = getActiveMediaProvider();
  const validCategory = MEDIA_CATEGORIES.includes(category) ? category : 'Other';

  const asset = await mediaProvider.upload({
    filename,
    mimeType,
    size,
    category: validCategory,
    altText,
    caption,
    uploadedBy: uploadedBy || 'Staff',
  });

  db.insert('auditLogs', {
    id: `audit_${Date.now()}`,
    actor: uploadedBy || 'Staff',
    actorId: 'staff',
    action: 'upload_media',
    entity: 'media_asset',
    entityId: asset.id,
    description: `Uploaded media asset '${filename}' under category '${validCategory}'`,
    timestamp: new Date().toISOString(),
  });

  return asset;
}

export async function getMediaLibrary(filters = {}) {
  const mediaProvider = getActiveMediaProvider();
  return mediaProvider.list(filters);
}

export async function trackMediaUsage(mediaId, referenceSource) {
  const asset = db.find('mediaAssets', m => m.id === mediaId);
  if (!asset) return;

  const currentRefs = asset.referencedBy || [];
  if (!currentRefs.includes(referenceSource)) {
    currentRefs.push(referenceSource);
    db.update('mediaAssets', mediaId, {
      referencedBy: currentRefs,
      usageCount: currentRefs.length,
      updatedAt: new Date().toISOString(),
    });
  }
}
