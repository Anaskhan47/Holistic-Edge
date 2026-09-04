import express from 'express';
import { db } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/audit-logs
router.get('/', authenticate, (req, res) => {
  const auditLogs = db.get('auditLogs');
  res.json({ success: true, count: auditLogs.length, auditLogs });
});

export default router;
