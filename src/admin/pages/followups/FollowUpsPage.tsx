import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  Send,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface Reminder {
  id: string;
  patientId: string;
  registrationTokenNumber: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  status: string;
  sentAt?: string;
  bookedAt?: string;
  failureReason?: string;
}

export function FollowUpsPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processingDue, setProcessingDue] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    fetchReminders();
  }, [statusFilter]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'ALL' ? `/api/follow-ups?status=${encodeURIComponent(statusFilter)}` : '/api/follow-ups';
      const res = await apiClient.get<any>(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || 'admin_session'}` },
      });
      if (res.ok && res.data?.success && Array.isArray(res.data.reminders)) {
        setReminders(res.data.reminders);
      }
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDueReminders = async () => {
    setProcessingDue(true);
    setFeedbackMessage('');
    try {
      const res = await apiClient.post<any>('/api/follow-ups/process-due', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || 'admin_session'}` },
      });
      if (res.ok && res.data?.success) {
        setFeedbackMessage(`Processed ${res.data.processedCount || 0} due reminders.`);
        fetchReminders();
      } else {
        setFeedbackMessage(res.error || 'Failed to process due reminders.');
      }
    } catch (err: any) {
      console.error('Failed to process due reminders:', err);
      setFeedbackMessage(err.message || 'Failed to process due reminders.');
    } finally {
      setProcessingDue(false);
    }
  };

  const handleSendNow = async (id: string) => {
    setSendingId(id);
    setFeedbackMessage('');
    try {
      const res = await apiClient.post<any>(`/api/follow-ups/${id}/send-now`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || 'admin_session'}` },
      });
      if (res.ok && res.data?.success) {
        setFeedbackMessage(res.data.message || 'Follow-up email sent successfully!');
        fetchReminders();
      } else {
        setFeedbackMessage(res.error || res.data?.error || 'Failed to send email.');
      }
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setFeedbackMessage(err.message || 'Email dispatch error.');
    } finally {
      setSendingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await apiClient.put<any>(`/api/follow-ups/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || 'admin_session'}` },
      });
      if (res.ok && res.data?.success) {
        fetchReminders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0284C7] border border-sky-200">SCHEDULED</span>;
      case 'DUE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">DUE TODAY</span>;
      case 'SENT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">EMAIL SENT</span>;
      case 'BOOKED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">CONVERTED (BOOKED)</span>;
      case 'FAILED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">FAILED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-[#059669]" />
            Administrative Follow-up Reminders
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Schedule, monitor, and dispatch automated email follow-up reminders via Google SMTP
          </p>
        </div>

        <button
          onClick={handleTriggerDueReminders}
          disabled={processingDue}
          className="py-2.5 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {processingDue ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Trigger Due Reminders Now</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')} className="text-emerald-600 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'SCHEDULED', 'DUE', 'SENT', 'BOOKED', 'FAILED', 'SNOOZED'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reminders Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#059669]" />
            <p className="text-xs">Loading follow-up reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarCheck className="w-10 h-10 stroke-[1.5] mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No reminders found</p>
            <p className="text-xs mt-1">There are no follow-up reminders matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Patient / Token</th>
                  <th className="p-4">Scheduled Date</th>
                  <th className="p-4">Purpose / Notes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reminders.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{r.patientName}</div>
                      <div className="text-[11px] text-[#0284C7] font-semibold">{r.registrationTokenNumber}</div>
                      <div className="text-[11px] text-slate-400">{r.patientEmail}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      📅 {r.scheduledDate} ({r.scheduledTime})
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {r.notes}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleSendNow(r.id)}
                        disabled={sendingId === r.id}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {sendingId === r.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        <span>Send Email Now</span>
                      </button>

                      {r.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'SNOOZED')}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold cursor-pointer"
                        >
                          Snooze
                        </button>
                      )}
                      {r.status !== 'BOOKED' && r.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'CANCELLED')}
                          className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
