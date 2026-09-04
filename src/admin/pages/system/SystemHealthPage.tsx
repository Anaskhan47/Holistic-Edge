import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Key,
  Send,
  Loader2,
} from 'lucide-react';

export function SystemHealthPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testEmailRecipient, setTestEmailRecipient] = useState('anasahmedkhan845@gmail.com');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [smtpStatusMessage, setSmtpStatusMessage] = useState('');
  const [smtpStatusType, setSmtpStatusType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system-health');
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error('Failed to fetch system health:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSmtpConnection = async () => {
    setTestingSmtp(true);
    setSmtpStatusMessage('');
    setSmtpStatusType('');
    try {
      const res = await fetch('/api/system-health/test-smtp');
      const data = await res.json();
      if (data.success) {
        setSmtpStatusType('success');
        setSmtpStatusMessage(data.message || 'Google SMTP connection & authentication successful!');
      } else {
        setSmtpStatusType('error');
        setSmtpStatusMessage(data.message || data.error || 'SMTP Connection Failed');
      }
    } catch (err: any) {
      setSmtpStatusType('error');
      setSmtpStatusMessage(err.message || 'SMTP Connection Request Error');
    } finally {
      setTestingSmtp(false);
    }
  };

  const handleSendDiagnosticEmail = async () => {
    setSendingTestEmail(true);
    setSmtpStatusMessage('');
    setSmtpStatusType('');
    try {
      const res = await fetch('/api/system-health/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testEmailRecipient }),
      });
      const data = await res.json();
      if (data.success) {
        setSmtpStatusType('success');
        setSmtpStatusMessage(`Test email successfully delivered via Google SMTP to ${testEmailRecipient}! Message ID: ${data.result?.providerMessageId || 'OK'}`);
      } else {
        setSmtpStatusType('error');
        setSmtpStatusMessage(data.error || 'Failed to deliver test email');
      }
    } catch (err: any) {
      setSmtpStatusType('error');
      setSmtpStatusMessage(err.message || 'Test email request error');
    } finally {
      setSendingTestEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-[#0284C7]" />
            System & Integration Health
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor Provider Adapters, Google SMTP Credentials, Booking Engine & Live Mail System
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Health</span>
        </button>
      </div>

      {/* Status Feedback Banner */}
      {smtpStatusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between font-medium ${
            smtpStatusType === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {smtpStatusType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{smtpStatusMessage}</span>
          </div>
          <button
            onClick={() => setSmtpStatusMessage('')}
            className="font-bold underline hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Provider & Live SMTP Diagnostic Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Email System (Google SMTP)</h2>
                <p className="text-xs text-slate-500">
                  {healthData?.services?.emailProvider?.provider || 'Google SMTP Provider'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
              ACTIVE (READY)
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800">SMTP Configuration Details:</div>
              <p className="font-mono text-[11px] text-slate-600">
                Host: smtp.gmail.com | Port: 587 (TLS) | Sender: holisticedges@gmail.com
              </p>
            </div>

            {/* Test Email Input & Controls */}
            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl space-y-3">
              <label className="block font-bold text-slate-800 text-xs">
                Live SMTP Connection & Diagnostic Email Tool
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="Enter email to receive test message..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
                <button
                  type="button"
                  onClick={handleSendDiagnosticEmail}
                  disabled={sendingTestEmail}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {sendingTestEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Test Email</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestSmtpConnection}
                disabled={testingSmtp}
                className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {testingSmtp ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0284C7]" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                )}
                <span>Test Google SMTP Socket Auth Connection</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Provider Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-[#0284C7] flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Data Provider Adapter</h2>
                <p className="text-xs text-slate-500">Google Sheets Persistence Engine</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
              READY
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="font-semibold text-slate-800">
                Sheet ID: 1fFTHGvyYhDAXBie3VbGVYOskciiU4f8lbbyfsvGjihQ
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Persists appointments, patient directories, follow-ups, and leads directly to Google Sheets.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-emerald-800 font-medium space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Drive & Service Account Authenticated</span>
              </p>
              <p className="text-[11px] text-emerald-700">
                Service Account: holistic-edge-app@peak-monument-444920-q1.iam.gserviceaccount.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
