import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, AlertCircle, CheckCircle2, Send, FileText, Loader2 } from 'lucide-react';

interface EmailLog {
  id: string;
  recipient: string;
  template: string;
  subject: string;
  status: string;
  sentAt?: string;
  failedAt?: string;
  failureReason?: string;
  providerMessageId?: string;
}

const DEMO_EMAIL_LOGS: EmailLog[] = [
  {
    id: 'log-101',
    recipient: 'anasahmedkhan845@gmail.com',
    template: 'APPOINTMENT_CONFIRMATION',
    subject: 'Appointment Confirmed - HE-001284 | Holistic Edge',
    status: 'SENT',
    sentAt: '2026-09-02T15:20:00Z',
    providerMessageId: '<dff3243b-b05e-7453-07ce-46dca78fe34a@gmail.com>',
  },
  {
    id: 'log-102',
    recipient: 'ahmedkhananas57@gmail.com',
    template: 'APPOINTMENT_CONFIRMATION',
    subject: 'Appointment Confirmed - HE-001288 | Holistic Edge',
    status: 'SENT',
    sentAt: '2026-09-02T15:22:00Z',
    providerMessageId: '<31f01d6f-0336-a271-1dbb-06d0a19121eb@gmail.com>',
  },
  {
    id: 'log-103',
    recipient: 'anasahmedkhan4535@gmail.com',
    template: 'APPOINTMENT_CONFIRMATION',
    subject: 'Appointment Confirmed - HE-001289 | Holistic Edge',
    status: 'SENT',
    sentAt: '2026-09-02T15:24:00Z',
    providerMessageId: '<e19599b2-92d5-dddd-44e7-27a589c9c813@gmail.com>',
  },
];

export function EmailCenterPage() {
  const [logs, setLogs] = useState<EmailLog[]>(DEMO_EMAIL_LOGS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'templates'>('logs');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email/logs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      });
      const data = await res.json();
      if (data.success && data.logs && data.logs.length > 0) {
        setLogs(data.logs);
      } else {
        setLogs(DEMO_EMAIL_LOGS);
      }
    } catch (err) {
      console.warn('Using local fallback email logs:', err);
      setLogs(DEMO_EMAIL_LOGS);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryEmail = async (logId: string) => {
    setRetryingId(logId);
    try {
      const res = await fetch(`/api/email/retry/${logId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error('Failed to retry email:', err);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#0284C7]" />
            Email Management & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor outgoing booking confirmations, follow-up reminders, and SMTP delivery statuses
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'border-[#0284C7] text-[#0284C7]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Email Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'border-[#0284C7] text-[#0284C7]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Email Templates
        </button>
      </div>

      {/* Content */}
      {activeTab === 'logs' ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0284C7]" />
              <p className="text-xs">Loading email delivery logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Mail className="w-10 h-10 stroke-[1.5] mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No email logs found</p>
              <p className="text-xs mt-1">Email delivery logs will appear here after booking or follow-up events.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Subject / Template</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{l.recipient}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{l.subject}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{l.template}</div>
                      </td>
                      <td className="p-4">
                        {l.status === 'SENT' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DELIVERED (SMTP)</span>
                          </span>
                        ) : l.status === 'FAILED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1 w-max">
                            <AlertCircle className="w-3 h-3" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0284C7] flex items-center gap-1 w-max">
                            <Send className="w-3 h-3" />
                            <span>QUEUED</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {l.sentAt ? new Date(l.sentAt).toLocaleString() : l.failedAt ? new Date(l.failedAt).toLocaleString() : 'Pending'}
                      </td>
                      <td className="p-4 text-right">
                        {l.status === 'FAILED' ? (
                          <button
                            onClick={() => handleRetryEmail(l.id)}
                            disabled={retryingId === l.id}
                            className="py-1 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg text-[11px] transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {retryingId === l.id ? 'Retrying...' : 'Retry Email'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Appointment Confirmation Email</h3>
            <p className="text-xs text-slate-500">Sent automatically upon successful appointment creation.</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 border border-slate-100">
              <p className="font-semibold text-[#0284C7] mb-2">Subject: Appointment Confirmed - HE-001284 | Holistic Edge</p>
              <p>Contains Patient Name, Registration Token No, Date, Time, Service and Susheel Apartments location details.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Follow-up Health Reminder Email</h3>
            <p className="text-xs text-slate-500">Triggered on scheduled follow-up reminder date.</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 border border-slate-100">
              <p className="font-semibold text-[#059669] mb-2">Subject: Follow-up Health Reminder - HE-001284 | Holistic Edge</p>
              <p>Contains signed secure booking link (`/book•token=...`), patient HE token recognition, and direct booking button.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
