export const ROLE_PERMISSIONS = {
  RECEPTION: {
    canViewPatients: true,
    canEditPatients: true,
    canCreateAppointments: true,
    canEditAppointments: true,
    canManageSlots: true,
    canSetFollowUps: true,
    canSendEmails: true,
    canViewNotifications: true,
    canManageOffers: false,
    canManageServices: false,
    canManageConditions: false,
    canManageFAQ: false,
    canManageTeam: false,
    canManageClinic: false,
    canManageMedia: false,
    canManageUsers: false,
    canManageIntegrations: false,
    canViewAuditLogs: false,
  },
  ADMIN: {
    canViewPatients: true,
    canEditPatients: true,
    canCreateAppointments: true,
    canEditAppointments: true,
    canManageSlots: true,
    canSetFollowUps: true,
    canSendEmails: true,
    canViewNotifications: true,
    canManageOffers: true,
    canManageServices: true,
    canManageConditions: true,
    canManageFAQ: true,
    canManageTeam: true,
    canManageClinic: true,
    canManageMedia: true,
    canManageUsers: false,
    canManageIntegrations: false,
    canViewAuditLogs: true,
  },
  SUPER_ADMIN: {
    canViewPatients: true,
    canEditPatients: true,
    canCreateAppointments: true,
    canEditAppointments: true,
    canManageSlots: true,
    canSetFollowUps: true,
    canSendEmails: true,
    canViewNotifications: true,
    canManageOffers: true,
    canManageServices: true,
    canManageConditions: true,
    canManageFAQ: true,
    canManageTeam: true,
    canManageClinic: true,
    canManageMedia: true,
    canManageUsers: true,
    canManageIntegrations: true,
    canViewAuditLogs: true,
  },
};

export function hasPermission(role, permissionName) {
  const roleConfig = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.RECEPTION;
  return Boolean(roleConfig[permissionName]);
}

export function enforcePermission(permissionName) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const allowed = hasPermission(req.user.role, permissionName);
    if (!allowed) {
      return res.status(403).json({
        error: `Forbidden. Your role (${req.user.role}) lacks permission: ${permissionName}`,
      });
    }
    next();
  };
}
