import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CommandPalette } from '../components/layout/CommandPalette';
import { HolographicGrid } from '../components/hud/HolographicGrid';

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'COMMAND CENTER';
      case '/chat': return 'JARVIS AI CORE';
      case '/voice': return 'VOICE COMMAND MATRIX';
      case '/search': return 'TACTICAL SEARCH HUB';
      case '/briefing': return 'DAILY SITUATION BRIEFING';
      case '/news': return 'GLOBAL INTELLIGENCE FEED';
      case '/sports': return 'SPORTS TELEMETRY';
      case '/weather': return 'METEOROLOGICAL OBSERVATORY';
      case '/tasks': return 'MISSION TASK REGISTRY';
      case '/memory': return 'NEURAL MEMORY BANKS';
      case '/system': return 'SYSTEM STATUS & TELEMETRY';
      case '/profile': return 'OPERATIVE PROFILE';
      case '/settings': return 'SYSTEM CONFIGURATION';
      case '/admin': return 'ADMIN TERMINAL ACCESS';
      default: return 'COMMAND CENTER';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] flex overflow-hidden">
      {/* Background Holographic Matrix */}
      <HolographicGrid />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <Header
          title={getPageTitle()}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenCommandPalette={() => setCommandOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </div>
  );
};
