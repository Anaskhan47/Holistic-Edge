import React, { useState } from 'react';
import { clinicGalleryData } from '../../data/gallery';
import { GalleryItem } from '../../types';
import { Eye, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const ClinicExperienceGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Treatment Rooms', 'Spine Care Equipment', 'Therapy Suites', 'Reception & Facility'];

  const filteredGallery =
    activeCategory === 'All'
      ? clinicGalleryData: clinicGalleryData.filter(g => g.category === activeCategory);

  return (
    <section id="clinic-experience" className="py-16 md:py-24 bg-[#FAF9F6] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="editorial" size="md" className="mb-3">
            Facility Tour
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] font-serif tracking-tight">
            The Holistic Edge Environment
          </h2>
          <p className="text-sm sm:text-base text-[#5A544E] mt-3 leading-relaxed">
            Clean, sanitized, and therapeutic care suites situated in Susheel Apartments, right behind Olive Hospital in Mehdipatnam, Hyderabad.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] shadow-sm'
                    : 'bg-white text-[#4A443D] border border-[#E8E4DC] hover:border-[#D5CFC5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-[#F0ECE4] border border-[#E8E4DC] shadow-sm cursor-pointer aspect-[4/3] flex flex-col justify-end"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

              <div className="relative z-10 p-4 text-white">
                <Badge variant="editorial" size="sm" className="mb-1.5 bg-[#FAF9F6]/90 text-[#1A1A1A] border-none backdrop-blur-sm">
                  {item.category}
                </Badge>
                <h3 className="text-sm font-bold font-serif text-[#FAF9F6] line-clamp-1">{item.title}</h3>
                <p className="text-[11px] text-[#D4CEC5] line-clamp-2 mt-0.5 opacity-90">
                  {item.description}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#1A1A1A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        id="gallery-lightbox-modal"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title}
        subtitle={selectedImage?.category}
        maxWidth="xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-[#171614] aspect-[16/10] max-h-[480px]">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-sm text-[#2C2926] leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E4DC]">
              {selectedImage.description}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
};
