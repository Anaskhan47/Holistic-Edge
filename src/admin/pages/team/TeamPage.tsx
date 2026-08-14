import React from 'react';
import { teamData } from '../../../data/team';

export function TeamPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Team & Practitioners</h1>
        <p className="text-sm text-[#9E968C]">Manage practitioner profiles and credentials</p>
      </div>

      <div className="space-y-4">
        {teamData.map(member => (
          <div key={member.id} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 flex items-start gap-4">
            <img
              src={member.image as string}
              alt={member.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1A1A1A]">{member.name}</h2>
                <span className="text-xs bg-[#A94420]/10 text-[#A94420] px-2.5 py-0.5 rounded-full font-medium">
                  {typeof member.experienceYears === 'number'
                    ? `${member.experienceYears}+ yrs`
                    : member.experienceYears}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#5A544E]">{member.role} · {member.qualifications}</p>
              <p className="text-xs text-[#9E968C] leading-relaxed">{member.bio}</p>
              <div className="flex flex-wrap gap-1 pt-2">
                {member.specialization.map((s, i) => (
                  <span key={i} className="text-[10.5px] bg-[#F4F1EA] text-[#5A544E] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
