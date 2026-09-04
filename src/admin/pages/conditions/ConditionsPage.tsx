import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  BookOpen,
  Eye,
  Edit2,
  Trash2,
  Archive,
  Star,
  Filter
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import {
  conditionsCmsStorage,
  type AdminConditionCms,
  type CmsStatus,
  CMS_UPDATED_EVENT
} from '../../services/cmsStorage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { cn } from '../../../lib/utils';

const STATUS_TABS: ('All' | CmsStatus)[] = ['All', 'PUBLISHED', 'DRAFT', 'UNPUBLISHED', 'ARCHIVED'];
const CATEGORIES = ['All', 'Spine & Back', 'Neck & Shoulder', 'Joint & Extremities', 'Nerve & Neurological', 'TMJ & Jaw', 'Lifestyle & Posture'];

export function ConditionsPage() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const [conditions, setConditions] = useState<AdminConditionCms[]>(() => conditionsCmsStorage.getAll());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminConditionCms | null>(null);

  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const refresh = () => {
    setConditions(conditionsCmsStorage.getAll());
  };

  useEffect(() => {
    refresh();
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, []);

  const filtered = useMemo(() => {
    let list = [...conditions];
    if (statusFilter !== 'All') {
      list = list.filter(c => c.status === statusFilter);
    }
    if (categoryFilter !== 'All') {
      list = list.filter(c => c.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.shortDescription || '').toLowerCase().includes(q) ||
        (c.slug || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [conditions, statusFilter, categoryFilter, search]);

  const handlePublishToggle = (condition: AdminConditionCms) => {
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }

    if (condition.status === 'PUBLISHED') {
      conditionsCmsStorage.unpublish(condition.id);
      logAudit('unpublished', 'condition', condition.id, `Unpublished condition: ${condition.name}`);
      showToast('info', 'Condition Unpublished', `"${condition.name}" removed from live website.`);
    } else {
      const res = conditionsCmsStorage.publish(condition.id, user || undefined);
      if (res.success) {
        logAudit('published', 'condition', condition.id, `Published condition: ${condition.name}`);
        showToast('success', 'Condition Published', `"${condition.name}" is now live on the public website.`);
      } else {
        showToast('error', 'Publication Failed', res.error);
      }
    }
    refresh();
  };

  const handleArchive = (condition: AdminConditionCms) => {
    conditionsCmsStorage.archive(condition.id);
    logAudit('archived', 'condition', condition.id, `Archived condition: ${condition.name}`);
    showToast('info', 'Condition Archived', `"${condition.name}" moved to archive.`);
    refresh();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    conditionsCmsStorage.delete(deleteTarget.id);
    logAudit('deleted', 'condition', deleteTarget.id, `Deleted condition: ${deleteTarget.name}`);
    showToast('success', 'Condition Deleted', `"${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
    refresh();
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Conditions & Triage Directory</h1>
            <span className="text-xs bg-[#F4F1EA] text-[#5A544E] px-2.5 py-0.5 rounded-full font-bold">
              {conditions.length} Total
            </span>
          </div>
          <p className="text-sm text-[#9E968C] mt-0.5">
            Manage musculoskeletal condition profiles and patient triage mapping
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/conditions/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
        >
          <Plus size={15} /> Add Condition
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E5E2DC] pb-3">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize',
              statusFilter === tab
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]'
            )}
          >
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Category Pill Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E968C]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by condition name, symptoms..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E2DC] bg-white text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={13} className="text-[#9E968C]" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E2DC] bg-white text-xs text-[#5A544E] outline-none"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Conditions Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center">
          <BookOpen size={32} className="text-[#C4BDB4] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1A1A1A]">No conditions found</p>
          <p className="text-xs text-[#9E968C] mt-1">Try adjusting your category filter or search query</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8F7F4] border-b border-[#E5E2DC] text-[11px] font-semibold text-[#9E968C] uppercase tracking-wider">
                <th className="py-3 px-4">Condition Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filtered.map(cond => (
                <tr key={cond.id} className="hover:bg-[#FDFBF7] transition-colors group">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {cond.featured && (
                          <Star size={12} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                        )}
                        <span className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#0F2747]">
                          {cond.name}
                        </span>
                      </div>
                      <p className="text-[#5A544E] text-xs line-clamp-1">{cond.shortDescription}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold bg-[#F4F1EA] text-[#0F2747] px-2.5 py-1 rounded-lg">
                      {cond.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#5A544E]">
                    /conditions/{cond.slug}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        'text-[10.5px] font-bold px-2.5 py-1 rounded-full border',
                        cond.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' :
                        cond.status === 'DRAFT' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      )}
                    >
                      {cond.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/admin/conditions/${cond.id}`)}
                        className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                        title="Edit Condition"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handlePublishToggle(cond)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-[11px] font-semibold',
                          cond.status === 'PUBLISHED'
                            ? 'border border-amber-200 bg-amber-50 text-amber-800'
                            : 'bg-[#0F2747] text-white hover:bg-[#0B1D3A]'
                        )}
                      >
                        {cond.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleArchive(cond)}
                        className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                        title="Archive"
                      >
                        <Archive size={13} />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(cond)}
                        className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Condition"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"•`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

