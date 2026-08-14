import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { conditionsData } from '../../../data/conditions';

export function ConditionsPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Conditions Treated</h1>
        <p className="text-sm text-[#9E968C]">Manage clinical condition protocols and descriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditionsData.map(c => (
          <div key={c.id} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A365D]/10 text-[#1A365D] flex items-center justify-center font-bold">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">{c.title}</h2>
                <p className="text-xs text-[#9E968C]">{c.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-[#5A544E] leading-relaxed">{c.shortDescription}</p>
            <div className="pt-2 border-t border-[#F0ECE4]">
              <span className="text-[11px] font-semibold text-[#9E968C] uppercase mb-1 block">Symptoms Addressed:</span>
              <div className="flex flex-wrap gap-1">
                {c.symptoms.map((s, i) => (
                  <span key={i} className="text-[11px] bg-[#F4F1EA] text-[#5A544E] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
