import React, { useEffect, useState, useMemo } from 'react';
import { X, Search, ImageIcon, Check, Upload, FolderOpen } from 'lucide-react';
import { imageStorage, type MediaAsset, type MediaCategory } from '../../services/imageStorage';
import { cn } from '../../../lib/utils';

const CATEGORIES: { value: MediaCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Media' },
  { value: 'offers', label: 'Offers' },
  { value: 'services', label: 'Services' },
  { value: 'conditions', label: 'Conditions' },
  { value: 'team', label: 'Team' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'homepage', label: 'Homepage' },
  { value: 'amm-method', label: 'A.M.M Method' },
  { value: 'other', label: 'Other' },
];

export interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  category: MediaCategory;
}

export function MediaLibraryModal({ open, onClose, onSelect, category }: MediaLibraryModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<MediaCategory | 'all'>(category || 'all');

  useEffect(() => {
    if (!open) return;
    setAssets(imageStorage.getAll());
    const unsub = imageStorage.subscribe(() => setAssets(imageStorage.getAll()));
    return unsub;
  }, [open]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setSelectedId(null);
      setSearch('');
    }
  }, [open]);

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const matchesCat = filterCat === 'all' || a.category === filterCat;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        a.originalName.toLowerCase().includes(q) ||
        a.altText.toLowerCase().includes(q) ||
        a.caption.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [assets, filterCat, search]);

  const handleSelect = () => {
    const asset = assets.find(a => a.id === selectedId);
    if (asset) {
      onSelect(asset);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E2DC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2747] text-white flex items-center justify-center">
              <ImageIcon size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1A1A1A]">Media Library</h2>
              <p className="text-[11px] text-[#9E968C]">{assets.length} asset{assets.length !== 1 ? 's' : ''} · Select an image to use</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#FAF9F6] hover:bg-[#F0ECE4] flex items-center justify-center text-[#5A544E] hover:text-[#1A1A1A] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 px-5 py-3 border-b border-[#E5E2DC] bg-[#FAF9F6]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E968C]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by filename or alt text…"
              className="w-full pl-8 pr-3 h-9 rounded-lg border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] bg-white"
            />
          </div>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value as MediaCategory | 'all')}
            className="h-9 px-3 rounded-lg border border-[#E5E2DC] text-xs text-[#1A1A1A] bg-white outline-none"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC] flex items-center justify-center mb-3">
                <FolderOpen size={24} className="text-[#9E968C]" />
              </div>
              <p className="text-sm font-bold text-[#5A544E]">
                {search || filterCat !== 'all' ? 'No matching images' : 'No images uploaded yet'}
              </p>
              <p className="text-xs text-[#9E968C] mt-1">
                {search ? 'Try a different search term' : 'Upload images using the uploader in any form'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map(asset => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setSelectedId(asset.id === selectedId ? null: asset.id)}
                  onDoubleClick={() => { setSelectedId(asset.id); handleSelect(); }}
                  className={cn(
                    'relative rounded-xl overflow-hidden border-2 transition-all text-left group',
                    asset.id === selectedId
                      ? 'border-[#0F2747] ring-2 ring-[#0F2747]/20'
                      : 'border-[#E5E2DC] hover:border-[#0F2747]/40'
                  )}
                >
                  <div className="aspect-square bg-[#FAF9F6]">
                    <img
                      src={asset.url}
                      alt={asset.altText || asset.originalName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Selection checkmark */}
                  {asset.id === selectedId && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0F2747] text-white flex items-center justify-center shadow-md">
                      <Check size={11} />
                    </div>
                  )}

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white font-medium truncate">{asset.originalName}</p>
                    <p className="text-[9px] text-white/70">{(asset.sizeBytes / 1024).toFixed(0)} KB · {asset.width}×{asset.height}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E2DC] bg-[#FAF9F6]">
          <p className="text-xs text-[#9E968C]">
            {selectedId ? (
              <span className="text-[#0F2747] font-semibold">1 image selected · Double-click to select quickly</span>
            ) : (
              `${filtered.length} image${filtered.length !== 1 ? 's' : ''}`
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 rounded-lg border border-[#E5E2DC] text-xs font-semibold text-[#5A544E] hover:bg-[#F0ECE4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSelect}
              disabled={!selectedId}
              className="h-8 px-4 rounded-lg bg-[#0F2747] text-white text-xs font-bold hover:bg-[#0B1D3A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
