import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  FileText,
  CloudSun,
  Trophy,
  Newspaper,
  Search,
  CheckSquare,
  Sparkles,
  Zap,
  Mic,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/api';
import { DashboardData } from '../types';
import { ArcReactor } from '../components/hud/ArcReactor';
import { StatusIndicator } from '../components/hud/StatusIndicator';
import { AIStatusWidget } from '../components/widgets/AIStatusWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { NewsWidget } from '../components/widgets/NewsWidget';
import { TasksWidget } from '../components/widgets/TasksWidget';
import { SystemHealthWidget } from '../components/widgets/SystemHealthWidget';
import { sound } from '../utils/sound';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboard = async () => {
    try {
      const res = await ApiClient.getDashboard();
      setData(res);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const quickActions = [
    { label: 'Ask JARVIS', path: '/chat', icon: Bot, color: 'text-cyan-400' },
    { label: 'Daily Briefing', path: '/briefing', icon: FileText, color: 'text-blue-400' },
    { label: 'Weather', path: '/weather', icon: CloudSun, color: 'text-amber-400' },
    { label: 'Sports Center', path: '/sports', icon: Trophy, color: 'text-green-400' },
    { label: 'News Intelligence', path: '/news', icon: Newspaper, color: 'text-cyan-300' },
    { label: 'Web Search', path: '/search', icon: Search, color: 'text-purple-400' },
    { label: 'New Directive', path: '/tasks', icon: CheckSquare, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto pb-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/25 backdrop-blur-md tech-corner-tl tech-corner-br">
        <div>
          <h1 className="text-xl sm:text-2xl font-hud font-black tracking-wider text-cyan-200 uppercase">
            {getGreeting()}, {user?.full_name || 'Operative'}
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-0.5">
            J.A.R.V.I.S. IS ONLINE • ALL SYSTEMS RESPONDING
          </p>
        </div>

        {/* HUD Subsystem Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusIndicator label="AI CORE" status={data?.is_demo ? 'DEMO' : 'ACTIVE'} />
          <StatusIndicator label="VOICE" status="READY" />
          <StatusIndicator label="NETWORK" status="ONLINE" />
          <StatusIndicator label="DATABASE" status="ONLINE" />
        </div>
      </div>

      {/* Main Center Console: Large Arc Reactor & HUD Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left Side: Recent Missions or Quick AI Prompt */}
        <div className="cyber-panel rounded-lg p-5 tech-corner-tl tech-corner-br h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 mb-3">
              <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider">
                MISSION BRIEFING
              </h3>
              <span className="text-[10px] font-mono text-cyan-500">LIVE FEED</span>
            </div>
            <p className="text-xs font-mono text-gray-300 leading-relaxed">
              "Command center synchronized. Meteorological, sports telemetry, and neural heuristic networks are tracking smoothly. Ready for mission instructions."
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/20 space-y-2">
            <button
              onClick={() => navigate('/voice')}
              className="w-full flex items-center justify-between p-2 rounded bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-300 text-xs font-mono text-cyan-300 hover:text-white transition-all"
            >
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-green-400" />
                <span>Voice Command Interface</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/briefing')}
              className="w-full flex items-center justify-between p-2 rounded bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-300 text-xs font-mono text-cyan-300 hover:text-white transition-all"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Play Situation Briefing</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Hero Animated Reactor */}
        <div className="flex flex-col items-center justify-center p-6 cyber-panel rounded-lg tech-corner-tl tech-corner-br min-h-[340px]">
          <ArcReactor
            state={data?.is_demo ? 'IDLE' : 'LISTENING'}
            size={270}
            interactive={true}
            onClick={() => navigate('/chat')}
            subtext="AI CORE ONLINE"
          />
          <div className="mt-4 text-center">
            <h2 className="text-lg font-hud font-black text-cyan-300 tracking-widest uppercase">
              J.A.R.V.I.S.
            </h2>
            <p className="text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase">
              TACTICAL COMMAND OPERATING SYSTEM
            </p>
          </div>
        </div>

        {/* Right Side: Quick Diagnostic Telemetry */}
        <div className="h-full">
          <SystemHealthWidget />
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br">
        <div className="text-[11px] font-hud font-bold text-cyan-400/80 uppercase tracking-wider mb-3">
          QUICK TACTICAL LAUNCHPAD
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  sound.playClick();
                  navigate(action.path);
                }}
                className="flex flex-col items-center justify-center p-3 rounded bg-black/50 border border-cyan-500/25 hover:border-cyan-400 hover:bg-cyan-950/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all group"
              >
                <Icon className={`w-5 h-5 mb-1.5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[11px] font-hud font-bold text-cyan-200 group-hover:text-white uppercase tracking-wider text-center">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modular Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AIStatusWidget data={data || undefined} />
        <WeatherWidget />
        <TasksWidget tasks={data?.urgent_tasks || []} onRefresh={fetchDashboard} />
        <NewsWidget />
        <div className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
            <h3 className="text-sm font-hud font-bold text-cyan-200 uppercase tracking-wider">
              RECENT CONVERSATIONS
            </h3>
            <button onClick={() => navigate('/chat')} className="text-xs font-mono text-cyan-400 hover:text-white">
              OPEN CHAT
            </button>
          </div>
          <div className="space-y-2">
            {!data?.recent_conversations || data.recent_conversations.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 py-4 text-center">
                No archived consultations.
              </p>
            ) : (
              data.recent_conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/chat')}
                  className="p-2 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 cursor-pointer flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-cyan-200 truncate">{c.title}</span>
                  </div>
                  <span className="text-[10px] text-cyan-500/60 shrink-0">
                    {c.message_count} msgs
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
            <h3 className="text-sm font-hud font-bold text-cyan-200 uppercase tracking-wider">
              STORED MEMORIES
            </h3>
            <button onClick={() => navigate('/memory')} className="text-xs font-mono text-cyan-400 hover:text-white">
              MANAGE
            </button>
          </div>
          <div className="space-y-2">
            {!data?.recent_memories || data.recent_memories.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 py-4 text-center">
                No custom parameters retained.
              </p>
            ) : (
              data.recent_memories.map((m) => (
                <div key={m.id} className="p-2 rounded bg-black/40 border border-cyan-500/20 text-xs font-mono">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span>{m.key}</span>
                    <span className="text-[9px] uppercase px-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                      {m.category}
                    </span>
                  </div>
                  <div className="text-gray-300 text-[11px] truncate mt-0.5">{m.value}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
