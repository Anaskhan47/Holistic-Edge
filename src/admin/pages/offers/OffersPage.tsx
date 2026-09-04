import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Tag,
  Calendar,
  Clock,
  Eye,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Sparkles,
  Globe,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { offerStorage } from '../../services/adminStorage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import type { AdminOffer, OfferStatus, OfferType } from '../../types/admin.types';
import { cn } from '../../../lib/utils';

const STATUSES: ('All' | OfferStatus)[] = [
  'All',
  'ACTIVE',
  'SCHEDULED',
  'DRAFT',
  'EXPIRED',
  'UNPUBLISHED',
  'ARCHIVED',
];

const TYPES: ('All' | OfferType)[] = [
  'All',
  'CONSULTATION',
  'PROMOTIONAL',
  'SERVICE',
  'SEASONAL',
  'LIMITED_TIME',
];

function formatDateTime(isoStr: string): string {
  if (!isoStr) return '—';
  try {
    return new Date(isoStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
}

export function OffersPage() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const {
    offers,
    refreshOffers,
    publishOffer,
    unpublishOffer,
    archiveOffer,
    duplicateOffer,
    deleteOffer,
    showToast,
    logAudit,
  } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [previewOffer, setPreviewOffer] = useState<AdminOffer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOffer | null>(null);
  const [conflictTarget, setConflictTarget] = useState<{ offer: AdminOffer; conflicts: AdminOffer[] } | null>(null);

  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  // Counts by status
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: offers.length };
    STATUSES.forEach(s => {
      if (s !== 'All') {
        map[s] = offers.filter(o => o.status === s).length;
      }
    });
    return map;
  }, [offers]);

  // Filtered list
  const filteredOffers = useMemo(() => {
    let list = [...offers];
    if (statusFilter !== 'All') {
      list = list.filter(o => o.status === statusFilter);
    }
    if (typeFilter !== 'All') {
      list = list.filter(o => o.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        (o.title || '').toLowerCase().includes(q) ||
        (o.label || '').toLowerCase().includes(q) ||
        (o.shortDescription || '').toLowerCase().includes(q) ||
        (o.discountValue && o.discountValue.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [offers, statusFilter, typeFilter, search]);

  const handlePublishClick = (offer: AdminOffer) => {
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish offers. Please request a Manager or Admin.');
      return;
    }

    // Check for placement conflicts
    const conflicts = offerStorage.checkPlacementConflicts(offer);
    if (conflicts.length > 0) {
      setConflictTarget({ offer, conflicts });
      return;
    }

    const res = publishOffer(offer.id);
    if (res.success) {
      showToast('success', 'Offer Published', `"${offer.title}" is now live on the public website.`);
    } else {
      showToast('error', 'Publication Failed', res.error || 'Unable to publish offer.');
    }
  };

  const handleConfirmConflictPublish = () => {
    if (!conflictTarget) return;
    const { offer, conflicts } = conflictTarget;

    // Unpublish or adjust conflicting offers
    conflicts.forEach(conf => {
      unpublishOffer(conf.id);
      logAudit('unpublished', 'offer', conf.id, `Unpublished due to conflict with ${offer.title}`);
    });

    const res = publishOffer(offer.id);
    if (res.success) {
      showToast('success', 'Offer Published', `"${offer.title}" replaced previous active offer(s).`);
    } else {
      showToast('error', 'Publication Failed', res.error);
    }
    setConflictTarget(null);
  };

  const handleUnpublish = (offer: AdminOffer) => {
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot unpublish offers.');
      return;
    }
    unpublishOffer(offer.id);
    showToast('info', 'Offer Unpublished', `"${offer.title}" has been removed from the public website.`);
  };

  const handleDuplicate = (offer: AdminOffer) => {
    const copy = duplicateOffer(offer.id);
    if (copy) {
      showToast('success', 'Offer Duplicated', `Draft created: "${copy.title}"`);
    }
  };

  const handleArchive = (offer: AdminOffer) => {
    archiveOffer(offer.id);
    showToast('info', 'Offer Archived', `"${offer.title}" moved to archive.`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteOffer(deleteTarget.id);
    showToast('success', 'Offer Deleted', `"${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
  };

  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-200';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DRAFT': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'EXPIRED': return 'bg-red-50 text-red-700 border-red-200';
      case 'UNPUBLISHED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ARCHIVED': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Offers & Promotions</h1>
            <span className="text-xs bg-[#F4F1EA] text-[#5A544E] px-2.5 py-0.5 rounded-full font-bold">
              {offers.length} Total
            </span>
          </div>
          <p className="text-sm text-[#9E968C] mt-0.5">
            Create, schedule, and publish live promotions to the website with zero deployment delay
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/offers/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Create Offer
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E5E2DC] pb-3">
        {STATUSES.map(s => {
          const count = counts[s] || 0;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize',
                statusFilter === s
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]'
              )}
            >
              <span>{s.toLowerCase()}</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  statusFilter === s ? 'bg-white/20 text-white' : 'bg-[#F4F1EA] text-[#9E968C]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E968C]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, label, discount..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E2DC] bg-white text-xs text-[#1A1A1A] placeholder:text-[#9E968C] focus:outline-none focus:border-[#0F2747]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={13} className="text-[#9E968C]" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E2DC] bg-white text-xs text-[#5A544E] outline-none"
          >
            <option value="All">All Types</option>
            <option value="CONSULTATION">Consultation</option>
            <option value="PROMOTIONAL">Promotional</option>
            <option value="SERVICE">Service Offer</option>
            <option value="SEASONAL">Seasonal</option>
            <option value="LIMITED_TIME">Limited Time</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center">
          <Tag size={32} className="text-[#C4BDB4] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1A1A1A]">No offers found</p>
          <p className="text-xs text-[#9E968C] mt-1">
            {search || statusFilter !== 'All' ? 'Try adjusting your filters' : 'Create your first promotional offer to get started'}
          </p>
          <button
            onClick={() => navigate('/admin/offers/new')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
          >
            <Plus size={13} /> Create Offer
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8F7F4] border-b border-[#E5E2DC] text-[11px] font-semibold text-[#9E968C] uppercase tracking-wider">
                  <th className="py-3 px-4">Offer & Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Schedule Window</th>
                  <th className="py-3 px-4">Placements</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4]">
                {filteredOffers.map(offer => (
                  <tr key={offer.id} className="hover:bg-[#FDFBF7] transition-colors group">
                    {/* Offer Info */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {offer.featured && (
                            <Star size={12} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                          )}
                          <span className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#0F2747] transition-colors line-clamp-1">
                            {offer.title}
                          </span>
                        </div>
                        <p className="text-[#5A544E] text-xs line-clamp-1">{offer.shortDescription}</p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="bg-[#F4F1EA] text-[#0F2747] font-semibold text-[10px] px-2 py-0.5 rounded-full">
                            {offer.label}
                          </span>
                          {offer.discountValue && (
                            <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                              {offer.discountValue}
                            </span>
                          )}
                          <span className="text-[10.5px] text-[#9E968C]">Priority {offer.priority}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-[#5A544E] bg-[#F4F1EA] px-2.5 py-1 rounded-lg">
                        {offer.type}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5 text-[11px]">
                        <p className="text-[#1A1A1A] flex items-center gap-1">
                          <span className="text-[#9E968C]">Start:</span> {formatDateTime(offer.startAt)}
                        </p>
                        <p className="text-[#1A1A1A] flex items-center gap-1">
                          <span className="text-[#9E968C]">End:</span> {formatDateTime(offer.endAt)}
                        </p>
                      </div>
                    </td>

                    {/* Placements */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {offer.placements.showInAnnouncement && (
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-blue-200">
                            Header
                          </span>
                        )}
                        {offer.placements.showInHero && (
                          <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-purple-200">
                            Hero
                          </span>
                        )}
                        {offer.placements.showInMobileSticky && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                            Mobile
                          </span>
                        )}
                        {offer.placements.showOnServices && (
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            Services
                          </span>
                        )}
                        {offer.placements.showOnConditions && (
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            Conditions
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full border', getStatusColor(offer.status))}>
                        {offer.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewOffer(offer)}
                          className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E] transition-colors"
                          title="Live Preview"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/offers/${offer.id}`)}
                          className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E] transition-colors"
                          title="Edit Offer"
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Publish / Unpublish Button */}
                        {offer.status === 'ACTIVE' || offer.status === 'SCHEDULED' ? (
                          <button
                            onClick={() => handleUnpublish(offer)}
                            className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[11px] transition-colors"
                            title="Unpublish"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublishClick(offer)}
                            disabled={offer.status === 'EXPIRED'}
                            className="px-2.5 py-1 rounded-lg bg-[#0F2747] text-white hover:bg-[#0B1D3A] font-semibold text-[11px] transition-colors disabled:opacity-40"
                            title="Publish to Live Website"
                          >
                            Publish
                          </button>
                        )}

                        <button
                          onClick={() => handleDuplicate(offer)}
                          className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E] transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => handleArchive(offer)}
                          className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E] transition-colors"
                          title="Archive"
                        >
                          <Archive size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(offer)}
                          className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 transition-colors"
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
        </div>
      )}

      {/* Production Preview Modal */}
      {previewOffer && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewOffer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E5E2DC]">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Offer Live Preview</h3>
                <p className="text-xs text-[#9E968C]">{previewOffer.title}</p>
              </div>
              <button
                onClick={() => setPreviewOffer(null)}
                className="w-7 h-7 rounded-lg hover:bg-[#F4F1EA] flex items-center justify-center text-[#5A544E]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-3 sm:p-6 space-y-6 overflow-y-auto bg-[#FAF9F6]">
              {/* Header Announcement Bar Preview */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[#9E968C] uppercase tracking-wider">
                  Header Announcement Bar Placement
                </p>
                <div className="bg-[#111110] text-[#EDE8E0] text-xs py-2.5 px-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#0F2747] animate-pulse" />
                    <span className="bg-[#FAF9F6]/15 text-[#10B981] text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {previewOffer.label}
                    </span>
                    <span className="font-medium text-white">{previewOffer.title}</span>
                  </div>
                  <span className="bg-[#FAF9F6] text-[#111110] px-3 py-1 rounded-full text-[11px] font-bold">
                    {previewOffer.ctaText}
                  </span>
                </div>
              </div>

              {/* Hero Promotion Card Preview */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[#9E968C] uppercase tracking-wider">
                  Hero Section Placement
                </p>
                <div className="bg-white border-2 border-[#0F2747]/15 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0F2747] text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-[#0F2747]/10 text-[#0F2747] px-2 py-0.5 rounded-full">
                        {previewOffer.label}
                      </span>
                      <p className="text-sm font-bold text-[#1A1A1A] mt-1">{previewOffer.title}</p>
                      <p className="text-xs text-[#5A544E]">{previewOffer.shortDescription}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-bold whitespace-nowrap">
                    {previewOffer.ctaText}
                  </button>
                </div>
              </div>

              {/* Mobile Sticky CT• Preview */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[#9E968C] uppercase tracking-wider">
                  Mobile Sticky Bottom Bar Placement
                </p>
                <div className="max-w-sm mx-auto bg-[#111110] text-white rounded-xl p-2 flex items-center justify-between text-xs font-medium shadow-md">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="bg-[#10B981] text-[#111110] text-[9.5px] font-bold px-1.5 py-0.2 rounded uppercase">
                      {previewOffer.discountValue || previewOffer.label}
                    </span>
                    <span className="truncate">{previewOffer.title}</span>
                  </div>
                  <span className="text-[#10B981] font-bold text-[11px] pl-2 flex-shrink-0">
                    {previewOffer.ctaText} →
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E2DC] bg-white flex justify-end">
              <button
                onClick={() => setPreviewOffer(null)}
                className="px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placement Conflict Warning Dialog */}
      {conflictTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Placement Conflict Detected</h3>
              <p className="text-xs text-[#5A544E] mt-1 leading-relaxed">
                Another active offer is currently assigned to one of this offer's high-priority placements:
              </p>
              <div className="mt-3 bg-[#F8F7F4] rounded-xl p-3 space-y-2 border border-[#E5E2DC]">
                {conflictTarget.conflicts.map(c => (
                  <div key={c.id} className="text-xs">
                    <p className="font-bold text-[#1A1A1A]">{c.title}</p>
                    <p className="text-[11px] text-[#9E968C]">Status: {c.status} · Priority: {c.priority}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5A544E] mt-2">
                Would you like to replace the existing offer(s) with <strong>"{conflictTarget.offer.title}"</strong>•
              </p>
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <button
                onClick={() => setConflictTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E2DC] text-xs font-semibold text-[#5A544E] hover:bg-[#F8F7F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConflictPublish}
                className="px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
              >
                Replace Existing & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Offer"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"• This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

