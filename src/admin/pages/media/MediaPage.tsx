import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Tag,
  Eye,
  X,
  Plus,
  Filter,
  ExternalLink
} from 'lucide-react';
import { mediaStorage } from '../../services/adminStorage';
import { useAdminStore } from '../../context/AdminStoreContext';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import clinicImg from '/holistic-edge-enhanced-clinic-room.svg';
import ammImg from '../../../../AMM.svg';
import logoImg from '../../../../Logo.png';
import { cn } from '../../../lib/utils';
import type { AdminMediaAsset, MediaCategory } from '../../types/admin.types';

const CATEGORIES: ('All' | MediaCategory)[] = [
  'All',
  'Clinic Exterior',
  'Reception',
  'Treatment Room',
  'Doctor',
  'Team',
  'General',
];

export function MediaPage() {
  const { showToast, logAudit } = useAdminStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with mediaStorage + initial built-in assets if empty
  const [assets, setAssets] = useState<AdminMediaAsset[]>(() => {
    const existing = mediaStorage.getAll();
    if (existing.length > 0) return existing;

    // Seed default assets
    const defaults: Omit<AdminMediaAsset, 'id' | 'uploadedAt' | 'usageCount'>[] = [
      {
        filename: 'Clinc.png',
        originalName: 'Clinic Exterior & Reception',
        url: clinicImg,
        mimeType: 'image/png',
        sizeBytes: 2500561,
        altText: 'Holistic Edge Clinic facility and patient entrance',
        category: 'Clinic Exterior',
        tags: ['clinic', 'exterior', 'facility'],
        requiresConsent: false,
        uploadedBy: 'Admin',
      },
      {
        filename: 'AMM.svg',
        originalName: 'Clinical Consultation Photo',
        url: ammImg,
        mimeType: 'image/avif',
        sizeBytes: 149631,
        altText: 'Healer Abdul Mallik performing spinal mobility evaluation',
        category: 'Doctor',
        tags: ['consultation', 'doctor', 'examination'],
        requiresConsent: true,
        consentConfirmed: true,
        uploadedBy: 'Admin',
      },
      {
        filename: 'Logo.png',
        originalName: 'Official Clinic Logo Asset',
        url: logoImg,
        mimeType: 'image/png',
        sizeBytes: 131476,
        altText: 'Holistic Edge Brand Logo',
        category: 'General',
        tags: ['brand', 'logo', 'identity'],
        requiresConsent: false,
        uploadedBy: 'Admin',
      },
    ];

    defaults.forEach(d => mediaStorage.create(d));
    return mediaStorage.getAll();
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewAsset, setPreviewAsset] = useState<AdminMediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('General');
  const [isDragOverPage, setIsDragOverPage] = useState(false);

  const filteredAssets = selectedCategory === 'All'
    ? assets: assets.filter(a => a.category === selectedCategory);

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Invalid file', `${file.name} is not an image.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newAsset = mediaStorage.create({
          filename: file.name,
          originalName: file.name.replace(/\.[^/.]+$/, ''),
          url,
          mimeType: file.type,
          sizeBytes: file.size,
          altText: file.name,
          category: uploadCategory,
          tags: ['upload', uploadCategory.toLowerCase()],
          requiresConsent: false,
          uploadedBy: 'Admin',
        });

        const updated = mediaStorage.getAll();
        setAssets(updated);
        logAudit('created', 'media', newAsset.id, `Uploaded media asset: ${file.name}`);
        showToast('success', 'Media uploaded', `${file.name} added to library.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverPage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverPage(true);
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOverPage(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    mediaStorage.delete(deleteTarget.id);
    const updated = mediaStorage.getAll();
    setAssets(updated);
    logAudit('deleted', 'media', deleteTarget.id, `Deleted media asset: ${deleteTarget.filename}`);
    showToast('success', 'Media deleted', `${deleteTarget.filename} removed from library.`);
    setDeleteTarget(null);
  };

  const copyUrl = (asset: AdminMediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    showToast('info', 'URL Copied', 'Asset reference copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      onDrop={handlePageDrop}
      onDragOver={handlePageDragOver}
      onDragLeave={handlePageDragLeave}
      className="p-3 sm:p-6 space-y-6 max-w-6xl relative min-h-[500px]"
    >
      {isDragOverPage && (
        <div className="absolute inset-0 z-50 bg-[#0F2747]/90 backdrop-blur-xs border-4 border-dashed border-white rounded-3xl flex flex-col items-center justify-center text-white pointer-events-none transition-all">
          <Upload size={48} className="animate-bounce mb-3" />
          <p className="text-xl font-bold">Drop files here to upload to Media Library</p>
          <p className="text-sm opacity-80 mt-1">Categorizing as {uploadCategory}</p>
        </div>
      )}
      {/* Header & Upload Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A1A]">Media Library</h1>
          <p className="text-sm text-[#9E968C]">Upload, manage, and categorize clinical photography and branding assets</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={uploadCategory}
            onChange={e => setUploadCategory(e.target.value as MediaCategory)}
            className="text-xs border border-[#E5E2DC] rounded-xl px-3 py-2 bg-white text-[#5A544E] outline-none"
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] transition-colors"
          >
            <Upload size={14} /> Upload Media
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white border border-[#E5E2DC] text-[#5A544E] hover:bg-[#F8F7F4]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-12 text-center">
          <ImageIcon size={32} className="text-[#C4BDB4] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1A1A1A]">No media in this category</p>
          <p className="text-xs text-[#9E968C] mt-1">Upload an image to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden group hover:shadow-sm hover:border-[#D5CFC5] transition-all flex flex-col justify-between"
            >
              <div className="h-44 bg-[#F4F1EA] relative overflow-hidden flex items-center justify-center p-2">
                <img
                  src={asset.url}
                  alt={asset.altText}
                  className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="p-2 rounded-lg bg-white/90 text-[#1A1A1A] hover:bg-white transition-colors"
                    title="Preview"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => copyUrl(asset)}
                    className="p-2 rounded-lg bg-white/90 text-[#1A1A1A] hover:bg-white transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(asset)}
                    className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-xs font-bold text-[#1A1A1A] truncate" title={asset.originalName}>
                    {asset.originalName}
                  </p>
                  <span className="text-[10px] bg-[#F4F1EA] text-[#5A544E] px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                    {asset.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#9E968C] pt-1 border-t border-[#F4F1EA]">
                  <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                  <span>{new Date(asset.uploadedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E5E2DC]">
              <h3 className="text-sm font-bold text-[#1A1A1A] truncate">{previewAsset.originalName}</h3>
              <button
                onClick={() => setPreviewAsset(null)}
                className="w-7 h-7 rounded-lg hover:bg-[#F4F1EA] flex items-center justify-center text-[#5A544E]"
              >
                <X size={15} />
              </button>
            </div>
            <div className="p-3 sm:p-6 bg-[#F8F7F4] flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={previewAsset.url}
                alt={previewAsset.altText}
                className="max-h-[55vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-[#E5E2DC] flex items-center justify-between bg-white text-xs text-[#5A544E]">
              <span>Category: <strong>{previewAsset.category}</strong></span>
              <button
                onClick={() => copyUrl(previewAsset)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F2747] text-white font-medium"
              >
                <Copy size={12} /> Copy Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Media Asset"
        message={`Are you sure you want to delete "${deleteTarget?.originalName}"• This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

