import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  Maximize2,
  Terminal,
  Activity,
  Cpu,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/api';
import { voiceEngine, AvatarState } from '../services/voiceEngine';
import { DashboardData } from '../types';
import { JarvisAvatar } from '../components/3d/JarvisAvatar';
import { HUD } from '../components/hud/HUD';
import { CommandPanel } from '../components/dashboard/CommandPanel';
import { IntelligencePanel } from '../components/dashboard/IntelligencePanel';
import { HolographicCard } from '../components/hud/HolographicCard';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { NewsWidget } from '../components/widgets/NewsWidget';
import { TasksWidget } from '../components/widgets/TasksWidget';
import { sound } from '../utils/sound';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Avatar state and live audio level from voiceEngine
  const [avatarState, setAvatarState] = useState<AvatarState>('IDLE');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [activeDirective, setActiveDirective] = useState<string>('');
  const [lastSpeechResponse, setLastSpeechResponse] = useState<string>('');

  useEffect(() => {
    // Subscribe to voiceEngine events
    const unsubState = voiceEngine.onStateChange((st) => setAvatarState(st));
    const unsubAudio = voiceEngine.onAudioLevel((lvl) => setAudioLevel(lvl));
    const unsubTranscript = voiceEngine.onTranscript((text) => setActiveDirective(text));

    return () => {
      unsubState();
      unsubAudio();
      unsubTranscript();
    };
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await ApiClient.getDashboard();
      setData(res);
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

  const handleToggleVoice = async () => {
    sound.playClick();
    if (avatarState === 'LISTENING') {
      voiceEngine.stopListening();
    } else if (avatarState === 'SPEAKING') {
      voiceEngine.stopSpeaking();
    } else {
      await voiceEngine.startListening();
    }
  };

  const handleQuickDirective = async (prompt: string) => {
    sound.playClick();
    setActiveDirective(prompt);
    const reply = await voiceEngine.processDirective(prompt);
    setLastSpeechResponse(reply);
  };

  const handleCycleAvatarState = () => {
    sound.playClick();
    const states: AvatarState[] = ['IDLE', 'LISTENING', 'THINKING', 'SPEAKING', 'PROCESSING', 'SLEEPING'];
    const nextIdx = (states.indexOf(avatarState) + 1) % states.length;
    voiceEngine.setState(states[nextIdx]);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto pb-10">
      {/* 1. Top Futuristic HUD Telemetry Bar */}
      <HUD
        title={`${getGreeting().toUpperCase()}, ${user?.full_name?.toUpperCase() || 'OPERATIVE'}`}
        subtext="J.A.R.V.I.S. DIGITAL HUMAN CORE // MONOCHROME COMMAND SUITE"
      />

      {/* 2. Main 3D Holographic Command Center Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Tactical Command Panel */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <CommandPanel />
        </div>

        {/* Center: Hero 3D Holographic Digital Human Avatar */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          <HolographicCard
            glowColor="white"
            title="JARVIS // DIGITAL HUMAN INTELLIGENCE"
            badge={data?.is_demo ? 'GUEST DEMO' : 'LIVE NEURAL LINK'}
            index="(02)"
            className="w-full flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* 3D WebGL Avatar Canvas Container */}
            <div className="w-full h-[360px] sm:h-[420px] flex items-center justify-center relative rounded-2xl overflow-hidden bg-[#050505]">
              <JarvisAvatar
                state={avatarState}
                audioLevel={audioLevel}
                interactive={true}
                className="w-full h-full"
              />

              {/* State pill switcher overlay */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={handleCycleAvatarState}
                  title="Cycle Avatar State Preview"
                  className="px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] font-mono font-bold text-gray-300 hover:text-white hover:border-white/50 transition-all cursor-pointer backdrop-blur-md"
                >
                  STATE: <span className="text-white uppercase">{avatarState}</span>
                </button>
              </div>
            </div>

            {/* Directive Transcription & Audio Waveform Banner */}
            {activeDirective && (
              <div className="w-full mt-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white shrink-0 animate-pulse" />
                <span className="truncate">{activeDirective}</span>
              </div>
            )}

            {/* Core Action Overlay */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 mt-3">
              <div className="text-left w-full sm:w-auto">
                <div className="text-xs font-hud font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>VOCAL MATRIX:</span>
                  <span className="font-mono text-black bg-white font-black px-2 py-0.5 rounded-full text-[10px]">
                    {avatarState}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                  Full 3D Facial Anatomy • Lip-Sync • Neural Cranium Core
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* Voice Toggle Button */}
                <button
                  onClick={handleToggleVoice}
                  className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] sm:min-h-0 rounded-full text-xs font-hud font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    avatarState === 'LISTENING'
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse'
                      : 'bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white'
                  }`}
                >
                  {avatarState === 'LISTENING' ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>LISTENING...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>VOICE INPUT</span>
                    </>
                  )}
                </button>

                {/* Open Chat */}
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/chat');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 min-h-[44px] sm:min-h-0 rounded-full bg-white text-black text-xs font-hud font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>OPEN CHAT</span>
                </button>
              </div>
            </div>

            {/* Quick Vocal Directives Palette */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/5 mt-3">
              {[
                'Report system status',
                'Show weather summary',
                'Check priority tasks',
                'Identify active protocols',
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickDirective(cmd)}
                  className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 text-[10px] font-mono text-gray-400 hover:text-white transition-all text-left truncate cursor-pointer"
                >
                  › {cmd}
                </button>
              ))}
            </div>
          </HolographicCard>
        </div>

        {/* Right Side: Live Intelligence & 3D Globe */}
        <div className="lg:col-span-3 order-3 lg:order-3">
          <IntelligencePanel isDemo={data?.is_demo} />
        </div>
      </div>

      {/* 3. Modular Live Telemetry & Mission Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherWidget />
        <TasksWidget tasks={data?.urgent_tasks || []} onRefresh={fetchDashboard} />
        <NewsWidget />

        {/* Stored Memories Holographic Card (Strict Monochrome) */}
        <HolographicCard title="STORED MEMORIES" badge="NEURAL" index="(07)" glowColor="white">
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
                  className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/30 cursor-pointer text-xs font-mono transition-all"
                >
                  <div className="flex items-center justify-between text-white font-bold">
                    <span className="truncate">{m.key}</span>
                    <span className="text-[8px] uppercase px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300">
                      {m.category}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[10px] truncate mt-0.5">{m.value}</div>
                </div>
              ))
            )}

            <button
              onClick={() => {
                sound.playClick();
                navigate('/memory');
              }}
              className="w-full mt-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs font-mono text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              [ ACCESS MEMORY BANKS ]
            </button>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
export default DashboardPage;
