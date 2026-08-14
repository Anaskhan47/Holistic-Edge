import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { clinicInfo } from '../../data/clinicInfo';

export interface MobileBottomBarProps {
  onOpenBooking: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenBooking }) => {
  const whatsappUrl = `https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
    'Hello Holistic Edge, I would like to book an appointment for pain management.'
  )}`;

  return (
    <div
      id="mobile-conversion-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#E8E4DC] py-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden safe-area-pb"
    >
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Call Action */}
        <a
          id="mobile-bar-call-btn"
          href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-[#F2EDE4] text-[#1A1A1A] font-semibold text-xs border border-[#DDD5C7] active:bg-[#E5DDCF] transition-colors"
        >
          <Phone className="w-4 h-4 text-[#A94420] mb-0.5" />
          <span>Call</span>
        </a>

        {/* WhatsApp Action */}
        <a
          id="mobile-bar-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-[#EAF2ED] text-[#1B4332] border border-[#C5DACB] font-semibold text-xs active:bg-[#DEEBE2] transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 mb-0.5 flex-shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="12" fill="#25D366" />
            <path
              fill="#FFF"
              d="M12 4a8 8 0 0 0-6.89 12.06l-.57 2.08 2.13-.56A8 8 0 1 0 12 4zm3.93 11.23c-.15.42-.76.78-1.07.83-.27.05-.62.08-1.74-.37A6.47 6.47 0 0 1 10.3 13.9a7.12 7.12 0 0 1-1.46-2.58c0-.78.41-1.2 1-1.2h.33a.47.47 0 0 1 .45.31c.12.3.4.97.43 1.05s.03.17-.02.27c-.05.1-.11.22-.19.31-.08.1-.17.2-.25.29s-.07.19-.01.3A5 5 0 0 0 11.8 14a4.41 4.41 0 0 0 1.77.72c.12.02.18 0 .24-.07s.25-.29.32-.39.13-.1.25-.06a7.71 7.71 0 0 1 1.08.51c.1.05.17.08.2.13s0 .28-.1.7z"
            />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Book Consultation Primary Action */}
        <button
          type="button"
          id="mobile-bar-book-btn"
          onClick={onOpenBooking}
          className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#A94420] text-white font-bold text-xs shadow-md shadow-[#A94420]/25 active:scale-98 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  );
};
