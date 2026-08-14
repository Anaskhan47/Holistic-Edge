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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ammMethodStages.map(stage => {
            const isActive = stage.stepNumber === activeStage;
            return (
              <button
                key={stage.stepNumber}
                type="button"
                onClick={() => setActiveStage(stage.stepNumber)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border relative ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A] shadow-md scale-[1.01]'
                    : 'bg-white text-[#1A1A1A] border-[#E8E4DC] hover:border-[#D5CFC5] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isActive ? 'bg-[#332E2A] text-[#D49E58]' : 'bg-[#FAF0EB] text-[#A94420]'
                    }`}
                  >
                    Stage {stage.stepNumber}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isActive ? 'bg-[#332E2A] text-[#D49E58]' : 'bg-[#F2EDE4] text-[#736C63]'
                    }`}
                  >
                    Code: {stage.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-serif">{stage.name}</h3>
                <p
                  className={`text-xs mt-1 ${
                    isActive ? 'text-[#D4CEC5]' : 'text-[#736C63]'
                  }`}
                >
                  {stage.shortName}
                </p>
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
                <div className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#A94420] flex items-center justify-center font-bold text-xs font-serif">
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
