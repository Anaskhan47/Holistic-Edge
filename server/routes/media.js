import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getActiveMediaProvider } from '../providers/index.js';
import { uploadMediaAsset, getMediaLibrary } from '../services/mediaService.js';
import { db } from '../db.js';

const router = express.Router();
const mediaProvider = getActiveMediaProvider();

// GET /api/media
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, status } = req.query;
    const assets = await getMediaLibrary({ category, status });
    res.json({ success: true, count: assets.length, assets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/media/upload
router.post('/upload', authenticate, async (req, res) => {
  try {
    const { filename, mimeType, size, category, altText, caption } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required for media upload.' });
    }

    const asset = await uploadMediaAsset({
      filename,
      mimeType,
      size,
      category,
      altText,
      caption,
      uploadedBy: req.user?.name || 'Staff',
    });

    res.status(201).json({ success: true, asset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/media/:id (Replace / Update Metadata)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await mediaProvider.replace(req.params.id, req.body);
    res.json({ success: true, asset: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/media/:id (Safe Delete)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await mediaProvider.delete(req.params.id);
    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
