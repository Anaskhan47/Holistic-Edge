import React from 'react';
import { Stethoscope, CheckCircle2 } from 'lucide-react';
import { servicesData } from '../../../data/services';

export function ServicesPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Services Management</h1>
        <p className="text-sm text-[#9E968C]">View and manage clinic therapeutic offerings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicesData.map(service => (
          <div key={service.id} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A94420]/10 text-[#A94420] flex items-center justify-center font-bold">
                <Stethoscope size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">{service.title}</h2>
                <p className="text-xs text-[#9E968C]">{service.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-[#5A544E] leading-relaxed">{service.shortDescription}</p>
            <div className="space-y-1 pt-2 border-t border-[#F0ECE4]">
              <span className="text-[11px] font-semibold text-[#9E968C] uppercase">Key Benefits:</span>
              <ul className="text-xs text-[#2C2926] space-y-1">
                {service.benefits.slice(0, 3).map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
