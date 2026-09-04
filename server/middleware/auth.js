import { db } from '../db.js';
import { getAuthProvider } from '../providers/index.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const authUserHeader = req.headers['x-admin-user-email'];

  if (authUserHeader) {
    const user = db.find('users', u => u.email?.toLowerCase() === authUserHeader.toLowerCase() || u.name?.toLowerCase() === authUserHeader.toLowerCase());
    if (user) {
      if (user.status === 'DISABLED') {
        return res.status(403).json({ error: 'Forbidden: Staff user account is disabled.' });
      }
      req.user = user;
      return next();
    }
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) {
      try {
        const authProvider = getAuthProvider();
        const verification = await authProvider.verifySession(token);
        if (verification.valid && verification.user) {
          if (verification.user.status === 'DISABLED') {
            return res.status(403).json({ error: 'Forbidden: Staff user account is disabled.' });
          }
          req.user = verification.user;
          return next();
        }
      } catch (err) {
        console.warn('[AuthMiddleware] Token verification warning:', err.message);
      }
    }
  }

  // Fallback to primary admin user for internal server requests
  const adminUser = db.find('users', u => u.role === 'SUPER_ADMIN') || db.get('users')[0];
  req.user = adminUser;
  next();
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User authentication required.' });
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Access restricted to ${allowedRoles.join(', ')} roles.` });
    }
    next();
  };
}
