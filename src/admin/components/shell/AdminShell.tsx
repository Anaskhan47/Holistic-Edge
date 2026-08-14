import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { CommandPalette } from '../ui/CommandPalette';
import { AdminToastContainer } from '../ui/AdminToast';
import { Menu } from 'lucide-react';
import { cn } from '../../../lib/utils';

const SIDEBAR_PREF_KEY = 'he_admin_sidebar_collapsed';

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_PREF_KEY) === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(v => {
      const next = !v;
      localStorage.setItem(SIDEBAR_PREF_KEY, String(next));
      return next;
    });
  };

  // Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close mobile nav on resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F7F4] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-full">
        <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden w-[220px] flex flex-col">
            <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} onNavClick={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-14 h-14 flex-shrink-0 text-[#6B6661] hover:text-[#1A1A1A] hover:bg-[#F0ECE4] transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <AdminTopBar onSearchOpen={() => setCmdOpen(true)} />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Toast Notifications */}
      <AdminToastContainer />
    </div>
  );
}
