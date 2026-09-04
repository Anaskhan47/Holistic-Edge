import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, X, Star, Archive, Eye, Trash2, ChevronLeft, ChevronRight, Globe, EyeOff } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { testimonialStorage, notificationStorage } from '../../services/adminStorage';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { AdminTestimonial, TestimonialStatus } from '../../types/admin.types';
import { cn } from '../../../lib/utils';

const STATUSES: TestimonialStatus[] = ['Pending', 'Approved', 'Rejected', 'Archived'];
const PAGE_SIZE = 10;

export function TestimonialsPage() {
  const navigate = useNavigate();
  const { testimonials, refreshTestimonials, refreshMetrics, showToast, logAudit } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string; status: TestimonialStatus; label: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...testimonials].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (statusFilter !== 'All') data = data.filter(t => t.status === statusFilter);
    return data;
  }, [testimonials, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: testimonials.length };
    STATUSES.forEach(s => { c[s] = testimonials.filter(t => t.status === s).length; });
    return c;
  }, [testimonials]);

  const handleAction = async (id: string, newStatus: TestimonialStatus) => {
    setActionLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const updated = testimonialStorage.update(id, {
      status: newStatus,
      publishedAt: newStatus === 'Approved' ? new Date().toISOString() : undefined,
    });
    if (updated) {
      refreshTestimonials();
      refreshMetrics();
      logAudit(newStatus.toLowerCase(), 'testimonial', id, `Testimonial from ${updated.displayName} ${newStatus.toLowerCase()}`);
      showToast('success', `Testimonial ${newStatus}`, `${updated.displayName}'s review has been ${newStatus.toLowerCase()}.`);
    }
    setActionLoading(false);
    setConfirmAction(null);
  };

  const handleFeatureToggle = async (t: AdminTestimonial) => {
    if (t.status !== 'Approved') {
      showToast('warning', 'Cannot feature', 'Only approved testimonials can be featured.');
      return;
    }
    const updated = testimonialStorage.update(t.id, { featured: !t.featured });
    if (updated) {
      refreshTestimonials();
      logAudit(updated.featured ? 'featured' : 'unfeatured', 'testimonial', t.id, `Testimonial ${t.displayName} ${updated.featured ? 'featured' : 'unfeatured'}`);
      showToast('success', updated.featured ? 'Testimonial featured' : 'Testimonial unfeatured');
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A1A]">Testimonials</h1>
          <p className="text-sm text-[#9E968C]">{counts.Pending > 0 && <span className="text-amber-700 font-medium">{counts.Pending} pending review · </span>}{testimonials.length} total</p>
        </div>
        <button onClick={() => navigate('/admin/testimonials/new')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-sm font-semibold hover:bg-[#0B1D3A]">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-1.5">
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', statusFilter === s ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]')}>
            {s} {counts[s] > 0 && <span className="opacity-60 ml-0.5">({counts[s]})</span>}
          </button>
        ))}
      </div>

      {/* Cards */}
      {paginated.length === 0 ? (
        <EmptyState icon={<Star size={22} />} title="No testimonials" description={statusFilter !== 'All' ? 'No testimonials with this status.' : 'Testimonials will appear here.'} />
      ) : (
        <div className="space-y-3">
          {paginated.map(t => (
            <div key={t.id} className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden">
              <div className="flex items-start gap-4 p-5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#0F2747] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.displayName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{t.displayName}</p>
                        {t.featured && <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">★ Featured</span>}
                      </div>
                      <p className="text-[11.5px] text-[#9E968C]">{t.condition} · {t.service} · {t.source}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < t.rating ? 'text-[#10B981] fill-amber-400' : 'text-[#E5E2DC]'} />
                        ))}
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>

                  <p className={cn('text-sm text-[#2C2926] mt-2 leading-relaxed', expandedId !== t.id && 'line-clamp-2')}>
                    "{t.review}"
                  </p>
                  {t.review.length > 100 && (
                    <button onClick={() => setExpandedId(expandedId === t.id ? null: t.id)} className="text-[11px] text-[#0F2747] hover:underline mt-1">
                      {expandedId === t.id ? 'Show less' : 'Show more'}
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {t.status === 'Pending' && (
                      <>
                        <button onClick={() => setConfirmAction({ id: t.id, action: 'approve', status: 'Approved', label: 'Approve' })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 border border-green-100">
                          <Check size={11} /> Approve
                        </button>
                        <button onClick={() => setConfirmAction({ id: t.id, action: 'reject', status: 'Rejected', label: 'Reject' })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 border border-red-100">
                          <X size={11} /> Reject
                        </button>
                      </>
                    )}
                    {t.status === 'Approved' && (
                      <>
                        <button onClick={() => setConfirmAction({ id: t.id, action: 'publish', status: 'Published', label: 'Publish to Website' })}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]">
                          <Globe size={11} /> Publish to Website
                        </button>
                        <button onClick={() => handleFeatureToggle(t)}
                          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', t.featured ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' : 'bg-[#F8F7F4] text-[#5A544E] border-[#E5E2DC] hover:bg-[#F0ECE4]')}>
                          <Star size={11} /> {t.featured ? 'Unfeature' : 'Feature'}
                        </button>
                      </>
                    )}
                    {t.status === 'Published' && (
                      <button onClick={() => setConfirmAction({ id: t.id, action: 'unpublish', status: 'Unpublished', label: 'Unpublish' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 border border-amber-200">
                        <EyeOff size={11} /> Unpublish
                      </button>
                    )}
                    {t.status !== 'Archived' && (
                      <button onClick={() => setConfirmAction({ id: t.id, action: 'archive', status: 'Archived', label: 'Archive' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F7F4] text-[#9E968C] text-xs font-medium hover:bg-[#F0ECE4] border border-[#E5E2DC]">
                        <Archive size={11} /> Archive
                      </button>
                    )}
                    {t.status === 'Rejected' && (
                      <button onClick={() => setConfirmAction({ id: t.id, action: 'approve', status: 'Approved', label: 'Re-approve' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 border border-green-100">
                        <Check size={11} /> Re-approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg border border-[#E5E2DC] flex items-center justify-center disabled:opacity-40"><ChevronLeft size={13} /></button>
          <span className="text-xs text-[#9E968C] px-2">{page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg border border-[#E5E2DC] flex items-center justify-center disabled:opacity-40"><ChevronRight size={13} /></button>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title={`${confirmAction?.label} Testimonial`}
        message={`Are you sure you want to ${confirmAction?.action} this testimonial? ${confirmAction?.status === 'Approved' ? 'It will become visible on the public website.' : confirmAction?.status === 'Rejected' ? 'The review will be hidden.' : ''}`}
        confirmLabel={confirmAction?.label || 'Confirm'}
        variant={confirmAction?.status === 'Rejected' || confirmAction?.status === 'Archived' ? 'danger' : 'warning'}
        isLoading={actionLoading}
        onConfirm={() => confirmAction && handleAction(confirmAction.id, confirmAction.status)}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}

