import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Stethoscope,
  BookOpen,
  HelpCircle,
  Image,
  BarChart2,
  Bell,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Building2,
  ShieldCheck,
  Activity,
  Tag,
  Clock,
  UserCheck,
  CalendarCheck,
  Mail,
  Server,
  Layers,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { cn } from '../../../lib/utils';
import logoImg from '../../../../Logo.png';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavClick?: () => void;
}

export function AdminSidebar({ collapsed, onToggle, onNavClick }: AdminSidebarProps) {
  const location = useLocation();
  const { offers, unreadNotificationsCount, dueFollowUpsCount, activeLeadsCount } = useAdminStore();
  const { user } = useAdminAuth();

  const userRole = user?.role || 'ADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isReception = userRole === 'RECEPTION';

  const navGroups: NavGroup[] = [
    {
      title: 'Operations',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutGrid size={18} /> },
        { label: 'Appointments', path: '/admin/appointments', icon: <CalendarDays size={18} /> },
        { label: 'Patients', path: '/admin/patients', icon: <Users size={18} /> },
        { label: 'Slots & Capacity', path: '/admin/booking-slots', icon: <Clock size={18} /> },
        {
          label: 'Follow-ups',
          path: '/admin/follow-ups',
          icon: <CalendarCheck size={18} />,
          badge: dueFollowUpsCount > 0 ? dueFollowUpsCount: undefined,
        },
        {
          label: 'Notifications',
          path: '/admin/notifications',
          icon: <Bell size={18} />,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount: undefined,
        },
        {
          label: 'Lead Enquiries',
          path: '/admin/leads',
          icon: <UserCheck size={18} />,
          badge: activeLeadsCount > 0 ? activeLeadsCount: undefined,
        },
      ],
    },
    ...(!isReception ? [
      {
        title: 'Clinic Content (CMS)',
        items: [
          { label: 'Services', path: '/admin/services', icon: <Stethoscope size={18} /> },
          { label: 'Conditions', path: '/admin/conditions', icon: <Activity size={18} /> },
          {
            label: 'Special Offers',
            path: '/admin/offers',
            icon: <Tag size={18} />,
            badge: offers ? offers.filter(o => o.active).length || undefined: undefined,
          },
          { label: 'Reviews', path: '/admin/reviews', icon: <BarChart2 size={18} /> },
          { label: 'FAQ', path: '/admin/faq', icon: <HelpCircle size={18} /> },
          { label: 'Media Library', path: '/admin/media', icon: <Image size={18} /> },
        ],
      },
      {
        title: 'Administration',
        items: [
          ...(isSuperAdmin ? [
            { label: 'Staff & Roles', path: '/admin/users', icon: <Building2 size={18} /> },
            { label: 'Email Logs', path: '/admin/email', icon: <Mail size={18} /> },
            { label: 'Integrations', path: '/admin/integrations', icon: <Layers size={18} /> },
            { label: 'System Health', path: '/admin/system-health', icon: <Server size={18} /> },
            { label: 'Audit Log', path: '/admin/audit-logs', icon: <ScrollText size={18} /> },
          ] : []),
          { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
        ],
      },
    ] : []),
  ];

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#060B17] border-r border-[#17243A] transition-all duration-300 ease-in-out flex-shrink-0 z-30 font-sans',
        collapsed ? 'w-[60px]' : 'w-[230px]'
      )}
    >
      {/* Brand Header & Logo */}
      <div
        className={cn(
          'flex items-center border-b border-[#17243A] flex-shrink-0',
          collapsed ? 'justify-center h-16 px-0' : 'h-16 px-3'
        )}
      >
        {!collapsed ? (
          <div className="bg-white rounded-xl px-2 py-1 shadow-sm max-w-[190px] flex items-center justify-center">
            <img
              src="/brand/admin-logo.png"
              alt="Holistic Edge"
              className="h-7.5 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = logoImg;
              }}
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center text-[#38BDF8]">
            <ShieldCheck size={16} />
          </div>
        )}
      </div>

      {/* Nav Groups Container */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-2">
            {!collapsed ? (
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {group.title}
              </p>
            ) : (
              <div className="my-2 mx-3 border-t border-[#17243A]" />
            )}

            {group.items.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  title={collapsed ? item.label: undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 mx-2 rounded-xl text-xs font-medium transition-all duration-150 group relative',
                    collapsed && 'justify-center px-0 mx-2',
                    isActive
                      ? 'bg-[#0284C7] text-white shadow-md shadow-sky-900/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  <span className={cn('flex-shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200')}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!collapsed && item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white leading-none">
                      {item.badge}
                    </span>
                  )}

                  {collapsed && item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#060B17]" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#17243A] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pl-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="truncate">{user?.name || 'Staff User'}</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-auto cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
