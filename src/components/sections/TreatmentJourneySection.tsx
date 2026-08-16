import React from 'react';
import { treatmentJourneySteps } from '../../data/treatmentJourney';
import { MessageSquare, Search, FileText, Activity, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface TreatmentJourneyProps {
  onOpenBooking: () => void;
}

export const TreatmentJourneySection: React.FC<TreatmentJourneyProps> = ({ onOpenBooking }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <section id="treatment-journey" className="py-16 md:py-24 bg-[#F2EDE4]/60 border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="editorial" size="md" className="mb-3">
            Patient Pathway
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            Your 5-Step Treatment Journey
          </h2>
          <p className="text-sm sm:text-base text-[#5A544E] mt-3 leading-relaxed">
            From your initial consultation to long-term spinal durability, here is what you can expect every step of the way at Holistic Edge.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {treatmentJourneySteps.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E4DC] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center font-bold text-xs font-serif border border-[#CBD8E6]">
                    0{step.stepNumber}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#736C63] flex items-center justify-center group-hover:text-[#0F2747] transition-colors border border-[#E8E4DC]">
                    {getStepIcon(step.icon)}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A] font-serif mb-1 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#736C63] mb-4 font-medium">
                  {step.subtitle}
                </p>
                <p className="text-sm text-[#5A544E] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Key Outcomes */}
              <div className="pt-4 border-t border-[#F0EBE3] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A847C] block mb-1">
                  Key Outcomes:
                </span>
                {step.details.slice(0, 2).map((detail, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#2C2926]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0F2747] mt-1.5 flex-shrink-0" />
                    <span className="line-clamp-2">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-12 text-center">
          <Button
            variant="accent"
            size="lg"
            onClick={onOpenBooking}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Book an Appointment
          </Button>
        </div>
      </div>
    </section>
  );
};
