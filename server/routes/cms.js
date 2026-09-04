import express from 'express';
import { db } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cms/services
router.get('/services', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  let services = db.get('cmsServices');
  if (publishedOnly) {
    services = services.filter(s => s.status === 'PUBLISHED');
  }
  res.json({ success: true, count: services.length, services });
});

// GET /api/cms/conditions
router.get('/conditions', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  let conditions = db.get('cmsConditions');
  if (publishedOnly) {
    conditions = conditions.filter(c => c.status === 'PUBLISHED');
  }
  res.json({ success: true, count: conditions.length, conditions });
});

// GET /api/cms/faqs
router.get('/faqs', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  let faqs = db.get('cmsFaqs');
  if (publishedOnly) {
    faqs = faqs.filter(f => f.status === 'PUBLISHED');
  }
  res.json({ success: true, count: faqs.length, faqs });
});

// GET /api/cms/team
router.get('/team', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  let team = db.get('cmsTeam');
  if (publishedOnly) {
    team = team.filter(t => t.status === 'PUBLISHED' || t.isPublished);
  }
  res.json({ success: true, count: team.length, team });
});

// GET /api/cms/clinic
router.get('/clinic', (req, res) => {
  const settings = db.get('clinicSettings');
  res.json({ success: true, clinic: settings });
});

// GET /api/cms/offers
router.get('/offers', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  let offers = db.get('offers');
  if (publishedOnly) {
    offers = offers.filter(o => o.status === 'ACTIVE' || o.isPublished);
  }
  res.json({ success: true, count: offers.length, offers });
});

// POST /api/cms/offers
router.post('/offers', authenticate, (req, res) => {
  const offer = {
    id: `offer_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.insert('offers', offer);

  db.insert('auditLogs', {
    id: `audit_${Date.now()}`,
    actor: req.user?.name || 'Admin',
    action: 'created',
    entity: 'offer',
    entityId: offer.id,
    description: `Created offer: ${offer.title}`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({ success: true, offer });
});

// PUT /api/cms/offers/:id
router.put('/offers/:id', authenticate, (req, res) => {
  const updated = db.update('offers', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Offer not found' });
  res.json({ success: true, offer: updated });
});

export default router;
