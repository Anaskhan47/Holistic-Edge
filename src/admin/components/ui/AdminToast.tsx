import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../../types/admin.types';
import { cn } from '../../../lib/utils';
import { useAdminStore } from '../../context/AdminStoreContext';

const TYPE_CONFIG = {
  success: { icon: <CheckCircle2 size={15} />, bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', text: 'text-[#166534]', iconColor: 'text-[#16A34A]' },
  error: { icon: <XCircle size={15} />, bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#991B1B]', iconColor: 'text-[#DC2626]' },
  warning: { icon: <AlertTriangle size={15} />, bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', text: 'text-[#92400E]', iconColor: 'text-[#D97706]' },
  info: { icon: <Info size={15} />, bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', text: 'text-[#1E3A8A]', iconColor: 'text-[#2563EB]' },
};

function Toast({ toast }: { toast: ToastMessage }) {
  const { dismissToast } = useAdminStore();
  const config = TYPE_CONFIG[toast.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm w-full',
        'animate-in slide-in-from-right-full duration-300',
        config.bg, config.border
      )}
    >
      <span className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold leading-tight', config.text)}>{toast.title}</p>
        {toast.message && (
          <p className={cn('text-xs mt-0.5 leading-tight opacity-80', config.text)}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className={cn('flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5', config.text)}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function AdminToastContainer() {
  const { toasts } = useAdminStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
}
