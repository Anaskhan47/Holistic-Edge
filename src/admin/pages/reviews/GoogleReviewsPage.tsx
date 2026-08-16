import React, { useState } from 'react';
import { googleReviewsStorage, type GoogleReviewItem, type GoogleIntegrationState } from '../../../services/api/cmsStorage';
import { useAdminStore } from '../../context/AdminStoreContext';
import { Star, RefreshCw, Globe, Check, EyeOff, Archive, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function GoogleReviewsPage() {
  const { showToast } = useAdminStore();
  const [reviews, setReviews] = useState<GoogleReviewItem[]>(() => googleReviewsStorage.getAll());
  const [integration, setIntegration] = useState<GoogleIntegrationState>(() => googleReviewsStorage.getIntegrationState());
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'published' | 'archived'>('all');

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

  const handleArchive = (id: string) => {
    googleReviewsStorage.archiveReview(id);
    refreshData();
    showToast('info', 'Archived', 'Review archived');
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return r.status === 'PENDING' || !r.isApproved;
    if (filter === 'approved') return r.isApproved && !r.isPublishedOnWebsite;
    if (filter === 'published') return r.isPublishedOnWebsite;
    if (filter === 'archived') return r.status === 'ARCHIVED';
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center font-bold border border-[#CBD8E6]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1A1A1A]">Google Business Profile Reviews</h1>
              <span className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1',
                integration.isConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              )}>
                {integration.isConnected ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {integration.isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <p className="text-xs text-[#5A544E] mt-0.5">
              {integration.isConnected
                ? `${integration.accountName} · ${integration.locationName} (Last Synced: ${new Date(integration.lastSyncedAt || '').toLocaleTimeString()})`
                : 'Connect your official Google Business Profile to synchronize and moderate live patient reviews.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncNow}
            disabled={!integration.isConnected || syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={handleConnectToggle}
            className="px-4 py-2.5 rounded-xl border border-[#E5E2DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F8F7F4] transition-colors"
          >
            {integration.isConnected ? 'Disconnect' : 'Connect Google Profile'}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'pending', 'approved', 'published', 'archived'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors',
                filter === f
                  ? 'bg-[#0F2747] text-white font-semibold'
                  : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]'
              )}
            >
              {f} ({reviews.filter(r => {
                if (f === 'pending') return r.status === 'PENDING' || !r.isApproved;
                if (f === 'approved') return r.isApproved && !r.isPublishedOnWebsite;
                if (f === 'published') return r.isPublishedOnWebsite;
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
                  <div className="flex items-center text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    {'★'.repeat(r.starRating)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{r.reviewerName}</h3>
                    <p className="text-[11px] text-[#9E968C]">
                      Google Review · {new Date(r.reviewTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    <Check size={13} />
                    <span>Approve</span>
                  </button>
                )}

                {!r.isPublishedOnWebsite ? (
                  <button
                    onClick={() => handlePublish(r.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] transition-colors shadow-xs"
                  >
                    <Globe size={13} />
                    <span>Publish to Website</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(r.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 border border-amber-200 transition-colors"
                  >
                    <EyeOff size={13} />
                    <span>Unpublish</span>
                  </button>
                )}

                <button
                  onClick={() => handleArchive(r.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 border border-gray-200 transition-colors"
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
