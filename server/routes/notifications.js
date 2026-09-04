import express from 'express';
import { db } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticate, (req, res) => {
  const notifications = db.get('notifications');
  res.json({ success: true, count: notifications.length, notifications });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, (req, res) => {
  const updated = db.update('notifications', req.params.id, { status: 'read' });
  if (!updated) return res.status(404).json({ error: 'Notification not found' });
  res.json({ success: true, notification: updated });
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, (req, res) => {
  const notifications = db.get('notifications').map(n => ({ ...n, status: 'read' }));
  db.set('notifications', notifications);
  res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
