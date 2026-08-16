import React from 'react';
import { cn } from '../../../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] flex items-center justify-center mb-4 text-[#9E968C]">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[#9E968C] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── Skeleton Rows ─────────────────────────────────────────────

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className={cn(
            'h-4 rounded-md bg-[#F0ECE4] animate-pulse',
            i === 0 ? 'w-32' : i === cols - 1 ? 'w-16' : 'w-full max-w-[120px]'
          )} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </>
  );
}
