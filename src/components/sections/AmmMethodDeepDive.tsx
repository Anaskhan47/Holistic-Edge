import React, { useState } from 'react';
import { ammMethodStages, ammPhilosophy } from '../../data/ammMethod';
import { Activity, Zap, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface AmmMethodDeepDiveProps {
  onOpenBooking: () => void;
}

export const AmmMethodDeepDive: React.FC<AmmMethodDeepDiveProps> = ({
  onOpenBooking
}) => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const currentStageData = ammMethodStages.find(s => s.stepNumber === activeStage) || ammMethodStages[0];

  const getStageIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Activity className="w-5 h-5" />;
      case 2:
        return <Zap className="w-5 h-5" />;
      case 3:
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="amm-method-deepdive" className="py-16 md:py-24 bg-[#FAF9F6] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Pill */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="editorial" size="md" className="mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E58] mr-1" />
            Signature Clinical Protocol
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            The A.M.M Method™: A 3-Phase Path to Lasting Recovery
          </h2>
          <p className="text-sm sm:text-base text-[#5A544E] mt-3 leading-relaxed">
            Formulated by Dr. Abdul Mallik over 25 years of practice. True musculoskeletal healing requires addressing spinal alignment, soft tissue tension, and muscle stabilizers in deliberate sequence.
          </p>
        </div>

        {/* 3 Step Interactive Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 items-stretch">
          {ammMethodStages.map(stage => {
            const isActive = stage.stepNumber === activeStage;
            return (
              <button
                key={stage.stepNumber}
                type="button"
                onClick={() => setActiveStage(stage.stepNumber)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between h-full relative group outline-none ${
                  isActive
                    ? 'bg-[#0F2747] text-white border-[#0F2747] shadow-xl shadow-[#0F2747]/15 ring-2 ring-[#0F2747]/20 scale-[1.01]'
                    : 'bg-white text-[#1A1A1A] border-[#CBD8E6] hover:border-[#0F2747]/40 hover:bg-[#F0F4F8]/60 shadow-sm'
                }`}
              >
                <div>
                  {/* Badges Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'bg-[#F0F4F8] text-[#0F2747] border border-[#CBD8E6]'
                      }`}
                    >
                      STAGE {stage.stepNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-[#0B1D3A] text-blue-200 border border-blue-400/30'
                          : 'bg-[#F0F4F8] text-[#0F2747] border border-[#CBD8E6]'
                      }`}
                    >
                      CODE: {stage.code}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={`text-xl font-bold font-serif leading-tight ${
                    isActive ? 'text-white' : 'text-[#1A1A1A]'
                  }`}>
                    {stage.name}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed font-medium ${
                      isActive ? 'text-blue-100/90' : 'text-[#5A544E]'
                    }`}
                  >
                    {stage.shortName}
                  </p>
                </div>

                {/* Card Footer Indicator */}
                <div className={`mt-5 pt-3 border-t text-[11px] font-semibold flex items-center justify-between ${
                  isActive ? 'border-white/15 text-blue-200' : 'border-[#F0ECE4] text-[#0F2747]'
                }`}>
                  <span>{isActive ? 'Active Protocol' : 'Explore Protocol'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                    isActive ? 'text-blue-200' : 'text-[#0F2747]'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown Card */}
        <Card padding="lg" className="border-[#E8E4DC] shadow-sm bg-white mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="editorial" size="md">
                  Stage {currentStageData.stepNumber} of 3
                </Badge>
                <span className="text-xs font-semibold text-[#736C63]">
                  {currentStageData.tagline}
                </span>
              </div>

              <h3 className="text-2xl font-normal text-[#1A1A1A] font-serif">
                {currentStageData.name}: {currentStageData.shortName}
              </h3>

              <p className="text-sm sm:text-base text-[#5A544E] leading-relaxed">
                {currentStageData.description}
              </p>

              <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A847C] block">
                  Clinical Purpose:
                </span>
                <p className="text-xs sm:text-sm text-[#2C2926] font-medium leading-relaxed">
                  {currentStageData.clinicalPurpose}
                </p>
              </div>

              {/* Patient Experience */}
              <div className="flex items-start gap-2.5 text-xs text-[#1B4332] bg-[#EAF2ED] border border-[#C5DACB] rounded-xl p-3.5">
                <CheckCircle2 className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1B4332] font-semibold block">What Patients Feel:</strong>
                  <span>{currentStageData.patientFeeling}</span>
                </div>
              </div>
            </div>

            {/* Right: Modalities Used in this Stage */}
            <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E4DC] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Modalities & Techniques Used:
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#2C2926]">
                {currentStageData.modalities.map((mod, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#E8E4DC]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" />
                    <span>{mod}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Button
                  fullWidth
                  variant="accent"
                  size="md"
                  onClick={onOpenBooking}
                >
                  Book A.M.M Consultation
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Philosophy Comparison Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DC] shadow-sm">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-normal text-[#1A1A1A] font-serif">
              {ammPhilosophy.headline}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A544E] mt-2">
              {ammPhilosophy.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ammPhilosophy.points.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-2xl p-5 text-left space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center font-bold text-xs font-serif">
                  0{idx + 1}
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A] leading-snug">
                  {p.title}
                </h4>
                <p className="text-xs text-[#5A544E] leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
