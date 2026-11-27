import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  ChevronRight
} from 'lucide-react';
import { HolographicCard } from '../hud/HolographicCard';
import { sound } from '../../utils/sound';
import { useAuth } from '../../context/AuthContext';

export const CommandPanel: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const commands = [
    { num: '/01', label: 'Ask JARVIS', path: '/chat', icon: Bot, color: 'text-cyan-400', badge: 'AI CORE' },
    { num: '/02', label: 'Voice Command', path: '/voice', icon: Mic, color: 'text-emerald-400', badge: 'VOCODER' },
    { num: '/03', label: 'Web Intelligence', path: '/search', icon: Search, color: 'text-indigo-400', badge: 'SEARCH' },
    { num: '/04', label: 'Situation Briefing', path: '/briefing', icon: FileText, color: 'text-sky-400', badge: 'DAILY' },
    { num: '/05', label: 'News Intelligence', path: '/news', icon: Newspaper, color: 'text-cyan-300', badge: 'WIRE' },
    { num: '/06', label: 'Sports Telemetry', path: '/sports', icon: Trophy, color: 'text-amber-400', badge: 'LIVE' },
    { num: '/07', label: 'Meteorology', path: '/weather', icon: CloudSun, color: 'text-emerald-400', badge: 'RADAR' },
    { num: '/08', label: 'Mission Directives', path: '/tasks', icon: CheckSquare, color: 'text-rose-400', badge: 'AGENDA' },
    { num: '/09', label: 'Memory Banks', path: '/memory', icon: Cpu, color: 'text-purple-400', badge: 'NEURAL' },
    { num: '/10', label: 'System Telemetry', path: '/system', icon: Activity, color: 'text-blue-400', badge: 'HARDWARE' },
    { num: '/11', label: 'Configuration', path: '/settings', icon: Settings, color: 'text-gray-300', badge: 'CONFIG' },
  ];

  if (isAdmin) {
    commands.push({
      num: '/12',
      label: 'Admin Terminal',
      path: '/admin',
      icon: Shield,
      color: 'text-amber-300',
      badge: 'ROOT'
    });
  }

  const handleCommandClick = (path: string) => {
    sound.playClick();
    navigate(path);
  };

  return (
    <HolographicCard title="DIRECTIVES" badge="INDEX" index="(01)" className="h-full">
      <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
        {commands.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.path}
              onClick={() => handleCommandClick(cmd.path)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl glass-fusion border border-white/5 hover:border-cyan-400/50 hover:bg-white/[0.04] transition-all group text-left cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-[10px] font-mono text-cyan-400/60 font-bold group-hover:text-cyan-300 shrink-0">
                  {cmd.num}
                </span>
                <Icon className={`w-3.5 h-3.5 ${cmd.color} shrink-0 group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-hud font-bold text-gray-200 group-hover:text-white uppercase tracking-wider truncate">
                  {cmd.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-mono text-gray-500 group-hover:text-cyan-300">
                  {cmd.badge}
                </span>
                <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </HolographicCard>
  );
};
