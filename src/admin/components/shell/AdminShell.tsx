import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { CommandPalette } from '../ui/CommandPalette';
import { isEditableTarget } from '../../../lib/keyboard';

export function AdminShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isEditable = isEditableTarget(e.target);

      // Handle Cmd/Ctrl + K shortcut explicitly
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      // CRITICAL: If focus is inside an editable field, STOP immediately!
      // Normal typing (a-z, 0-9, space, enter, punctuation, etc.) must NEVER trigger shortcuts or navigation.
      if (isEditable) {
        return;
      }

      // Escape closes mobile drawer or command palette if open
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          e.preventDefault();
          setCommandPaletteOpen(false);
        } else if (mobileSidebarOpen) {
          e.preventDefault();
          setMobileSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [commandPaletteOpen, mobileSidebarOpen]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAF9] font-sans antialiased text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full flex-shrink-0">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#060B17] z-50">
            <AdminSidebar
              collapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
              onNavClick={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <AdminTopBar
          onSearchOpen={() => setCommandPaletteOpen(true)}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-200">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}