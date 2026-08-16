import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Star,
  Stethoscope,
  BookOpen,
  HelpCircle,
  UserCircle,
  Image,
  BarChart2,
  Bell,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Building2,
  Zap,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { cn } from '../../../lib/utils';
import logoImg from '../../../../Logo.png';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
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
  const { metrics, unreadCount } = useAdminStore();
  const location = useLocation();

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Appointments', path: '/admin/appointments', icon: <CalendarDays size={16} />, badge: metrics.todayAppointments > 0 ? metrics.todayAppointments : undefined },
        { label: 'Leads', path: '/admin/leads', icon: <Activity size={16} />, badge: metrics.newLeads > 0 ? metrics.newLeads : undefined },
        { label: 'Notifications', path: '/admin/notifications', icon: <Bell size={16} />, badge: unreadCount > 0 ? unreadCount : undefined },
      ],
    },
    {
      title: 'Content',
      items: [
        { label: 'Testimonials', path: '/admin/testimonials', icon: <Star size={16} />, badge: metrics.pendingTestimonials > 0 ? metrics.pendingTestimonials : undefined },
        { label: 'Services', path: '/admin/services', icon: <Stethoscope size={16} /> },
        { label: 'Conditions', path: '/admin/conditions', icon: <BookOpen size={16} /> },
        { label: 'FAQ', path: '/admin/faq', icon: <HelpCircle size={16} /> },
        { label: 'Team', path: '/admin/team', icon: <Users size={16} /> },
        { label: 'Clinic', path: '/admin/clinic', icon: <Building2 size={16} /> },
        { label: 'Media', path: '/admin/media', icon: <Image size={16} /> },
      ],
    },
    {
      title: 'Insights',
      items: [
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart2 size={16} /> },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Users & Roles', path: '/admin/users', icon: <ShieldCheck size={16} /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings size={16} /> },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: <ScrollText size={16} /> },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#111110] border-r border-white/[0.06] transition-all duration-300 ease-in-out flex-shrink-0',
        collapsed ? 'w-[56px]' : 'w-[220px]'
      )}
    >
      {/* Brand */}
      <div className={cn(
        'flex items-center border-b border-white/[0.06] flex-shrink-0',
        collapsed ? 'justify-center h-14 px-0' : 'gap-2.5 h-14 px-4'
      )}>
        {!collapsed && (
          <img src={logoImg} alt="Holistic Edge" className="h-7 w-auto object-contain brightness-[1.15]" />
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-[#0F2747] flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-1">
            {!collapsed && (
              <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                {group.title}
              </p>
            )}
            {collapsed && <div className="my-2 mx-3 border-t border-white/[0.06]" />}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'relative flex items-center gap-2.5 transition-all duration-150 group',
                    collapsed ? 'justify-center mx-2 my-0.5 rounded-lg h-9 w-9' : 'mx-2 my-0.5 rounded-lg h-8 px-2.5',
                    isActive
                      ? 'bg-white/[0.1] text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#2563EB] rounded-full" />
                  )}

                  <span className={cn(isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70')}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="text-[12.5px] font-medium leading-none flex-1">{item.label}</span>
                  )}

                  {/* Badge */}
                  {item.badge !== undefined && (
                    <span className={cn(
                      'flex-shrink-0 text-[10px] font-bold leading-none rounded-full bg-[#0F2747] text-white',
                      collapsed ? 'absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center' : 'px-1.5 py-0.5'
                    )}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-2">
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center h-8 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
