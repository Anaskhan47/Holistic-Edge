import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, RefreshCw, ImageIcon, Check, AlertCircle, Loader2 } from 'lucide-react';
import { imageStorage, validateFile, type MediaAsset, type MediaCategory } from '../../services/imageStorage';
import { UPLOAD_CONFIG, PLACEMENT_GUIDANCE, type UploadPlacement } from '../../config/uploadConfig';
import { cn } from '../../../lib/utils';

// ─── Types ────────────────────────────────────────────────────

type UploadState = 'idle' | 'selecting' | 'uploading' | 'processing' | 'success' | 'error';

export interface ImageUploaderProps {
  /** Current image URL (base64 or CDN) */
  value: string;
  /** Called when a new image is successfully uploaded */
  onChange: (url: string, assetId?: string) => void;
  /** Called when image is removed */
  onRemove?: () => void;
  /** Alt text value */
  altText?: string;
  /** Called when alt text changes */
  onAltTextChange?: (alt: string) => void;
  /** Placement key for dimension guidance */
  placement?: UploadPlacement | string;
  /** Media category for library organization */
  category?: MediaCategory | string;
  /** Max file size in bytes (overrides config default) */
  maxSizeMb?: number;
  /** Admin username for audit */
  uploadedBy?: string;
  /** Called when "Choose from Media Library" is clicked */
  onSelectFromLibrary?: () => void;
  className?: string;
  /** Make the uploader compact */
  compact?: boolean;
  /** Whether uploader is disabled */
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────

export function ImageUploader({
  value,
  onChange,
  onRemove,
  altText = '',
  onAltTextChange,
  placement = 'general',
  category = 'other',
  uploadedBy = 'admin',
  onSelectFromLibrary,
  className,
  compact = false,
  disabled = false,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>(value ? 'success' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const guidance = PLACEMENT_GUIDANCE[placement] || PLACEMENT_GUIDANCE.general;

  const handleFile = useCallback(async (file: File) => {
    setPendingFile(file);
    setErrorMessage('');

    // Validate
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadState('error');
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }

    setUploadState('uploading');

    try {
      setUploadState('processing');
      const asset = await imageStorage.upload(file, {
        category: category as MediaCategory,
        uploadedBy,
        altText,
      });
      onChange(asset.url, asset.id);
      setUploadState('success');
      setPendingFile(null);
    } catch (err: any) {
      setUploadState('error');
      setErrorMessage(err?.message || 'Upload failed. Please try again.');
    }
  }, [category, uploadedBy, altText, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected after remove
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [disabled, handleFile]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setUploadState('idle');
    setErrorMessage('');
    setPendingFile(null);
    onRemove?.();
    onChange('', undefined);
  };

  const handleRetry = () => {
    if (pendingFile) {
      handleFile(pendingFile);
    } else {
      setUploadState('idle');
      setErrorMessage('');
    }
  };

  const triggerPicker = () => {
    if (!disabled && uploadState !== 'uploading' && uploadState !== 'processing') {
      inputRef.current?.click();
    }
  };

  // ── Render: Success (image preview) ──
  if (uploadState === 'success' && value) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="relative rounded-xl overflow-hidden border border-[#E5E2DC] bg-[#FAF9F6] group">
          <img
            src={value}
            alt={altText || 'Uploaded image'}
            className={cn(
              'w-full object-cover',
              compact ? 'h-32' : 'h-44'
            )}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={triggerPicker}
              disabled={disabled}
              className="flex items-center gap-1.5 bg-white text-[#0F2747] text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-blue-50 transition-colors"
            >
              <RefreshCw size={13} />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="flex items-center gap-1.5 bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-red-50 transition-colors"
            >
              <X size={13} />
              Remove
            </button>
          </div>
        </div>

        {/* Alt text */}
        {onAltTextChange && (
          <div>
            <label className="block text-xs font-semibold text-[#5A544E] mb-1">Alt Text <span className="text-[#9E968C] font-normal">(for accessibility & SEO)</span></label>
            <input
              value={altText}
              onChange={e => onAltTextChange(e.target.value)}
              placeholder={`Describe this ${guidance.label.toLowerCase()}…`}
              className="w-full h-9 px-3 rounded-lg border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] bg-white"
            />
          </div>
        )}

        {/* Quick change controls visible at bottom */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerPicker}
            disabled={disabled}
            className="flex items-center gap-1.5 text-[#0F2747] text-xs font-semibold hover:text-[#0B1D3A] transition-colors"
          >
            <RefreshCw size={12} />
            Replace Image
          </button>
          {onSelectFromLibrary && (
            <>
              <span className="text-[#D5CFC5]">·</span>
              <button
                type="button"
                onClick={onSelectFromLibrary}
                disabled={disabled}
                className="flex items-center gap-1.5 text-[#5A544E] text-xs font-semibold hover:text-[#1A1A1A] transition-colors"
              >
                <ImageIcon size={12} />
                Media Library
              </button>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={UPLOAD_CONFIG.INPUT_ACCEPT}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  // ── Render: Uploading / Processing ──
  if (uploadState === 'uploading' || uploadState === 'processing') {
    return (
      <div className={cn(
        'rounded-xl border-2 border-dashed border-[#E5E2DC] bg-[#FAF9F6] flex flex-col items-center justify-center gap-3 text-center',
        compact ? 'p-6' : 'p-10',
        className
      )}>
        <Loader2 size={28} className="text-[#0F2747] animate-spin" />
        <div>
          <p className="text-sm font-bold text-[#1A1A1A]">
            {uploadState === 'processing' ? 'Processing image…' : 'Uploading…'}
          </p>
          <p className="text-xs text-[#9E968C] mt-0.5">
            {pendingFile?.name || ''}
          </p>
        </div>
      </div>
    );
  }

  // ── Render: Error ──
  if (uploadState === 'error') {
    return (
      <div className={cn(
        'rounded-xl border-2 border-dashed border-red-200 bg-red-50 flex flex-col items-center justify-center gap-3 text-center',
        compact ? 'p-6' : 'p-8',
        className
      )}>
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle size={20} className="text-red-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-red-700">Upload Failed</p>
          <p className="text-xs text-red-500 mt-1 max-w-xs">{errorMessage}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1.5 bg-white border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
          <button
            type="button"
            onClick={() => { setUploadState('idle'); setErrorMessage(''); }}
            className="flex items-center gap-1.5 bg-white border border-[#E5E2DC] text-[#5A544E] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#FAF9F6] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Idle (drop zone) ──
  return (
    <div className={cn('space-y-2.5', className)}>
      <div
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={disabled ? undefined: triggerPicker}
        className={cn(
          'rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center select-none',
          compact ? 'p-6' : 'p-10',
          isDragOver
            ? 'border-[#0F2747] bg-[#0F2747]/5'
            : 'border-[#D5CFC5] bg-[#FAF9F6] hover:border-[#0F2747]/40 hover:bg-white',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className={cn(
          'rounded-xl flex items-center justify-center transition-colors',
          compact ? 'w-10 h-10' : 'w-14 h-14',
          isDragOver ? 'bg-[#0F2747] text-white' : 'bg-white border border-[#E5E2DC] text-[#0F2747]'
        )}>
          <Upload size={compact ? 18: 24} />
        </div>

        <div>
          <p className={cn('font-bold text-[#1A1A1A]', compact ? 'text-xs' : 'text-sm')}>
            {isDragOver ? 'Drop image here' : 'Drag & drop image here'}
          </p>
          <p className="text-xs text-[#9E968C] mt-0.5">
            or <span className="text-[#0F2747] font-semibold underline-offset-2 hover:underline">click to browse</span>
          </p>
          {!compact && (
            <p className="text-[11px] text-[#B8B0A6] mt-2">
              {UPLOAD_CONFIG.ACCEPTED_EXTENSIONS} · Max {UPLOAD_CONFIG.MAX_FILE_SIZE_LABEL}
            </p>
          )}
        </div>

        {!compact && (
          <p className="text-[11px] text-[#9E968C] italic">{guidance.recommend}</p>
        )}
      </div>

      {/* Library / Alt text row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {onSelectFromLibrary && (
          <button
            type="button"
            onClick={onSelectFromLibrary}
            disabled={disabled}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5A544E] hover:text-[#1A1A1A] transition-colors border border-[#E5E2DC] rounded-lg px-3 py-1.5 bg-white hover:border-[#0F2747]/30"
          >
            <ImageIcon size={13} />
            Choose from Media Library
          </button>
        )}
      </div>

      {/* Alt text (idle state) */}
      {onAltTextChange && (
        <div>
          <label className="block text-xs font-semibold text-[#5A544E] mb-1">
            Alt Text <span className="text-[#9E968C] font-normal">(describe the image for accessibility)</span>
          </label>
          <input
            value={altText}
            onChange={e => onAltTextChange(e.target.value)}
            placeholder={`e.g. ${guidance.label} for Holistic Edge Chiropractic…`}
            className="w-full h-9 px-3 rounded-lg border border-[#E5E2DC] text-xs text-[#1A1A1A] outline-none focus:border-[#0F2747] bg-white"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_CONFIG.INPUT_ACCEPT}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}
