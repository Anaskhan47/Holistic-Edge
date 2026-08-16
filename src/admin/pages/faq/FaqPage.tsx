import React, { useMemo } from 'react';
import { HelpCircle } from 'lucide-react';
import { faqsData } from '../../../data/faqs';

export function FaqPage() {
  const grouped = useMemo(() => {
    const map: Record<string, typeof faqsData> = {};
    faqsData.forEach(f => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return map;
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">FAQ Management</h1>
        <p className="text-sm text-[#9E968C]">{faqsData.length} questions across {Object.keys(grouped).length} categories</p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-[#1A1A1A] border-b border-[#F0ECE4] pb-2">{category}</h2>
            <div className="space-y-3">
              {items.map(q => (
                <div key={q.id} className="bg-[#F8F7F4] rounded-xl p-3.5 space-y-1">
                  <p className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <HelpCircle size={14} className="text-[#0F2747] flex-shrink-0" />
                    {q.question}
                  </p>
                  <p className="text-xs text-[#5A544E] pl-5 leading-relaxed">{q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

