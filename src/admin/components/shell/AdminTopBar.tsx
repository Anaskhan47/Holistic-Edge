import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Settings,
  Plus,
  CalendarPlus,
  UserPlus,
  Star,
  X,
  Check,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import { cn } from '../../../lib/utils';

interface AdminTopBarProps {
  onSearchOpen: () => void;
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AdminTopBar({ onSearchOpen }: AdminTopBarProps) {
  const { user, logout } = useAdminAuth();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickActionsOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Generate breadcrumbs
  const breadcrumbs = React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];
    let path = '';
    for (const seg of segments) {
      path += '/' + seg;
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
      crumbs.push({ label, path });
    }
    return crumbs;
  }, [location.pathname]);

  const recentNotifs = notifications.filter(n => n.status !== 'archived').slice(0, 8);

  const notifTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <CalendarPlus size={13} className="text-[#1B4332]" />;
      case 'lead': return <UserPlus size={13} className="text-[#1A365D]" />;
      case 'testimonial': return <Star size={13} className="text-[#92400E]" />;
      default: return <Bell size={13} className="text-[#6B6661]" />;
    }
  };

  const quickActions = [
    { label: 'New Appointment', icon: <CalendarPlus size={14} />, path: '/admin/appointments/new' },
    { label: 'Add Lead', icon: <UserPlus size={14} />, path: '/admin/leads/new' },
    { label: 'Add Testimonial', icon: <Star size={14} />, path: '/admin/testimonials/new' },
  ];

  return (
    <header className="h-14 flex-shrink-0 flex items-center gap-3 px-4 bg-white border-b border-[#E5E2DC] z-20">
      {/* Breadcrumbs */}
      <nav className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <span className="text-[#C4BDB4] text-xs">/</span>}
            <button
              onClick={() => navigate(crumb.path)}
              className={cn(
                'truncate transition-colors',
                i === breadcrumbs.length - 1
                  ? 'text-[#1A1A1A] font-semibold cursor-default'
                  : 'text-[#9E968C] hover:text-[#1A1A1A]'
              )}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search Trigger */}
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 h-8 rounded-lg text-[#9E968C] hover:text-[#1A1A1A] bg-[#F8F7F4] hover:bg-[#F0ECE4] border border-[#E5E2DC] text-xs transition-colors"
        >
          <Search size={13} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] bg-white border border-[#E5E2DC] rounded px-1 py-0.5 font-mono">⌘K</kbd>
        </button>

        {/* Quick Actions */}
        <div ref={quickRef} className="relative">
          <button
            onClick={() => setQuickActionsOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#A94420] text-white hover:bg-[#8F3717] transition-colors"
            title="Quick actions"
          >
            <Plus size={15} />
          </button>
          {quickActionsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#E5E2DC] py-1 z-50">
              {quickActions.map(action => (
                <button
                  key={action.path}
                  onClick={() => { navigate(action.path); setQuickActionsOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#2C2926] hover:bg-[#F8F7F4] transition-colors"
                >
                  <span className="text-[#A94420]">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6661] hover:text-[#1A1A1A] hover:bg-[#F8F7F4] transition-colors"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[9px] font-bold bg-[#A94420] text-white rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-[#E5E2DC] overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E2DC]">
                <span className="text-sm font-semibold text-[#1A1A1A]">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#A94420] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-[#9E968C] hover:text-[#1A1A1A]">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#F0ECE4]">
                {recentNotifs.length === 0 ? (
                  <p className="text-center text-sm text-[#9E968C] py-8">No notifications</p>
                ) : (
                  recentNotifs.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifOpen(false);
                      }}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#F8F7F4] transition-colors',
                        n.status === 'unread' && 'bg-[#FBF2EC]'
                      )}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F4F1EA] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {notifTypeIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-medium text-[#1A1A1A] leading-tight">{n.title}</p>
                        <p className="text-[11.5px] text-[#6B6661] mt-0.5 leading-tight truncate">{n.message}</p>
                        <p className="text-[10.5px] text-[#9E968C] mt-1">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                      {n.status === 'unread' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A94420] flex-shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-[#E5E2DC] px-4 py-2">
                <button
                  onClick={() => { navigate('/admin/notifications'); setNotifOpen(false); }}
                  className="text-[12px] text-[#A94420] hover:underline w-full text-center"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-2 h-8 px-2 rounded-lg text-[#2C2926] hover:bg-[#F8F7F4] transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#A94420] flex items-center justify-center text-white text-[10px] font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-xs font-medium truncate max-w-[80px]">{user?.name}</span>
            <ChevronDown size={12} className="text-[#9E968C]" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#E5E2DC] py-1 z-50">
              <div className="px-3 py-2 border-b border-[#F0ECE4] mb-1">
                <p className="text-xs font-semibold text-[#1A1A1A] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#9E968C] truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] bg-[#FBF2EC] text-[#A94420] px-1.5 py-0.5 rounded font-medium">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={() => { navigate('/admin/settings'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#2C2926] hover:bg-[#F8F7F4]"
              >
                <Settings size={13} />
                Settings
              </button>
              <div className="border-t border-[#F0ECE4] mt-1 pt-1">
                <button
                  onClick={() => { logout(); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
