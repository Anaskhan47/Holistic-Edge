import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E5E2DC] w-full max-w-sm p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#9E968C] hover:text-[#1A1A1A]"
        >
          <X size={16} />
        </button>

        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
          variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'
        )}>
          {variant === 'danger'
            ? <Trash2 size={18} className="text-red-600" />
            : <AlertTriangle size={18} className="text-amber-600" />
          }
        </div>

        <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">{title}</h3>
        <p className="text-sm text-[#5A544E] leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl border border-[#E5E2DC] text-sm text-[#2C2926] hover:bg-[#F8F7F4] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50',
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
            )}
          >
            {isLoading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
