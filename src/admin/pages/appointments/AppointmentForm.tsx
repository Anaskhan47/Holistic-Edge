import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { appointmentStorage, notificationStorage } from '../../services/adminStorage';
import { useAdminStore } from '../../context/AdminStoreContext';
import { servicesData } from '../../../data/services';
import { conditionsData } from '../../../data/conditions';
import type { AppointmentSource, AppointmentStatus } from '../../types/admin.types';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
];

const SOURCES: AppointmentSource[] = ['Website', 'Phone', 'WhatsApp', 'Walk-in', 'Referral'];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  condition: string;
  preferredDate: string;
  preferredTime: string;
  source: AppointmentSource;
  notes: string;
  status: AppointmentStatus;
}

interface FormErrors { [key: string]: string }

export function AppointmentForm() {
  const navigate = useNavigate();
  const { refreshAppointments, refreshMetrics, showToast, logAudit } = useAdminStore();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    service: servicesData[0]?.title ?? '',
    condition: conditionsData[0]?.title ?? 'Back Pain',
    preferredDate: tomorrow,
    preferredTime: '10:00 AM',
    source: 'Phone',
    notes: '',
    status: 'Pending',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[\d\s+()-]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
    if (!form.service) errs.service = 'Service is required';
    if (!form.condition) errs.condition = 'Condition is required';
    if (!form.preferredDate) errs.preferredDate = 'Date is required';
    if (!form.preferredTime) errs.preferredTime = 'Time is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const created = appointmentStorage.create({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      service: form.service,
      condition: form.condition,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      source: form.source,
      notes: form.notes.trim() || undefined,
      status: form.status,
    });
    notificationStorage.create({
      type: 'appointment',
      title: 'New Appointment Created',
      message: `${created.fullName} — ${created.service} on ${created.preferredDate}`,
      entityId: created.id,
      entityType: 'appointment',
      link: `/admin/appointments/${created.id}`,
    });
    refreshAppointments();
    refreshMetrics();
    logAudit('created', 'appointment', created.id, `Appointment created for ${created.fullName}`);
    showToast('success', 'Appointment created', `${created.fullName} — ${created.id}`);
    setSaving(false);
    navigate(`/admin/appointments/${created.id}`);
  };

  const Field = ({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-[#5A544E] mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );

  const inputClass = (field: string) =>
    `w-full h-10 px-3 rounded-xl border text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-[#E5E2DC] focus:border-[#A94420] focus:ring-[#A94420]/10'
    }`;

  return (
    <div className="p-6 max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/appointments')}
          className="w-8 h-8 rounded-lg border border-[#E5E2DC] flex items-center justify-center text-[#5A544E] hover:bg-[#F8F7F4] transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <h1 className="text-lg font-bold text-[#1A1A1A]">New Appointment</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Patient Info */}
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name *" name="fullName" error={errors.fullName}>
              <input className={inputClass('fullName')} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Patient full name" />
            </Field>
            <Field label="Phone *" name="phone" error={errors.phone}>
              <input className={inputClass('phone')} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </Field>
            <div className="col-span-2">
              <Field label="Email (optional)" name="email" error={errors.email}>
                <input className={inputClass('email')} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="patient@email.com" />
              </Field>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">Appointment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Service *" name="service" error={errors.service}>
              <select className={inputClass('service')} value={form.service} onChange={e => set('service', e.target.value)}>
                {servicesData.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Condition *" name="condition" error={errors.condition}>
              <select className={inputClass('condition')} value={form.condition} onChange={e => set('condition', e.target.value)}>
                {conditionsData.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Preferred Date *" name="preferredDate" error={errors.preferredDate}>
              <input className={inputClass('preferredDate')} type="date" value={form.preferredDate} onChange={e => set('preferredDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </Field>
            <Field label="Preferred Time *" name="preferredTime" error={errors.preferredTime}>
              <select className={inputClass('preferredTime')} value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Source" name="source" error={errors.source}>
              <select className={inputClass('source')} value={form.source} onChange={e => set('source', e.target.value as AppointmentSource)}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Initial Status" name="status" error={errors.status}>
              <select className={inputClass('status')} value={form.status} onChange={e => set('status', e.target.value as AppointmentStatus)}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </Field>
          </div>
          <Field label="Notes (optional)" name="notes" error={errors.notes}>
            <textarea
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E2DC] text-sm text-[#1A1A1A] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#A94420] focus:ring-2 focus:ring-[#A94420]/10 resize-none transition-all"
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Clinical notes, special requirements…"
            />
          </Field>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/appointments')}
            className="px-5 py-2.5 rounded-xl border border-[#E5E2DC] text-sm text-[#2C2926] hover:bg-[#F8F7F4] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A94420] text-white text-sm font-semibold hover:bg-[#8F3717] disabled:opacity-60 transition-colors"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : <><Save size={14} /> Create Appointment</>}
          </button>
        </div>
      </form>
    </div>
  );
}
