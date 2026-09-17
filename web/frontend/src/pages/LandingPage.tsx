import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Terminal,
  Zap
} from 'lucide-react';
import { ArcReactor } from '../components/hud/ArcReactor';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [bootStep, setBootStep] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  const bootMessages = [
    'SYSTEM INITIALIZING...',
    'AI CORE ........ ONLINE',
    'VOICE SYSTEM ... ONLINE',
    'NETWORK ........ ONLINE',
    'DATABASE ........ ONLINE',
    'SECURITY ........ ACTIVE',
    'J.A.R.V.I.S. ONLINE'
  ];

  useEffect(() => {
    sound.playBoot();
    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev < bootMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setBootComplete(true);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  const featureCards = [
    { title: 'AI CONVERSATION', desc: 'Advanced neural dialogue with contextual memory retention.', icon: Bot },
    { title: 'VOICE ASSISTANT', desc: 'Real-time Web Speech synthesis and tactical voice recognition.', icon: Mic },
    { title: 'LIVE INTELLIGENCE', desc: 'Real-time internet intelligence across multiple search engines.', icon: Radio },
    { title: 'NEWS CENTER', desc: 'Live dispatches across Technology, AI, Science, and World events.', icon: Newspaper },
    { title: 'SPORTS TELEMETRY', desc: 'Live tracking of Cricket, Football, Formula 1, and Tennis.', icon: Trophy },
    { title: 'METEOROLOGY', desc: 'Live atmospheric conditions, humidity, and multi-day forecasts.', icon: CloudSun },
    { title: 'PRODUCTIVITY', desc: 'Mission agenda, prioritized tasks, and situational daily briefings.', icon: CheckSquare },
    { title: 'NEURAL MEMORY', desc: 'Secure parameter and user preference storage banks.', icon: Cpu },
    { title: 'SECURITY ENCLAVE', desc: 'Multi-layered authorization, token encryption, and audit telemetry.', icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] overflow-y-auto selection:bg-cyan-500 selection:text-black">
      {/* Cinematic Startup Overlay */}
      {!bootComplete && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <ArcReactor state="THINKING" size={200} subtext="INITIALIZING CORE" />
          <div className="mt-8 font-mono text-cyan-400 text-sm tracking-widest text-center space-y-1">
            {bootMessages.slice(0, bootStep + 1).map((msg, i) => (
              <div key={i} className={i === bootStep ? 'text-white font-bold animate-pulse' : 'text-cyan-500/70'}>
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col items-center text-center">
        {/* Top System Status Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>AUTONOMOUS OPERATING SYSTEM V2.0</span>
        </div>

        {/* Central Glowing Reactor */}
        <div className="my-4">
          <ArcReactor state="IDLE" size={280} subtext="COMMAND SYSTEM READY" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-hud font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-200 uppercase">
          J.A.R.V.I.S.
        </h1>
        <p className="mt-2 text-sm sm:text-base font-hud tracking-widest text-cyan-400 uppercase">
          JUST A RATHER VERY INTELLIGENT SYSTEM
        </p>

        <p className="mt-6 max-w-2xl text-sm sm:text-lg font-mono text-gray-300">
          "An intelligent AI system designed for conversation, information, productivity and control."
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <NeonButton
            variant="cyan"
            size="lg"
            onClick={() => navigate('/login')}
            icon={<Zap className="w-5 h-5" />}
          >
            ENTER JARVIS
          </NeonButton>

          <NeonButton
            variant="ghost"
            size="lg"
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            icon={<Terminal className="w-5 h-5" />}
          >
            EXPLORE SYSTEM
          </NeonButton>
        </div>
      </div>

      {/* Feature Matrix Section */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-cyan-500/20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-hud font-bold tracking-widest text-cyan-300 uppercase">
            INTEGRATED COMMAND SUBSYSTEMS
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-mono text-cyan-400/60 uppercase">
            TACTICAL ARCHITECTURE DESIGNED FOR COMPLETE SITUATIONAL AWARENESS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br flex flex-col group cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 group-hover:text-white group-hover:border-cyan-300 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500/50">
                    MODULE 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-hud font-bold text-cyan-200 group-hover:text-cyan-300 tracking-wider uppercase mb-2">
                  {card.title}
                </h3>
                <p className="text-xs font-mono text-gray-400 leading-relaxed flex-1">
                  {card.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-hud text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span>INITIALIZE</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 py-8 px-4 text-center text-xs font-mono text-cyan-500/60">
        <p>J.A.R.V.I.S. ARTIFICIAL INTELLIGENCE PLATFORM • OPERATIONAL COMMAND CENTER</p>
        <p className="text-[10px] text-gray-500 mt-1">All telemetry and mission logs strictly isolated and encrypted.</p>
      </footer>
    </div>
  );
};
