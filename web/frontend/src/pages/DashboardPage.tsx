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
  Mic,
  MessageSquare,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/api';
import { DashboardData } from '../types';
import { AICore } from '../components/3d/AICore';
import { HUD } from '../components/hud/HUD';
import { CommandPanel } from '../components/dashboard/CommandPanel';
import { IntelligencePanel } from '../components/dashboard/IntelligencePanel';
import { HolographicCard } from '../components/hud/HolographicCard';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { NewsWidget } from '../components/widgets/NewsWidget';
import { TasksWidget } from '../components/widgets/TasksWidget';
import { AIState } from '../components/3d/HolographicRings';
import { sound } from '../utils/sound';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [coreState, setCoreState] = useState<AIState>('IDLE');

  const fetchDashboard = async () => {
    try {
      const res = await ApiClient.getDashboard();
      setData(res);
      setCoreState(res.is_demo ? 'IDLE' : 'LISTENING');
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCoreClick = () => {
    sound.playClick();
    // Cycle state preview on manual interaction or open Chat
    setCoreState((prev) => {
      if (prev === 'IDLE') return 'LISTENING';
      if (prev === 'LISTENING') return 'THINKING';
      if (prev === 'THINKING') return 'SPEAKING';
      return 'IDLE';
    });
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto pb-10">
      {/* 1. Top Futuristic HUD Telemetry Bar */}
      <HUD
        title={`${getGreeting().toUpperCase()}, ${user?.full_name?.toUpperCase() || 'OPERATIVE'}`}
        subtext="J.A.R.V.I.S. QUANTUM CORE ONLINE // ALL DIRECTIVES ACTIVE"
      />

      {/* 2. Main 3D Holographic Command Center Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Tactical Command Panel (3 Cols on Desktop) */}
        <div className="lg:col-span-3">
          <CommandPanel />
        </div>

        {/* Center: Hero 3D AI Core (6 Cols on Desktop) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <HolographicCard
            glowColor="cyan"
            title="NEURAL AI CORE"
            badge={data?.is_demo ? 'DEMO MODE' : 'LIVE CORE'}
            className="w-full flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* 3D WebGL Interactive Core */}
            <div className="w-full h-[370px] sm:h-[420px] flex items-center justify-center">
              <AICore
                state={coreState}
                size="100%"
                interactive={true}
                onClick={handleCoreClick}
                subtext="CLICK TO ENGAGE NEURAL CORE"
              />
            </div>

            {/* Core Action Overlay */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-cyan-500/20 mt-2">
              <div className="text-left">
                <div className="text-xs font-hud font-bold text-cyan-200 uppercase tracking-wider">
                  TACTICAL STATE: <span className="text-cyan-400">{coreState}</span>
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  Interactive WebGL Physics & 3D Holographic Rings
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/chat');
                  }}
                  className="px-3 py-1.5 rounded bg-cyan-950/80 border border-cyan-400 hover:border-cyan-300 text-xs font-hud text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>OPEN CHAT</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/voice');
                  }}
                  className="px-3 py-1.5 rounded bg-cyan-950/80 border border-emerald-400 hover:border-emerald-300 text-xs font-hud text-emerald-300 hover:text-white flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,136,0.25)]"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>VOICE HUD</span>
                </button>
              </div>
            </div>
          </HolographicCard>
        </div>

        {/* Right Side: Live Intelligence & 3D Globe (3 Cols on Desktop) */}
        <div className="lg:col-span-3">
          <IntelligencePanel isDemo={data?.is_demo} />
        </div>
      </div>

      {/* 3. Modular Live Telemetry & Mission Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherWidget />
        <TasksWidget tasks={data?.urgent_tasks || []} onRefresh={fetchDashboard} />
        <NewsWidget />

        {/* Stored Memories Holographic Card */}
        <HolographicCard title="STORED MEMORIES" badge="NEURAL" glowColor="purple">
          <div className="space-y-2">
            {!data?.recent_memories || data.recent_memories.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 py-6 text-center">
                No custom parameters retained.
              </p>
            ) : (
              data.recent_memories.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate('/memory')}
                  className="p-2 rounded bg-black/40 border border-purple-500/20 hover:border-purple-400 cursor-pointer text-xs font-mono transition-all"
                >
                  <div className="flex items-center justify-between text-purple-300 font-bold">
                    <span className="truncate">{m.key}</span>
                    <span className="text-[8px] uppercase px-1 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                      {m.category}
                    </span>
                  </div>
                  <div className="text-gray-300 text-[10px] truncate mt-0.5">{m.value}</div>
                </div>
              ))
            )}

            <button
              onClick={() => {
                sound.playClick();
                navigate('/memory');
              }}
              className="w-full mt-3 py-1 text-center text-xs font-mono text-purple-400 hover:text-white transition-colors"
            >
              [ ACCESS MEMORY BANKS ]
            </button>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
