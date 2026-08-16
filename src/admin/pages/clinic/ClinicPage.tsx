import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { clinicInfo } from '../../../data/clinicInfo';
import clinicPhoto from '../../../../Clinc.png';

export function ClinicPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Clinic Details</h1>
        <p className="text-sm text-[#9E968C]">Location, hours, contact information and facility imagery</p>
      </div>

      <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden">
        <img src={clinicPhoto} alt="Holistic Edge Clinic" className="w-full h-48 object-cover" />
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#1A1A1A]">{clinicInfo.name}</h2>
          <p className="text-xs text-[#5A544E] leading-relaxed">{clinicInfo.tagline}</p>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#F0ECE4]">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-[#0F2747] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">{clinicInfo.name}</p>
                <p className="text-xs text-[#5A544E]">{clinicInfo.address}</p>
                <p className="text-xs text-[#5A544E]">{clinicInfo.city}, {clinicInfo.state} - {clinicInfo.pincode}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#1A365D] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Contact Phones</p>
                <p className="text-xs text-[#5A544E]">{clinicInfo.phone} · {clinicInfo.whatsapp}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#1B4332] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Working Hours</p>
                <p className="text-xs text-[#5A544E]">{clinicInfo.timingWeekdays} (Weekdays)</p>
                <p className="text-xs text-[#5A544E]">{clinicInfo.timingSunday} (Sunday)</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F0ECE4] pt-4">
            <h3 className="text-xs font-semibold text-[#9E968C] uppercase tracking-wider mb-3">Key Highlights</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#F8F7F4] rounded-xl p-3">
                <p className="text-base font-bold text-[#0F2747]">{clinicInfo.experienceYears}+</p>
                <p className="text-[11px] text-[#9E968C]">Years Practice</p>
              </div>
              <div className="bg-[#F8F7F4] rounded-xl p-3">
                <p className="text-base font-bold text-[#0F2747]">{clinicInfo.patientsTreated}</p>
                <p className="text-[11px] text-[#9E968C]">Patients Treated</p>
              </div>
              <div className="bg-[#F8F7F4] rounded-xl p-3">
                <p className="text-base font-bold text-[#0F2747]">{clinicInfo.specialistsCount}</p>
                <p className="text-[10px] text-[#9E968C]">Specialists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
