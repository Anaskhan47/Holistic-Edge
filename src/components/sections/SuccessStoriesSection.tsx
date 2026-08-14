import React, { useState } from 'react';
import { testimonialsData, trustAggregates } from '../../data/testimonials';
import { Star, CheckCircle2, Quote, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

import { Link } from 'react-router-dom';

export interface SuccessStoriesProps {
  onOpenBooking: () => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesProps> = ({
  onOpenBooking
}) => {
  const [filterSource, setFilterSource] = useState<string>('All');

  const sources = ['All', 'Justdial', 'Cybo', 'Direct Patient Feedback'];

  const filteredReviews =
    filterSource === 'All'
      ? testimonialsData
      : testimonialsData.filter(t => t.source === filterSource);

  return (
    <section id="patient-success-stories" className="py-16 md:py-24 bg-[#FAF9F6] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="editorial" size="md" className="mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332] mr-1" />
            Verified Patient Experiences
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            Real Stories of Pain Recovery
          </h2>
          <p className="text-sm sm:text-base text-[#5A544E] mt-3 leading-relaxed">
            Authentic feedback from patients across Hyderabad who restored their mobility and reclaimed an active life at Holistic Edge.
          </p>

          {/* Aggregated Rating Trust Strip */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white p-3 rounded-2xl border border-[#E8E4DC] shadow-xs">
            <div className="flex items-center gap-1 text-[#D49E58] font-bold text-sm px-2">
              <Star className="w-4 h-4 fill-[#D49E58]" />
              <span>4.6★ Justdial Verified</span>
            </div>
            <span className="text-[#DDD5C7] hidden sm:inline">•</span>
            <div className="flex items-center gap-1 text-[#D49E58] font-bold text-sm px-2">
              <Star className="w-4 h-4 fill-[#D49E58]" />
              <span>4.7★ Cybo Rating</span>
            </div>
            <span className="text-[#DDD5C7] hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-[#2C2926] px-2 font-serif">
              12,000+ Treated Over 25 Years
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.slice(0, 3).map(testimonial => (
            <Card
              key={testimonial.id}
              hoverable
              padding="lg"
              className="flex flex-col justify-between border-[#E8E4DC] shadow-sm relative group bg-white"
            >
              <div className="space-y-4">
                {/* Rating & Source */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-[#D49E58]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D49E58]" />
                    ))}
                  </div>
                  <Badge variant="neutral" size="sm">
                    {testimonial.source}
                  </Badge>
                </div>

                {/* Condition Tag */}
                <div className="bg-[#FAF0EB] text-[#A94420] border border-[#ECCDC1] px-2.5 py-1 rounded-lg text-xs font-semibold inline-block">
                  {testimonial.conditionTreated}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#2C2926] leading-relaxed italic font-serif">
                  "{testimonial.review}"
                </p>
              </div>

              {/* Patient Attribution */}
              <div className="pt-4 border-t border-[#F0EBE3] flex items-center justify-between mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-[#FAF9F6] flex items-center justify-center font-bold text-xs font-serif">
                    {testimonial.patientInitial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">
                      {testimonial.patientName}
                    </div>
                    <div className="text-[11px] text-[#736C63]">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <Badge variant="verified" size="sm">
                  Verified
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Stories Button */}
        <div className="mt-12 text-center flex flex-wrap justify-center gap-3">
          <Link
            to="/#patient-success-stories"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all duration-200 border-[#E8E4DC] text-[#2C2926] hover:border-[#D5CFC5] hover:bg-[#FAF9F6]"
          >
            Explore All Patient Stories
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Button
            variant="accent"
            size="md"
            onClick={onOpenBooking}
          >
            Start Your Recovery
          </Button>
        </div>
      </div>
    </section>
  );
};
