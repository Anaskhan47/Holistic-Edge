import React from 'react';
import { servicesData } from '../../data/services';
import {
  Activity,
  Zap,
  Shield,
  HeartHandshake,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

import { Link } from 'react-router-dom';

export interface ServicesSectionProps {
  onOpenBooking: (service?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBooking
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#0066CC]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-[#00A896]" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-[#FF6B35]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-[#028071]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#0066CC]" />;
      default:
        return <Activity className="w-6 h-6 text-[#0066CC]" />;
    }
  };

  const flagshipService = servicesData.find(s => s.isFlagship);
  const standardServices = servicesData.filter(s => !s.isFlagship);

  return (
    <section id="clinical-services" className="py-16 md:py-24 bg-[#FAF9F6] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="editorial" size="md" className="mb-3">
            Holistic Clinical Modalities
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            Non-Surgical & Non-Medicinal Care Services
          </h2>
          <p className="text-sm sm:text-base text-[#5A544E] mt-3 leading-relaxed">
            Every therapy at Holistic Edge is delivered by experienced practitioners using proven, hygienic, and gentle protocols to restore your mobility naturally.
          </p>
        </div>

        {/* FLAGSHIP HERO CARD: The A.M.M Method */}
        {flagshipService && (
          <div className="mb-10 relative overflow-hidden rounded-3xl bg-[#171614] text-[#FAF9F6] p-6 sm:p-8 lg:p-10 shadow-xl border border-[#2B2723]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1B4332] text-[#D8EADB] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#2D5A45]">
                    Flagship Protocol
                  </span>
                  <span className="text-xs text-[#D49E58] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Proprietary to Holistic Edge
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-normal font-serif text-[#FAF9F6]">
                  The A.M.M Method™
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#D49E58] uppercase tracking-wider">
                  Adjustment • Mobilization • Muscle Strengthening
                </p>

                <p className="text-sm sm:text-base text-[#A69E92] leading-relaxed">
                  Developed by Dr. Abdul Mallik over 25 years of practice. A complete 3-phase care framework that aligns misaligned joints, decompresses tight fascia, and strengthens stabilizing muscles for lasting pain relief.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-[#211E1C] rounded-xl p-3 border border-[#332E2A]">
                    <span className="text-xs font-bold text-[#D49E58] block">Stage 1: A</span>
                    <span className="text-xs font-medium text-[#FAF9F6]">Spinal Realignment</span>
                  </div>
                  <div className="bg-[#211E1C] rounded-xl p-3 border border-[#332E2A]">
                    <span className="text-xs font-bold text-[#D49E58] block">Stage 2: M</span>
                    <span className="text-xs font-medium text-[#FAF9F6]">Cupping & Mobilization</span>
                  </div>
                  <div className="bg-[#211E1C] rounded-xl p-3 border border-[#332E2A]">
                    <span className="text-xs font-bold text-[#D49E58] block">Stage 3: M</span>
                    <span className="text-xs font-medium text-[#FAF9F6]">Muscle Stabilization</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    to="/#amm-method"
                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 bg-[#0F2747] text-white hover:bg-[#0B1D3A]"
                  >
                    Explore A.M.M Method
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => onOpenBooking(flagshipService.title)}
                    className="border-[#4A433B] text-[#FAF9F6] hover:bg-[#2A2521] hover:border-[#6B6155]"
                  >
                    Book A.M.M Consultation
                  </Button>
                </div>
              </div>

              {/* Right Side Visual */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 aspect-[4/3]">
                  <img
                    src={flagshipService.image}
                    alt="A.M.M Method"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Standard Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standardServices.map(service => (
            <Card
              key={service.id}
              hoverable
              padding="none"
              className="flex flex-col justify-between overflow-hidden border-[#E8E4DC] group bg-white"
            >
              <div className="relative h-44 overflow-hidden bg-[#F0ECE4]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-sm border border-[#E8E4DC] flex items-center justify-center">
                  {getIcon(service.iconName)}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold font-serif text-[#FAF9F6]">{service.title}</h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#0F2747] block mb-1">
                    {service.subtitle}
                  </span>
                  <p className="text-xs text-[#5A544E] line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Key Benefits */}
                  <div className="mt-3 space-y-1 text-xs text-[#2C2926]">
                    {service.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0F2747] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0EBE3] flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-semibold text-[#0F2747] hover:text-[#0B1D3A] flex items-center gap-1 group/btn"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] text-[#736C63] font-medium">
                    <Clock className="w-3 h-3 text-[#A69E92]" />
                    <span>{service.durationMinutes}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
