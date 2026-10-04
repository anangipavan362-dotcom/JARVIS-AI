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
  MicOff,
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
  HelpCircle,
  Play,
  Volume2,
  Globe2,
  RefreshCw,
  Bell,
  Code2,
  Sliders,
  Share2,
  Menu,
  X
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { AICore } from '../components/3d/AICore';
import { ParticleField } from '../components/3d/ParticleField';
import { BootSequence } from '../components/common/BootSequence';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { sound } from '../utils/sound';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showBoot, setShowBoot] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'briefing' | 'weather' | 'news' | 'sports' | 'tasks'>('briefing');
  const [dashboardPreviewTab, setDashboardPreviewTab] = useState<'chat' | 'telemetry' | 'tasks' | 'security'>('chat');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const booted = sessionStorage.getItem('jarvis_booted');
    if (!booted) {
      setShowBoot(true);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handlePlayVoicePreview = () => {
    sound.playClick();
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      window.speechSynthesis?.cancel();
      return;
    }

    setIsAudioPlaying(true);
    sound.playAccessGranted();

    if ('speechSynthesis' in window) {
      const text = "Good afternoon, Operative. All JARVIS cognitive and sensory subsystems are operating at peak fidelity. What directives shall we initiate?";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsAudioPlaying(false), 3000);
    }
  };

  const faqs = [
    {
      q: 'What is JARVIS?',
      a: 'JARVIS (Just A Rather Very Intelligent System) is a complete, futuristic AI operating system and digital command center. It unifies conversational intelligence, live world sensory feeds, speech synthesis, task management, and military-grade security into a high-performance glassmorphic interface.'
    },
    {
      q: 'What can JARVIS do?',
      a: 'JARVIS coordinates multi-turn conversational AI reasoning, voice control, live global news aggregation across 6 categories, sports match intelligence, atmospheric weather sensors via Open-Meteo radar, tactical web search across Google/YouTube/arXiv, prioritized mission tasks, explicit neural memory banks, and cybersecurity monitoring.'
    },
    {
      q: 'Does JARVIS support voice control?',
      a: 'Yes. JARVIS features native real-time browser speech recognition (Speech-to-Text) paired with neural speech synthesis (Text-to-Speech) and responsive 3D acoustic waveform visualizers for hands-free command operations.'
    },
    {
      q: 'Does JARVIS work on mobile?',
      a: 'Yes. The entire platform is built with an adaptive responsive architecture. On mobile and tablets, 3D particle densities and WebGL geometry scale intelligently to deliver a fluid 60fps experience while preserving full glassmorphic visual fidelity.'
    },
    {
      q: 'Is my data private and isolated?',
      a: 'Absolutely. Every operative account is strictly isolated within our multi-tenant relational database schema. We enforce SHA-256 OTP authentication, Argon2/Bcrypt password hashing, HS256 JWT tokens, and provide a 1-click \"Download My Data\" export and permanent account purge tool.'
    },
    {
      q: 'How does the AI reasoning engine work?',
      a: 'JARVIS operates a dual-engine architecture: it directly connects to Google Gemini 2.5 Flash via our secure FastAPI proxy gateway for deep live reasoning. If API credentials or connectivity are unconfigured, it seamlessly transitions to built-in adaptive heuristics so your command center remains operational.'
    },
    {
      q: 'What platforms and browsers are supported?',
      a: 'JARVIS runs natively on Google Chrome, Microsoft Edge, Safari, Firefox, and Chromium-based browsers across Windows, macOS, Linux, Android, and iOS. In addition, the original Python Tkinter desktop assistant is fully preserved for local native Windows operations.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#02040a] text-[#E8FFFF] overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}

      {/* Atmospheric Background Glows (Fusion AI Gradient Lighting) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,180,255,0.12)_0%,rgba(100,50,255,0.06)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,255,0.07)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(80,50,220,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff04_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff04_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* FLOATING GLASS NAVIGATION BAR */}
      <div className="fixed top-4 inset-x-0 z-50 max-w-6xl mx-auto px-4 pointer-events-auto">
        <nav className="glass-fusion px-4 py-2.5 rounded-full flex items-center justify-between border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.35)] group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <span className="font-hud font-black text-sm tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                JARVIS AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[9px] font-mono text-cyan-400/80 tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                OS // V2.5
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-gray-300">
            <a href="#hero" className="hover:text-cyan-300 transition-colors">OVERVIEW</a>
            <a href="#showcase" className="hover:text-cyan-300 transition-colors">INTELLIGENCE</a>
            <a href="#capabilities" className="hover:text-cyan-300 transition-colors">CAPABILITIES</a>
            <a href="#security" className="hover:text-cyan-300 transition-colors">SECURITY</a>
            <a href="#dashboard-preview" className="hover:text-cyan-300 transition-colors">DASHBOARD</a>
            <a href="#pricing" className="hover:text-cyan-300 transition-colors">PRICING</a>
            <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                sound.playClick();
                navigate('/login');
              }}
              className="hidden sm:inline-block px-3.5 py-1.5 rounded-full text-xs font-hud font-bold tracking-wider text-gray-300 hover:text-white border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                sound.playClick();
                navigate('/dashboard');
              }}
              className="px-4 py-1.5 rounded-full text-xs font-hud font-black tracking-wider text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>LAUNCH</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle Navigation Drawer"
              className="lg:hidden p-2 rounded-full border border-white/10 hover:border-cyan-400/40 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-300" /> : <Menu className="w-5 h-5 text-cyan-300" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Glassmorphism Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 inset-x-4 max-w-lg mx-auto glass-fusion-cyan p-6 rounded-3xl border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-hud font-bold text-xs text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                COMMAND NAVIGATION
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Home
              </a>
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                AI Intelligence
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Features
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Security & Trust
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/news');
                }}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors text-left cursor-pointer"
              >
                News Wire
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/sports');
                }}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors text-left cursor-pointer"
              >
                Sports Radar
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/weather');
                }}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors text-left cursor-pointer"
              >
                Weather Radar
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors text-left cursor-pointer"
              >
                Login
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  sound.playClick();
                  navigate('/dashboard');
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-hud font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
              >
                <span>LAUNCH JARVIS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. CINEMATIC HERO SECTION (FUSION AI + 3D LAYERED COMPOSITION) */}
      <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <ImageWithFallback
            src="/images/hero/command_center.jpg"
            alt="Cybersecurity Command Operations Room"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover filter brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-transparent to-[#02040a]" />
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <ParticleField count={isMobile ? 120 : 320} speed={0.25} color="#00e5ff" />
          </Canvas>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>FUSION ARCHITECTURE // NEXT-GEN AI COMMAND CENTER</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-hud font-black tracking-tight text-white uppercase drop-shadow-[0_0_40px_rgba(0,229,255,0.3)]">
            JARVIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">AI</span>
          </h1>

          <p className="mt-4 text-lg sm:text-2xl font-hud tracking-wide text-cyan-200/90 font-medium">
            "Your Intelligent Digital Command Center"
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
            Experience an autonomous neural operating system fusing conversational speech, global live sensory feeds, prioritized task directives, and military-grade user data isolation into one cohesive glassmorphic cockpit.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                navigate('/dashboard');
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-black font-hud font-black text-sm tracking-widest uppercase flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.65)] hover:scale-105 transition-all cursor-pointer"
            >
              <span>Launch JARVIS</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                handlePlayVoicePreview();
              }}
              className="px-7 py-3.5 rounded-full glass-fusion border border-emerald-400/40 hover:border-emerald-300 text-emerald-300 hover:text-white font-hud font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 hover:bg-emerald-950/40 shadow-[0_0_20px_rgba(0,255,136,0.15)] cursor-pointer"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Talk to JARVIS</span>
            </button>

            <a
              href="#showcase"
              onClick={() => sound.playClick()}
              className="px-6 py-3.5 rounded-full glass-fusion border border-white/10 hover:border-cyan-400/40 text-gray-300 hover:text-white font-hud font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 hover:bg-white/[0.05]"
            >
              <span>Explore Intelligence</span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* HERO 3D LAYERED COMPOSITION */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mt-8 flex flex-col items-center">
          <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center">
            <div className="absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.18)_0%,rgba(120,50,255,0.08)_50%,transparent_75%)] pointer-events-none blur-xl" />

            <div className="w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] z-10">
              <AICore state="IDLE" size="100%" interactive={true} subtext="CLICK TO STIMULATE NEURAL CORE" />
            </div>

            {/* FLOATING GLASS CARD 1: DATA MATRIX */}
            <div className="hidden md:flex absolute left-4 lg:left-8 top-16 w-64 glass-fusion-cyan p-4 rounded-2xl animate-float-1 z-20">
              <div className="w-full">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                  <span className="text-[10px] font-hud font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    DATA MATRIX
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">LIVE // 100%</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Throughput:</span>
                    <span className="text-cyan-200">1.48 TB/s</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Inference Latency:</span>
                    <span className="text-emerald-300">11.8 ms</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Context Memory:</span>
                    <span className="text-indigo-300">256K Tokens</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400">SYNCED</span>
                </div>
              </div>
            </div>

            {/* FLOATING GLASS CARD 2: SECURITY DEFENSE SHIELD */}
            <div className="hidden md:flex absolute right-4 lg:right-8 top-20 w-64 glass-fusion p-4 rounded-2xl animate-float-2 z-20">
              <div className="w-full">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                  <span className="text-[10px] font-hud font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    CYBER DEFENSE
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 font-bold">ACTIVE</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Authentication:</span>
                    <span className="text-emerald-300">SHA-256 OTP</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Isolation Layer:</span>
                    <span className="text-cyan-300">Multi-Tenant</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Active Threats:</span>
                    <span className="text-emerald-400 font-bold">0 Detected</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-400">
                  <span>JWT ENCRYPTED</span>
                  <span className="text-emerald-400">RESILIENT</span>
                </div>
              </div>
            </div>

            {/* FLOATING GLASS PILL: AI STATUS */}
            <div className="absolute top-0 glass-pill px-4 py-2 rounded-full border border-cyan-500/30 text-xs font-mono flex items-center gap-3 animate-float-3 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-gray-300">NEURAL CORE:</span>
              <span className="text-cyan-300 font-bold font-hud">GOOGLE GEMINI 2.5 FLASH</span>
              <span className="text-gray-500">|</span>
              <span className="text-purple-300 font-bold">DEMO RESILIENT</span>
            </div>

            {/* FLOATING GLASS CHIP: TASKS & SENSORS */}
            <div className="absolute bottom-2 glass-fusion px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-4 text-xs font-mono z-20">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-gray-300">Directives:</span>
                <span className="text-cyan-300 font-bold">8 Queued</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-gray-300">Sensors:</span>
                <span className="text-emerald-300 font-bold">Global RSS + Weather</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-gray-300">Voice Synthesis:</span>
                <span className="text-indigo-300 font-bold">Armed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI PRODUCT SHOWCASE */}
      <section id="showcase" className="py-24 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              LIVE SYSTEM DEMONSTRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              See JARVIS in Action
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Watch how JARVIS transforms raw conversational requests into multi-sensory briefings and tactical directive executions.
            </p>
          </div>

          <div className="glass-fusion rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="bg-[#050b18]/80 rounded-2xl p-5 border border-cyan-500/20 mb-8">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-cyan-300 font-bold">INTERACTIVE DIALOGUE TERMINAL</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <button
                    onClick={handlePlayVoicePreview}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-xs"
                  >
                    {isAudioPlaying ? <MicOff className="w-3.5 h-3.5 text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{isAudioPlaying ? 'STOP VOICE' : 'PLAY VOICE AUDIO'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[10px] font-hud text-cyan-300 font-black">
                    OP
                  </div>
                  <div className="glass-pill px-4 py-2.5 rounded-2xl rounded-tl-sm border border-cyan-500/20 text-xs font-mono text-cyan-100 max-w-xl">
                    <span className="text-[10px] text-cyan-400 block font-bold mb-0.5">OPERATIVE // VOICE DIRECTIVE</span>
                    "Give me today's briefing."
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500 text-black flex items-center justify-center text-[10px] font-hud font-black shadow-[0_0_12px_#00e5ff]">
                    J
                  </div>
                  <div className="glass-fusion px-5 py-3 rounded-2xl rounded-tl-sm border border-cyan-500/30 text-xs font-mono text-gray-200 max-w-2xl leading-relaxed">
                    <span className="text-[10px] text-cyan-300 block font-bold mb-1">J.A.R.V.I.S. // COGNITIVE RESPONSE</span>
                    Good afternoon, Operative. Radar sensors indicate 21°C clear atmospheric conditions in your coordinates. Global RSS feeds report breakthroughs in quantum neural architectures. You have 4 high-priority directives scheduled, and all 14 multi-tenant database clusters report 100% integrity. Telemetry cards loaded below for inspection:
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {[
                { id: 'briefing', label: 'ALL BRIEFING CARDS', icon: Layers },
                { id: 'weather', label: 'ATMOSPHERIC SENSORS', icon: CloudSun },
                { id: 'news', label: 'WORLD NEWS RSS', icon: Newspaper },
                { id: 'sports', label: 'SPORTS TELEMETRY', icon: Trophy },
                { id: 'tasks', label: 'MISSION DIRECTIVES', icon: CheckSquare }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeShowcaseTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveShowcaseTab(tab.id as any);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                        : 'glass-pill text-gray-300 hover:text-white hover:border-cyan-400/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(activeShowcaseTab === 'briefing' || activeShowcaseTab === 'weather') && (
                <div className="glass-fusion p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                    <span className="text-[10px] font-hud font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <CloudSun className="w-4 h-4 text-cyan-400" />
                      ATMOSPHERE
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400">OPEN-METEO</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-hud font-bold text-white">21°C</span>
                      <span className="block text-[10px] font-mono text-gray-400">Clear Skies // Optimal</span>
                    </div>
                    <div className="text-right text-[11px] font-mono text-gray-300 space-y-0.5">
                      <div>Wind: <span className="text-cyan-300">12 km/h</span></div>
                      <div>Humidity: <span className="text-cyan-300">48%</span></div>
                      <div>UV Index: <span className="text-emerald-300">Low</span></div>
                    </div>
                  </div>
                </div>
              )}

              {(activeShowcaseTab === 'briefing' || activeShowcaseTab === 'news') && (
                <div className="glass-fusion p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                    <span className="text-[10px] font-hud font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <Newspaper className="w-4 h-4 text-cyan-400" />
                      INTELLIGENCE WIRE
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400">6 CATEGORIES</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[9px] text-cyan-400 font-bold block uppercase">TECH & AI</span>
                      <p className="text-gray-200 text-[11px] truncate">Quantum photonic compute benchmarks exceed 100 TFLOPS...</p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[9px] text-purple-400 font-bold block uppercase">CYBER DEFENSE</span>
                      <p className="text-gray-200 text-[11px] truncate">Global cybersecurity guidelines standardize hardware keys...</p>
                    </div>
                  </div>
                </div>
              )}

              {(activeShowcaseTab === 'briefing' || activeShowcaseTab === 'sports') && (
                <div className="glass-fusion p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                    <span className="text-[10px] font-hud font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-cyan-400" />
                      SPORTS TELEMETRY
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400">MATCH RADAR</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-gray-300 text-[11px]">Formula 1 GP:</span>
                      <span className="text-emerald-300 font-bold text-[11px]">Pole: Lap 1:18.2</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-gray-300 text-[11px]">Champions League:</span>
                      <span className="text-cyan-300 font-bold text-[11px]">Matchday Active</span>
                    </div>
                  </div>
                </div>
              )}

              {(activeShowcaseTab === 'briefing' || activeShowcaseTab === 'tasks') && (
                <div className="glass-fusion p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                    <span className="text-[10px] font-hud font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ACTIVE DIRECTIVES
                    </span>
                    <span className="text-[9px] font-mono text-purple-400">4 PENDING</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="truncate">Deploy Cloud Run backend</span>
                      </div>
                      <span className="text-[9px] text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/30">URGENT</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="truncate">Review neural memories</span>
                      </div>
                      <span className="text-[9px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">HIGH</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI CAPABILITIES */}
      <section id="capabilities" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              TACTICAL CAPABILITIES MATRIX
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Engineered for Command
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Explore 12 specialized subsystems operating simultaneously inside the JARVIS command nexus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: 'AI Conversation',
                desc: 'Multi-turn conversational reasoning powered by Google Gemini 2.5 Flash with adaptive local heuristic fail-safe.',
                metric: 'GEMINI 2.5 CORE'
              },
              {
                icon: Mic,
                title: 'Voice Assistant',
                desc: 'Real-time browser speech recognition combined with neural speech synthesis and 3D acoustic waveform visualizers.',
                metric: 'WEB SPEECH API'
              },
              {
                icon: Search,
                title: 'Smart Search',
                desc: 'Targeted multi-vector dispatch aggregating verified technical and academic results across Google, YouTube, and arXiv.',
                metric: 'MULTI-VECTOR'
              },
              {
                icon: Layers,
                title: 'Daily Briefing',
                desc: 'Unified situational reports compiling weather radar, high-priority mission tasks, and categorized intelligence.',
                metric: 'AUTO COMPILED'
              },
              {
                icon: Newspaper,
                title: 'News Intelligence',
                desc: 'Prioritized live RSS feeds across 6 global categories: Top News, India, World, Tech, AI, Science, and Business.',
                metric: '6 RSS CATEGORIES'
              },
              {
                icon: Trophy,
                title: 'Sports Telemetry',
                desc: 'Live sports scorelines and telemetry feeds covering Formula 1, Premier League, Cricket, and Grand Slam Tennis.',
                metric: 'LIVE MATCH RADAR'
              },
              {
                icon: CloudSun,
                title: 'Atmospheric Weather',
                desc: 'Global meteorological telemetry fetched from Open-Meteo radar models without third-party API key dependencies.',
                metric: 'OPEN-METEO RADAR'
              },
              {
                icon: CheckSquare,
                title: 'Task Management',
                desc: 'Classify mission directives across LOW, MEDIUM, HIGH, and URGENT with natural language deadline parsing.',
                metric: 'CRUD & REMINDERS'
              },
              {
                icon: Database,
                title: 'Neural Memory',
                desc: 'Explicit user-controlled key-value memory banks allowing operatives to inspect, search, and permanently purge data.',
                metric: 'EXPLICIT PRIVACY'
              },
              {
                icon: RefreshCw,
                title: 'Workflow Automation',
                desc: 'Event-driven automated triggers and scheduled diagnostic health checks keeping your directives synchronized.',
                metric: 'AUTONOMOUS JOBS'
              },
              {
                icon: Globe2,
                title: 'Real-Time Translation',
                desc: 'Cross-language neural understanding across 30+ languages with streaming speech-to-speech comprehension.',
                metric: '30+ LANGUAGES'
              },
              {
                icon: Shield,
                title: 'Cybersecurity Matrix',
                desc: 'Real-time security auditing, brute-force mitigation, rate-limiting, and cryptographic user boundary enforcement.',
                metric: 'ARGON2 & JWT'
              }
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="glass-fusion p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      {cap.metric}
                    </span>
                  </div>
                  <h3 className="text-lg font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs font-mono text-gray-400 leading-relaxed">
                    {cap.desc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span className="text-gray-500">SUBSYSTEM {String(i + 1).padStart(2, '0')}</span>
                    <span className="group-hover:translate-x-1 transition-transform">OPERATIONAL →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. AI WORKFLOW & ARCHITECTURE */}
      <section className="py-20 relative border-t border-white/5 bg-[#030712]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              QUANTUM PIPELINE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-hud font-bold text-white mt-4 uppercase">
              How JARVIS Processes Directives
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-mono text-gray-400">
              End-to-end telemetry pipeline from sensory input to neural synthesis and secure relational confinement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Sensory Ingestion',
                desc: 'Captures voice audio, text prompts, Open-Meteo atmospheric radar, and live news RSS feeds simultaneously.',
                tag: 'INPUT GRIDS'
              },
              {
                step: '02',
                title: 'Quantum Gateway',
                desc: 'FastAPI microservices perform JWT authentication, input sanitization, and cryptographic identity validation.',
                tag: 'FASTAPI CORE'
              },
              {
                step: '03',
                title: 'Neural Synthesis',
                desc: 'Dispatches queries to Google Gemini 2.5 Flash with instant fallback to resilient local heuristic logic.',
                tag: 'GEMINI AI'
              },
              {
                step: '04',
                title: 'Data Confinement',
                desc: 'Stores directives, sessions, and memory in strictly isolated relational schemas with multi-tenant isolation.',
                tag: 'POSTGRESQL / SQLITE'
              }
            ].map((p, idx) => (
              <div key={idx} className="glass-fusion p-5 rounded-2xl border border-white/10 relative">
                <div className="text-2xl font-hud font-black text-cyan-500/40 mb-2">
                  {p.step}
                </div>
                <h4 className="text-sm font-hud font-bold text-white mb-1.5">{p.title}</h4>
                <p className="text-xs font-mono text-gray-400 leading-relaxed">{p.desc}</p>
                <div className="mt-4 pt-2 border-t border-white/5 text-[9px] font-mono text-cyan-400">
                  {p.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRUST & CYBERSECURITY */}
      <section id="security" className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-emerald-500/30">
              ZERO-TRUST ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Intelligence you can trust.
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Every interaction, token, and memory record is strictly confined to your authenticated identity with verified cryptographic isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Secure Authentication',
                desc: 'Argon2 & salted Bcrypt password hashing combined with mandatory 6-digit SHA-256 OTP verification for every operative.',
                badge: 'OTP & BCRYPT'
              },
              {
                title: 'Encrypted Communication',
                desc: 'Strict TLS 1.3 encryption across all REST requests and WebSocket streams with defensive CORS origin locking.',
                badge: 'TLS 1.3 / HTTPS'
              },
              {
                title: 'Private Memory Banks',
                desc: 'Explicit user-controlled memory parameter storage. You can inspect, modify, or permanently purge any key at any time.',
                badge: 'EXPLICIT DATA'
              },
              {
                title: 'Protected Sessions',
                desc: 'Cryptographically signed HS256 JWT tokens with automatic timeout, device telemetry fingerprinting, and invalidation.',
                badge: 'HS256 JWT'
              },
              {
                title: 'API & Rate Security',
                desc: 'Multi-layer rate limiting, IP tracking, and defensive sanitization protecting against SQL injection and command poisoning.',
                badge: 'BRUTE-FORCE SHIELD'
              },
              {
                title: 'User Data Isolation',
                desc: 'Multi-tenant database schema guarantees Operative A can never read or modify records belonging to Operative B.',
                badge: 'PYTEST VERIFIED'
              }
            ].map((sec, idx) => (
              <div key={idx} className="glass-fusion p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
                    {sec.badge}
                  </span>
                </div>
                <h3 className="text-base font-hud font-bold text-white">{sec.title}</h3>
                <p className="mt-2 text-xs font-mono text-gray-400 leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. JARVIS DASHBOARD PREVIEW */}
      <section id="dashboard-preview" className="py-24 relative border-t border-white/5 bg-[#030614]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              AUTHENTIC COCKPIT INTERFACE
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              The Operative Cockpit
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Inspect the real logged-in JARVIS interface. Experience the unified layout designed for maximum operational efficiency.
            </p>
          </div>

          <div className="glass-fusion rounded-3xl border border-cyan-500/30 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
            <div className="px-5 py-3 bg-[#030712] border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-gray-400 text-[11px]">JARVIS OS // OPERATIVE COCKPIT [ACTIVE CONSOLE]</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">UTC: {currentTime || 'SYNCING...'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              <div className="lg:col-span-2 p-4 border-r border-white/10 bg-[#02050f]/80 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-500 px-3 uppercase tracking-widest block mb-2">NAVIGATION</span>
                  {[
                    { id: 'chat', label: 'AI Assistant', icon: Bot },
                    { id: 'telemetry', label: 'Telemetry', icon: Activity },
                    { id: 'tasks', label: 'Directives', icon: CheckSquare },
                    { id: 'security', label: 'Security Grid', icon: Shield }
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = dashboardPreviewTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          setDashboardPreviewTab(item.id as any);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-all text-left ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-gray-400 space-y-1">
                  <div>USER: <span className="text-cyan-300 font-bold">OPERATIVE-01</span></div>
                  <div>ROLE: <span className="text-purple-300">COMMANDER</span></div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-black/40">
                {dashboardPreviewTab === 'chat' && (
                  <div className="flex flex-col h-full justify-between space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                      <span className="text-cyan-300 font-bold flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        MISSION CHAT STREAM // GEMINI 2.5 FLASH
                      </span>
                      <span className="text-[10px] text-emerald-400">ENCRYPTED</span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      <div className="glass-pill p-3 rounded-xl border border-white/10 text-xs font-mono">
                        <span className="text-[10px] text-cyan-400 block font-bold">USER // 14:32</span>
                        "Synthesize telemetry for today's mission briefing and report any security alerts."
                      </div>
                      <div className="glass-fusion p-4 rounded-xl border border-cyan-500/30 text-xs font-mono text-gray-200">
                        <span className="text-[10px] text-cyan-300 block font-bold mb-1">JARVIS // 14:32</span>
                        Telemetry synthesized. Zero anomalous intrusion signatures detected across all 14 multi-tenant models. 4 mission directives queued. Open-Meteo reports nominal atmospheric clarity. Ready for instruction.
                      </div>
                    </div>

                    <div className="glass-pill p-2 rounded-xl border border-white/10 flex items-center gap-2">
                      <input
                        type="text"
                        disabled
                        value="Directives armed. Stand by for command..."
                        className="bg-transparent text-xs font-mono text-gray-400 px-3 py-1 flex-1 outline-none"
                      />
                      <button
                        onClick={() => navigate('/chat')}
                        className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-hud font-bold uppercase hover:bg-cyan-400 transition-colors"
                      >
                        OPEN CHAT
                      </button>
                    </div>
                  </div>
                )}

                {dashboardPreviewTab === 'telemetry' && (
                  <div className="space-y-4">
                    <div className="text-xs font-hud font-bold text-cyan-300 pb-2 border-b border-white/10">
                      LIVE SERVER & HARDWARE TELEMETRY
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl glass-pill">
                        <span className="text-[10px] text-gray-400 block">CPU LOAD</span>
                        <span className="text-xl font-hud font-bold text-white">12.4%</span>
                      </div>
                      <div className="p-3 rounded-xl glass-pill">
                        <span className="text-[10px] text-gray-400 block">RAM ALLOCATION</span>
                        <span className="text-xl font-hud font-bold text-cyan-300">412 MB</span>
                      </div>
                      <div className="p-3 rounded-xl glass-pill">
                        <span className="text-[10px] text-gray-400 block">SQL QUERY LATENCY</span>
                        <span className="text-xl font-hud font-bold text-emerald-300">8.2 ms</span>
                      </div>
                      <div className="p-3 rounded-xl glass-pill">
                        <span className="text-[10px] text-gray-400 block">UPTIME METRIC</span>
                        <span className="text-xl font-hud font-bold text-purple-300">99.98%</span>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardPreviewTab === 'tasks' && (
                  <div className="space-y-3">
                    <div className="text-xs font-hud font-bold text-cyan-300 pb-2 border-b border-white/10">
                      ACTIVE MISSION DIRECTIVES
                    </div>
                    {[
                      { title: 'Verify Google Cloud Run health probe', priority: 'URGENT' },
                      { title: 'Deploy Firebase Hosting frontend', priority: 'HIGH' },
                      { title: 'Synchronize Open-Meteo weather radar', priority: 'MEDIUM' }
                    ].map((t, i) => (
                      <div key={i} className="glass-pill p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-200">{t.title}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          t.priority === 'URGENT' ? 'bg-red-950/80 text-red-300 border border-red-500/40' : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {dashboardPreviewTab === 'security' && (
                  <div className="space-y-3">
                    <div className="text-xs font-hud font-bold text-emerald-300 pb-2 border-b border-white/10">
                      SECURITY & AUDIT LOGS
                    </div>
                    {[
                      { time: '14:31:02', event: 'MFA OTP Verification SUCCESS', ip: '127.0.0.1' },
                      { time: '14:28:15', event: 'Session Token Issued (HS256)', ip: '127.0.0.1' },
                      { time: '14:25:40', event: 'Database Connection Pool Verified', ip: 'INTERNAL' }
                    ].map((log, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono flex items-center justify-between">
                        <span className="text-gray-400">{log.time}</span>
                        <span className="text-emerald-300 font-bold">{log.event}</span>
                        <span className="text-gray-500">{log.ip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 p-5 border-l border-white/10 bg-[#02050f]/80 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-hud font-bold text-cyan-300 mb-3 uppercase tracking-widest">
                    SYSTEM STATUS HUD
                  </div>
                  <div className="w-full h-36 flex items-center justify-center">
                    <AICore state="IDLE" size="100%" interactive={false} />
                  </div>
                  <div className="mt-4 space-y-2 text-[10px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>CORE MODE:</span>
                      <span className="text-cyan-300">LIVE DUAL ENGINE</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>VOICE SYNTHESIS:</span>
                      <span className="text-emerald-300">ARMED</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>ACTIVE MODELS:</span>
                      <span className="text-indigo-300">14 SCHEMAS</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/dashboard');
                  }}
                  className="w-full mt-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-hud font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
                >
                  ENTER COCKPIT →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING & SUBSCRIPTION PLANS */}
      <section id="pricing" className="py-24 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              OPERATIVE CLEARANCE TIERS
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Transparent Access
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Choose the operational tier matched to your intelligence needs. All tiers feature strict data confinement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-fusion p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase block">TIER 01 // CIV</span>
                <h3 className="text-2xl font-hud font-bold text-white mt-1">Explorer</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-hud font-black text-white">$0</span>
                  <span className="text-xs font-mono text-gray-400">/ forever</span>
                </div>
                <p className="mt-3 text-xs font-mono text-gray-400">
                  Ideal for personal intelligence and essential conversational assistance.
                </p>
                <div className="mt-6 space-y-2.5 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Gemini AI Core Conversation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Real-Time Weather Radar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Global RSS News Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>50 Directives & Basic Memory</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  navigate('/register');
                }}
                className="mt-8 w-full py-3 rounded-full glass-pill border border-white/10 hover:border-cyan-400/40 text-xs font-hud font-bold tracking-wider uppercase text-gray-200 hover:text-white transition-all cursor-pointer"
              >
                START FREE
              </button>
            </div>

            <div className="glass-fusion-cyan p-6 sm:p-8 rounded-3xl border border-cyan-400/40 flex flex-col justify-between relative shadow-[0_0_40px_rgba(0,229,255,0.2)]">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-hud font-black tracking-widest uppercase">
                RECOMMENDED
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-300 tracking-widest uppercase block">TIER 02 // TACTICAL</span>
                <h3 className="text-2xl font-hud font-bold text-white mt-1">Commander Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-hud font-black text-cyan-300">$29</span>
                  <span className="text-xs font-mono text-gray-400">/ month</span>
                </div>
                <p className="mt-3 text-xs font-mono text-gray-300">
                  Full command capabilities with unlimited voice synthesis and deep memory.
                </p>
                <div className="mt-6 space-y-2.5 text-xs font-mono text-gray-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Unlimited Gemini 2.5 Inference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Neural Speech Synthesis & STT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Unlimited Tasks & Neural Memory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Sports Telemetry & Web Intelligence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Priority Telemetry Gateway</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  navigate('/register');
                }}
                className="mt-8 w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 text-black text-xs font-hud font-black tracking-wider uppercase shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all cursor-pointer"
              >
                ENROLL COMMANDER
              </button>
            </div>

            <div className="glass-fusion p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase block">TIER 03 // DEFENSE</span>
                <h3 className="text-2xl font-hud font-bold text-white mt-1">Enterprise Nexus</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-hud font-black text-white">$99</span>
                  <span className="text-xs font-mono text-gray-400">/ month</span>
                </div>
                <p className="mt-3 text-xs font-mono text-gray-400">
                  Dedicated high-assurance infrastructure with custom models and RBAC governance.
                </p>
                <div className="mt-6 space-y-2.5 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Dedicated Cloud Run Instances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Custom LLM Fine-Tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Role-Based Multi-Admin RBAC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Hardware Security Key Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  navigate('/register');
                }}
                className="mt-8 w-full py-3 rounded-full glass-pill border border-white/10 hover:border-purple-400/40 text-xs font-hud font-bold tracking-wider uppercase text-gray-200 hover:text-white transition-all cursor-pointer"
              >
                CONTACT DEFENSE DESK
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TACTICAL GLASS FAQ ACCORDION */}
      <section id="faq" className="py-24 relative border-t border-white/5 bg-[#030612]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              System Directives & FAQ
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Answers regarding architecture, data privacy, voice integration, and operational safety.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="glass-fusion rounded-2xl border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveFaq(isOpen ? null : index);
                    }}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-sm font-hud font-bold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs font-mono text-gray-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-28 relative border-t border-white/5 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.15)_0%,rgba(100,50,255,0.06)_50%,transparent_70%)] pointer-events-none blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6">
            <AICore state="IDLE" size="100%" interactive={false} />
          </div>

          <h2 className="text-4xl sm:text-6xl font-hud font-black text-white uppercase drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">
            "Your digital intelligence is ready."
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm font-mono text-gray-400">
            Deploy your personal JARVIS command center. Gain immediate access to conversational AI, speech synthesis, live sensory telemetry, and autonomous directives.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                sound.playClick();
                navigate('/dashboard');
              }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-black font-hud font-black text-sm tracking-widest uppercase flex items-center gap-3 shadow-[0_0_35px_rgba(0,229,255,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              <span>Launch JARVIS</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. ENTERPRISE FOOTER */}
      <footer className="py-14 border-t border-white/10 bg-[#01030a] text-xs font-mono text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <span className="font-hud font-black text-base text-white tracking-wider">JARVIS AI</span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Autonomous personal AI operating system inspired by advanced holographic interfaces. Engineered with high-assurance security, live telemetry, and speech synthesis.
              </p>
              <div className="mt-4 text-[11px] text-gray-500">
                © {new Date().getFullYear()} J.A.R.V.I.S. Operating System. All rights reserved.
              </div>
            </div>

            <div>
              <span className="font-hud font-bold text-white uppercase tracking-wider block mb-3 text-xs">Product</span>
              <ul className="space-y-2">
                <li><a href="#hero" className="hover:text-cyan-300 transition-colors">Overview</a></li>
                <li><a href="#capabilities" className="hover:text-cyan-300 transition-colors">Capabilities</a></li>
                <li><a href="#showcase" className="hover:text-cyan-300 transition-colors">Live Intelligence</a></li>
                <li><a href="#dashboard-preview" className="hover:text-cyan-300 transition-colors">Dashboard Cockpit</a></li>
              </ul>
            </div>

            <div>
              <span className="font-hud font-bold text-white uppercase tracking-wider block mb-3 text-xs">Security & Trust</span>
              <ul className="space-y-2">
                <li><a href="#security" className="hover:text-cyan-300 transition-colors">Zero-Trust Matrix</a></li>
                <li><a href="#security" className="hover:text-cyan-300 transition-colors">Data Confinement</a></li>
                <li><a href="#security" className="hover:text-cyan-300 transition-colors">OTP Verification</a></li>
                <li><a href="/login" className="hover:text-cyan-300 transition-colors">Operative Clearance</a></li>
              </ul>
            </div>

            <div>
              <span className="font-hud font-bold text-white uppercase tracking-wider block mb-3 text-xs">Resources</span>
              <ul className="space-y-2">
                <li><a href="https://github.com/anangipavan362-dotcom/JARVIS-AI" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors flex items-center gap-1">GitHub Repo <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="/docs" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors flex items-center gap-1">API Docs (Swagger) <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="#faq" className="hover:text-cyan-300 transition-colors">Documentation & FAQ</a></li>
                <li><a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing Plans</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div>
              CLOUD ENGINE: <span className="text-cyan-400">FASTAPI // GOOGLE CLOUD RUN</span> | FRONTEND: <span className="text-yellow-400">FIREBASE HOSTING</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
