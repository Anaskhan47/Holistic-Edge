import React, { useState } from 'react';
import { googleReviewsStorage, type GoogleReviewItem, type GoogleIntegrationState } from '../../../services/api/cmsStorage';
import { useAdminStore } from '../../context/AdminStoreContext';
import { Star, RefreshCw, Globe, Check, EyeOff, Archive, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function GoogleReviewsPage() {
  const { showToast } = useAdminStore();
  const [reviews, setReviews] = useState<GoogleReviewItem[]>(() => googleReviewsStorage.getAll());
  const [integration, setIntegration] = useState<GoogleIntegrationState>(() => googleReviewsStorage.getIntegrationState());
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'published' | 'featured' | 'archived'>('all');

  const refreshData = () => {
    setReviews(googleReviewsStorage.getAll());
    setIntegration(googleReviewsStorage.getIntegrationState());
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      const res = googleReviewsStorage.syncGoogleReviews();
      setSyncing(false);
      refreshData();
      showToast('success', 'Google Review Sync Complete', res.importedCount > 0 ? `Imported ${res.importedCount} new review(s) from Google Business Profile` : 'No new Google reviews found');
    }, 800);
  };

  const handleConnectToggle = () => {
    if (integration.isConnected) {
      googleReviewsStorage.updateIntegrationState({ isConnected: false, syncStatus: 'Idle' });
      showToast('info', 'Disconnected', 'Google Business Profile disconnected');
    } else {
      googleReviewsStorage.updateIntegrationState({
        isConnected: true,
        accountName: 'Holistic Edge Chiropractic & Wellness Clinic',
        accountId: 'accounts/109849203847291',
        locationId: 'locations/847291039847291',
        locationName: 'Mehdipatnam Branch',
        syncStatus: 'Success'
      });
      showToast('success', 'Connected', 'OAuth 2.0 authorization granted for Google Business Profile');
    }
    refreshData();
  };

  const handleApprove = (id: string) => {
    googleReviewsStorage.approveReview(id);
    refreshData();
    showToast('success', 'Review Approved', 'Review is now approved for website publication');
  };

  const handlePublish = (id: string) => {
    googleReviewsStorage.publishToWebsite(id);
    refreshData();
    showToast('success', 'Published to Website', 'Review is now live on the public Holistic Edge website!');
  };

  const handleUnpublish = (id: string) => {
    googleReviewsStorage.unpublishFromWebsite(id);
    refreshData();
    showToast('info', 'Unpublished', 'Review removed from public website');
  };

  const handleToggleFeatured = (id: string) => {
    const updated = googleReviewsStorage.toggleFeatured(id);
    refreshData();
    if (updated?.isFeatured) {
      showToast('success', 'Featured Review', 'Review will be highlighted as featured on the website');
    } else {
      showToast('info', 'Unfeatured', 'Review removed from featured highlights');
    }
  };

  const handleArchive = (id: string) => {
    googleReviewsStorage.archiveReview(id);
    refreshData();
    showToast('info', 'Archived', 'Review archived');
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return r.status === 'PENDING' || !r.isApproved;
    if (filter === 'approved') return r.isApproved && !r.isPublishedOnWebsite;
    if (filter === 'published') return r.isPublishedOnWebsite;
    if (filter === 'featured') return Boolean(r.isFeatured);
    if (filter === 'archived') return r.status === 'ARCHIVED';
    return true;
  });

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Star size={22} className="fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#1A1A1A]">Google Business Profile Reviews</h1>
              {integration.isConnected ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Connected
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <AlertCircle size={12} /> Disconnected
                </span>
              )}
            </div>
            <p className="text-xs text-[#9E968C] mt-1">
              Sync, moderate, and feature live Google reviews from your clinic's Google Business Profile on the public website.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncNow}
            disabled={!integration.isConnected || syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={handleConnectToggle}
            className="px-4 py-2.5 rounded-xl border border-[#E5E2DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
          >
            {integration.isConnected ? 'Disconnect' : 'Connect Google Profile'}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'pending', 'approved', 'published', 'featured', 'archived'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors cursor-pointer',
                filter === f
                  ? 'bg-[#0F2747] text-white font-semibold'
                  : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]'
              )}
            >
              {f} ({reviews.filter(r => {
                if (f === 'pending') return r.status === 'PENDING' || !r.isApproved;
                if (f === 'approved') return r.isApproved && !r.isPublishedOnWebsite;
                if (f === 'published') return r.isPublishedOnWebsite;
                if (f === 'featured') return Boolean(r.isFeatured);
                if (f === 'archived') return r.status === 'ARCHIVED';
                return true;
              }).length})
            </button>
          ))}
        </div>

        <div className="text-xs text-[#5A544E] font-medium">
          <span className="font-bold text-[#0F2747]">{reviews.filter(r => r.isPublishedOnWebsite).length}</span> Live on Public Website
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden divide-y divide-[#F0ECE4] shadow-sm">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Star size={24} className="text-[#C4BDB4] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#1A1A1A]">No Google Reviews Found</p>
            <p className="text-xs text-[#9E968C] mt-1">Click "Sync Now" to retrieve reviews from Google Business Profile.</p>
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className="p-5 space-y-3 hover:bg-[#F0F4F8]/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    {Array.from({ length: r.starRating }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{r.reviewerName}</h3>
                    <p className="text-[11px] text-[#9E968C]">
                      Google Review &bull; {new Date(r.reviewTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.isFeatured && (
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      Featured
                    </span>
                  )}
                  <span className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider',
                    r.isPublishedOnWebsite
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : r.isApproved
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  )}>
                    {r.isPublishedOnWebsite ? 'Published on Website' : r.isApproved ? 'Approved' : 'Pending Review'}
                  </span>
                </div>
              </div>

              {r.comment && (
                <p className="text-xs sm:text-sm text-[#2C2926] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DC]">
                  "{r.comment}"
                </p>
              )}

              {r.hasReply && r.replyComment && (
                <div className="pl-4 border-l-2 border-[#0F2747] text-xs text-[#5A544E] space-y-1">
                  <span className="font-bold text-[#0F2747] block">Owner Response on Google:</span>
                  <p className="italic">"{r.replyComment}"</p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#F0ECE4]">
                {!r.isApproved && (
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Check size={13} />
                    <span>Approve</span>
                  </button>
                )}

                {!r.isPublishedOnWebsite ? (
                  <button
                    onClick={() => handlePublish(r.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] transition-colors shadow-xs cursor-pointer"
                  >
                    <Globe size={13} />
                    <span>Publish to Website</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(r.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                  >
                    <EyeOff size={13} />
                    <span>Unpublish</span>
                  </button>
                )}

                <button
                  onClick={() => handleToggleFeatured(r.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
                    r.isFeatured
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-[#F8F7F4] text-[#5A544E] border-[#E5E2DC] hover:bg-[#F0ECE4]'
                  )}
                >
                  <Star size={13} className={r.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                  <span>{r.isFeatured ? 'Unfeature' : 'Feature'}</span>
                </button>

                <button
                  onClick={() => handleArchive(r.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
                >
                  <Archive size={13} />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
