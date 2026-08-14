import React from 'react';
import { ScrollText, RefreshCw, Activity, Check, Plus, Trash2, Eye, Star } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

const ACTION_ICONS: Record<string, React.ReactNode> = {
  created: <Plus size={13} className="text-green-600" />,
  updated: <RefreshCw size={13} className="text-[#1A365D]" />,
  deleted: <Trash2 size={13} className="text-red-500" />,
  approved: <Check size={13} className="text-green-600" />,
  rejected: <Trash2 size={13} className="text-red-500" />,
  featured: <Star size={13} className="text-amber-600" />,
  initialized: <Activity size={13} className="text-[#9E968C]" />,
  status_changed: <RefreshCw size={13} className="text-amber-600" />,
  note_added: <Plus size={13} className="text-[#1A365D]" />,
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AuditLogsPage() {
  const { auditEntries } = useAdminStore();

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Audit Logs</h1>
        <p className="text-sm text-[#9E968C]">{auditEntries.length} entries · Last 500 actions</p>
      </div>

      <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0ECE4] bg-[#F8F7F4]">
                {['Action', 'Entity', 'Description', 'Actor', 'Timestamp'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#9E968C] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F7F4]">
              {auditEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <ScrollText size={24} className="text-[#C4BDB4] mx-auto mb-3" />
                    <p className="text-sm text-[#9E968C]">No audit entries yet</p>
                  </td>
                </tr>
              ) : (
                auditEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#F4F1EA] flex items-center justify-center flex-shrink-0">
                          {ACTION_ICONS[entry.action] ?? <Activity size={12} className="text-[#9E968C]" />}
                        </div>
                        <span className="text-[12.5px] font-medium text-[#1A1A1A] capitalize">{entry.action.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11.5px] bg-[#F4F1EA] text-[#5A544E] px-2 py-0.5 rounded-full capitalize">{entry.entity}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <p className="text-[12.5px] text-[#2C2926] truncate">{entry.description}</p>
                      <p className="text-[10.5px] text-[#C4BDB4] font-mono">{entry.entityId}</p>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-[#5A544E]">{entry.actor}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] text-[#9E968C]">{formatTs(entry.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
