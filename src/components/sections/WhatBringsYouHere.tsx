import React, { useState } from 'react';
import { conditionsData } from '../../data/conditions';
import { ArrowRight, ChevronRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

import { Link } from 'react-router-dom';

export interface WhatBringsYouHereProps {
  onOpenBooking: () => void;
}

export const WhatBringsYouHere: React.FC<WhatBringsYouHereProps> = ({
  onOpenBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Spine', 'Joints', 'Nerves', 'Head & Neck', 'Muscles'];

  const filteredConditions =
    selectedCategory === 'All'
      ? conditionsData
      : conditionsData.filter(c => c.category === selectedCategory);

  return (
    <section id="what-brings-you-here" className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="editorial" size="md" className="mb-3">
            Patient-Centered Triage
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            What Brings You to Holistic Edge Today?
          </h2>
          <p className="text-sm sm:text-base text-[#5A544E] mt-3 leading-relaxed">
            Select the condition or pain symptom you are experiencing to learn how our non-surgical therapies address the root mechanical cause.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] shadow-sm'
                    : 'bg-white text-[#4A443D] border border-[#E8E4DC] hover:border-[#D5CFC5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Condition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConditions.map(condition => (
            <Card
              key={condition.id}
              hoverable
              padding="none"
              className="overflow-hidden flex flex-col justify-between border-[#E8E4DC] group bg-white"
            >
              {/* Image Banner */}
              <div className="relative h-44 overflow-hidden bg-[#F0ECE4]">
                <img
                  src={condition.image}
                  alt={condition.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="editorial" size="sm" className="bg-white/90 text-[#1A1A1A] backdrop-blur-sm">
                    {condition.category}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold font-serif text-[#FAF9F6]">{condition.title}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-[#5A544E] line-clamp-2 leading-relaxed mb-3">
                    {condition.shortDescription}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#2C2926]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A847C] block mb-1">
                      Key Indicators:
                    </span>
                    {condition.symptoms.slice(0, 2).map((symptom, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#F0EBE3] flex items-center justify-between gap-2">
                  <Link
                    to={`/conditions/${condition.slug}`}
                    className="text-xs font-semibold text-[#0F2747] hover:text-[#0B1D3A] flex items-center gap-1 group/btn"
                  >
                    <span>View Care Approach</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onOpenBooking(condition.title)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F0F4F8] text-[#0F2747] hover:bg-[#D4E2F0] transition-colors border border-[#CBD8E6]"
                  >
                    Book for this
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-[#E8E4DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F4F8] text-[#0F2747] flex items-center justify-center flex-shrink-0 border border-[#CBD8E6]">
              <Sparkles className="w-5 h-5 text-[#0F2747]" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-[#1A1A1A] font-serif">
                Not sure what is causing your pain?
              </h4>
              <p className="text-xs text-[#5A544E]">
                Book a consultation with Dr. Abdul Mallik to evaluate your symptoms in person.
              </p>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={onOpenBooking}>
            Book an Appointment
          </Button>
        </div>
      </div>
    </section>
  );
};
