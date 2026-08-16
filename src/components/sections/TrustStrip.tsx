import React from 'react';
import { Award, Users, UserCheck, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { clinicInfo } from '../../data/clinicInfo';

export const TrustStrip: React.FC = () => {
  const metrics = [
    {
      value: '25+',
      label: 'Years Experience',
      sublabel: 'Dedicated Spine Practice',
      icon: Award,
      color: 'text-[#0F2747]',
      bgColor: 'bg-[#F0F4F8]'
    },
    {
      value: '12,000+',
      label: 'Patients Treated',
      sublabel: 'In Mehdipatnam, Hyd',
      icon: Users,
      color: 'text-[#1B4332]',
      bgColor: 'bg-[#EAF2ED]'
    },
    {
      value: '7',
      label: 'Healthcare Team',
      sublabel: 'Multidisciplinary Staff',
      icon: UserCheck,
      color: 'text-[#1A365D]',
      bgColor: 'bg-[#EBF2F7]'
    },
    {
      value: '4.6★',
      label: 'Justdial Verified',
      sublabel: 'External Patient Rating',
      icon: Star,
      color: 'text-[#D49E58]',
      bgColor: 'bg-[#FAF4ED]',
      isStar: true
    },
    {
      value: '4.7★',
      label: 'Cybo Rating',
      sublabel: 'External Clinic Profile',
      icon: Star,
      color: 'text-[#D49E58]',
      bgColor: 'bg-[#FAF4ED]',
      isStar: true
    }
  ];

  return (
    <div id="trust-metrics-strip" className="bg-[#FAF9F6] border-b border-[#E8E4DC] py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white hover:bg-[#FDFBF7] border border-[#E8E4DC] hover:border-[#D5CFC5] rounded-2xl p-4 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5"
              >
                <div className={`w-11 h-11 rounded-xl ${m.bgColor} flex items-center justify-center flex-shrink-0 ${m.color}`}>
                  <Icon className={`w-5 h-5 ${m.isStar ? 'fill-current' : ''}`} />
                </div>
                <div className="text-left">
                  <span className="text-xl md:text-2xl font-normal text-[#1A1A1A] font-serif leading-none block">
                    {m.value}
                  </span>
                  <span className="text-xs font-semibold text-[#2C2926] block mt-1">
                    {m.label}
                  </span>
                  <span className="text-[10px] text-[#736C63] block">
                    {m.sublabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
