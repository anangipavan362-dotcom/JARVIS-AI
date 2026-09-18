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
    { label: 'Ask JARVIS', path: '/chat', icon: Bot, color: 'text-cyan-400', badge: 'AI CORE' },
    { label: 'Voice Command', path: '/voice', icon: Mic, color: 'text-green-400', badge: 'MIC' },
    { label: 'Web Intelligence', path: '/search', icon: Search, color: 'text-purple-400', badge: 'SEARCH' },
    { label: 'Situation Briefing', path: '/briefing', icon: FileText, color: 'text-blue-400', badge: 'DAILY' },
    { label: 'News Intelligence', path: '/news', icon: Newspaper, color: 'text-cyan-300', badge: 'DISPATCH' },
    { label: 'Sports Telemetry', path: '/sports', icon: Trophy, color: 'text-amber-400', badge: 'LIVE' },
    { label: 'Meteorology', path: '/weather', icon: CloudSun, color: 'text-emerald-400', badge: 'RADAR' },
    { label: 'Mission Tasks', path: '/tasks', icon: CheckSquare, color: 'text-rose-400', badge: 'AGENDA' },
    { label: 'Memory Banks', path: '/memory', icon: Cpu, color: 'text-violet-400', badge: 'NEURAL' },
    { label: 'System Telemetry', path: '/system', icon: Activity, color: 'text-sky-400', badge: 'HARDWARE' },
    { label: 'Configuration', path: '/settings', icon: Settings, color: 'text-gray-300', badge: 'SETTINGS' },
  ];

  if (isAdmin) {
    commands.push({
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
    <HolographicCard title="COMMAND CENTER" badge="DIRECTIVES" className="h-full">
      <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
        {commands.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.path}
              onClick={() => handleCommandClick(cmd.path)}
              className="w-full flex items-center justify-between p-2 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/40 hover:shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-all group text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 ${cmd.color} shrink-0 group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-hud font-bold text-cyan-200 group-hover:text-white uppercase tracking-wider truncate">
                  {cmd.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[8px] font-mono text-cyan-400/60 group-hover:text-cyan-300">
                  {cmd.badge}
                </span>
                <ChevronRight className="w-3 h-3 text-cyan-500/40 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </HolographicCard>
  );
};
