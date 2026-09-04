import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Stethoscope,
  Eye,
  Edit2,
  Globe,
  EyeOff,
  Archive,
  Trash2,
  CheckCircle2,
  Star,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminStore } from '../../context/AdminStoreContext';
import {
  servicesCmsStorage,
  type AdminServiceCms,
  type CmsStatus,
  CMS_UPDATED_EVENT
} from '../../services/cmsStorage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { cn } from '../../../lib/utils';

const STATUS_TABS: ('All' | CmsStatus)[] = ['All', 'PUBLISHED', 'DRAFT', 'UNPUBLISHED', 'ARCHIVED'];

export function ServicesPage() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast, logAudit } = useAdminStore();

  const [services, setServices] = useState<AdminServiceCms[]>(() => servicesCmsStorage.getAll());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminServiceCms | null>(null);
  const [previewTarget, setPreviewTarget] = useState<AdminServiceCms | null>(null);

  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const refresh = () => {
    setServices(servicesCmsStorage.getAll());
  };

  useEffect(() => {
    refresh();
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: services.length };
    STATUS_TABS.forEach(s => {
      if (s !== 'All') {
        map[s] = services.filter(item => item.status === s).length;
      }
    });
    return map;
  }, [services]);

  const filtered = useMemo(() => {
    let list = [...services];
    if (statusFilter !== 'All') {
      list = list.filter(s => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.shortDescription || '').toLowerCase().includes(q) ||
        (s.slug || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, statusFilter, search]);

  const handlePublishToggle = (service: AdminServiceCms) => {
    if (!canPublish) {
      showToast('error', 'Permission Denied', 'Your role cannot publish content.');
      return;
    }

    if (service.status === 'PUBLISHED') {
      servicesCmsStorage.unpublish(service.id);
      logAudit('unpublished', 'service', service.id, `Unpublished service: ${service.title}`);
      showToast('info', 'Service Unpublished', `"${service.title}" removed from live website.`);
    } else {
      const res = servicesCmsStorage.publish(service.id, user || undefined);
      if (res.success) {
        logAudit('published', 'service', service.id, `Published service: ${service.title}`);
        showToast('success', 'Service Published', `"${service.title}" is now live on the public website.`);
      } else {
        showToast('error', 'Publication Failed', res.error);
      }
    }
    refresh();
  };

  const handleArchive = (service: AdminServiceCms) => {
    servicesCmsStorage.archive(service.id);
    logAudit('archived', 'service', service.id, `Archived service: ${service.title}`);
    showToast('info', 'Service Archived', `"${service.title}" moved to archive.`);
    refresh();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    servicesCmsStorage.delete(deleteTarget.id);
    logAudit('deleted', 'service', deleteTarget.id, `Deleted service: ${deleteTarget.title}`);
    showToast('success', 'Service Deleted', `"${deleteTarget.title}" deleted permanently.`);
    setDeleteTarget(null);
    refresh();
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Clinical Services Management</h1>
            <span className="text-xs bg-[#F4F1EA] text-[#5A544E] px-2.5 py-0.5 rounded-full font-bold">
              {services.length} Total
            </span>
          </div>
          <p className="text-sm text-[#9E968C] mt-0.5">
            Create, edit, and publish clinical treatment protocols with zero-delay website sync
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/services/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E5E2DC] pb-3">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize',
              statusFilter === tab
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]'
            )}
          >
            <span>{tab.toLowerCase()}</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                statusFilter === tab ? 'bg-white/20 text-white' : 'bg-[#F4F1EA] text-[#9E968C]'
              )}
            >
              {counts[tab] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E968C]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, slug, description..."
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E2DC] bg-white text-xs text-[#1A1A1A] placeholder:text-[#9E968C] focus:outline-none focus:border-[#0F2747]"
        />
      </div>

      {/* Services Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center">
          <Stethoscope size={32} className="text-[#C4BDB4] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1A1A1A]">No services found</p>
          <p className="text-xs text-[#9E968C] mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => navigate('/admin/services/new')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold"
          >
            <Plus size={13} /> Add Service
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8F7F4] border-b border-[#E5E2DC] text-[11px] font-semibold text-[#9E968C] uppercase tracking-wider">
                <th className="py-3 px-4">Service & Details</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Benefits</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filtered.map(service => (
                <tr key={service.id} className="hover:bg-[#FDFBF7] transition-colors group">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {service.featured && (
                          <Star size={12} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                        )}
                        <span className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#0F2747] transition-colors">
                          {service.title}
                        </span>
                      </div>
                      <p className="text-[#5A544E] text-xs line-clamp-1">{service.shortDescription}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-[#5A544E] bg-[#F4F1EA] px-2 py-0.5 rounded">
                      /services/{service.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs text-[#5A544E]">{service.benefits.length} Benefits listed</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        'text-[10.5px] font-bold px-2.5 py-1 rounded-full border',
                        service.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' :
                        service.status === 'DRAFT' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                        service.status === 'UNPUBLISHED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-purple-50 text-purple-700 border-purple-200'
                      )}
                    >
                      {service.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewTarget(service)}
                        className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                        title="Live Preview"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        onClick={() => navigate(`/admin/services/${service.id}`)}
                        className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                        title="Edit Service"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handlePublishToggle(service)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors',
                          service.status === 'PUBLISHED'
                            ? 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                            : 'bg-[#0F2747] text-white hover:bg-[#0B1D3A]'
                        )}
                      >
                        {service.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleArchive(service)}
                        className="p-1.5 rounded-lg border border-[#E5E2DC] hover:bg-[#F4F1EA] text-[#5A544E]"
                        title="Archive"
                      >
                        <Archive size={13} />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(service)}
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

      {/* Preview Modal */}
      {previewTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewTarget(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F2747] bg-[#F0F4F8] px-2 py-0.5 rounded-full">
                  Service Live Preview
                </span>
                <h3 className="text-base font-bold text-[#1A1A1A] mt-1">{previewTarget.title}</h3>
              </div>
              <button
                onClick={() => setPreviewTarget(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E5E2DC]"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#5A544E]">
              <p className="text-sm font-semibold text-[#1A1A1A]">{previewTarget.shortDescription}</p>
              <p className="leading-relaxed">{previewTarget.fullDescription}</p>
              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E2DC] space-y-1.5">
                <p className="font-bold text-[#1A1A1A]">Key Benefits:</p>
                {previewTarget.benefits.map((b, i) => (
                  <p key={i} className="flex items-center gap-1.5 text-[#1A1A1A]">
                    <CheckCircle2 size={11} className="text-green-600 flex-shrink-0" />
                    <span>{b}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"•`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

