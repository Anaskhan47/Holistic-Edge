import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable: boolean;
  bordered: boolean;
  padding: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'white' | 'warm' | 'dark' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = false,
  bordered = true,
  padding = 'md',
  variant = 'white',
  children,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variants = {
    white: 'bg-white text-[#1A1A1A]',
    warm: 'bg-[#F5F2EC] text-[#1A1A1A]',
    dark: 'bg-[#1E1C1A] text-[#FAF9F6] border-[#33302C]',
    outline: 'bg-transparent text-[#1A1A1A]'
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        bordered && (variant === 'dark' ? 'border border-[#33302C] shadow-sm' : 'border border-[#E8E4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'),
        hoverable && (variant === 'dark' ? 'hover:border-[#4D4842] hover:-translate-y-0.5' : 'hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:border-[#D0C7B8] hover:-translate-y-0.5'),
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

