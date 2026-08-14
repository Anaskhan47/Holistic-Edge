import React from 'react';
import { cn } from '../../lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'neutral' | 'warm' | 'dark' | 'brand' | 'accent';
}

export const Section: React.FC<SectionProps> = ({
  className,
  spacing = 'lg',
  background = 'neutral',
  children,
  id,
  ...props
}) => {
  const spacings = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32'
  };

  const backgrounds = {
    white: 'bg-white text-[#1A1A1A]',
    neutral: 'bg-[#FAF9F6] text-[#1A1A1A]',
    warm: 'bg-[#F4F0E8] text-[#1A1A1A]',
    dark: 'bg-[#1E1C1A] text-[#FAF9F6]',
    brand: 'bg-[#1A365D] text-white',
    accent: 'bg-[#1B4332] text-white'
  };

  return (
    <section
      id={id}
      className={cn('relative w-full overflow-hidden', spacings[spacing], backgrounds[background], className)}
      {...props}
    >
      {children}
    </section>
  );
};

