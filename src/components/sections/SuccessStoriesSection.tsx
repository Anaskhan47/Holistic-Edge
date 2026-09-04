import React, { useState, useEffect } from 'react';
import { testimonialsData } from '../../data/testimonials';
import { googleReviewsStorage } from '../../services/api/cmsStorage';
import { Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TestimonialsSlider } from '../ui/TestimonialsSlider';
import { Link } from 'react-router-dom';

export interface SuccessStoriesProps {
  onOpenBooking: () => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesProps> = ({
  onOpenBooking
}) => {
  const [googleReviews, setGoogleReviews] = useState(() => googleReviewsStorage.getPublishedOnWebsite());

  useEffect(() => {
    setGoogleReviews(googleReviewsStorage.getPublishedOnWebsite());
    
    // Ensure Elfsight script is loaded & initialized
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Continuously hide Elfsight watermark inside Shadow DOM & Light DOM
    const removeBadge = () => {
      const scan = (root: ParentNode) => {
        if (!root) return;
        try {
          const els = root.querySelectorAll('*');
          els.forEach(el => {
            if (el.shadowRoot) scan(el.shadowRoot);
            if (
              (el.tagName === 'A' && el.getAttribute('href')?.includes('elfsight')) ||
              el.textContent?.includes('Free Google Reviews Widget') ||
              (typeof el.className === 'string' && el.className.includes('eapps-link'))
            ) {
              (el as HTMLElement).style.setProperty('display', 'none', 'important');
              (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
              (el as HTMLElement).style.setProperty('opacity', '0', 'important');
              (el as HTMLElement).style.setProperty('height', '0', 'important');
              (el as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
              if (el.parentNode) {
                try { el.parentNode.removeChild(el); } catch (e) {}
              }
            }
          });
        } catch (err) {}
      };
      scan(document);
    };

    const interval = setInterval(removeBadge, 200);
    return () => clearInterval(interval);
  }, []);

  const combinedTestimonials = React.useMemo(() => {
    const formatted = googleReviews.map(r => ({
      id: r.id,
      patientName: r.reviewerName,
      patientInitial: r.reviewerName.charAt(0).toUpperCase(),
      conditionTreated: 'Chiropractic Care',
      review: r.comment || 'Excellent chiropractic treatment and patient care.',
      source: 'Google Review',
      location: r.location || 'Mehdipatnam, Hyderabad',
      rating: r.starRating,
      isFeatured: r.isFeatured,
    }));

    const featured = formatted.filter(r => r.isFeatured);
    const regular = formatted.filter(r => !r.isFeatured);
    return [...featured, ...testimonialsData, ...regular];
  }, [googleReviews]);

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
            <div className="flex items-center gap-1 text-[#1A1A1A] font-bold text-sm px-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>4.6 &bull; Justdial Verified</span>
            </div>
            <span className="text-[#DDD5C7] hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1 text-[#1A1A1A] font-bold text-sm px-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>4.7 &bull; Cybo Rating</span>
            </div>
            <span className="text-[#DDD5C7] hidden sm:inline">&bull;</span>
            <span className="text-xs font-semibold text-[#2C2926] px-2 font-serif">
              50,000+ Treated Over 25 Years
            </span>
          </div>
        </div>

        {/* Live Elfsight Google Reviews Floating Container */}
        <div className="my-6">
          <div className="elfsight-app-dbf3833d-dbc7-4170-a493-31ca3363edf2" data-elfsight-app-lazy />
        </div>

        {/* Continuous Horizontal Testimonials Slider Rail */}
        <TestimonialsSlider testimonials={combinedTestimonials} />

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