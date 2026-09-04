import React from 'react';
import { usePublishedServices } from '../../hooks/useCmsContent';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  Clock,
  Activity,
  CheckCircle2,
  Zap,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ServicesSectionProps {
  onOpenBooking: (preselectedService: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const publishedServices = usePublishedServices();
  
  // Filter out flagship protocol (amm-method) and any removed services (cupping-therapy)
  const standardServices = publishedServices.filter(
    s => s.id !== 'amm-method' && s.id !== 'cupping-therapy' && s.slug !== 'cupping-therapy'
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#0284C7]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#0284C7]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#0284C7]" />;
      default:
        return <Activity className="w-5 h-5 text-[#0284C7]" />;
    }
  };

  return (
    <section id="clinical-services" className="py-16 sm:py-24 bg-[#FAF9F6] border-t border-[#EFEBE3]">
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

        {/* Standard Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardServices.map(service => {
            const title = service.title || (service as any).name || 'Service';
            const imageUrl = service.heroImage || (service as any).image || '/brand/holistic-edge-logo-transparent.png';
            const benefits = service.benefits || [];

            return (
              <Card
                key={service.id}
                hoverable
                padding="none"
                className="flex flex-col justify-between overflow-hidden border-[#E8E4DC] group bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-[#F0ECE4]">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/Our Clinical Offerings/Chiropractic Care.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-sm border border-[#E8E4DC] flex items-center justify-center">
                    {getIcon((service as any).iconName || 'Activity')}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-bold font-serif text-[#FAF9F6]">{title}</h3>
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
                      {benefits.slice(0, 2).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0EBE3] flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-xs font-semibold text-[#0284C7] hover:text-[#026AA2] flex items-center gap-1 group/btn"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-1 text-[11px] text-[#736C63] font-medium">
                      <Clock className="w-3 h-3 text-[#A69E92]" />
                      <span>{(service as any).durationMinutes || '30 Mins'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
