import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Globe,
  Loader2,
  Stethoscope,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import { servicesCmsStorage, type AdminServiceCms } from '../../services/cmsStorage';
import { auditStorage } from '../../services/adminStorage';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { MediaLibraryModal } from '../../components/ui/MediaLibraryModal';
import { cn } from '../../../lib/utils';

export function ServiceFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const isEdit = Boolean(id);
  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [form, setForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    shortDescription: '',
    fullDescription: '',
    heroImage: '',
    whatItIs: '',
    howItWorks: ['Comprehensive physical and biomechanical palpation exam.', 'Targeted low-force spinal adjustments to restore optimal alignment.', 'Neuromuscular re-education and rehabilitation guidance.'],
    benefits: ['100% Drug-free and non-surgical pain resolution', 'Restored spinal mobility and joint flexibility', 'Reduced nerve compression and muscular tension'],
    whoItsFor: ['Chronic lower back pain, neck stiffness, and sciatica', 'Postural misalignment and ergonomic strain', 'Disc bulge or herniation symptoms'],
    whatToExpect: [
      { step: '01', title: 'Clinical Assessment', description: 'Comprehensive physical examination, range of motion testing, and posture mapping.' },
      { step: '02', title: 'Targeted Protocol', description: 'Precision manual adjustments and decompression customized to your spinal alignment.' },
      { step: '03', title: 'Rehabilitation & Roadmap', description: 'Post-treatment recovery exercises and ergonomic stabilization guidelines.' },
    ],
    relatedConditions: ['Lower Back Pain', 'Sciatica', 'Cervical Spondylosis', 'Slipped Disc'],
    faq: [
      { question: 'How many sessions will I need•', answer: 'Most patients experience marked improvement within 3 to 5 structured sessions, depending on condition chronicity.' },
      { question: 'Is the treatment painful•', answer: 'Treatments are non-invasive and generally comfortable. Patients often feel immediate pressure relief.' }
    ],
    seoTitle: '',
    seoDescription: '',
    featured: true,
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = servicesCmsStorage.getById(id);
      if (existing) {
        setForm({
          title: existing.title,
          slug: existing.slug,
          subtitle: existing.subtitle || '',
          shortDescription: existing.shortDescription,
          fullDescription: existing.fullDescription,
          heroImage: existing.heroImage || '',
          whatItIs: existing.whatItIs || '',
          howItWorks: existing.howItWorks || [],
          benefits: existing.benefits || [],
          whoItsFor: existing.whoItsFor || [],
          whatToExpect: existing.whatToExpect || [],
          relatedConditions: existing.relatedConditions || [],
          faq: existing.faq || [],
          seoTitle: existing.seoTitle || '',
          seoDescription: existing.seoDescription || '',
          featured: existing.featured || true,
          status: existing.status,
        });
      } else {
        showToast('error', 'Service not found');
        navigate('/admin/services');
      }
    }
  }, [id, navigate, showToast]);

  const setField = (field: string, val: any) => {
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'title' && !isEdit && !prev.slug) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return updated;
    });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Service name is required';
    if (!form.slug.trim()) errs.slug = 'URL slug is required';
    if (!form.shortDescription.trim()) errs.shortDescription = 'Short description is required';
    if (!form.fullDescription.trim()) errs.fullDescription = 'Full clinical description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validate()) return;
    setSaving(true);

    const saved = servicesCmsStorage.saveDraft({
      ...form,
      id: isEdit ? id: undefined,
    });

    logAudit('saved_draft', 'service', saved.id, `Saved draft service: ${form.title}`);
    showToast('success', 'Draft Saved', `"${form.title}" saved successfully.`);
    setSaving(false);
    navigate('/admin/services');
  };

  const handlePublish = async () => {
    if (!validate()) return;
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }
    setSaving(true);

    const saved = servicesCmsStorage.saveDraft({
      ...form,
      id: isEdit ? id: undefined,
    });

    const res = servicesCmsStorage.publish(saved.id, user || undefined);
    if (res.success) {
      logAudit('published', 'service', saved.id, `Published service: ${form.title}`);
      showToast('success', 'Service Published', `"${form.title}" is now live on the website.`);
      navigate('/admin/services');
    } else {
      showToast('error', 'Publication Failed', res.error);
    }
    setSaving(false);
  };

  // Helper list modifiers
  const addArrayItem = (field: 'howItWorks' | 'benefits' | 'whoItsFor' | 'relatedConditions', item: string) => {
    if (!item.trim()) return;
    setForm(prev => ({ ...prev, [field]: [...prev[field], item.trim()] }));
  };

  const removeArrayItem = (field: 'howItWorks' | 'benefits' | 'whoItsFor' | 'relatedConditions', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="p-3 sm:p-6 max-w-6xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => navigate('/admin/services')}
            className="w-8 h-8 rounded-lg border border-[#E5E2DC] flex items-center justify-center text-[#5A544E] hover:bg-[#F8F7F4]"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A]">
              {isEdit ? `Edit Service: ${form.title}` : 'Add New Clinical Service'}
            </h1>
            <p className="text-xs text-[#9E968C]">
              Manage patient therapeutic offerings with live website synchronization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-[#E5E2DC] bg-white text-xs font-semibold text-[#2C2926] hover:bg-[#F8F7F4]"
          >
            <Eye size={13} /> Preview
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-[#E5E2DC] bg-white text-xs font-semibold text-[#2C2926] hover:bg-[#F8F7F4]"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] shadow-sm"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
            Publish Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Fields */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              1. General Details
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Service Name *</label>
                <input
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  placeholder="e.g. Precision Chiropractic Care"
                  className={cn(
                    'w-full h-10 px-3 rounded-xl border text-xs text-[#1A1A1A] outline-none',
                    errors.title ? 'border-red-300' : 'border-[#E5E2DC] focus:border-[#0F2747]'
                  )}
                />
                {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A544E] mb-1">URL Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setField('slug', e.target.value)}
                    placeholder="e.g. chiropractic-care"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A544E] mb-1">Subtitle / Tagline</label>
                  <input
                    value={form.subtitle}
                    onChange={e => setField('subtitle', e.target.value)}
                    placeholder="e.g. Spinal Realignment & Decompression"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={e => setField('shortDescription', e.target.value)}
                  placeholder="Brief summary shown on service cards and directory..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Full Clinical Description *</label>
                <textarea
                  rows={4}
                  value={form.fullDescription}
                  onChange={e => setField('fullDescription', e.target.value)}
                  placeholder="Comprehensive clinical explanation of treatment mechanism, benefits, and protocols..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Key Clinical Benefits */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              2. Key Benefits & Clinical Advantages
            </h2>

            <div className="space-y-2">
              {form.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={b}
                    onChange={e => {
                      const updated = [...form.benefits];
                      updated[i] = e.target.value;
                      setField('benefits', updated);
                    }}
                    className="flex-1 h-9 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747]"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', i)}
                    className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('benefits', 'New Clinical Benefit')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F2747] bg-[#F0F4F8] hover:bg-[#E2EBF4]"
              >
                <Plus size={13} /> Add Benefit
              </button>
            </div>
          </div>

          {/* Related Conditions */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              3. Related Conditions Treated
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {form.relatedConditions.map((cond, i) => (
                <span key={i} className="bg-[#F4F1EA] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                  {cond}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('relatedConditions', i)}
                    className="text-[#9E968C] hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                id="new-condition-input"
                placeholder="e.g. Migraine/ Vertigo/ Headache"
                className="flex-1 h-9 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('relatedConditions', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('new-condition-input') as HTMLInputElement;
                  if (input && input.value) {
                    addArrayItem('relatedConditions', input.value);
                    input.value = '';
                  }
                }}
                className="px-3 py-2 rounded-xl bg-[#F0F4F8] text-[#0F2747] text-xs font-semibold"
              >
                Add Condition
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Meta & Status */}
        <div className="space-y-5">
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              Publication Settings
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Status</label>
                <div className="text-xs font-bold px-3 py-2 rounded-xl bg-[#F4F1EA] text-[#1A1A1A]">
                  {form.status}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-service"
                  checked={form.featured}
                  onChange={e => setField('featured', e.target.checked)}
                  className="rounded border-[#E5E2DC] text-[#0F2747] focus:ring-[#0F2747]"
                />
                <label htmlFor="featured-service" className="text-xs font-semibold text-[#1A1A1A] cursor-pointer">
                  Featured on Homepage
                </label>
              </div>

              <div className="border-t border-[#E5E2DC] pt-3">
                <label className="block text-xs font-semibold text-[#5A544E] mb-2">Service Hero Image</label>
                <ImageUploader
                  value={form.heroImage}
                  onChange={url => setField('heroImage', url)}
                  placement="service-hero"
                  category="services"
                  onSelectFromLibrary={() => setLibraryOpen(true)}
                />
              </div>

              <div className="border-t border-[#E5E2DC] pt-3 space-y-2">
                <label className="block text-xs font-semibold text-[#5A544E]">SEO Metadata</label>
                <input
                  value={form.seoTitle}
                  onChange={e => setField('seoTitle', e.target.value)}
                  placeholder="Meta title..."
                  className="w-full h-9 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none"
                />
                <textarea
                  rows={2}
                  value={form.seoDescription}
                  onChange={e => setField('seoDescription', e.target.value)}
                  placeholder="Meta description..."
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F2747] bg-[#F0F4F8] px-2 py-0.5 rounded-full">
                  Live Service Preview
                </span>
                <h3 className="text-base font-bold text-[#1A1A1A] mt-1">{form.title || 'Untitled Service'}</h3>
              </div>
              <button type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F8F7F4]"
              >
                Close Preview
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#5A544E]">
              <p className="text-sm font-medium text-[#1A1A1A]">{form.shortDescription}</p>
              <p className="leading-relaxed">{form.fullDescription}</p>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E2DC] space-y-2">
                <p className="font-bold text-[#1A1A1A]">Key Benefits:</p>
                <ul className="space-y-1">
                  {form.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#1A1A1A]">
                      <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Selector Modal */}
      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={asset => setField('heroImage', asset.url)}
        category="services"
      />
    </div>
  );
}

