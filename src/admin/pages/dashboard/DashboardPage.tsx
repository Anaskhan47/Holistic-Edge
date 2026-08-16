import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Activity,
  Bell,
  Star,
  Clock,
  Phone,
  MessageSquare,
  Plus,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  UserPlus,
  RefreshCw,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { appointmentStorage, leadStorage, auditStorage } from '../../services/adminStorage';
import { clinicInfo } from '../../../data/clinicInfo';

function greeting(name: string): string {
  const h = new Date().getHours();
  const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${time}, ${name.split(' ')[0]}`;
}

function formatTime(isoOrDate: string): string {
  const d = new Date(isoOrDate);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function MetricCard({
  label, value, sub, icon, color, onClick,
}: {
  label: string; value: number | string; sub?: string; icon: React.ReactNode;
  color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white border border-[#E5E2DC] rounded-2xl p-5 hover:border-[#D5CFC5] hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <ArrowRight size={14} className="text-[#C4BDB4] group-hover:text-[#9E968C] transition-colors" />
      </div>
      <p className="text-2xl font-bold text-[#1A1A1A] leading-none mb-1">{value}</p>
      <p className="text-xs font-medium text-[#5A544E]">{label}</p>
      {sub && <p className="text-[11px] text-[#9E968C] mt-0.5">{sub}</p>}
    </button>
  );
}

export function DashboardPage() {
  const { user } = useAdminAuth();
  const { metrics, refreshMetrics, refreshAppointments, refreshLeads } = useAdminStore();
  const navigate = useNavigate();

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Load live data
  const todayAppts = useMemo(() => appointmentStorage.getTodayAppointments(), []);
  const recentLeads = useMemo(() => leadStorage.getAll().slice(0, 5), []);
  const recentActivity = useMemo(() => auditStorage.getRecent(8), []);

  const attentionItems = useMemo(() => {
    const items: { label: string; count: number; path: string; color: string; icon: React.ReactNode }[] = [];
    if (metrics.newLeads > 0) items.push({ label: 'New inquiries', count: metrics.newLeads, path: '/admin/leads?status=New', color: 'text-[#1E40AF]', icon: <Activity size={14} /> });
    if (metrics.pendingTestimonials > 0) items.push({ label: 'Testimonials awaiting approval', count: metrics.pendingTestimonials, path: '/admin/testimonials?status=Pending', color: 'text-amber-700', icon: <Star size={14} /> });
    if (metrics.cancelledToday > 0) items.push({ label: 'Cancelled today', count: metrics.cancelledToday, path: '/admin/appointments?status=Cancelled', color: 'text-red-700', icon: <XCircle size={14} /> });
    if (metrics.pendingFollowUps > 0) items.push({ label: 'Follow-ups due', count: metrics.pendingFollowUps, path: '/admin/leads?status=Follow-up', color: 'text-amber-700', icon: <Clock size={14} /> });
    return items;
  }, [metrics]);

  const activityIcons: Record<string, React.ReactNode> = {
    approved: <CheckCircle2 size={13} className="text-green-600" />,
    created: <Plus size={13} className="text-[#A94420]" />,
    updated: <RefreshCw size={13} className="text-[#1A365D]" />,
    cancelled: <XCircle size={13} className="text-red-500" />,
    confirmed: <CheckCircle2 size={13} className="text-green-600" />,
    initialized: <Star size={13} className="text-[#9E968C]" />,
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">{greeting(user?.name ?? 'Admin')}</h1>
          <p className="text-sm text-[#9E968C] mt-0.5">{dateLabel}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/admin/appointments/new')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#A94420] text-white text-xs font-semibold hover:bg-[#8F3717] transition-colors"
          >
            <CalendarPlus size={13} />
            New Appointment
          </button>
          <button
            onClick={() => navigate('/admin/leads/new')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E2DC] bg-white text-xs font-medium text-[#2C2926] hover:bg-[#F8F7F4] transition-colors"
          >
            <UserPlus size={13} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Today's Appointments"
          value={metrics.todayAppointments}
          sub={`${todayAppts.filter(a => a.status === 'Confirmed').length} confirmed`}
          icon={<CalendarDays size={17} className="text-[#1B4332]" />}
          color="bg-green-50"
          icon={<CalendarDays size={17} className="text-[#0F2747]" />}
          color="bg-blue-50"
          onClick={() => navigate('/admin/appointments')}
        />
        <MetricCard
          label="New Leads"
          value={metrics.newLeads}
          sub="Awaiting contact"
          icon={<Activity size={17} className="text-[#0F2747]" />}
          color="bg-blue-50"
          onClick={() => navigate('/admin/leads?status=New')}
        />
        <MetricCard
          label="Pending Follow-ups"
          value={metrics.pendingFollowUps}
          sub="Action required"
          icon={<Clock size={17} className="text-[#0F2747]" />}
          color="bg-blue-50"
          onClick={() => navigate('/admin/leads?status=Follow-up')}
        />
        <MetricCard
          label="Unread Notifications"
          value={metrics.unreadNotifications}
          icon={<Bell size={17} className="text-[#0F2747]" />}
          color="bg-blue-50"
          onClick={() => navigate('/admin/notifications')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0ECE4]">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Today's Schedule</h2>
              <p className="text-[11px] text-[#9E968C] mt-0.5">{todayAppts.length} appointment{todayAppts.length !== 1 ? 's' : ''} today</p>
            </div>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="text-xs text-[#A94420] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </button>
          </div>

          {todayAppts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <CalendarDays size={24} className="text-[#C4BDB4] mb-3" />
              <p className="text-sm font-medium text-[#5A544E]">No appointments today</p>
              <p className="text-xs text-[#9E968C] mt-1">Schedule is clear for today</p>
              <button
                onClick={() => navigate('/admin/appointments/new')}
                className="mt-4 flex items-center gap-1.5 text-xs text-[#A94420] hover:underline"
              >
                <Plus size={12} /> New Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F0ECE4]">
              {todayAppts.map(appt => (
                <button
                  key={appt.id}
                  onClick={() => navigate(`/admin/appointments/${appt.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors text-left group"
                >
                  <div className="w-14 flex-shrink-0">
                    <p className="text-xs font-semibold text-[#1A1A1A]">{appt.preferredTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{appt.fullName}</p>
                    <p className="text-[11.5px] text-[#9E968C] truncate">{appt.service}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`tel:${appt.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="w-7 h-7 rounded-lg bg-[#F4F1EA] flex items-center justify-center text-[#5A544E] hover:bg-[#E8E4DC]"
                    >
                      <Phone size={12} />
                    </a>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Attention + Activity */}
        <div className="flex flex-col gap-4">
          {/* Needs Attention */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Needs Attention</h2>
            </div>
            {attentionItems.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <CheckCircle2 size={20} className="text-green-500 mx-auto mb-2" />
                <p className="text-xs text-[#9E968C]">Everything looks good!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0ECE4]">
                {attentionItems.map(item => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F8F7F4] transition-colors text-left"
                  >
                    <span className={item.color}>{item.icon}</span>
                    <span className="flex-1 text-[12.5px] text-[#2C2926]">{item.label}</span>
                    <span className="text-xs font-bold bg-[#F4F1EA] text-[#5A544E] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden flex-1">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Recent Activity</h2>
              <button
                onClick={() => navigate('/admin/audit-logs')}
                className="text-[11px] text-[#9E968C] hover:text-[#A94420]"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-[#F0ECE4] max-h-64 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <p className="text-center text-xs text-[#9E968C] py-6">No activity yet</p>
              ) : (
                recentActivity.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                    <div className="w-5 h-5 rounded-full bg-[#F4F1EA] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {activityIcons[entry.action] ?? <Activity size={11} className="text-[#9E968C]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#2C2926] leading-tight">{entry.description}</p>
                      <p className="text-[10.5px] text-[#9E968C] mt-0.5">{entry.actor} · {formatRelative(entry.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0ECE4]">
          <div>
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Recent Inquiries</h2>
            <p className="text-[11px] text-[#9E968C] mt-0.5">Latest patient leads</p>
          </div>
          <button
            onClick={() => navigate('/admin/leads')}
            className="text-xs text-[#A94420] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0ECE4]">
                {['Name', 'Condition', 'Source', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-[#9E968C] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F7F4]">
              {recentLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#F8F7F4] transition-colors group">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/leads/${lead.id}`)}
                      className="font-medium text-[#1A1A1A] hover:text-[#A94420] text-left"
                    >
                      {lead.fullName}
                    </button>
                    <p className="text-[11px] text-[#9E968C]">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-[#5A544E]">{lead.condition}</td>
                  <td className="px-4 py-3 text-[12.5px] text-[#9E968C]">{lead.source}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-[11px] text-[#9E968C] whitespace-nowrap">{formatRelative(lead.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`tel:${lead.phone}`}
                        className="w-7 h-7 rounded-lg bg-[#F4F1EA] flex items-center justify-center text-[#5A544E] hover:bg-[#E8E4DC]"
                        title="Call"
                      >
                        <Phone size={11} />
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100"
                        title="WhatsApp"
                      >
                        <MessageSquare size={11} />
                      </a>
                      <button
                        onClick={() => navigate(`/admin/leads/${lead.id}`)}
                        className="w-7 h-7 rounded-lg bg-[#F4F1EA] flex items-center justify-center text-[#5A544E] hover:bg-[#E8E4DC]"
                        title="View"
                      >
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#9E968C]">
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Performance Overview</h2>
            <p className="text-[11px] text-[#9E968C] mt-0.5">Conversion & traffic metrics</p>
          </div>
          <TrendingUp size={16} className="text-[#9E968C]" />
        </div>
        <div className="flex items-center justify-center py-8 border border-dashed border-[#E5E2DC] rounded-xl">
          <div className="text-center">
            <AlertCircle size={20} className="text-[#C4BDB4] mx-auto mb-2" />
            <p className="text-sm text-[#9E968C]">Analytics connection required</p>
            <p className="text-[11px] text-[#C4BDB4] mt-1">Connect Google Analytics or Plausible to view traffic data</p>
            <button
              onClick={() => navigate('/admin/settings')}
              className="mt-3 text-xs text-[#A94420] hover:underline"
            >
              Configure in Settings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
