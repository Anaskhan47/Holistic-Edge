import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, ChevronDown, Activity, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { clinicInfo } from '../../data/clinicInfo';
import { servicesData } from '../../data/services';
import { conditionsData } from '../../data/conditions';
import { cn } from '../../lib/utils';
import logoImg from '@/Logo.png';

export interface HeaderProps {
  onOpenBooking: (preselectedService?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'conditions' | null>(null);
  
  // Mobile accordion states
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileConditionsOpen, setMobileConditionsOpen] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle clicking outside of dropdowns to close them
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#nav-services-dropdown-btn') && !target.closest('#nav-services-dropdown-menu')) {
        if (activeDropdown === 'services') setActiveDropdown(null);
      }
      if (!target.closest('#nav-conditions-dropdown-btn') && !target.closest('#nav-conditions-dropdown-menu')) {
        if (activeDropdown === 'conditions') setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDropdown]);

  // Reset mobile accordions when menu toggles
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileServicesOpen(false);
      setMobileConditionsOpen(false);
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'A.M.M Method™', path: '/#amm-method-deepdive', isSpecial: true },
    { label: 'Services', path: '/services', hasDropdown: true },
    { label: 'Conditions', path: '/conditions', hasDropdown: true },
    { label: 'Success Stories', path: '/#patient-success-stories' },
    { label: 'Patient Resources', path: '/#frequently-asked-questions', isHighlighted: true },
    { label: 'Contact', path: '/#location-contact' }
  ];

  const getIsActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return location.hash === path.replace('/', '');
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-site-header"
      className="sticky top-0 z-40 w-full transition-all duration-300"
    >
      {/* Absolute Backdrop background to avoid containing block rules for fixed children */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300 z-[-1]',
          isScrolled
            ? 'glass-nav border-b border-[#E8E4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
            : 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EFEBE3]'
        )}
      />

      <div className={cn(
        'w-full max-w-[1360px] mx-auto px-6 sm:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 transition-all duration-300',
        isScrolled ? 'h-16 xl:h-[72px]' : 'h-16 xl:h-[84px]'
      )}>
        {/* 1. BRAND AREA */}
        <Link
          id="header-brand-logo"
          to="/"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center focus:outline-none max-w-[240px] flex-shrink-0"
        >
          <img
            src="/brand/holistic-edge-logo-transparent.png"
            alt="Holistic Edge Wellness Centre"
            className="h-10 sm:h-12 object-contain"
          />
        </Link>

        {/* 2. PRIMARY NAVIGATION (DESKTOP) */}
        <nav className="hidden xl:flex items-center justify-center gap-1.5 2xl:gap-3 justify-self-center h-full">
          {navLinks.map(link => {
            const isActive = getIsActive(link.path);

            if (link.label === 'Services') {
              const isOpen = activeDropdown === 'services';
              return (
                <div key={link.path} className="h-full flex items-center relative">
                  <button
                    id="nav-services-dropdown-btn"
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(isOpen ? null : 'services');
                    }}
                    className={cn(
                      'h-10 px-3 2xl:px-4 text-xs 2xl:text-sm font-medium rounded-[14px] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap outline-none',
                      isActive
                        ? 'text-[#0F2747] font-semibold bg-[#F0F4F8] border border-[#CBD8E6]/60'
                        : 'text-[#2C2926] hover:text-[#0F2747] hover:bg-[#F2ECE4]'
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-250", isOpen && "rotate-180")} />
                  </button>

                  {isOpen && (
                    <div
                      id="nav-services-dropdown-menu"
                      className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-[#E8E4DC] py-2.5 px-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                    >
                      <div className="px-3 py-1.5 mb-1 border-b border-[#F0ECE3] flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A847C]">
                          Clinical Services
                        </span>
                        <Link
                          to="/services"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs text-[#0F2747] font-medium hover:underline"
                        >
                          View All
                        </Link>
                      </div>
                      {servicesData.map(s => (
                        <Link
                          key={s.id}
                          to={`/services/${s.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F6F0] transition-colors group flex items-start gap-2.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0F2747] mt-2 group-hover:scale-125 transition-transform" />
                          <div>
                            <div className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#0F2747]">
                              {s.title}
                            </div>
                            <div className="text-xs text-[#6B6661] line-clamp-1">
                              {s.subtitle}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (link.label === 'Conditions') {
              const isOpen = activeDropdown === 'conditions';
              return (
                <div key={link.path} className="h-full flex items-center relative">
                  <button
                    id="nav-conditions-dropdown-btn"
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(isOpen ? null : 'conditions');
                    }}
                    className={cn(
                      'h-10 px-3 2xl:px-4 text-xs 2xl:text-sm font-medium rounded-[14px] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap outline-none',
                      isActive
                        ? 'text-[#0F2747] font-semibold bg-[#F0F4F8] border border-[#CBD8E6]/60'
                        : 'text-[#2C2926] hover:text-[#0F2747] hover:bg-[#F2ECE4]'
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-250", isOpen && "rotate-180")} />
                  </button>

                  {isOpen && (
                    <div
                      id="nav-conditions-dropdown-menu"
                      className="absolute top-full left-0 w-96 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-[#E8E4DC] py-2.5 px-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                    >
                      <div className="px-2 py-1.5 mb-2 border-b border-[#F0ECE3] flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A847C]">
                          Conditions We Treat
                        </span>
                        <Link
                          to="/conditions"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs text-[#0F2747] font-medium hover:underline"
                        >
                          All Conditions
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {conditionsData.slice(0, 10).map(c => (
                          <Link
                            key={c.id}
                            to={`/conditions/${c.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F9F6F0] text-xs font-medium text-[#2C2926] hover:text-[#0F2747] transition-colors truncate"
                          >
                            • {c.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={link.path} className="h-full flex items-center relative">
                <Link
                  id={`nav-link-${link.label.replace(/\s+/g, '-').toLowerCase()}`}
                  to={link.path}
                  className={cn(
                    'h-10 px-3 2xl:px-[17px] text-xs 2xl:text-sm font-medium rounded-[14px] transition-all relative flex items-center justify-center whitespace-nowrap',
                    link.isSpecial && 'text-[#1B4332] font-semibold bg-[#EAF2ED] border border-[#C5DACB] hover:bg-[#DEEBE2] pr-5 2xl:pr-6',
                    link.isHighlighted && 'text-[#0F2747] font-semibold bg-[#F0F4F8] border border-[#CBD8E6]/80 hover:bg-[#D4E2F0]',
                    isActive && !link.isSpecial && !link.isHighlighted
                      ? 'text-[#0F2747] font-semibold bg-[#F0F4F8] border border-[#CBD8E6]/60'
                      : !link.isSpecial && !link.isHighlighted && 'text-[#2C2926] hover:text-[#0F2747] hover:bg-[#F2ECE4]'
                  )}
                >
                  <span>{link.label}</span>
                  {link.isSpecial && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* 3. ACTIONS */}
        <div className="flex items-center justify-end gap-3 justify-self-end">
          {/* Phone Link (Hidden on screens under xl, text hidden under 2xl) */}
          <a
            id="header-phone-action"
            href={`tel:${clinicInfo.phoneRaw}`}
            className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl text-[#1A1A1A] hover:bg-[#F2ECE4] transition-colors border border-transparent hover:border-[#E8E4DC] flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#F2EDE4] text-[#1A1A1A] flex items-center justify-center border border-[#DDD5C7] flex-shrink-0">
              <Phone className="w-4 h-4 text-[#1A1A1A]" />
            </div>
            <div className="hidden 2xl:flex text-left leading-none flex-col justify-center">
              <span className="text-[9px] text-[#6B6661] font-bold uppercase tracking-wider mb-0.5">Quick Call</span>
              <span className="text-xs font-bold text-[#1A1A1A] whitespace-nowrap">{clinicInfo.phone}</span>
            </div>
          </a>

          {/* Call icon wrapper for smaller viewports (hidden on mobile, shown on tablet < xl) */}
          <a
            href={`tel:${clinicInfo.phoneRaw}`}
            className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-xl bg-[#F2EDE4] text-[#1A1A1A] border border-[#DDD5C7] hover:bg-[#E8E2D5] transition-colors"
            aria-label="Call clinic"
          >
            <Phone className="w-4 h-4 text-[#0F2747]" />
          </a>

          {/* Book Consultation Button */}
          <Button
            id="header-book-consultation-btn"
            variant="accent"
            size="md"
            onClick={() => onOpenBooking()}
            leftIcon={<Calendar className="w-4 h-4" />}
            className="hidden sm:inline-flex h-11 px-5 rounded-[14px] text-xs font-semibold shadow-sm"
          >
            Book Appointment
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            aria-label="Open mobile navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1A1A1A] hover:bg-[#F2ECE4] rounded-xl xl:hidden transition-colors outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Absolute top-full to naturally follow sticky header border and support scrolling) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="absolute left-0 right-0 top-full h-[calc(100vh-64px)] xl:hidden z-50 bg-[#FAF9F6]/98 backdrop-blur-lg overflow-y-auto p-5 border-t border-[#E8E4DC] flex flex-col justify-between"
        >
          <div className="space-y-4">

            <div className="grid grid-cols-1 gap-1.5">
              {navLinks.map(link => {
                const isActive = getIsActive(link.path);

                if (link.label === 'Services') {
                  return (
                    <div key={link.path} className="w-full">
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between outline-none',
                          isActive ? 'bg-[#1A1A1A]/5 text-[#0F2747]' : 'text-[#1A1A1A] hover:bg-[#F2ECE4]'
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", mobileServicesOpen && "rotate-180")} />
                      </button>

                      {mobileServicesOpen && (
                        <div className="pl-4 pr-2 py-1.5 mt-1 space-y-1 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC]/60 animate-in fade-in slide-in-from-top-1 duration-150">
                          <Link
                            to="/services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-sm font-semibold text-[#0F2747] hover:underline"
                          >
                            View All Services
                          </Link>
                          {servicesData.map(s => (
                            <Link
                              key={s.id}
                              to={`/services/${s.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-3 py-2 text-sm font-medium text-[#2C2926] hover:text-[#0F2747] rounded-lg"
                            >
                              {s.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (link.label === 'Conditions') {
                  return (
                    <div key={link.path} className="w-full">
                      <button
                        type="button"
                        onClick={() => setMobileConditionsOpen(!mobileConditionsOpen)}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between outline-none',
                          isActive ? 'bg-[#1A1A1A]/5 text-[#0F2747]' : 'text-[#1A1A1A] hover:bg-[#F2ECE4]'
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", mobileConditionsOpen && "rotate-180")} />
                      </button>

                      {mobileConditionsOpen && (
                        <div className="pl-4 pr-2 py-1.5 mt-1 grid grid-cols-1 gap-1 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC]/60 animate-in fade-in slide-in-from-top-1 duration-150">
                          <Link
                            to="/conditions"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-sm font-semibold text-[#0F2747] hover:underline"
                          >
                            All Conditions We Treat
                          </Link>
                          {conditionsData.map(c => (
                            <Link
                              key={c.id}
                              to={`/conditions/${c.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-3 py-1.5 text-xs font-medium text-[#2C2926] hover:text-[#0F2747] rounded-lg truncate"
                            >
                              • {c.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between',
                      isActive
                        ? 'bg-[#1A1A1A] text-[#FAF9F6]'
                        : 'text-[#1A1A1A] hover:bg-[#F2ECE4]'
                    )}
                  >
                    <span>{link.label}</span>
                    {link.isSpecial && (
                      <Badge variant="teal" size="sm">
                        3-Stage Protocol
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E4DC] mt-6 space-y-3">
            <Button
              fullWidth
              variant="accent"
              size="lg"
              className="rounded-xl"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              leftIcon={<Calendar className="w-5 h-5" />}
            >
              Book an Appointment
            </Button>
            <a
              href={`tel:${clinicInfo.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D5CFC5] text-[#1A1A1A] font-semibold text-sm hover:bg-[#F2ECE4] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0F2747]" />
              <span>Direct Call: {clinicInfo.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
