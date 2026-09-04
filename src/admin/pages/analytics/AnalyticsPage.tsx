import React, { useMemo } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  ArrowUpRight,
  PieChart,
  CheckCircle2,
  Phone,
  MessageSquare,
  Globe
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

export function AnalyticsPage() {
  const { appointments, leads, offers } = useAdminStore();

  // Dynamic Lead Source Breakdown
  const sourceStats = useMemo(() => {
    const total = leads.length;
    if (total === 0) return [];

    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  // Dynamic Service Popularity Breakdown
  const serviceStats = useMemo(() => {
    const total = appointments.length;
    if (total === 0) return [];

    const counts: Record<string, number> = {};
    appointments.forEach(a => {
      counts[a.service] = (counts[a.service] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [appointments]);

  // Dynamic Appointment Status Breakdown
  const apptStatusStats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled' || a.status === 'No-show').length;

    return { total, confirmed, completed, pending, cancelled };
  }, [appointments]);

  // Dynamic Conversion Rate
  const conversionRate = useMemo(() => {
    if (leads.length === 0) return '0%';
    const converted = leads.filter(l => l.status === 'Converted' || l.status === 'Appointment Booked').length;
    return `${Math.round((converted / leads.length) * 100)}%`;
  }, [leads]);

  const activeOffersCount = useMemo(() => {
    return offers.filter(o => o.status === 'ACTIVE').length;
  }, [offers]);

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Analytics & Performance Insights</h1>
        <p className="text-sm text-[#9E968C]">Live operational analytics across appointments, inquiries, and conversion channels</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Total Bookings</span>
            <Calendar size={16} className="text-[#0F2747]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{appointments.length}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} /> {apptStatusStats.completed} Completed
          </p>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Total Inquiries</span>
            <Activity size={16} className="text-[#0F2747]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{leads.length}</p>
          <p className="text-xs text-[#5A544E] mt-1">
            {leads.filter(l => l.status === 'New').length} new uncontacted
          </p>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Conversion Rate</span>
            <TrendingUp size={16} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{conversionRate}</p>
          <p className="text-xs text-[#9E968C] mt-1">Inquiry-to-Booking pipeline</p>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Active Promotions</span>
            <Users size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{activeOffersCount}</p>
          <p className="text-xs text-blue-600 mt-1">
            {offers.length} Total Campaigns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Inflow Channels */}
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Inquiry Acquisition Channels</h2>
            <span className="text-xs text-[#9E968C]">{leads.length} Total Leads</span>
          </div>

          {sourceStats.length === 0 ? (
            <p className="text-xs text-[#9E968C] py-8 text-center">No inquiry source data yet</p>
          ) : (
            <div className="space-y-3 pt-1">
              {sourceStats.map(s => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#1A1A1A]">{s.name}</span>
                    <span className="text-[#9E968C]">{s.percent}% ({s.count})</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F1EA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F2747] rounded-full transition-all duration-500"
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clinical Service Demand */}
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Clinical Service Demand</h2>
            <span className="text-xs text-[#9E968C]">{appointments.length} Bookings</span>
          </div>

          {serviceStats.length === 0 ? (
            <p className="text-xs text-[#9E968C] py-8 text-center">No appointment data yet</p>
          ) : (
            <div className="space-y-3 pt-1">
              {serviceStats.map(s => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#1A1A1A]">{s.name}</span>
                    <span className="text-[#9E968C]">{s.percent}% ({s.count})</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F1EA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1B4332] rounded-full transition-all duration-500"
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

