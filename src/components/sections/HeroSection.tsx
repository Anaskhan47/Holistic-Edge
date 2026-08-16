import React from 'react';
import {
  Calendar,
  Phone,
  ShieldCheck,
  Award,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { clinicInfo } from '../../data/clinicInfo';
import { motion } from 'motion/react';

import { Link } from 'react-router-dom';
import clinicImg from '@/Clinc.png';

export interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#E8E4DC]">
      {/* Subtle Background Geometry */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#0F2747]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#1B4332]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2"
            >
              <Badge variant="editorial" size="md" className="py-1 px-3.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F2747]" />
                <span>Mehdipatnam, Hyderabad • Founded by Dr. Abdul Mallik</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#1A1A1A] leading-[1.12] font-serif tracking-tight"
            >
              25 Years of Experience. <br className="hidden sm:inline" />
              <span className="text-[#0F2747] italic font-medium">12,000+ Patients Treated.</span> <br />
              <span className="text-[#2B2723] text-2xl sm:text-3xl md:text-4xl font-normal font-serif">
                A Different Approach to Pain Care.
              </span>
            </motion.h1>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#5A544E] leading-relaxed max-w-2xl"
            >
              Personalized, non-surgical and non-medicinal approaches for spine, joint, and musculoskeletal conditions. Combining precision Chiropractic adjustments, Cupping, Acupuncture, and our signature{' '}
              <strong className="text-[#1A1A1A] font-semibold">A.M.M Method™</strong> in Hyderabad.
            </motion.p>

            {/* Value Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-[#2C2926] font-medium"
            >
              <div className="flex items-center gap-2 bg-white border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <CheckCircle2 className="w-4 h-4 text-[#1B4332] flex-shrink-0" />
                <span>100% Non-Surgical Care</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <CheckCircle2 className="w-4 h-4 text-[#1B4332] flex-shrink-0" />
                <span>Drug-Free Pain Relief</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <CheckCircle2 className="w-4 h-4 text-[#1B4332] flex-shrink-0" />
                <span>Root-Cause Realignment</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <Button
                id="hero-book-cta-btn"
                variant="accent"
                size="lg"
                onClick={onOpenBooking}
                leftIcon={<Calendar className="w-5 h-5" />}
                className="shadow-md shadow-[#0F2747]/20 hover:shadow-lg hover:shadow-[#0F2747]/30"
              >
                Book an Appointment
              </Button>

              <a
                id="hero-call-cta-btn"
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F4EFE8] text-[#1A1A1A] border border-[#D5CFC5] font-semibold px-5 py-3.5 rounded-xl text-base shadow-sm hover:border-[#1A1A1A]/40 transition-colors"
              >
                <Phone className="w-5 h-5 text-[#0F2747]" />
                <span>Call {clinicInfo.phone}</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual & Verified Trust Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Visual Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#F0ECE4] relative aspect-[4/3] sm:aspect-[5/4]">
                <img
                  src={clinicImg}
                  alt="Holistic Edge Wellness Clinic Mehdipatnam Hyderabad"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Founder Overlay Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-2xl bg-[#1A1A1A]/85 backdrop-blur-md border border-white/15 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#D49E58]">
                        Clinic Founder & Director
                      </div>
                      <div className="text-base font-bold font-serif text-[#FAF9F6]">
                        Dr. Abdul Mallik
                      </div>
                    </div>
                    <Link
                      to="/about/dr-abdul-mallik"
                      className="text-xs text-[#D49E58] font-semibold flex items-center gap-1 hover:underline z-20"
                    >
                      <span>Read Bio</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Trust & Metric Cards in Normal Document Flow (Zero Overlap on all viewports) */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#E8E4DC] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF4ED] text-[#D49E58] flex items-center justify-center border border-[#EADBCE] flex-shrink-0">
                    <Star className="w-4 h-4 fill-[#D49E58]" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A1A]">
                      <span>4.6★ / 4.7★</span>
                      <span className="text-[9px] text-[#1B4332] bg-[#EAF2ED] px-1 py-0.5 rounded font-semibold hidden sm:inline">Verified</span>
                    </div>
                    <div className="text-[10.5px] text-[#736C63] truncate">Justdial & Cybo Ratings</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#E8E4DC] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center border border-[#CBD8E6] flex-shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-[#1A1A1A] font-serif">12,000+</div>
                    <div className="text-[10.5px] text-[#736C63] truncate">Patients Treated in Hyd</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
