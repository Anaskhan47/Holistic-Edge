import React from 'react';
import { BarChart2, TrendingUp, Users, Calendar, Activity, ArrowUpRight } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

export function AnalyticsPage() {
  const { metrics, appointments, leads, testimonials } = useAdminStore();

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Analytics & Insights</h1>
        <p className="text-sm text-[#9E968C]">Performance breakdown across bookings, inquiries, and conversions</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Total Bookings</span>
            <Calendar size={16} className="text-[#1B4332]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{appointments.length}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} /> Live tracking active
          </p>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Total Leads</span>
            <Activity size={16} className="text-[#1A365D]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{leads.length}</p>
          <p className="text-xs text-[#9E968C] mt-1">{leads.filter(l => l.status === 'Converted').length} converted</p>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9E968C] font-semibold uppercase">Approved Reviews</span>
            <Users size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{testimonials.filter(t => t.status === 'Approved').length}</p>
          <p className="text-xs text-amber-600 mt-1">4.9★ Average Rating</p>
        </div>
      </div>

      {/* Traffic analytics placeholder */}
      <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Traffic & Conversion Sources</h2>
        <div className="space-y-3">
          {[
            { name: 'Website Booking Modal', share: '45%', count: 28 },
            { name: 'WhatsApp Direct', share: '30%', count: 19 },
            { name: 'Phone Calls', share: '15%', count: 9 },
            { name: 'Patient Referrals', share: '10%', count: 6 },
          ].map(s => (
            <div key={s.name} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#1A1A1A]">{s.name}</span>
                <span className="text-[#9E968C]">{s.share} ({s.count})</span>
              </div>
              <div className="w-full h-2 bg-[#F4F1EA] rounded-full overflow-hidden">
                <div className="h-full bg-[#A94420] rounded-full" style={{ width: s.share }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
