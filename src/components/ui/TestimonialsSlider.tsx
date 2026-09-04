import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { Badge } from './Badge';

export interface TestimonialSlideItem {
  id: string;
  patientName: string;
  patientInitial: string;
  conditionTreated: string;
  review: string;
  source: string;
  location: string;
  rating: number;
  isFeatured: boolean;
}

interface TestimonialsSliderProps {
  testimonials: TestimonialSlideItem[];
}

export const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({ testimonials }) => {
  // Duplicate array 2x for seamless infinite marquee loop
  const duplicatedItems = [...testimonials, ...testimonials];

  return (
    <div className="relative w-full overflow-hidden py-4 select-none group">
      {/* Left/Right Edge Fade Mask overlays for smooth fade entrance/exit */}
      <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />

      {/* Infinite Horizontal Marquee Rail */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] ease-linear">
        {duplicatedItems.map((testimonial, idx) => (
          <div
            key={`${testimonial.id}-${idx}`}
            className="w-[280px] sm:w-[340px] md:w-[380px] shrink-0 px-3"
          >
            <div className="h-full bg-white p-5 sm:p-6 rounded-[24px] border border-[#E8E4DC] shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 flex flex-col justify-between transition-all duration-300 cursor-pointer">
              <div className="space-y-3.5">
                {/* Rating & Source */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {testimonial.isFeatured && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        ⭐ Featured
                      </span>
                    )}
                    <Badge variant="neutral" size="sm" className="text-[10px]">
                      {testimonial.source}
                    </Badge>
                  </div>
                </div>

                {/* Condition Badge */}
                <div className="bg-[#F0F4F8] text-[#0F2747] border border-[#CBD8E6] px-2.5 py-1 rounded-lg text-xs font-semibold inline-block">
                  {testimonial.conditionTreated}
                </div>

                {/* Review Quote */}
                <p className="text-xs sm:text-sm text-[#2C2926] leading-relaxed italic font-serif">
                  "{testimonial.review}"
                </p>
              </div>

              {/* Patient Attribution */}
              <div className="pt-4 border-t border-[#F0EBE3] flex items-center justify-between mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F2747] text-white flex items-center justify-center font-bold text-xs font-serif">
                    {testimonial.patientInitial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">
                      {testimonial.patientName}
                    </div>
                    <div className="text-[10.5px] text-[#736C63]">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <Badge variant="verified" size="sm">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
