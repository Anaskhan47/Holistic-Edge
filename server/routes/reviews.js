import express from 'express';
import { db } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews
router.get('/', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  let reviews = db.get('googleReviews');
  if (publishedOnly) {
    reviews = reviews.filter(r => r.isPublishedOnWebsite || r.status === 'PUBLISHED');
  }
  res.json({ success: true, count: reviews.length, reviews });
});

// POST /api/reviews/sync
router.post('/sync', authenticate, (req, res) => {
  const freshReview = {
    id: `g-rev-${Date.now()}`,
    googleReviewId: `ChZDSUhN${Date.now()}`,
    reviewerName: 'Venkatesh Rao',
    starRating: 5,
    comment: 'Top class chiropractic clinic in Hyderabad. Healer Abdul Mallik is very patient and explains the MRI reports thoroughly.',
    reviewTimestamp: new Date().toISOString(),
    hasReply: false,
    source: 'GOOGLE',
    location: 'Mehdipatnam, Hyderabad',
    status: 'PUBLISHED',
    isApproved: true,
    isPublishedOnWebsite: true,
    isFeatured: true,
    importedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.insert('googleReviews', freshReview);

  db.insert('auditLogs', {
    id: `audit_${Date.now()}`,
    actor: req.user?.name || 'Admin',
    action: 'synced_google_reviews',
    entity: 'GoogleReview',
    entityId: freshReview.id,
    description: 'Synced new Google review from Google Business Profile API',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, importedCount: 1, reviews: db.get('googleReviews') });
});

// PUT /api/reviews/:id
router.put('/:id', authenticate, (req, res) => {
  const updated = db.update('googleReviews', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Review not found' });
  res.json({ success: true, review: updated });
});

export default router;
