import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Users,
  Edit2,
  Trash2,
  Star,
  Award,
  Filter
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import {
  teamCmsStorage,
  type AdminTeamCms,
  CMS_UPDATED_EVENT
} from '../../services/cmsStorage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { cn } from '../../../lib/utils';

export function TeamPage() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const [team, setTeam] = useState<AdminTeamCms[]>(() => teamCmsStorage.getAll());
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminTeamCms | null>(null);

  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const refresh = () => setTeam(teamCmsStorage.getAll());

  useEffect(() => {
    refresh();
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, []);

  const filtered = useMemo(() => {
    let list = [...team];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.role || '').toLowerCase().includes(q) ||
        (Array.isArray(m.specializations) && m.specializations.some(s => (s || '').toLowerCase().includes(q)))
      );
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [team, search]);

  const handlePublishToggle = (member: AdminTeamCms) => {
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }
    if (member.status === 'PUBLISHED') {
      teamCmsStorage.unpublish(member.id);
      logAudit('unpublished', 'team', member.id, `Unpublished team profile: ${member.name}`);
      showToast('info', 'Profile Unpublished', `"${member.name}" hidden from live website.`);
    } else {
      teamCmsStorage.publish(member.id, user || undefined);
      logAudit('published', 'team', member.id, `Published team profile: ${member.name}`);
      showToast('success', 'Profile Published', `"${member.name}" is now live on the public website.`);
    }
    refresh();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    teamCmsStorage.delete(deleteTarget.id);
    logAudit('deleted', 'team', deleteTarget.id, `Deleted profile: ${deleteTarget.name}`);
    showToast('success', 'Profile Deleted', `"${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
    refresh();
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Clinical Team & Specialists</h1>
            <span className="text-xs bg-[#F4F1EA] text-[#5A544E] px-2.5 py-0.5 rounded-full font-bold">
              {team.length} Members
            </span>
          </div>
          <p className="text-sm text-[#9E968C] mt-0.5">Manage practitioner profiles and clinical specialties</p>
        </div>

        <button
          onClick={() => navigate('/admin/team/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
        >
          <Plus size={15} /> Add Practitioner
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E968C]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, role, specialty..."
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E2DC] bg-white text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747]"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center">
          <Users size={32} className="text-[#C4BDB4] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1A1A1A]">No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(member => (
            <div key={member.id} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4 hover:border-[#D5CFC5] transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center font-bold text-base flex-shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1A1A1A]">{member.name}</h2>
                    <p className="text-xs text-[#0F2747] font-semibold">{member.role}</p>
                    <p className="text-[11px] text-[#9E968C]">{member.experience}</p>
                  </div>
                </div>

                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', member.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200')}>
                  {member.status}
                </span>
              </div>

              <p className="text-xs text-[#5A544E] leading-relaxed line-clamp-2">{member.bio}</p>

              <div className="flex flex-wrap gap-1">
                {member.specializations.map((spec, i) => (
                  <span key={i} className="text-[10px] font-medium bg-[#F4F1EA] text-[#5A544E] px-2 py-0.5 rounded">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[#F0ECE4]">
                <button
                  onClick={() => navigate(`/admin/team/${member.id}`)}
                  className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                  title="Edit Profile"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handlePublishToggle(member)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-semibold',
                    member.status === 'PUBLISHED' ? 'border border-amber-200 bg-amber-50 text-amber-800' : 'bg-[#0F2747] text-white'
                  )}
                >
                  {member.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => setDeleteTarget(member)}
                  className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Practitioner"
        message={`Are you sure you want to delete profile for "${deleteTarget?.name}"•`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

