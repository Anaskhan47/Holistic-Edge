import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  HelpCircle,
  Edit2,
  Trash2,
  Star,
  Filter
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import {
  faqCmsStorage,
  type AdminFaqCms,
  CMS_UPDATED_EVENT
} from '../../services/cmsStorage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { cn } from '../../../lib/utils';

export function FaqPage() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const [faqs, setFaqs] = useState<AdminFaqCms[]>(() => faqCmsStorage.getAll());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<AdminFaqCms | null>(null);

  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const refresh = () => setFaqs(faqCmsStorage.getAll());

  useEffect(() => {
    refresh();
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach(f => set.add(f.category));
    return ['All', ...Array.from(set)];
  }, [faqs]);

  const filtered = useMemo(() => {
    let list = [...faqs];
    if (categoryFilter !== 'All') {
      list = list.filter(f => f.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        (f.question || '').toLowerCase().includes(q) ||
        (f.answer || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [faqs, categoryFilter, search]);

  const handlePublishToggle = (faq: AdminFaqCms) => {
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }
    if (faq.status === 'PUBLISHED') {
      faqCmsStorage.unpublish(faq.id);
      logAudit('unpublished', 'faq', faq.id, `Unpublished FAQ: ${faq.question}`);
      showToast('info', 'FAQ Unpublished', 'Question hidden from website.');
    } else {
      faqCmsStorage.publish(faq.id, user || undefined);
      logAudit('published', 'faq', faq.id, `Published FAQ: ${faq.question}`);
      showToast('success', 'FAQ Published', 'Question is now live on the public website.');
    }
    refresh();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    faqCmsStorage.delete(deleteTarget.id);
    logAudit('deleted', 'faq', deleteTarget.id, `Deleted FAQ: ${deleteTarget.question}`);
    showToast('success', 'FAQ Deleted', 'Question removed permanently.');
    setDeleteTarget(null);
    refresh();
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">FAQ Management</h1>
            <span className="text-xs bg-[#F4F1EA] text-[#5A544E] px-2.5 py-0.5 rounded-full font-bold">
              {faqs.length} Total
            </span>
          </div>
          <p className="text-sm text-[#9E968C] mt-0.5">Manage patient questions and answers with instant website sync</p>
        </div>

        <button
          onClick={() => navigate('/admin/faq/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
        >
          <Plus size={15} /> Add Question
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E968C]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions or answers..."
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
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ Items */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center">
          <HelpCircle size={32} className="text-[#C4BDB4] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1A1A1A]">No FAQs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(faq => (
            <div key={faq.id} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-2 hover:border-[#D5CFC5] transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    Q
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#1A1A1A]">{faq.question}</h2>
                      {faq.featured && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star size={10} className="fill-amber-500 text-amber-500" /> Featured
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#9E968C]">{faq.category} · Order #{faq.sortOrder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', faq.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200')}>
                    {faq.status}
                  </span>
                  <button
                    onClick={() => navigate(`/admin/faq/${faq.id}`)}
                    className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handlePublishToggle(faq)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-[11px] font-semibold',
                      faq.status === 'PUBLISHED' ? 'border border-amber-200 bg-amber-50 text-amber-800' : 'bg-[#0F2747] text-white'
                    )}
                  >
                    {faq.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(faq)}
                    className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#5A544E] leading-relaxed pl-8">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Question"
        message={`Are you sure you want to delete "${deleteTarget?.question}"•`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

