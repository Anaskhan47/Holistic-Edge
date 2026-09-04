import express from 'express';
import { db } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { getAuthProvider } from '../providers/index.js';
import { hasPermission } from '../services/authService.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const authProvider = getAuthProvider();
    const authResult = await authProvider.signIn(email, password);
    const userRole = authResult.user.role;

    db.insert('auditLogs', {
      id: `audit_${Date.now()}`,
      actor: authResult.user.name,
      actorId: authResult.user.id,
      action: 'login',
      entity: 'auth',
      entityId: authResult.user.id,
      description: `${authResult.user.name} logged into Clinic Operations (${userRole})`,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      user: {
        ...authResult.user,
        permissions: {
          canViewPatients: hasPermission(userRole, 'canViewPatients'),
          canManageSlots: hasPermission(userRole, 'canManageSlots'),
          canManageOffers: hasPermission(userRole, 'canManageOffers'),
          canManageUsers: hasPermission(userRole, 'canManageUsers'),
          canManageIntegrations: hasPermission(userRole, 'canManageIntegrations'),
        },
      },
      token: authResult.token,
      expiresAt: authResult.expiresAt,
    });
  } catch (err) {
    res.status(401).json({ error: err.message || 'Invalid email or password.' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const authProvider = getAuthProvider();
    const token = req.headers.authorization?.replace('Bearer ', '');
    await authProvider.signOut(token);

    if (req.user) {
      db.insert('auditLogs', {
        id: `audit_${Date.now()}`,
        actor: req.user.name,
        actorId: req.user.id,
        action: 'logout',
        entity: 'auth',
        entityId: req.user.id,
        description: `${req.user.name} logged out from Clinic Operations`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  try {
    const authProvider = getAuthProvider();
    const result = await authProvider.sendPasswordReset(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to send password reset email.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  res.json({
    success: true,
    user: {
      ...req.user,
      permissions: {
        canViewPatients: hasPermission(req.user.role, 'canViewPatients'),
        canManageSlots: hasPermission(req.user.role, 'canManageSlots'),
        canManageOffers: hasPermission(req.user.role, 'canManageOffers'),
        canManageUsers: hasPermission(req.user.role, 'canManageUsers'),
        canManageIntegrations: hasPermission(req.user.role, 'canManageIntegrations'),
      },
    },
  });
});

// GET /api/auth/users & /api/auth/staff
router.get(['/users', '/staff'], authenticate, (req, res) => {
  const users = db.get('users') || [];
  res.json({ success: true, count: users.length, users });
});

export default router;
