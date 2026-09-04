import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Globe,
  Loader2,
  BookOpen,
  Plus,
  Trash2,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import { conditionsCmsStorage, type AdminConditionCms } from '../../services/cmsStorage';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { MediaLibraryModal } from '../../components/ui/MediaLibraryModal';
import { cn } from '../../../lib/utils';

export function ConditionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const isEdit = Boolean(id);
  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'Spine & Back',
    shortDescription: '',
    overview: '',
    symptoms: ['Radiating pain down the leg or arm', 'Localized sharpness and stiffness', 'Muscle weakness and tingling sensation'],
    treatmentApproach: ['Precision Chiropractic spinal adjustments', 'Targeted decompression and posture realignment', 'Active neuromuscular re-education'],
    relatedServices: ['Chiropractic Care', 'Alternative Therapies'],
    faq: [
      { question: 'Can this condition be cured without surgery•', answer: 'In the vast majority of cases, non-surgical realignment and decompression effectively relieve nerve compression and symptoms.' }
    ],
    heroImage: '',
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
      const existing = conditionsCmsStorage.getById(id);
      if (existing) {
        setForm({
          name: existing.name,
          slug: existing.slug,
          category: existing.category,
          shortDescription: existing.shortDescription,
          overview: existing.overview,
          symptoms: existing.symptoms || [],
          treatmentApproach: existing.treatmentApproach || [],
          relatedServices: existing.relatedServices || [],
          faq: existing.faq || [],
          heroImage: existing.heroImage || '',
          seoTitle: existing.seoTitle || '',
          seoDescription: existing.seoDescription || '',
          featured: existing.featured || true,
          status: existing.status,
        });
      } else {
        showToast('error', 'Condition not found');
        navigate('/admin/conditions');
      }
    }
  }, [id, navigate, showToast]);

  const setField = (field: string, val: any) => {
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'name' && !isEdit && !prev.slug) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return updated;
    });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Condition name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.shortDescription.trim()) errs.shortDescription = 'Short description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validate()) return;
    setSaving(true);

    const saved = conditionsCmsStorage.saveDraft({
      ...form,
      id: isEdit ? id: undefined,
    });

    logAudit('saved_draft', 'condition', saved.id, `Saved draft condition: ${form.name}`);
    showToast('success', 'Draft Saved', `"${form.name}" saved.`);
    setSaving(false);
    navigate('/admin/conditions');
  };

  const handlePublish = async () => {
    if (!validate()) return;
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }
    setSaving(true);

    const saved = conditionsCmsStorage.saveDraft({
      ...form,
      id: isEdit ? id: undefined,
    });

    const res = conditionsCmsStorage.publish(saved.id, user || undefined);
    if (res.success) {
      logAudit('published', 'condition', saved.id, `Published condition: ${form.name}`);
      showToast('success', 'Condition Published', `"${form.name}" is now live on the website.`);
      navigate('/admin/conditions');
    } else {
      showToast('error', 'Publication Failed', res.error);
    }
    setSaving(false);
  };

  const addArrayItem = (field: 'symptoms' | 'treatmentApproach' | 'relatedServices', item: string) => {
    if (!item.trim()) return;
    setForm(prev => ({ ...prev, [field]: [...prev[field], item.trim()] }));
  };

  const removeArrayItem = (field: 'symptoms' | 'treatmentApproach' | 'relatedServices', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => navigate('/admin/conditions')}
            className="w-8 h-8 rounded-lg border border-[#E5E2DC] flex items-center justify-center text-[#5A544E] hover:bg-[#F8F7F4]"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A]">
              {isEdit ? `Edit Condition: ${form.name}` : 'Add Condition / Symptom Profile'}
            </h1>
            <p className="text-xs text-[#9E968C]">
              Manage patient triage and conditions directory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-[#E5E2DC] bg-white text-xs font-semibold text-[#2C2926]"
          >
            <Eye size={13} /> Preview
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-[#E5E2DC] bg-white text-xs font-semibold text-[#2C2926]"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
            Publish Condition
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              1. Condition Details
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Condition Name *</label>
                <input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Cervical Spondylosis & Neck Stiffness"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747]"
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A544E] mb-1">URL Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setField('slug', e.target.value)}
                    placeholder="e.g. cervical-spondylosis"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A544E] mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setField('category', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] bg-white outline-none"
                  >
                    <option value="Spine & Back">Spine & Back</option>
                    <option value="Neck & Shoulder">Neck & Shoulder</option>
                    <option value="Joint & Extremities">Joint & Extremities</option>
                    <option value="Nerve & Neurological">Nerve & Neurological</option>
                    <option value="TMJ & Jaw">TMJ & Jaw</option>
                    <option value="Lifestyle & Posture">Lifestyle & Posture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={e => setField('shortDescription', e.target.value)}
                  placeholder="Brief clinical description shown in triage and search..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A544E] mb-1">Clinical Overview</label>
                <textarea
                  rows={4}
                  value={form.overview}
                  onChange={e => setField('overview', e.target.value)}
                  placeholder="Detailed anatomical and biomechanical overview of the condition..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Symptoms List */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              2. Common Patient Symptoms
            </h2>
            <div className="space-y-2">
              {form.symptoms.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s}
                    onChange={e => {
                      const updated = [...form.symptoms];
                      updated[i] = e.target.value;
                      setField('symptoms', updated);
                    }}
                    className="flex-1 h-9 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('symptoms', i)}
                    className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('symptoms', 'New Symptom')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F2747] bg-[#F0F4F8]"
              >
                <Plus size={13} /> Add Symptom
              </button>
            </div>
          </div>
        </div>

        {/* Right Settings Col */}
        <div className="space-y-5">
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider">
              Settings & Status
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
                  id="featured-condition"
                  checked={form.featured}
                  onChange={e => setField('featured', e.target.checked)}
                  className="rounded border-[#E5E2DC] text-[#0F2747]"
                />
                <label htmlFor="featured-condition" className="text-xs font-semibold text-[#1A1A1A] cursor-pointer">
                  Featured in Triage
                </label>
              </div>

              <div className="border-t border-[#E5E2DC] pt-3">
                <label className="block text-xs font-semibold text-[#5A544E] mb-2">Condition Hero Image</label>
                <ImageUploader
                  value={form.heroImage}
                  onChange={url => setField('heroImage', url)}
                  placement="condition"
                  category="conditions"
                  onSelectFromLibrary={() => setLibraryOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
              <h3 className="text-base font-bold text-[#1A1A1A]">{form.name || 'Untitled Condition'}</h3>
              <button type="button" onClick={() => setPreviewOpen(false)} className="text-xs px-3 py-1.5 border rounded-lg">
                Close
              </button>
            </div>
            <p className="text-xs text-[#5A544E] leading-relaxed">{form.overview || form.shortDescription}</p>
          </div>
        </div>
      )}

      {/* Media Library Selector Modal */}
      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={asset => setField('heroImage', asset.url)}
        category="conditions"
      />
    </div>
  );
}

