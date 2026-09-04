import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  isOpen = false,
  onToggle,
  badge
}) => {
  return (
    <div
      id={`accordion-item-${id}`}
      className="border border-[#E8E4DC] rounded-2xl overflow-hidden bg-white transition-colors duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
    >
      <button
        type="button"
        id={`accordion-btn-${id}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left font-medium text-[#1A1A1A] hover:text-[#0F2747] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F2747]/20"
      >
        <div className="flex items-center gap-3 pr-2">
          <span className="text-base md:text-lg font-semibold text-[#1A1A1A] font-serif leading-snug">{title}</span>
          {badge && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F2EDE4] text-[#4A433B] border border-[#DDD5C7]">
              {badge}
            </span>
          )}
        </div>
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#F7F4EE] border border-[#E8E4DC] text-[#6B6661] transition-transform duration-300',
            isOpen && 'rotate-180 bg-[#F0F4F8] border-[#CBD8E6] text-[#0F2747]'
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-content-${id}`}
            role="region"
            aria-labelledby={`accordion-btn-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-6 md:px-6 md:pb-7 text-[#5A554E] leading-relaxed text-sm md:text-base border-t border-[#F0EBE3] pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface AccordionProps {
  items: { id: string; title: string; content: React.ReactNode; badge: string }[];
  allowMultiple: boolean;
  defaultOpenIndex: number;
  className: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIndex = 0,
  className
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    if (defaultOpenIndex >= 0 && items[defaultOpenIndex]) {
      return [items[defaultOpenIndex].id];
    }
    return [];
  });

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map(item => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          badge={item.badge}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};
