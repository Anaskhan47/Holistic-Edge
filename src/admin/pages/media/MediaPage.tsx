import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Check, Tag } from 'lucide-react';
import clinicImg from '../../../../Clinc.png';
import ammImg from '../../../../AMM.avif';
import logoImg from '../../../../Logo.png';

export function MediaPage() {
  const assets = [
    { name: 'Clinc.png', type: 'Clinic Exterior Photo', path: clinicImg, category: 'Facility' },
    { name: 'AMM.avif', type: 'Treatment Photo (Dr. Abdul Mallik)', path: ammImg, category: 'Treatment' },
    { name: 'Logo.png', type: 'Official Clinic Logo', path: logoImg, category: 'Branding' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A1A]">Media Library</h1>
          <p className="text-sm text-[#9E968C]">Clinic photography, treatment assets, and branding assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assets.map(a => (
          <div key={a.name} className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden group">
            <div className="h-40 bg-[#F4F1EA] flex items-center justify-center overflow-hidden p-2">
              <img src={a.path} alt={a.name} className="max-h-full max-w-full object-contain rounded-lg" />
            </div>
            <div className="p-4">
              <p className="text-sm font-bold text-[#1A1A1A] truncate">{a.name}</p>
              <p className="text-xs text-[#9E968C] mt-0.5">{a.type}</p>
              <span className="inline-block mt-2 text-[10.5px] bg-[#F4F1EA] text-[#5A544E] px-2 py-0.5 rounded-full font-medium">{a.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
