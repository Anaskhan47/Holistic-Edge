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
              <MapPin size={16} className="text-[#A94420] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Address</p>
                <p className="text-xs text-[#9E968C]">{clinicInfo.address}</p>
                <p className="text-xs text-[#9E968C]">{clinicInfo.landmark}, {clinicInfo.city}</p>
                <p className="text-xs text-[#9E968C]">{clinicInfo.state} – {clinicInfo.pincode}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone size={16} className="text-[#1A365D] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Contact</p>
                <p className="text-xs text-[#9E968C]">Phone: {clinicInfo.phone}</p>
                <p className="text-xs text-[#9E968C]">WhatsApp: +{clinicInfo.whatsapp}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Hours</p>
                <p className="text-xs text-[#9E968C]">{clinicInfo.openingHoursNote}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[10.5px] text-[#9E968C] font-semibold uppercase tracking-wide mb-1">Stats</p>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-base font-bold text-[#A94420]">{clinicInfo.experienceYears}+</p>
                    <p className="text-[10px] text-[#9E968C]">Years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-[#A94420]">{clinicInfo.patientsTreated}</p>
                    <p className="text-[10px] text-[#9E968C]">Patients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-[#A94420]">{clinicInfo.specialistsCount}</p>
                    <p className="text-[10px] text-[#9E968C]">Specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
