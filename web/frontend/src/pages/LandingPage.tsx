import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Mic,
  Radio,
  Newspaper,
  Trophy,
  CloudSun,
  CheckSquare,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import { AICore } from '../components/3d/AICore';
import { BootSequence } from '../components/common/BootSequence';
import { HolographicCard } from '../components/hud/HolographicCard';
import { sound } from '../utils/sound';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showBoot, setShowBoot] = useState(false);

  useEffect(() => {
    const booted = sessionStorage.getItem('jarvis_booted');
    if (!booted) {
      setShowBoot(true);
    }
  }, []);

  const featureCards = [
    { title: '3D NEURAL CORE', desc: 'Real-time WebGL interactive AI core with dynamic state heuristics.', icon: Bot, color: 'cyan' as const },
    { title: 'VOICE MATRIX', desc: 'Real-time Web Audio API frequency analysis and vocal synthesis.', icon: Mic, color: 'green' as const },
    { title: 'WEB INTELLIGENCE', desc: 'Real-time multi-source search aggregation and situation analysis.', icon: Radio, color: 'purple' as const },
    { title: 'GLOBAL NEWS FEED', desc: 'Dispatches across Technology, AI, Science, and Global geopolitics.', icon: Newspaper, color: 'blue' as const },
    { title: 'SPORTS TELEMETRY', desc: 'Real-time match tracking of Cricket, Football, Formula 1, and Tennis.', icon: Trophy, color: 'cyan' as const },
    { title: 'METEOROLOGY', desc: 'Atmospheric conditions, satellite radar indices, and forecast models.', icon: CloudSun, color: 'green' as const },
    { title: 'MISSION DIRECTIVES', desc: 'Strategic productivity, prioritized tasks, and daily situation briefings.', icon: CheckSquare, color: 'purple' as const },
    { title: 'NEURAL MEMORY', desc: 'Persistent secure key-value associative memory parameters.', icon: Cpu, color: 'blue' as const },
    { title: 'SECURITY ENCLAVE', desc: 'Cryptographic token encryption, isolated sessions, and audit logging.', icon: ShieldCheck, color: 'red' as const },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] overflow-y-auto selection:bg-cyan-500 selection:text-black">
      {/* 1. Cinematic Boot Sequence on Initial Load */}
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}

      {/* 2. Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 flex flex-col items-center text-center">
        {/* Top Operational Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>AUTONOMOUS 3D AI COMMAND SYSTEM // V2.0 ONLINE</span>
        </div>

        {/* Central 3D WebGL AI Core Hero */}
        <div className="w-full max-w-xl h-[340px] sm:h-[420px] flex items-center justify-center my-2">
          <AICore state="IDLE" size="100%" interactive={true} subtext="TOUCH TO ENGAGE" />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-hud font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-200 uppercase">
          J.A.R.V.I.S.
        </h1>
        <p className="mt-2 text-sm sm:text-base font-hud tracking-widest text-cyan-400 uppercase">
          JUST A RATHER VERY INTELLIGENT SYSTEM
        </p>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
          Tactical personal AI command center featuring real-time 3D neural core visualization, voice synthesis, global intelligence streams, and mission automation.
        </p>

        {/* CTA Launch Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              navigate('/login');
            }}
            className="px-6 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-black text-sm tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_#00E5FF] transition-all hover:scale-105"
          >
            <span>INITIALIZE SESSION</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              navigate('/register');
            }}
            className="px-6 py-3 rounded bg-black/60 border border-cyan-500/50 hover:border-cyan-300 text-cyan-300 hover:text-white font-hud font-bold text-sm tracking-wider uppercase transition-all"
          >
            ENROLL NEW OPERATIVE
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 w-full text-left">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-hud font-bold text-cyan-300 tracking-wider uppercase">
              SUBSYSTEM CAPABILITIES
            </h2>
            <p className="text-xs font-mono text-cyan-500/80 tracking-widest uppercase mt-1">
              FULL-STACK COMMAND INFRASTRUCTURE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <HolographicCard
                  key={i}
                  title={card.title}
                  badge="ACTIVE"
                  glowColor={card.color}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/30 shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-xs font-mono text-gray-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </HolographicCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
