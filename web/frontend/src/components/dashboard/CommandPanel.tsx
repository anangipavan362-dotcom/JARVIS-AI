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
  ChevronRight,
} from 'lucide-react';
import { HolographicCard } from '../hud/HolographicCard';
import { sound } from '../../utils/sound';
import { useAuth } from '../../context/AuthContext';

export const CommandPanel: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const commands = [
    { num: '/01', label: 'Ask JARVIS', path: '/chat', icon: Bot, badge: 'AI CORE' },
    { num: '/02', label: 'Voice Command', path: '/voice', icon: Mic, badge: 'VOCODER' },
    { num: '/03', label: 'Web Intelligence', path: '/search', icon: Search, badge: 'SEARCH' },
    { num: '/04', label: 'Situation Briefing', path: '/briefing', icon: FileText, badge: 'DAILY' },
    { num: '/05', label: 'News Intelligence', path: '/news', icon: Newspaper, badge: 'WIRE' },
    { num: '/06', label: 'Sports Telemetry', path: '/sports', icon: Trophy, badge: 'LIVE' },
    { num: '/07', label: 'Meteorology', path: '/weather', icon: CloudSun, badge: 'RADAR' },
    { num: '/08', label: 'Mission Directives', path: '/tasks', icon: CheckSquare, badge: 'AGENDA' },
    { num: '/09', label: 'Memory Banks', path: '/memory', icon: Cpu, badge: 'NEURAL' },
    { num: '/10', label: 'System Telemetry', path: '/system', icon: Activity, badge: 'HARDWARE' },
    { num: '/11', label: 'Configuration', path: '/settings', icon: Settings, badge: 'CONFIG' },
  ];

  if (isAdmin) {
    commands.push({
      num: '/12',
      label: 'Admin Terminal',
      path: '/admin',
      icon: Shield,
      badge: 'ROOT',
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
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/30 hover:bg-white/[0.08] transition-all group text-left cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-[10px] font-mono text-gray-500 font-bold group-hover:text-white shrink-0">
                  {cmd.num}
                </span>
                <Icon className="w-3.5 h-3.5 text-gray-300 group-hover:text-white shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-hud font-bold text-gray-200 group-hover:text-white uppercase tracking-wider truncate">
                  {cmd.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-mono text-gray-500 group-hover:text-gray-300">
                  {cmd.badge}
                </span>
                <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </HolographicCard>
  );
};
export default CommandPanel;
