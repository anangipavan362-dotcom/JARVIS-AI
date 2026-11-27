import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CommandPalette } from '../components/layout/CommandPalette';

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Command', italicWord: 'Cockpit', indexBadge: '/01' };
      case '/chat':
        return { title: 'Neural', italicWord: 'Cognition', indexBadge: '/02' };
      case '/voice':
        return { title: 'Digital Human', italicWord: 'Avatar', indexBadge: '/03' };
      case '/search':
        return { title: 'Tactical', italicWord: 'Intelligence', indexBadge: '/04' };
      case '/briefing':
        return { title: 'Daily', italicWord: 'Briefing', indexBadge: '/05' };
      case '/news':
        return { title: 'Global', italicWord: 'News Wire', indexBadge: '/06' };
      case '/sports':
        return { title: 'Sports', italicWord: 'Telemetry', indexBadge: '/07' };
      case '/weather':
        return { title: 'Meteorology', italicWord: 'Radar', indexBadge: '/08' };
      case '/tasks':
        return { title: 'Mission', italicWord: 'Directives', indexBadge: '/09' };
      case '/memory':
        return { title: 'Neural', italicWord: 'Memory Banks', indexBadge: '/10' };
      case '/system':
        return { title: 'System', italicWord: 'Diagnostics', indexBadge: '/11' };
      case '/profile':
        return { title: 'Operative', italicWord: 'Profile', indexBadge: '/00' };
      case '/settings':
        return { title: 'System', italicWord: 'Configuration', indexBadge: '/12' };
      case '/admin':
        return { title: 'Admin', italicWord: 'Governance', indexBadge: '/13' };
      default:
        return { title: 'Command', italicWord: 'Center', indexBadge: '/01' };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex overflow-hidden selection:bg-white selection:text-black">
      {/* Premium Monochrome Atmospheric Ambient Background Reflections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.035)_0%,rgba(200,200,200,0.01)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
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
          title={pageMeta.title}
          italicWord={pageMeta.italicWord}
          indexBadge={pageMeta.indexBadge}
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
export default MainLayout;
