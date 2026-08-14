import React from 'react';
import { Phone, Clock, Sparkles } from 'lucide-react';
import { clinicInfo } from '../../data/clinicInfo';

interface AnnouncementBarProps {
  onOpenBooking: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenBooking }) => {
  return (
    <div
      id="global-announcement-bar"
      className="bg-[#1C1A18] text-[#EDE8E0] text-xs font-normal py-2 px-4 border-b border-[#2E2A26] relative z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#A94420] animate-pulse" />
          <span className="flex items-center gap-1.5 tracking-wide text-[#FAF9F6]">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E58] hidden md:inline" />
            <span>{clinicInfo.freeConsultationNotice}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#D8D2C6]">
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#A69E92]">
            <Clock className="w-3 h-3 text-[#D49E58]" />
            <span>Mehdipatnam, Hyderabad</span>
          </div>
          <a
            id="announcement-call-link"
            href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 hover:text-white font-medium underline underline-offset-4 decoration-[#A69E92]/50 transition-colors"
          >
            <Phone className="w-3 h-3 text-[#D49E58]" />
            <span>Call: {clinicInfo.phone}</span>
          </a>
          <button
            type="button"
            id="announcement-book-btn"
            onClick={onOpenBooking}
            className="hidden md:inline-flex items-center bg-[#FAF9F6]/10 hover:bg-[#FAF9F6] text-[#FAF9F6] hover:text-[#1A1A1A] px-3 py-0.5 rounded-full text-[11px] font-medium transition-all duration-200 border border-[#FAF9F6]/20"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

