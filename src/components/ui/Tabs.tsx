import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count: number;
  icon: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant: 'pills' | 'underline' | 'segmented';
  className: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className
}) => {
  if (variant === 'segmented') {
    return (
      <div className={cn('inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80', className)}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-btn-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-white text-[#0066CC] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isActive ? 'bg-[#E6F0FA] text-[#0066CC]' : 'bg-slate-200/70 text-slate-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            id={`tab-btn-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer',
              isActive
                ? 'bg-[#0066CC] text-white shadow-sm shadow-[#0066CC]/20'
                : 'bg-white text-slate-700 border border-slate-200/90 hover:border-[#0066CC]/40 hover:text-[#0066CC]'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
