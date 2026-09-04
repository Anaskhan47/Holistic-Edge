import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calendar, Users, FileText, Settings, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { patients, appointments, leads } = useAdminStore();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const filteredPatients = patients.filter(
    (p: any) =>
      (p.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.registrationTokenNumber || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.phone || '').includes(query) ||
      (p.email || '').toLowerCase().includes(query.toLowerCase())
  );

  const filteredAppointments = appointments.filter(
    (apt: any) =>
      (apt.fullName || apt.patientName || '').toLowerCase().includes(query.toLowerCase()) ||
      (apt.phone || '').includes(query) ||
      (apt.id || '').toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads.filter(
    (lead: any) =>
      (lead.fullName || lead.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (lead.phone || '').includes(query) ||
      (lead.condition || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh] font-sans">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Patients (HE Token, Name, Phone, Email), Appointments & Commands... (ESC)"
            className="w-full bg-transparent border-none text-slate-900 text-sm font-medium focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Nav Commands */}
          {!query && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Navigation
              </p>
              <div className="space-y-1">
                {[
                  { label: 'Go to Patient Directory (Google Sheets Dataset)', path: '/admin/patients', icon: <UserCheck className="w-4 h-4 text-emerald-500" /> },
                  { label: 'Go to Appointments', path: '/admin/appointments', icon: <Calendar className="w-4 h-4 text-sky-500" /> },
                  { label: 'Go to Leads & Inquiries', path: '/admin/leads', icon: <Users className="w-4 h-4 text-amber-500" /> },
                  { label: 'Go to Follow-up Reminders', path: '/admin/follow-ups', icon: <FileText className="w-4 h-4 text-purple-500" /> },
                  { label: 'Go to System Health', path: '/admin/system-health', icon: <Settings className="w-4 h-4 text-[#0284C7]" /> },
                ].map((cmd) => (
                  <button
                    key={cmd.path}
                    type="button"
                    onClick={() => handleSelect(cmd.path)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {cmd.icon}
                      <span>{cmd.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patients Search Results (From Google Sheets / Patients Feature) */}
          {query && filteredPatients.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Matching Patients (Google Sheet Patient Directory)
              </p>
              <div className="space-y-1">
                {filteredPatients.map((p: any) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect('/admin/patients')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/50 text-slate-700 font-medium transition-colors border border-transparent hover:border-emerald-100"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <span className="text-[10px] font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {p.registrationTokenNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{p.phone} {p.email ? `· ${p.email}` : ''}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.patientType || 'Patient Record'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Search Results */}
          {query && filteredAppointments.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Matching Appointments
              </p>
              <div className="space-y-1">
                {filteredAppointments.map((apt: any) => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => handleSelect(`/admin/appointments/${apt.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{apt.fullName || apt.patientName}</p>
                      <p className="text-[11px] text-slate-500">{apt.preferredDate || apt.date} · {apt.preferredTime || apt.time} · {apt.service}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {apt.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads Search Results */}
          {query && filteredLeads.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Matching Leads
              </p>
              <div className="space-y-1">
                {filteredLeads.map((lead: any) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => handleSelect(`/admin/leads/${lead.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{lead.fullName || lead.name}</p>
                      <p className="text-[11px] text-slate-500">{lead.phone} · {lead.condition || 'Inquiry'}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {lead.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}