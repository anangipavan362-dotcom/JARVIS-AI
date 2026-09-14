import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Mic,
  Search,
  FileText,
  Newspaper,
  Trophy,
  CloudSun,
  CheckSquare,
  Cpu,
  Activity,
  Settings,
  Shield,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/sound';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/chat', icon: Bot },
    { label: 'Voice Command', path: '/voice', icon: Mic },
    { label: 'Web Intelligence', path: '/search', icon: Search },
    { label: 'Daily Briefing', path: '/briefing', icon: FileText },
    { label: 'News Center', path: '/news', icon: Newspaper },
    { label: 'Sports Center', path: '/sports', icon: Trophy },
    { label: 'Meteorology', path: '/weather', icon: CloudSun },
    { label: 'Mission Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Memory Banks', path: '/memory', icon: Cpu },
    { label: 'System Telemetry', path: '/system', icon: Activity },
    { label: 'Configuration', path: '/settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Hub', path: '/admin', icon: Shield });
  }

  const handleNavClick = () => {
    sound.playClick();
    onCloseMobile?.();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-black/80 backdrop-blur-xl border-r border-cyan-500/30 flex flex-col justify-between select-none z-30">
      {/* Top Branding Section */}
      <div>
        <div className="p-5 border-b border-cyan-500/20 flex items-center gap-3">
          {/* Animated Mini Core Indicator */}
          <div className="relative w-9 h-9 rounded-full border border-cyan-400/60 bg-cyan-950/60 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00E5FF]" />
            <div className="absolute inset-0 rounded-full border border-cyan-400 border-t-transparent animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-hud font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              J.A.R.V.I.S.
            </h1>
            <p className="text-[9px] font-mono text-cyan-300/70 tracking-widest uppercase">
              AI COMMAND SYSTEM
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-hud tracking-wider transition-all duration-200 border ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-200 border-cyan-400/80 shadow-[0_0_15px_rgba(0,229,255,0.25)] tech-corner-tl'
                      : 'text-gray-400 border-transparent hover:text-cyan-300 hover:bg-cyan-950/30 hover:border-cyan-500/30'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="uppercase">{item.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Session Controls */}
      <div className="p-3 border-t border-cyan-500/20 bg-cyan-950/10">
        <NavLink
          to="/profile"
          onClick={handleNavClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-cyan-950/40 transition-all border border-transparent hover:border-cyan-500/30 mb-2 group"
        >
          <div className="w-8 h-8 rounded-full border border-cyan-400/50 bg-black/60 flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-cyan-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-hud font-bold text-cyan-200 truncate group-hover:text-white">
              {user?.full_name || 'Operative'}
            </p>
            <p className="text-[10px] font-mono text-cyan-400/60 truncate uppercase">
              {user?.role || 'USER'} • ONLINE
            </p>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-hud uppercase tracking-wider text-red-400 hover:text-white bg-red-950/20 hover:bg-red-900/40 border border-red-500/30 hover:border-red-400 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </aside>
  );
};
