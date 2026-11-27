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
  ChevronRight,
  Zap,
  X
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
    { num: '01', label: 'Cockpit', path: '/dashboard', icon: LayoutDashboard },
    { num: '02', label: 'AI Assistant', path: '/chat', icon: Bot },
    { num: '03', label: 'Voice Command', path: '/voice', icon: Mic },
    { num: '04', label: 'Web Intelligence', path: '/search', icon: Search },
    { num: '05', label: 'Daily Briefing', path: '/briefing', icon: FileText },
    { num: '06', label: 'News Center', path: '/news', icon: Newspaper },
    { num: '07', label: 'Sports Radar', path: '/sports', icon: Trophy },
    { num: '08', label: 'Meteorology', path: '/weather', icon: CloudSun },
    { num: '09', label: 'Mission Directives', path: '/tasks', icon: CheckSquare },
    { num: '10', label: 'Memory Banks', path: '/memory', icon: Cpu },
    { num: '11', label: 'System Telemetry', path: '/system', icon: Activity },
    { num: '12', label: 'Configuration', path: '/settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ num: '13', label: 'Admin Hub', path: '/admin', icon: Shield });
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
    <aside className="w-64 h-screen bg-[#02050f]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between select-none z-30 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
      {/* Top Branding Section */}
      <div>
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated Core Indicator */}
            <div className="relative w-8 h-8 rounded-full border border-cyan-400/60 bg-cyan-950/80 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.35)]">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-base font-hud font-black tracking-widest text-white flex items-center gap-1.5">
                <span>JARVIS</span>
                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 lowercase text-xs">
                  os
                </span>
              </h1>
              <p className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase">
                Autonomous Nexus // V2.5
              </p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl border border-white/10 text-cyan-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items with Agenciy Numbered Indices */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-hud tracking-wider transition-all duration-200 border ${
                    isActive
                      ? 'bg-cyan-500/15 text-white border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'text-gray-400 border-transparent hover:text-cyan-200 hover:bg-white/[0.03] hover:border-white/10'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-cyan-400/50">
                    {item.num}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="uppercase text-[11px]">{item.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-30" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Session Controls */}
      <div className="p-3 border-t border-white/10 bg-black/40">
        <NavLink
          to="/profile"
          onClick={handleNavClick}
          className="flex items-center gap-3 p-2.5 rounded-xl glass-fusion hover:bg-white/[0.05] transition-all border border-white/5 hover:border-cyan-500/30 mb-2 group"
        >
          <div className="w-8 h-8 rounded-full border border-cyan-400/50 bg-black/60 flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-cyan-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-hud font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
              {user?.full_name || 'Operative'}
            </p>
            <p className="text-[10px] font-mono text-emerald-400/90 truncate uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {user?.role || 'OPERATIVE'}
            </p>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-hud uppercase tracking-wider text-rose-300 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </aside>
  );
};
