import React from 'react';
import { Phone, Clock, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { clinicInfo } from '../../data/clinicInfo';
import { useAnnouncementOffer } from '../../hooks/usePublicOffers';

interface AnnouncementBarProps {
  onOpenBooking: (serviceName: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenBooking }) => {
  const activeOffer = useAnnouncementOffer();

  const handleCtaClick = () => {
    if (!activeOffer) {
      onOpenBooking();
      return;
    }

    if (activeOffer.ctaAction === 'BOOKING_MODAL' || !activeOffer.ctaAction) {
      onOpenBooking(activeOffer.preselectedService || 'Chiropractic & Wellness Consultation');
    } else if (activeOffer.ctaAction === 'WHATSAPP') {
      window.open(`https://wa.me/${clinicInfo.whatsapp}•text=${encodeURIComponent(`Hello Holistic Edge, I would like to inquire about "${activeOffer.title}".`)}`, '_blank');
    } else if (activeOffer.ctaAction === 'PHONE') {
      window.location.href = `tel:${clinicInfo.phoneRaw || clinicInfo.phone.replace(/\s+/g, '')}`;
    } else if (activeOffer.ctaUrl) {
      window.location.href = activeOffer.ctaUrl;
    } else {
      onOpenBooking();
    }
  };

  return (
    <div
      id="global-announcement-bar"
      className="bg-gradient-to-r from-[#0F2747] via-[#0B1D3A] to-[#0F2747] text-white text-xs font-normal py-2.5 px-4 border-b border-white/10 relative z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left Side: Offer / Notice */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <div className="w-5 h-5 rounded-md bg-white/15 text-white flex items-center justify-center flex-shrink-0 border border-white/20">
            <Sparkles size={11} className="text-blue-200" />
          </div>
          
          {activeOffer ? (
            <div className="flex items-center gap-2 text-white">
              <span className="bg-white text-[#0F2747] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Tag size={10} />
                {activeOffer.label || 'Special Offer'}
              </span>
              <span className="font-bold text-xs text-white">
                {activeOffer.title}
              </span>
              {activeOffer.discountValue && (
                <span className="text-[10px] font-bold text-white bg-white/20 border border-white/25 px-2 py-0.5 rounded-full hidden md:inline">
                  {activeOffer.discountValue}
                </span>
              )}
            </div>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <span>{clinicInfo.freeConsultationNotice}</span>
            </span>
          )}
        </div>

        {/* Right Side: Phone & Action */}
        <div className="flex items-center gap-3 sm:gap-4 text-white/80">
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-white/70">
            <Clock className="w-3 h-3 text-blue-300" />
            <span>Mehdipatnam, Hyderabad</span>
          </div>

          <a
            id="announcement-call-link"
            href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 hover:text-white font-medium text-xs transition-colors"
          >
            <Phone className="w-3 h-3 text-blue-300" />
            <span>{clinicInfo.phone}</span>
          </a>

          <button
            type="button"
            id="announcement-book-btn"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-[#0F2747] px-3.5 py-1 rounded-xl text-[11px] font-bold transition-all duration-200 shadow-sm active:scale-95"
          >
            <span>{activeOffer?.ctaText || 'Book Appointment'}</span>
            <ArrowRight size={11} className="text-[#0F2747]" />
          </button>
        </div>
      </div>
    </div>
  );
};

