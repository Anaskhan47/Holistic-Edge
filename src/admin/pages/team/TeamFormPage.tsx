import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  Loader2,
  Users,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import { teamCmsStorage, type AdminTeamCms } from '../../services/cmsStorage';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { MediaLibraryModal } from '../../components/ui/MediaLibraryModal';
import { cn } from '../../../lib/utils';

export function TeamFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const isEdit = Boolean(id);
  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [form, setForm] = useState({
    name: '',
    role: '',
    profilePhoto: '',
    bio: '',
    qualifications: ['Bachelor of Physiotherapy (BPT)', 'Certified Spine Care Specialist'],
    experience: '8+ Years Clinical Practice',
    specializations: ['Chiropractic Adjustments', 'Spinal Decompression', 'Neuromuscular Rehabilitation'],
    profileSlug: '',
    displayOrder: 1,
    featured: false,
    seoTitle: '',
    seoDescription: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = teamCmsStorage.getById(id);
      if (existing) {
        setForm({
          name: existing.name,
          role: existing.role,
          profilePhoto: existing.profilePhoto || '',
          bio: existing.bio,
          qualifications: existing.qualifications || [],
          experience: existing.experience || '',
          specializations: existing.specializations || [],
          profileSlug: existing.profileSlug,
          displayOrder: existing.displayOrder || 1,
          featured: existing.featured || false,
          seoTitle: existing.seoTitle || '',
          seoDescription: existing.seoDescription || '',
          status: existing.status,
        });
      } else {
        showToast('error', 'Practitioner not found');
        navigate('/admin/team');
      }
    }
  }, [id, navigate, showToast]);

  const setField = (field: string, val: any) => {
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'name' && !isEdit && !prev.profileSlug) {
        updated.profileSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return updated;
    });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Practitioner name is required';
    if (!form.role.trim()) errs.role = 'Role / Designation is required';
    if (!form.bio.trim()) errs.bio = 'Clinical biography is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = () => {
    if (!validate()) return;
    setSaving(true);
    const saved = teamCmsStorage.saveDraft({
      ...form,
      id: isEdit ? id: undefined,
    });
    logAudit('saved_draft', 'team', saved.id, `Saved draft team profile: ${form.name}`);
    showToast('success', 'Draft Saved', `"${form.name}" saved successfully.`);
    setSaving(false);
    navigate('/admin/team');
  };

  const handlePublish = () => {
    if (!validate()) return;
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }
    setSaving(true);
    const saved = teamCmsStorage.saveDraft({
      ...form,
      id: isEdit ? id: undefined,
    });
    const res = teamCmsStorage.publish(saved.id, user || undefined);
    if (res.success) {
      logAudit('published', 'team', saved.id, `Published practitioner profile: ${form.name}`);
      showToast('success', 'Profile Published', `"${form.name}" is now live on the website.`);
      navigate('/admin/team');
    } else {
      showToast('error', 'Publication Failed', res.error);
    }
    setSaving(false);
  };

  const addArrayItem = (field: 'qualifications' | 'specializations', item: string) => {
    if (!item.trim()) return;
    setForm(prev => ({ ...prev, [field]: [...prev[field], item.trim()] }));
  };

  const removeArrayItem = (field: 'qualifications' | 'specializations', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => navigate('/admin/team')}
            className="w-8 h-8 rounded-lg border border-[#E5E2DC] flex items-center justify-center text-[#5A544E] hover:bg-[#F8F7F4]"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A]">
              {isEdit ? `Edit Profile: ${form.name}` : 'Add Practitioner Profile'}
            </h1>
            <p className="text-xs text-[#9E968C]">Manage clinical team and specialist profiles</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            Publish Profile
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A544E] mb-1">Practitioner Name *</label>
            <input
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="e.g. Healer Abdul Mallik"
              className={cn(
                'w-full h-10 px-3 rounded-xl border text-xs text-[#1A1A1A] outline-none',
                errors.name ? 'border-red-300' : 'border-[#E5E2DC] focus:border-[#0F2747]'
              )}
            />
            {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A544E] mb-1">Role / Designation *</label>
            <input
              value={form.role}
              onChange={e => setField('role', e.target.value)}
              placeholder="e.g. Founder & Chief Chiropractor"
              className={cn(
                'w-full h-10 px-3 rounded-xl border text-xs text-[#1A1A1A] outline-none',
                errors.role ? 'border-red-300' : 'border-[#E5E2DC] focus:border-[#0F2747]'
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A544E] mb-1">Experience</label>
            <input
              value={form.experience}
              onChange={e => setField('experience', e.target.value)}
              placeholder="e.g. 25+ Years Experience"
              className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#5A544E] mb-2">Profile Photo</label>
            <ImageUploader
              value={form.profilePhoto}
              onChange={url => setField('profilePhoto', url)}
              placement="portrait"
              category="team"
              onSelectFromLibrary={() => setLibraryOpen(true)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A544E] mb-1">Biography & Clinical Philosophy *</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={e => setField('bio', e.target.value)}
            placeholder="Clinical background, expertise, and patient care approach..."
            className={cn(
              'w-full px-3 py-2 rounded-xl border text-xs text-[#1A1A1A] outline-none resize-none',
              errors.bio ? 'border-red-300' : 'border-[#E5E2DC] focus:border-[#0F2747]'
            )}
          />
        </div>

        {/* Specializations */}
        <div className="space-y-2 pt-2 border-t border-[#E5E2DC]">
          <label className="block text-xs font-semibold text-[#5A544E]">Specializations</label>
          <div className="flex flex-wrap gap-1.5">
            {form.specializations.map((spec, i) => (
              <span key={i} className="bg-[#F4F1EA] text-[#1A1A1A] text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                {spec}
                <button type="button" onClick={() => removeArrayItem('specializations', i)} className="font-bold text-[#9E968C] hover:text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              id="new-spec-input"
              placeholder="Add specialization..."
              className="flex-1 h-9 px-3 rounded-xl border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addArrayItem('specializations', (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-spec-input') as HTMLInputElement;
                if (input && input.value) {
                  addArrayItem('specializations', input.value);
                  input.value = '';
                }
              }}
              className="px-3 py-2 rounded-xl bg-[#F0F4F8] text-[#0F2747] text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Media Library Selector Modal */}
      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={asset => setField('profilePhoto', asset.url)}
        category="team"
      />
    </div>
  );
}

