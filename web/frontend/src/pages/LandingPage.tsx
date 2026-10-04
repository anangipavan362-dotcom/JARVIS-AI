import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Terminal,
  Cpu,
  Activity,
  Wifi,
  Mic,
  Bot,
  Search,
  Newspaper,
  Trophy,
  CloudSun,
  CheckSquare,
  Layers,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Zap,
  ExternalLink,
  Radio,
  Eye,
  Server,
  Database,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { AICore } from '../components/3d/AICore';
import { ParticleField } from '../components/3d/ParticleField';
import { BootSequence } from '../components/common/BootSequence';
import { HolographicCard } from '../components/hud/HolographicCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { sound } from '../utils/sound';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showBoot, setShowBoot] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const booted = sessionStorage.getItem('jarvis_booted');
    if (!booted) {
      setShowBoot(true);
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const faqs = [
    {
      q: 'What is J.A.R.V.I.S. AI Command Center?',
      a: 'J.A.R.V.I.S. is an advanced autonomous AI operating system designed for operatives who demand high-assurance security, real-time intelligence, voice control, and contextual mission management in one unified interface.'
    },
    {
      q: 'How does the AI reasoning engine work?',
      a: 'The neural core is powered by Google Gemini 2.5 Flash via our secure FastAPI proxy backend. It features multi-turn conversational reasoning, code generation, and streaming text-to-speech feedback.'
    },
    {
      q: 'How is user data protected and isolated?',
      a: 'Every operative account undergoes mandatory cryptographic 6-digit OTP verification upon enrollment. All passwords use salted bcrypt hashing, sessions use HS256 JWT tokens with 7-day expiration, and database queries strictly isolate each user from other operatives.'
    },
    {
      q: 'Does J.A.R.V.I.S. work with real-time news, sports, and weather?',
      a: 'Yes. Live atmospheric sensors are fetched via Open-Meteo radar models, global news is ingested via prioritized RSS intelligence feeds across 6 categories, and sports telemetry reports real-time match data across Cricket, Football, F1, and Tennis.'
    },
    {
      q: 'What happens if I lose internet connection or API keys are missing?',
      a: 'J.A.R.V.I.S. features built-in resilient Demo Mode. When external cloud APIs or keys are temporarily unconfigured, the system gracefully falls back to local neural heuristics and notifies the user with clear telemetry status indicators.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Cinematic Boot Sequence on Initial Visit */}
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}

      {/* SECTION 1: HERO COMMAND CENTER */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden border-b border-cyan-500/20">
        {/* Background Real Futuristic Command Center Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/hero/command_center.jpg"
            alt="Futuristic cybersecurity command center operations room"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/60 to-[#030712]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030712_85%)]" />
        </div>

        {/* Ambient 3D Holographic Particle Field */}
        <div className="absolute inset-0 z-1 pointer-events-none opacity-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <ParticleField count={380} speed={0.3} color="#00e5ff" />
          </Canvas>
        </div>

        {/* Top Operational Status Header */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <Zap className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <span className="font-hud font-black text-lg tracking-widest text-cyan-300">J.A.R.V.I.S.</span>
              <span className="block text-[9px] font-mono text-cyan-400/70 tracking-widest">TACTICAL OS // V2.0</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-bold">SYSTEM ONLINE</span>
            </div>
            <div className="text-gray-400">
              UTC: <span className="text-cyan-300">{currentTime || 'SYNCING...'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                navigate('/login');
              }}
              className="px-4 py-1.5 rounded text-xs font-hud font-bold tracking-wider uppercase text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/20 transition-all"
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                sound.playClick();
                navigate('/register');
              }}
              className="px-4 py-1.5 rounded text-xs font-hud font-black tracking-wider uppercase bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_#00e5ff] transition-all"
            >
              ENROLL
            </button>
          </div>
        </header>

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center my-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-[11px] font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>ENTERPRISE CYBERSECURITY & AI COMMAND CENTER</span>
          </div>

          {/* 3D Arc Reactor Interactive Core */}
          <div className="w-full max-w-md h-[260px] sm:h-[300px] flex items-center justify-center">
            <AICore state="IDLE" size="100%" interactive={true} subtext="TOUCH TO ENGAGE QUANTUM CORE" />
          </div>

          {/* Master Titles */}
          <h1 className="mt-2 text-4xl sm:text-6xl lg:text-7xl font-hud font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-100 uppercase drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">
            JARVIS AI
          </h1>
          <p className="mt-2 text-base sm:text-lg font-hud tracking-widest text-cyan-400 uppercase">
            Your intelligent personal AI command center.
          </p>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
            High-assurance operational environment featuring interactive 3D neural core visualization, conversational speech directives, multi-source tactical intelligence, and cryptographic security isolation.
          </p>

          {/* Master Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                navigate('/dashboard');
              }}
              className="px-8 py-3.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-black text-sm tracking-widest uppercase flex items-center gap-2 shadow-[0_0_25px_#00e5ff] transition-all hover:scale-105 cursor-pointer"
            >
              <span>LAUNCH JARVIS</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href="#command-center"
              onClick={() => sound.playClick()}
              className="px-7 py-3.5 rounded bg-black/70 border border-cyan-500/50 hover:border-cyan-300 text-cyan-300 hover:text-white font-hud font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-2"
            >
              <span>EXPLORE FEATURES</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Live System Telemetry Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl text-xs font-mono">
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/20 backdrop-blur-sm">
              <span className="text-[9px] text-gray-400 block uppercase">NEURAL ENGINE</span>
              <span className="font-hud text-cyan-300 font-bold">GEMINI 2.5 FLASH</span>
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/20 backdrop-blur-sm">
              <span className="text-[9px] text-gray-400 block uppercase">CLEARANCE GATEWAY</span>
              <span className="font-hud text-emerald-400 font-bold">SHA-256 OTP ACTIVE</span>
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/20 backdrop-blur-sm">
              <span className="text-[9px] text-gray-400 block uppercase">DATA CONFINEMENT</span>
              <span className="font-hud text-purple-300 font-bold">STRICT MULTI-TENANT</span>
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/20 backdrop-blur-sm">
              <span className="text-[9px] text-gray-400 block uppercase">UI ARCHITECTURE</span>
              <span className="font-hud text-cyan-300 font-bold">WEBGL 3D MATRIX</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-4 text-center">
          <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
            SCROLL DOWN TO INSPECT COMMAND SYSTEM
          </span>
        </div>
      </section>

      {/* SECTION 2: AI COMMAND CENTER OVERVIEW */}
      <section id="command-center" className="py-20 border-b border-cyan-500/20 relative bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 02 // PLATFORM</span>
            <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
              NEXT-GENERATION AI SECURITY OPERATIONS
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400">
              Designed as a commercial-grade central intelligence hub that unifies neural conversation, automated workflows, and global sensory telemetry under single-pane governance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <HolographicCard glowColor="cyan" className="p-6">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
                <span className="text-xs font-hud font-bold text-cyan-300 uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  REAL-TIME TELEMETRY FEED
                </span>
                <span className="text-[10px] font-mono text-emerald-400">PING: 14ms // ACTIVE</span>
              </div>
              <ImageWithFallback
                src="/images/hero/command_center.jpg"
                alt="Command Center Tactical Grid"
                containerClassName="rounded-lg h-64 border border-cyan-500/30"
                className="w-full h-full object-cover"
              />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded bg-black/50 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">CORE STATE</span>
                  <span className="text-emerald-400 font-bold">NOMINAL</span>
                </div>
                <div className="p-2 rounded bg-black/50 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">ENCRYPTION</span>
                  <span className="text-cyan-300 font-bold">HS256 JWT</span>
                </div>
                <div className="p-2 rounded bg-black/50 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">REDUNDANCY</span>
                  <span className="text-purple-300 font-bold">DEMO READY</span>
                </div>
              </div>
            </HolographicCard>

            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-hud font-bold text-cyan-200 uppercase">SYNCHRONIZED MULTI-THREAD MATRIX</h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Processes concurrent tactical queries, task scheduling, memory retention, and external RSS intelligence streams without thread blockage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-hud font-bold text-emerald-300 uppercase">ISOLATED OPERATIVE CONTEXT</h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Rigorous multi-tenant SQLAlchemy models guarantee User A cannot query, edit, or perceive User B's memories, tasks, sessions, or conversations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
                <div className="flex items-start gap-3">
                  <Server className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-hud font-bold text-purple-300 uppercase">CROSS-PLATFORM CONTINUITY</h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Works on desktop browsers, mobile devices, or alongside your native Windows JARVIS application (`desktop/jarvis.py`).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI CAPABILITIES */}
      <section className="py-20 border-b border-cyan-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 03 // INTELLIGENCE</span>
              <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
                NEURAL CONVERSATIONAL CORE
              </h2>
              <p className="mt-4 text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                Integrated directly with Google Gemini 2.5 Flash via our isolated backend AI service. Conversational memory allows J.A.R.V.I.S. to recall context across multiple turns without leaking API tokens to the client.
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Contextual multi-session memory recall</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Code generation, refactoring, and automated debugging</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Natural language query routing to search, weather, and tasks</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configurable AI temperature and creativity index</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/chat');
                  }}
                  className="px-6 py-2.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 text-xs font-hud font-bold tracking-widest uppercase inline-flex items-center gap-2 transition-all"
                >
                  <span>TEST AI ASSISTANT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <HolographicCard glowColor="purple" className="p-4">
              <ImageWithFallback
                src="/images/ai/neural_core.jpg"
                alt="AI Neural Core Quantum Matrix"
                containerClassName="rounded-lg h-80 border border-purple-500/30"
                className="w-full h-full object-cover"
              />
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* SECTION 4: VOICE ASSISTANT */}
      <section className="py-20 border-b border-cyan-500/20 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <HolographicCard glowColor="cyan" className="p-4 order-2 lg:order-1">
              <ImageWithFallback
                src="/images/voice/voice_matrix.jpg"
                alt="Holographic Voice Interface and Sound Visualizer"
                containerClassName="rounded-lg h-80 border border-cyan-500/30"
                className="w-full h-full object-cover"
              />
            </HolographicCard>

            <div className="order-1 lg:order-2">
              <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 04 // VOCAL SYNTHESIS</span>
              <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
                BIDIRECTIONAL VOICE MATRIX
              </h2>
              <p className="mt-4 text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                Interact hands-free with your personal AI command center using real-time Web Speech recognition, dynamic frequency visualizers, and neural speech synthesis.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-black/60 border border-cyan-500/20">
                  <Mic className="w-4 h-4 text-cyan-400 mb-1" />
                  <span className="text-[10px] text-gray-400 uppercase block">INPUT PROTOCOL</span>
                  <span className="text-cyan-300 font-bold">WEB SPEECH API</span>
                </div>
                <div className="p-3 rounded bg-black/60 border border-cyan-500/20">
                  <Radio className="w-4 h-4 text-purple-400 mb-1" />
                  <span className="text-[10px] text-gray-400 uppercase block">SYNTHESIS</span>
                  <span className="text-purple-300 font-bold">BROWSER TTS ENGINES</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/voice');
                  }}
                  className="px-6 py-2.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 text-xs font-hud font-bold tracking-widest uppercase inline-flex items-center gap-2 transition-all"
                >
                  <span>LAUNCH VOICE CONSOLE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WEB INTELLIGENCE & TACTICAL SEARCH */}
      <section className="py-20 border-b border-cyan-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 05 // RESEARCH</span>
            <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
              TACTICAL WEB INTELLIGENCE
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400">
              Aggregated live search queries dispatched across Google, YouTube, arXiv, and Google Scholar to deliver verified tactical sources without hallucinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'GOOGLE SEARCH', desc: 'Real-time general web queries and current news extraction.', icon: Search, color: 'text-cyan-400' },
              { title: 'ARXIV RESEARCH', desc: 'Peer-reviewed academic papers in AI, Physics, and Cryptography.', icon: BookOpenIcon, color: 'text-purple-400' },
              { title: 'GOOGLE SCHOLAR', desc: 'Scholarly literature, patent telemetry, and scientific citations.', icon: Sparkles, color: 'text-emerald-400' },
              { title: 'YOUTUBE INTELLIGENCE', desc: 'Curated technical walkthroughs, briefings, and video nodes.', icon: Radio, color: 'text-red-400' },
            ].map((node, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-black/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-all text-xs font-mono">
                <node.icon className={`w-5 h-5 ${node.color} mb-3`} />
                <h3 className="font-hud font-bold text-cyan-200 uppercase">{node.title}</h3>
                <p className="text-gray-400 mt-2 leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CYBERSECURITY MONITORING */}
      <section className="py-20 border-b border-cyan-500/20 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 06 // DEFENSE</span>
              <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
                CYBER DEFENSE & THREAT MATRIX
              </h2>
              <p className="mt-4 text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                Every action is monitored by automated security governance. The system logs failed attempts, enforces brute-force prevention, validates cryptographic tokens, and isolates user boundaries.
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-black/60 border border-red-500/30 flex items-center justify-between">
                  <span className="text-red-400 font-bold">BRUTE-FORCE LOCKOUT:</span>
                  <span className="text-gray-300">5-attempt auto lockout with cooldown</span>
                </div>
                <div className="p-3 rounded bg-black/60 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">CLEARANCE VALIDATION:</span>
                  <span className="text-gray-300">Mandatory 6-digit cryptographic OTP</span>
                </div>
                <div className="p-3 rounded bg-black/60 border border-cyan-500/30 flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">SESSION GOVERNANCE:</span>
                  <span className="text-gray-300">Single-use token rotation & remote revoke</span>
                </div>
              </div>
            </div>

            <HolographicCard glowColor="red" className="p-4">
              <ImageWithFallback
                src="/images/security/security_matrix.jpg"
                alt="Cyber Defense Network Security Shield"
                containerClassName="rounded-lg h-80 border border-red-500/30"
                className="w-full h-full object-cover"
              />
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* SECTION 7: NEURAL MEMORY BANKS */}
      <section className="py-20 border-b border-cyan-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 07 // RETENTION</span>
          <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
            EXPLICIT NEURAL MEMORY BANKS
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400">
            J.A.R.V.I.S. stores contextual key-value memory nodes tailored strictly to your account. You maintain full sovereignty to inspect, edit, or purge any stored memories at any time.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left font-mono text-xs">
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <span className="text-[10px] text-gray-500 block">KEY</span>
              <span className="text-cyan-300 font-bold">OPERATIVE_NAME</span>
              <span className="text-[10px] text-gray-400 block mt-2">VALUE</span>
              <span className="text-gray-300">Pavan Anangi</span>
            </div>
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <span className="text-[10px] text-gray-500 block">KEY</span>
              <span className="text-cyan-300 font-bold">DEFAULT_MODEL</span>
              <span className="text-[10px] text-gray-400 block mt-2">VALUE</span>
              <span className="text-gray-300">gemini-2.5-flash</span>
            </div>
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <span className="text-[10px] text-gray-500 block">KEY</span>
              <span className="text-cyan-300 font-bold">TIMEZONE_PREF</span>
              <span className="text-[10px] text-gray-400 block mt-2">VALUE</span>
              <span className="text-gray-300">Asia/Kolkata (IST)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: AUTOMATION & ORCHESTRATION */}
      <section className="py-20 border-b border-cyan-500/20 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <HolographicCard glowColor="purple" className="p-4">
              <ImageWithFallback
                src="/images/automation/automation_hub.jpg"
                alt="Automated Mission Task Orchestration Hub"
                containerClassName="rounded-lg h-80 border border-purple-500/30"
                className="w-full h-full object-cover"
              />
            </HolographicCard>

            <div>
              <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 08 // AUTOMATION</span>
              <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
                MISSION DIRECTIVE ORCHESTRATION
              </h2>
              <p className="mt-4 text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                Convert chaotic workflows into systematic operational directives. Prioritize mission tasks (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), track completion heuristics, and receive scheduled tactical reminders.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-black/60 border border-cyan-500/20">
                  <span className="text-cyan-400 font-bold">PRIORITY MATRIX</span>
                  <p className="text-gray-400 text-[11px] mt-1">4-tier heuristic mission classification</p>
                </div>
                <div className="p-3 rounded bg-black/60 border border-cyan-500/20">
                  <span className="text-purple-300 font-bold">STATUS TELEMETRY</span>
                  <p className="text-gray-400 text-[11px] mt-1">Real-time completion percentage gauges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: MISSION TASKS */}
      <section className="py-20 border-b border-cyan-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 09 // DIRECTIVES</span>
          <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
            TACTICAL TASK MANAGEMENT
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400">
            Manage high-priority directives with sorting, due dates, priority badges, and quick toggles directly synced to your personal account.
          </p>

          <div className="mt-8 space-y-2 text-left font-mono text-xs">
            <div className="p-3.5 rounded bg-black/60 border border-red-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-gray-200">Deploy J.A.R.V.I.S. Production Core to Google Cloud</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-hud bg-red-950/60 text-red-400 border border-red-500/40">URGENT</span>
            </div>
            <div className="p-3.5 rounded bg-black/60 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-gray-200">Configure Firebase Hosting SPA Routing Rules</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-hud bg-amber-950/60 text-amber-400 border border-amber-500/40">HIGH</span>
            </div>
            <div className="p-3.5 rounded bg-black/60 border border-cyan-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-gray-200">Perform Daily Global Intelligence Synchronization</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-hud bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">MEDIUM</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10, 11, 12: GLOBAL INTELLIGENCE (NEWS, SPORTS, WEATHER) */}
      <section className="py-20 border-b border-cyan-500/20 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTIONS 10, 11, 12 // SENSORS</span>
            <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
              LIVE GLOBAL SENSORY FEEDS
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400">
              Direct connection to global news RSS channels, live sporting telemetry, and meteorological radar sensors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* News */}
            <HolographicCard glowColor="blue" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase">SECTION 10: NEWS CENTER</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Live syndication across Technology, AI, Science, Business, India, and Geopolitics with verified direct canonical links.
              </p>
              <div className="mt-4 pt-3 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400/80">
                ACTIVE CHANNELS: 6 // REAL-TIME RSS
              </div>
            </HolographicCard>

            {/* Sports */}
            <HolographicCard glowColor="purple" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-hud font-bold text-purple-300 uppercase">SECTION 11: SPORTS TELEMETRY</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Live match tracking across Cricket, Premier League Football, Formula 1 Grand Prix schedules, and Grand Slam Tennis.
              </p>
              <div className="mt-4 pt-3 border-t border-purple-500/20 text-[10px] font-mono text-purple-300/80">
                DISCIPLINES: CRICKET, F1, FOOTBALL, TENNIS
              </div>
            </HolographicCard>

            {/* Weather */}
            <HolographicCard glowColor="green" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <CloudSun className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-hud font-bold text-emerald-300 uppercase">SECTION 12: METEOROLOGY</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Global satellite meteorological indices powered by Open-Meteo. Search any city for wind velocity, humidity, and atmospheric pressure.
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400/80">
                SENSOR ENGINE: OPEN-METEO // NO API KEY REQ
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* SECTION 13: DASHBOARD PREVIEW */}
      <section className="py-20 border-b border-cyan-500/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 13 // INTERFACE</span>
          <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
            OPERATIVE COMMAND DECK PREVIEW
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm font-mono text-gray-400">
            A unified holographic dashboard bringing together system telemetry, 3D WebGL core status, quick-action directives, and situation monitoring.
          </p>

          <div className="mt-10 max-w-5xl mx-auto">
            <HolographicCard glowColor="cyan" className="p-3">
              <div className="rounded-lg overflow-hidden border border-cyan-500/40 relative">
                <ImageWithFallback
                  src="/images/hero/command_center.jpg"
                  alt="Operative Dashboard Control Deck Preview"
                  containerClassName="w-full h-80 sm:h-[420px]"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_25px_#00e5ff]">
                    <Shield className="w-8 h-8 text-cyan-300" />
                  </div>
                  <h3 className="text-xl font-hud font-bold text-cyan-200 uppercase tracking-widest">
                    AUTHENTICATED OPERATIVE ACCESS
                  </h3>
                  <p className="text-xs font-mono text-gray-300 max-w-md mt-2">
                    Log in with your verified clearance to unlock AI Chat, Voice Directives, Daily Briefings, and the Admin Hub.
                  </p>
                  <button
                    onClick={() => {
                      sound.playClick();
                      navigate('/dashboard');
                    }}
                    className="mt-6 px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_#00e5ff]"
                  >
                    ENTER COMMAND DECK
                  </button>
                </div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* SECTION 14: SECURITY & GOVERNANCE */}
      <section className="py-20 border-b border-cyan-500/20 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 14 // CRYPTOGRAPHY</span>
            <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
              HIGH-ASSURANCE SECURITY ARCHITECTURE
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400">
              Zero plaintext password persistence, constant-time hash comparisons, and strict lifecycle states.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <Lock className="w-4 h-4 text-cyan-400 mb-2" />
              <span className="font-hud font-bold text-cyan-200 block uppercase">BCRYPT 12-ROUND HASHING</span>
              <p className="text-gray-400 text-[11px] mt-1">Passwords hashed with salt rounds before database persistence.</p>
            </div>
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <Shield className="w-4 h-4 text-emerald-400 mb-2" />
              <span className="font-hud font-bold text-emerald-300 block uppercase">SHA-256 OTP HASHING</span>
              <p className="text-gray-400 text-[11px] mt-1">Verification codes stored as hashes with constant-time verification.</p>
            </div>
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <Radio className="w-4 h-4 text-purple-400 mb-2" />
              <span className="font-hud font-bold text-purple-300 block uppercase">RATE LIMITING & COOLDOWN</span>
              <p className="text-gray-400 text-[11px] mt-1">60-second cooldown and 5-attempt thresholds prevent brute-forcing.</p>
            </div>
            <div className="p-4 rounded bg-black/60 border border-cyan-500/20">
              <Terminal className="w-4 h-4 text-amber-400 mb-2" />
              <span className="font-hud font-bold text-amber-300 block uppercase">AUDIT TRAIL LOGGING</span>
              <p className="text-gray-400 text-[11px] mt-1">Structured IP, actor, and timestamp records for administrative audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 15: FAQ ACCORDION */}
      <section className="py-20 border-b border-cyan-500/20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-widest">SECTION 15 // FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-hud font-bold text-cyan-300 mt-2 uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg bg-black/60 border border-cyan-500/30 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-cyan-950/20 transition-colors"
                  >
                    <span className="font-hud font-bold text-cyan-200 uppercase flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 shrink-0 transform transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-gray-300 leading-relaxed border-t border-cyan-500/10 bg-cyan-950/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 16: ENTERPRISE FOOTER */}
      <footer className="py-12 bg-black text-xs font-mono border-t border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="font-hud font-bold text-base text-cyan-300">J.A.R.V.I.S. AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Autonomous Personal AI Operating System and Cybersecurity Command Center.
              </p>
              <div className="mt-3 text-[10px] text-cyan-400/80">
                PROD BUILD: V2.0 // DEPLOYED
              </div>
            </div>

            <div>
              <h4 className="font-hud font-bold text-cyan-300 uppercase mb-3">OPERATIONAL NODES</h4>
              <ul className="space-y-1.5 text-gray-400 text-[11px]">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-cyan-300">Dashboard</button></li>
                <li><button onClick={() => navigate('/chat')} className="hover:text-cyan-300">AI Assistant</button></li>
                <li><button onClick={() => navigate('/voice')} className="hover:text-cyan-300">Voice Directives</button></li>
                <li><button onClick={() => navigate('/briefing')} className="hover:text-cyan-300">Daily Briefing</button></li>
                <li><button onClick={() => navigate('/admin')} className="hover:text-cyan-300">Cyber Admin Hub</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-hud font-bold text-cyan-300 uppercase mb-3">INTELLIGENCE SENSORS</h4>
              <ul className="space-y-1.5 text-gray-400 text-[11px]">
                <li><button onClick={() => navigate('/search')} className="hover:text-cyan-300">Tactical Web Search</button></li>
                <li><button onClick={() => navigate('/news')} className="hover:text-cyan-300">Global News RSS</button></li>
                <li><button onClick={() => navigate('/sports')} className="hover:text-cyan-300">Sports Telemetry</button></li>
                <li><button onClick={() => navigate('/weather')} className="hover:text-cyan-300">Open-Meteo Radar</button></li>
                <li><button onClick={() => navigate('/tasks')} className="hover:text-cyan-300">Mission Tasks</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-hud font-bold text-cyan-300 uppercase mb-3">COMPLIANCE & SYSTEM</h4>
              <ul className="space-y-1.5 text-gray-400 text-[11px]">
                <li><a href="https://github.com/anangipavan362-dotcom/JARVIS-AI" target="_blank" rel="noreferrer" className="hover:text-cyan-300 inline-flex items-center gap-1">GitHub Repository <ExternalLink className="w-3 h-3" /></a></li>
                <li><span className="text-gray-500">FastAPI & Python 3.11</span></li>
                <li><span className="text-gray-500">React 18 & Vite & Three.js</span></li>
                <li><span className="text-gray-500">Firebase Hosting Ready</span></li>
                <li><span className="text-gray-500">Cloud Run Serverless Ready</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[10px]">
            <div>
              © 2026 J.A.R.V.I.S. (Just A Rather Very Intelligent System). All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>STATUS: ALL SUBSYSTEMS NOMINAL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper component for book icon
const BookOpenIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
