import React from 'react';
import { Calendar, Phone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { clinicInfo } from '../../data/clinicInfo';

export interface FinalCtaProps {
  onOpenBooking: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaProps> = ({ onOpenBooking }) => {
  return (
    <section id="final-conversion-section" className="py-16 md:py-24 bg-[#1A1A1A] text-[#FAF9F6] relative overflow-hidden border-t border-[#332E2A]">
      {/* Subtle warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A94420]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#FAF9F6]/10 border border-white/10 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D49E58]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>25 Years • 12,000+ Treated • Hyderabad</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif text-[#FAF9F6] tracking-tight leading-tight">
          Ready to Take the Next Step Toward Lasting Pain Relief?
        </h2>

        <p className="text-sm sm:text-base text-[#D4CEC5] max-w-2xl mx-auto leading-relaxed">
          Do not let chronic back, neck, or joint pain dictate your everyday activities. Experience our personalized, non-surgical approach at Holistic Edge in Mehdipatnam.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="accent"
            size="lg"
            onClick={onOpenBooking}
            leftIcon={<Calendar className="w-5 h-5" />}
            className="shadow-xl w-full sm:w-auto"
          >
            Book an Appointment
          </Button>

          <a
            href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-[#FAF9F6] border border-white/15 font-semibold px-6 py-3.5 rounded-xl text-base shadow-sm transition-colors w-full sm:w-auto"
          >
            <Phone className="w-5 h-5 text-[#D49E58]" />
            <span>Call {clinicInfo.phone}</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-[#A8A199]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5DACB]" />
            <span>Founder-led clinical review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5DACB]" />
            <span>No surgery or invasive drugs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5DACB]" />
            <span>Convenient Mehdipatnam location</span>
          </div>
        </div>
      </div>
    </section>
  );
};
