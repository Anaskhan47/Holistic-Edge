import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CalendarDays, Activity, Star, Stethoscope, BookOpen, Users, ArrowRight } from 'lucide-react';
import { appointmentStorage, leadStorage, testimonialStorage } from '../../services/adminStorage';
import { servicesData } from '../../../data/services';
import { conditionsData } from '../../../data/conditions';
import { teamData } from '../../../data/team';
import { cn } from '../../../lib/utils';

interface SearchResult {
  id: string;
  type: 'appointment' | 'lead' | 'testimonial' | 'service' | 'condition' | 'team';
  label: string;
  sublabel?: string;
  path: string;
}

const TYPE_META: Record<SearchResult['type'], { icon: React.ReactNode; color: string; label: string }> = {
  appointment: { icon: <CalendarDays size={13} />, color: 'text-[#1B4332]', label: 'Appointment' },
  lead: { icon: <Activity size={13} />, color: 'text-[#1A365D]', label: 'Lead' },
  testimonial: { icon: <Star size={13} />, color: 'text-[#92400E]', label: 'Testimonial' },
  service: { icon: <Stethoscope size={13} />, color: 'text-[#A94420]', label: 'Service' },
  condition: { icon: <BookOpen size={13} />, color: 'text-[#5A544E]', label: 'Condition' },
  team: { icon: <Users size={13} />, color: 'text-[#1A1A1A]', label: 'Team' },
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Cmd+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) onClose(); // toggle — handled by parent
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const found: SearchResult[] = [];

    // Appointments
    appointmentStorage.getAll()
      .filter(a => a.fullName.toLowerCase().includes(lower) || a.phone.includes(lower) || a.service.toLowerCase().includes(lower))
      .slice(0, 3)
      .forEach(a => found.push({
        id: a.id, type: 'appointment',
        label: a.fullName,
        sublabel: `${a.service} · ${a.preferredDate} · ${a.status}`,
        path: `/admin/appointments/${a.id}`,
      }));

    // Leads
    leadStorage.getAll()
      .filter(l => l.fullName.toLowerCase().includes(lower) || l.phone.includes(lower) || l.condition.toLowerCase().includes(lower))
      .slice(0, 3)
      .forEach(l => found.push({
        id: l.id, type: 'lead',
        label: l.fullName,
        sublabel: `${l.condition} · ${l.status}`,
        path: `/admin/leads/${l.id}`,
      }));

    // Testimonials
    testimonialStorage.getAll()
      .filter(t => t.displayName.toLowerCase().includes(lower) || t.review.toLowerCase().includes(lower) || t.condition.toLowerCase().includes(lower))
      .slice(0, 2)
      .forEach(t => found.push({
        id: t.id, type: 'testimonial',
        label: t.displayName,
        sublabel: `${t.condition} · ${t.status}`,
        path: `/admin/testimonials`,
      }));

    // Services
    servicesData
      .filter(s => s.title.toLowerCase().includes(lower))
      .slice(0, 2)
      .forEach(s => found.push({
        id: s.id, type: 'service',
        label: s.title,
        sublabel: s.shortDescription,
        path: `/admin/services`,
      }));

    // Conditions
    conditionsData
      .filter(c => c.title.toLowerCase().includes(lower))
      .slice(0, 2)
      .forEach(c => found.push({
        id: c.id, type: 'condition',
        label: c.title,
        sublabel: c.shortDescription,
        path: `/admin/conditions`,
      }));

    // Team
    teamData
      .filter(m => m.name.toLowerCase().includes(lower) || m.role.toLowerCase().includes(lower))
      .slice(0, 2)
      .forEach(m => found.push({
        id: m.id, type: 'team',
        label: m.name,
        sublabel: m.role,
        path: `/admin/team`,
      }));

    setResults(found.slice(0, 12));
    setSelectedIdx(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 120);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[selectedIdx]) handleSelect(results[selectedIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl border border-[#E5E2DC] overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F0ECE4]">
          <Search size={16} className="text-[#9E968C] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search appointments, leads, services…"
            className="flex-1 text-sm text-[#1A1A1A] placeholder:text-[#9E968C] outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#9E968C] hover:text-[#1A1A1A]">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-72 overflow-y-auto">
            {results.map((result, idx) => {
              const meta = TYPE_META[result.type];
              return (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      idx === selectedIdx ? 'bg-[#F8F7F4]' : 'hover:bg-[#F8F7F4]'
                    )}
                  >
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-[#F4F1EA] flex-shrink-0', meta.color)}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{result.label}</p>
                      {result.sublabel && (
                        <p className="text-[11.5px] text-[#9E968C] truncate mt-0.5">{result.sublabel}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10.5px] text-[#9E968C] bg-[#F4F1EA] px-1.5 py-0.5 rounded">
                        {meta.label}
                      </span>
                      {idx === selectedIdx && <ArrowRight size={11} className="text-[#9E968C]" />}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty / hint */}
        {query && results.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-[#9E968C]">No results for "<span className="text-[#1A1A1A]">{query}</span>"</p>
          </div>
        )}
        {!query && (
          <div className="py-4 px-4">
            <p className="text-[11.5px] text-[#9E968C] mb-2">Quick access</p>
            <div className="flex flex-wrap gap-2">
              {['appointments', 'leads', 'testimonials', 'services', 'team'].map(k => (
                <button
                  key={k}
                  onClick={() => setQuery(k)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F4F1EA] text-[#5A544E] hover:bg-[#E8E4DC] transition-colors capitalize"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#F0ECE4] px-4 py-2 flex items-center gap-3 text-[10.5px] text-[#C4BDB4]">
          <span><kbd className="bg-[#F4F1EA] px-1 rounded font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="bg-[#F4F1EA] px-1 rounded font-mono">↵</kbd> select</span>
          <span><kbd className="bg-[#F4F1EA] px-1 rounded font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
