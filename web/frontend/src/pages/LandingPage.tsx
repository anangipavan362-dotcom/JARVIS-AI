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
  X,
  Send,
  Star,
  Quote,
  GitBranch,
  Mail,
  MapPin,
  Award,
  Users,
  Check
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
  const [promptTab, setPromptTab] = useState<'chat' | 'workflow' | 'analysis' | 'sensors'>('chat');
  const [promptInput, setPromptInput] = useState("Hey JARVIS, run diagnostic on orbital sensors and prepare daily situation briefing");
  const [isPromptExecuting, setIsPromptExecuting] = useState(false);
  const [promptExecuted, setPromptExecuted] = useState(true);
  const [featureTab, setFeatureTab] = useState<'workflow' | 'analytics' | 'integration'>('workflow');
  const [bentoActiveAction, setBentoActiveAction] = useState<'radar' | 'arxiv' | 'vectors' | 'security'>('radar');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('Autonomous Directive');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    sound.playProcessing();
    setTimeout(() => {
      setContactSubmitted(true);
      sound.playAccessGranted();
    }, 600);
  };

  const handleExecutePrompt = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!promptInput.trim() || isPromptExecuting) return;
    setIsPromptExecuting(true);
    sound.playProcessing();
    setTimeout(() => {
      setIsPromptExecuting(false);
      setPromptExecuted(true);
      sound.playAccessGranted();
    }, 700);
  };

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
                JARVIS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[9px] font-mono text-cyan-400/80 tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                AGENCY // V2.5
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-gray-300">
            <a href="#services" className="hover:text-cyan-300 transition-colors">SERVICES</a>
            <a href="#showcase" className="hover:text-cyan-300 transition-colors">SHOWCASE</a>
            <a href="#process" className="hover:text-cyan-300 transition-colors">PROCESS</a>
            <a href="#agents" className="hover:text-cyan-300 transition-colors">AGENTS</a>
            <a href="#pricing" className="hover:text-cyan-300 transition-colors">PRICING</a>
            <a href="#contact" className="hover:text-cyan-300 transition-colors">CONTACT</a>
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
            <a
              href="#contact"
              onClick={() => sound.playClick()}
              className="px-4 py-1.5 rounded-full text-xs font-hud font-black tracking-wider text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>LET'S TALK!</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </a>
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
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Services (/01)
              </a>
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Showcase (/02)
              </a>
              <a
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Process (/03)
              </a>
              <a
                href="#agents"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Core Agents (/04)
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Pricing Plans
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors"
              >
                Let's Talk!
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="p-3 rounded-xl glass-pill hover:bg-cyan-500/10 text-gray-200 hover:text-cyan-300 transition-colors text-left cursor-pointer col-span-2"
              >
                Sign In
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>© WE BUILD AUTONOMOUS INTELLIGENCE WITH INTENTION, CLARITY AND CARE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-hud font-black tracking-tight text-white uppercase drop-shadow-[0_0_40px_rgba(0,229,255,0.3)]">
            Create, <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-6xl sm:text-8xl lg:text-9xl">Impactful</span> Intelligence.
          </h1>

          <p className="mt-4 text-base sm:text-xl font-hud tracking-wide text-cyan-200/90 font-medium">
            "We craft autonomous digital systems that perform exceptionally."
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
            Experience an autonomous neural operating system fusing conversational speech, global live sensory feeds, prioritized task directives, and military-grade user data isolation into one cohesive command surface.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                navigate('/dashboard');
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-black font-hud font-black text-sm tracking-widest uppercase flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.65)] hover:scale-105 transition-all cursor-pointer"
            >
              <span>Launch Cockpit</span>
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
              href="#services"
              onClick={() => sound.playClick()}
              className="px-6 py-3.5 rounded-full glass-fusion border border-white/10 hover:border-cyan-400/40 text-gray-300 hover:text-white font-hud font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 hover:bg-white/[0.05]"
            >
              <span>Explore Services</span>
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

        {/* FUSION AI SIGNATURE: INTERACTIVE WORKSPACE MOCKUP & PROMPT CONSOLE */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-8 sm:mt-10">
          <div className="glass-fusion rounded-3xl p-5 sm:p-7 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-2xl">
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-1/4 w-96 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                  <Zap className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-[11px] font-mono font-bold text-cyan-200">GEMINI 2.5 FLASH // QUANTUM CORE</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Autonomous Agent Active
                </span>
              </div>

              {/* Action Tabs inspired by Fusion AI */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'chat', label: 'Chat', icon: Bot },
                  { id: 'workflow', label: 'Launch Directive', icon: GitBranch },
                  { id: 'analysis', label: 'Data Analysis', icon: Activity },
                  { id: 'sensors', label: 'Sensory Radar', icon: CloudSun },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = promptTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setPromptTab(tab.id as any);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                          : 'glass-pill text-gray-300 hover:text-white hover:border-cyan-400/30'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Input & Execution Bar */}
            <div className="mt-5">
              <form onSubmit={handleExecutePrompt} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-2xl bg-black/60 border border-cyan-500/30 shadow-inner">
                <div className="flex-1 flex items-center gap-3 px-3 py-1">
                  <Bot className="w-5 h-5 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Ask JARVIS to automate workflows, analyze telemetry, or query sensors..."
                    className="w-full bg-transparent text-xs sm:text-sm font-mono text-cyan-100 placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handlePlayVoicePreview}
                    className="p-2.5 rounded-full glass-fusion border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors"
                    title="Voice Input Simulation"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={isPromptExecuting}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-hud font-black text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isPromptExecuting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>EXECUTING...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Simulated Execution Response Output */}
            {promptExecuted && (
              <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#040916]/80 border border-cyan-500/20 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-cyan-300 font-bold">SYNTHESIZED MISSION DIRECTIVE // RESULTS READY</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">EXECUTION: 18ms // DUAL-ENGINE GEMINI</span>
                </div>

                {/* 3 Step Action Pill Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-300 font-bold">✓</div>
                    <div className="truncate">
                      <span className="text-gray-400 block text-[9px]">ATMOSPHERIC RADAR</span>
                      <span className="text-cyan-200 text-[11px] font-bold">21°C // Nominal</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-300 font-bold">✓</div>
                    <div className="truncate">
                      <span className="text-gray-400 block text-[9px]">GLOBAL RSS NEWS</span>
                      <span className="text-cyan-200 text-[11px] font-bold">6 Streams Indexed</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-300 font-bold">✓</div>
                    <div className="truncate">
                      <span className="text-gray-400 block text-[9px]">RELATIONAL SECURITY</span>
                      <span className="text-emerald-300 text-[11px] font-bold">14 Schemas Validated</span>
                    </div>
                  </div>
                </div>

                {/* Assistant Output Speech Bubble */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-mono text-gray-200 leading-relaxed">
                    <span className="text-[10px] text-cyan-300 font-bold block mb-0.5">J.A.R.V.I.S. VOCAL RESPONSE:</span>
                    "Good afternoon, Operative. All orbital and terrestrial telemetry streams have been consolidated into your daily mission briefing. Subsystems are operating at peak fidelity. What directives shall we initiate?"
                  </div>
                  <button
                    type="button"
                    onClick={handlePlayVoicePreview}
                    className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 hover:border-cyan-300 text-xs font-hud text-cyan-300 hover:text-white flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)] shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isAudioPlaying ? 'STOP VOICE' : 'TAP TO HEAR JARVIS'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Agenciy Stats Ribbon */}
          <div className="mt-12 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-white/10 py-8 px-4 text-center sm:text-left">
            <div>
              <div className="text-3xl sm:text-5xl font-hud font-black text-white">100+</div>
              <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">Missions Launched</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-hud font-black text-cyan-300">5+</div>
              <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">Neural Clusters</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-hud font-black text-white">25+</div>
              <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">Sensory Schemas</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-hud font-black text-emerald-400">99.98%</div>
              <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">Zero-Trust Uptime</div>
            </div>
          </div>

          {/* Social Proof Ticker */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
              Trusted by 150,000+ operatives, engineers & teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-60 text-xs font-hud font-bold text-gray-300 tracking-wider">
              <span className="hover:text-cyan-300 hover:opacity-100 transition-colors">GOOGLE CLOUD RUN</span>
              <span className="hover:text-cyan-300 hover:opacity-100 transition-colors">OPEN-METEO RADAR</span>
              <span className="hover:text-cyan-300 hover:opacity-100 transition-colors">FASTAPI CORE</span>
              <span className="hover:text-cyan-300 hover:opacity-100 transition-colors">FIREBASE HOSTING</span>
              <span className="hover:text-cyan-300 hover:opacity-100 transition-colors">ARXIV INTELLIGENCE</span>
              <span className="hover:text-cyan-300 hover:opacity-100 transition-colors">POSTGRESQL // SQLITE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO // TACTICAL SERVICES (AGENCY /01 - /04) */}
      <section id="services" className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
                (01) // WHAT WE DO
              </span>
              <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
                Our Core <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-4xl sm:text-6xl">Intelligence</span> Services
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
              We craft autonomous digital systems from concept to live deployment — blending neural reasoning, sensory telemetry, and real-time speech into one cohesive command cockpit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                index: '/01',
                title: 'Neural Cognition & Reasoning',
                tag: 'COGNITIVE ENGINE',
                desc: 'Multi-turn conversational reasoning powered by Google Gemini 2.5 Flash with streaming responses, code execution, and adaptive local heuristic fail-safe.',
                features: ['Gemini 2.5 Flash Proxy', 'Context Retention', 'Instant Heuristic Fallback'],
                icon: Bot
              },
              {
                index: '/02',
                title: 'Sensory Telemetry & Radar',
                tag: 'ATMOSPHERIC & NEWS WIRE',
                desc: 'Real-time meteorological forecasts from Open-Meteo radar models, live RSS news feeds across 6 global channels, and Formula 1 / Champions League telemetry.',
                features: ['Open-Meteo Radar (0 Keys)', '6 Global RSS Categories', 'Sports Scoreline Radar'],
                icon: CloudSun
              },
              {
                index: '/03',
                title: 'Acoustic Vocoder & Speech',
                tag: 'SPEECH SYNTHESIS & STT',
                desc: 'High-fidelity browser speech-to-text paired with neural speech synthesis and responsive 3D acoustic waveform visualizers for hands-free operations.',
                features: ['Web Speech Recognition', 'Neural Voice Synthesis', '3D Acoustic Spectrum'],
                icon: Mic
              },
              {
                index: '/04',
                title: 'Mission Directives & Deep Memory',
                tag: 'PERSISTENCE & SECURITY',
                desc: 'Classify mission directives across LOW, MEDIUM, HIGH, and URGENT with explicit user-controlled key-value memory banks backed by Argon2 cryptographic hashing.',
                features: ['Priority Directives CRUD', 'Explicit Private Memory', 'Argon2 & SHA-256 OTP'],
                icon: Database
              }
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="glass-fusion p-8 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-hud font-black text-2xl text-cyan-500/40 group-hover:text-cyan-300 transition-colors">
                        {srv.index}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block mb-1">
                      {srv.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {srv.features.map((f, i) => (
                        <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                          {f}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        navigate('/dashboard');
                      }}
                      className="text-xs font-hud font-bold text-cyan-300 group-hover:translate-x-1 transition-transform flex items-center gap-1 cursor-pointer"
                    >
                      <span>DEPLOY</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SHOWCASES & WORKFORCE */}
      <section id="showcase" className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              (02) // FEATURED SHOWCASES
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Build, scale and manage entire AI workforce
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              One unified platform to orchestrate AI agents, analyze sensory streams, and automate complex workflows with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Card 1 (Span 7): Instant, One-Command Actions */}
            <div className="lg:col-span-7 glass-fusion rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    INSTANT DISPATCH
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Instant, One-Command Actions
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                  Deploy multi-modal AI agents capable of executing live web searches, real-time weather diagnostics, arXiv paper extractions, and mission tasks in milliseconds.
                </p>
              </div>

              {/* Interactive Action Trigger Deck inside Card 1 */}
              <div className="mt-6 p-4 rounded-2xl bg-[#030712]/80 border border-white/10 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'radar', label: '⚡ Atmospheric Radar', metric: '42ms' },
                    { id: 'arxiv', label: '📄 arXiv Paper Feed', metric: '340ms' },
                    { id: 'vectors', label: '🌐 Multi-Vector Search', metric: '180ms' },
                    { id: 'security', label: '🔒 Zero-Trust Audit', metric: '<1ms' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        sound.playClick();
                        setBentoActiveAction(act.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                        bentoActiveAction === act.id
                          ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                          : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{act.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${bentoActiveAction === act.id ? 'bg-black/20 text-black' : 'bg-black/40 text-cyan-400'}`}>
                        {act.metric}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/20 text-xs font-mono">
                  {bentoActiveAction === 'radar' && (
                    <div className="text-gray-300 space-y-1">
                      <div className="text-cyan-400 font-bold text-[11px] flex justify-between">
                        <span>OPEN-METEO // TELEMETRY PASS</span>
                        <span className="text-emerald-400">STATUS: 200 OK</span>
                      </div>
                      <p className="text-[11px] text-gray-300">Surface temp: 21°C | Atmospheric pressure: 1014 hPa | Wind: 12 km/h WNW | Precipitation probability: 0%.</p>
                    </div>
                  )}
                  {bentoActiveAction === 'arxiv' && (
                    <div className="text-gray-300 space-y-1">
                      <div className="text-cyan-400 font-bold text-[11px] flex justify-between">
                        <span>ARXIV INTELLIGENCE // RECENT RELEASES</span>
                        <span className="text-purple-400">PAPERS INDEXED: 14</span>
                      </div>
                      <p className="text-[11px] text-gray-300">[cs.AI:2410.0194] "Autonomous Quantum Reasoning via Speculative Decoding In Sub-10ms Latencies"</p>
                    </div>
                  )}
                  {bentoActiveAction === 'vectors' && (
                    <div className="text-gray-300 space-y-1">
                      <div className="text-cyan-400 font-bold text-[11px] flex justify-between">
                        <span>MULTI-VECTOR SEARCH // AGGREGATOR</span>
                        <span className="text-yellow-400">3 DESTINATIONS</span>
                      </div>
                      <p className="text-[11px] text-gray-300">Parallel query sent to Google Scholar, YouTube Tech, and DuckDuckGo news cluster.</p>
                    </div>
                  )}
                  {bentoActiveAction === 'security' && (
                    <div className="text-gray-300 space-y-1">
                      <div className="text-cyan-400 font-bold text-[11px] flex justify-between">
                        <span>ZERO-TRUST AUDIT // CRYPTO SHIELD</span>
                        <span className="text-emerald-400">PASSED 100%</span>
                      </div>
                      <p className="text-[11px] text-gray-300">Bcrypt/Argon2 verification intact. 14 schema tables verified with tenant isolation active.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2 (Span 5): No-Code Workflow Builder */}
            <div className="lg:col-span-5 glass-fusion rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-400/40 flex items-center justify-center text-purple-300">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    VISUAL FLOW
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                  No-Code Workflow Builder
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                  Chain autonomous sensory pipelines together with intuitive natural language triggers. Schedule automated sweeps and proactive notifications.
                </p>
              </div>

              {/* Node diagram mockup */}
              <div className="mt-6 p-4 rounded-2xl bg-[#030712]/80 border border-white/10 space-y-2.5 font-mono text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-bold text-[11px]">TRIGGER:</span>
                  <span className="text-gray-300 truncate">Daily 07:00 UTC Chrono Sweeper</span>
                </div>
                <div className="flex justify-center -my-1 text-cyan-500/50">↓</div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="font-bold text-[11px]">FILTER:</span>
                  <span className="text-gray-300 truncate">Open-Meteo & RSS Priority Feeds</span>
                </div>
                <div className="flex justify-center -my-1 text-purple-500/50">↓</div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-[11px]">DISPATCH:</span>
                  <span className="text-gray-300 truncate">Vocal Briefing & Task Directives</span>
                </div>
              </div>
            </div>

            {/* Card 3 (Span 5): Natural-Language Interaction */}
            <div className="lg:col-span-5 glass-fusion rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    SPEECH & CHAT
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Natural-Language Interaction
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                  Talk or type directly with zero prompt engineering required. Powered by Google Gemini 2.5 Flash and Web Speech synthesis for human-like reasoning.
                </p>
              </div>

              {/* Voice waveform & audio controls */}
              <div className="mt-6 p-4 rounded-2xl bg-[#030712]/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-cyan-400" />
                    ACOUSTIC VOCODER
                  </span>
                  <button
                    onClick={handlePlayVoicePreview}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20 text-[10px] font-mono transition-colors"
                  >
                    {isAudioPlaying ? 'STOP AUDIO' : 'PLAY AUDIO'}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 h-10 px-2 bg-black/40 rounded-xl border border-white/5">
                  {[40, 75, 95, 30, 85, 60, 100, 45, 80, 50, 90, 35, 70, 85, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isAudioPlaying ? `${h}%` : '20%' }}
                      className="w-1 bg-gradient-to-t from-cyan-500 to-indigo-400 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>
                <p className="text-[11px] font-mono text-gray-400 text-center">
                  "Good afternoon, Operative. All 14 subsystems stand ready."
                </p>
              </div>
            </div>

            {/* Card 4 (Span 7): Multi-Channel Sensory Automation */}
            <div className="lg:col-span-7 glass-fusion rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    4 LIVE FEEDS
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Multi-Channel Sensory Automation
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                  Ingest live Open-Meteo atmospheric radar, 6 categories of global RSS news intelligence, sports scorelines, and system telemetry simultaneously.
                </p>
              </div>

              {/* 4 Mini Telemetry Panels */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#030712]/80 border border-white/10">
                  <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 mb-1">
                    <CloudSun className="w-3 h-3" /> WEATHER
                  </div>
                  <div className="text-lg font-hud font-bold text-white">21°C</div>
                  <div className="text-[10px] font-mono text-gray-400 truncate">Clear Skies</div>
                </div>

                <div className="p-3 rounded-xl bg-[#030712]/80 border border-white/10">
                  <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1 mb-1">
                    <Newspaper className="w-3 h-3" /> NEWS WIRE
                  </div>
                  <div className="text-lg font-hud font-bold text-white">6 FEEDS</div>
                  <div className="text-[10px] font-mono text-gray-400 truncate">Tech, AI & World</div>
                </div>

                <div className="p-3 rounded-xl bg-[#030712]/80 border border-white/10">
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mb-1">
                    <Trophy className="w-3 h-3" /> SPORTS
                  </div>
                  <div className="text-lg font-hud font-bold text-white">F1 & CL</div>
                  <div className="text-[10px] font-mono text-gray-400 truncate">Live Telemetry</div>
                </div>

                <div className="p-3 rounded-xl bg-[#030712]/80 border border-white/10">
                  <div className="text-[10px] font-mono text-yellow-400 flex items-center gap-1 mb-1">
                    <CheckSquare className="w-3 h-3" /> TASKS
                  </div>
                  <div className="text-lg font-hud font-bold text-white">4 QUEUED</div>
                  <div className="text-[10px] font-mono text-gray-400 truncate">High Priority</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT FEATURES DEEP DIVE - FUSION AI TABBED SHOWCASE */}
      <section id="features-tabs" className="py-24 relative border-t border-white/5 bg-[#020512]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              DEEP DIVE PRODUCT SUITE
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Build workflows, track insights, connect tools
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Switch between core operating modalities to inspect JARVIS autonomous agents, telemetry intelligence, and tool orchestration.
            </p>

            {/* 3 Tabs Switcher */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl glass-pill border border-cyan-500/30 gap-2">
              {[
                { id: 'workflow', label: 'Autonomous Workflows', icon: RefreshCw },
                { id: 'analytics', label: 'Real-Time Telemetry', icon: Activity },
                { id: 'integration', label: 'Universal Integrations', icon: Share2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = featureTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setFeatureTab(tab.id as any);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="glass-fusion rounded-3xl p-6 sm:p-10 border border-cyan-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {featureTab === 'workflow' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    MODULE 01 // AUTONOMOUS WORKFLOWS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-hud font-bold text-white">
                    Orchestrate End-to-End Autonomous Directives
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                    Set up multi-step autonomous pipelines without writing code. JARVIS ingests external sensory stimuli, evaluates conditional criteria, and triggers actions across databases, APIs, and voice synthesis.
                  </p>
                  <ul className="space-y-2.5 text-xs font-mono text-gray-300 pt-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Natural language trigger configuration</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Scheduled cron and atmospheric event triggers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Sub-50ms execution on Google Cloud Run</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-hud font-bold uppercase transition-all flex items-center gap-2"
                  >
                    <span>CONFIGURE PIPELINE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#030712] rounded-2xl p-5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                    <span className="text-cyan-300 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      PIPELINE RUNNER // "MORNING BRIEFING SWEEP"
                    </span>
                    <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px]">
                      COMPLETED (380ms)
                    </span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold">STEP 1</span>
                        <span className="text-gray-300">Open-Meteo Radar Polling</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px]">21°C CLEAR (42ms)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold">STEP 2</span>
                        <span className="text-gray-300">RSS Wire Synthesis (6 Feeds)</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px]">18 STORIES (112ms)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold">STEP 3</span>
                        <span className="text-gray-300">Gemini 2.5 Flash Executive Briefing</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px]">210 TOKENS (226ms)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {featureTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    MODULE 02 // REAL-TIME TELEMETRY
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-hud font-bold text-white">
                    Live Telemetry & Diagnostics
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                    Gain transparent insight into memory usage, active server load, API response latencies, and security events with 100% real-time telemetry streaming.
                  </p>
                  <ul className="space-y-2.5 text-xs font-mono text-gray-300 pt-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Live CPU, memory, and database query latency tracking</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Zero-trust cryptographic audit logs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>99.98% verifiable production uptime SLA</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-hud font-bold uppercase transition-all flex items-center gap-2"
                  >
                    <span>VIEW LIVE TELEMETRY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#030712] rounded-2xl p-5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                    <span className="text-cyan-300 font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      LIVE HEALTH GAUGES
                    </span>
                    <span className="text-cyan-400 font-bold">120 FPS STREAMING</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-gray-400">SERVER LATENCY</span>
                      <div className="text-2xl font-hud font-bold text-emerald-300">8.2 ms</div>
                      <span className="text-[10px] text-gray-500">FastAPI ASGI Core</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-gray-400">MEMORY RESIDENCY</span>
                      <div className="text-2xl font-hud font-bold text-cyan-300">412 MB</div>
                      <span className="text-[10px] text-gray-500">Peak Pool Active</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-gray-400">TOKEN THROUGHPUT</span>
                      <div className="text-2xl font-hud font-bold text-purple-300">142 tps</div>
                      <span className="text-[10px] text-gray-500">Gemini 2.5 Flash</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-gray-400">SECURITY AUDIT</span>
                      <div className="text-2xl font-hud font-bold text-emerald-300">0 ALERTS</div>
                      <span className="text-[10px] text-gray-500">Argon2 / SHA-256</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {featureTab === 'integration' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    MODULE 03 // UNIVERSAL INTEGRATIONS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-hud font-bold text-white">
                    Connected to Every Subsystem
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                    JARVIS bridges public weather radars, academic research indexes, video platforms, and relational databases into a unified, authenticated interface.
                  </p>
                  <ul className="space-y-2.5 text-xs font-mono text-gray-300 pt-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Google Gemini 2.5 Flash cognitive inference</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Open-Meteo meteorological radar without API keys</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>arXiv paper extraction & YouTube search</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-hud font-bold uppercase transition-all flex items-center gap-2"
                  >
                    <span>EXPLORE INTEGRATIONS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-[#030712] rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                    <span className="text-cyan-300 font-bold flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      CONNECTOR MATRIX // 8 OF 8 ARMED
                    </span>
                    <span className="text-emerald-400 font-bold text-[10px]">ALL HEALTHY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { name: 'Google Gemini', type: 'LLM Cognitive', status: '280ms' },
                      { name: 'Open-Meteo', type: 'Atmospheric Radar', status: '42ms' },
                      { name: 'arXiv Preprints', type: 'Scientific Archive', status: '340ms' },
                      { name: 'World RSS Wire', type: '6 Feeds Live', status: '110ms' },
                      { name: 'PostgreSQL / SQL', type: 'Isolated Schema', status: '8ms' },
                      { name: 'Web Speech STT', type: 'Speech Recognition', status: '12ms' },
                    ].map((conn, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-[11px]">{conn.name}</div>
                          <div className="text-[10px] text-gray-500">{conn.type}</div>
                        </div>
                        <span className="text-emerald-300 text-[10px] font-bold">{conn.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

      {/* 4. UNIVERSAL SUBSYSTEM INTEGRATION MATRIX */}
      <section id="integrations" className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              ECOSYSTEM INTEGRATIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Seamless connection to mission-critical tools
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              JARVIS unifies top-tier AI models, open meteorological models, scientific archives, and production databases into one command surface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Google Gemini 2.5',
                desc: 'Deep multi-modal reasoning and dynamic code generation with fallback to local heuristics.',
                badge: 'COGNITIVE CORE',
                latency: '280ms',
                icon: Bot
              },
              {
                title: 'Open-Meteo Radar',
                desc: 'Global meteorological forecasts, wind vectors, and UV indexes with zero key dependency.',
                badge: 'WEATHER RADAR',
                latency: '42ms',
                icon: CloudSun
              },
              {
                title: 'Global RSS Wire',
                desc: 'Live intelligence feeds across 6 channels: Tech, AI, Science, World, India, and Business.',
                badge: '6 CHANNELS',
                latency: '110ms',
                icon: Newspaper
              },
              {
                title: 'arXiv Intelligence',
                desc: 'Direct query vector targeting machine learning, physics, and computational preprints.',
                badge: 'ACADEMIC SEARCH',
                latency: '340ms',
                icon: Search
              },
              {
                title: 'YouTube Vector Search',
                desc: 'Multi-vector queries discovering technical walkthroughs, teardowns, and intelligence videos.',
                badge: 'MEDIA VECTOR',
                latency: '190ms',
                icon: Play
              },
              {
                title: 'Web Speech API',
                desc: 'Real-time browser speech recognition combined with neural speech synthesis.',
                badge: 'SPEECH & STT',
                latency: '12ms',
                icon: Mic
              },
              {
                title: 'Argon2 & JWT Shield',
                desc: 'Military-grade cryptographic password hashing, SHA-256 OTP verification, and JWTs.',
                badge: 'ZERO-TRUST AUTH',
                latency: '<1ms',
                icon: Lock
              },
              {
                title: 'PostgreSQL & SQLite',
                desc: 'Strict relational database confinement ensuring total tenant data separation.',
                badge: 'RELATIONAL ISOLATION',
                latency: '8ms',
                icon: Database
              }
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={idx}
                  className="glass-fusion p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-[1.02] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-bold">
                        {tool.latency}
                      </span>
                    </div>
                    <h4 className="text-base font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h4>
                    <p className="mt-2 text-xs font-mono text-gray-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gray-500">{tool.badge}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      CONNECTED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. THE JOURNEY TO AUTONOMOUS EXECUTION (AGENCY /03 PROCESS) */}
      <section id="process" className="py-24 relative border-t border-white/5 bg-[#030614]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
                (03) // OUR PROCESS
              </span>
              <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
                The Journey to a <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-4xl sm:text-6xl">Flawless</span> Autonomous Directive
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
              We keep execution lean and deterministic — so commands travel from speech prompt to multi-system completion without friction or data leaks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '/01',
                title: 'Ingest & Parse',
                desc: 'Captures voice speech, natural-language text prompts, scheduled cron timers, or inbound webhook events.',
                tag: 'INPUT INGESTION',
                color: 'from-cyan-500/10 to-transparent'
              },
              {
                step: '/02',
                title: 'Synthesize & Route',
                desc: 'FastAPI gateway sanitization, JWT authorization, and Google Gemini 2.5 Flash cognitive inference pass.',
                tag: 'NEURAL ROUTING',
                color: 'from-indigo-500/10 to-transparent'
              },
              {
                step: '/03',
                title: 'Concur & Isolate',
                desc: 'Multi-tenant schema validation, explicit memory persistence, and cryptographic verification via Argon2.',
                tag: 'RELATIONAL ISOLATION',
                color: 'from-purple-500/10 to-transparent'
              },
              {
                step: '/04',
                title: 'Deliver & Brief',
                desc: 'Real-time sensory HUD update, active task queuing, and neural speech synthesis voice debriefing.',
                tag: 'AUTONOMOUS BRIEFING',
                color: 'from-emerald-500/10 to-transparent'
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className={`glass-fusion p-8 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all bg-gradient-to-b ${st.color} flex flex-col justify-between group`}
              >
                <div>
                  <div className="font-hud font-black text-4xl text-cyan-500/30 group-hover:text-cyan-300 transition-colors mb-4">
                    {st.step}
                  </div>
                  <h3 className="text-xl font-hud font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  {st.tag}
                </div>
              </div>
            ))}
          </div>

          {/* Agenciy Awards & Recognition Ribbon */}
          <div id="awards" className="mt-20 glass-fusion p-6 sm:p-8 rounded-3xl border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">CLOUD COMPLIANCE</span>
              <div className="text-sm sm:text-base font-hud font-bold text-white">Google Cloud Run</div>
              <span className="text-[10px] font-mono text-cyan-300">Verified Architecture</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">CYBER DEFENSE</span>
              <div className="text-sm sm:text-base font-hud font-bold text-white">OWASP Zero-Trust</div>
              <span className="text-[10px] font-mono text-emerald-300">Cryptographic Standard</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">STREAM PERFORMANCE</span>
              <div className="text-sm sm:text-base font-hud font-bold text-white">FastAPI Core</div>
              <span className="text-[10px] font-mono text-purple-300">120 FPS Stream Pipeline</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">GLOBAL DELIVERY</span>
              <div className="text-sm sm:text-base font-hud font-bold text-white">Firebase Edge</div>
              <span className="text-[10px] font-mono text-yellow-300">Worldwide Low Latency</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI CORE LEADERSHIP & SUBSYSTEM AGENTS (AGENCY /04 TEAM) */}
      <section id="agents" className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
                (04) // CORE AGENTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
                Meet the <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-4xl sm:text-6xl">Subsystem</span> Operatives
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
              Autonomous specialized agents working in harmony across the JARVIS command nexus to execute complex directives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'J.A.R.V.I.S. Core',
                role: 'Chief Intelligence Officer',
                focus: 'Cognitive reasoning & multi-turn dialogue via Google Gemini 2.5 Flash with fallback heuristics.',
                badge: 'GEMINI 2.5 AI',
                icon: Bot
              },
              {
                name: 'Radar Nexus',
                role: 'Telemetry & Sensor Lead',
                focus: 'Continuous atmospheric polling via Open-Meteo, 6 RSS categories, and live sports telemetry.',
                badge: 'SENSORY GRID',
                icon: CloudSun
              },
              {
                name: 'Acoustic Vocoder',
                role: 'Voice & Speech Lead',
                focus: 'Browser-native speech recognition and neural speech synthesis with 3D waveform matrices.',
                badge: 'WEB SPEECH API',
                icon: Mic
              },
              {
                name: 'Security Vault',
                role: 'Cryptographic Defense Lead',
                focus: 'Zero-trust isolation, Argon2 password hashing, SHA-256 OTP verification, and JWT security.',
                badge: 'ARGON2 & JWT',
                icon: Shield
              }
            ].map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <div
                  key={idx}
                  className="glass-fusion p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform mb-6">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                      {agent.badge}
                    </span>
                    <h3 className="text-xl font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {agent.name}
                    </h3>
                    <div className="text-xs font-mono text-gray-400 mb-3">{agent.role}</div>
                    <p className="text-xs font-mono text-gray-300 leading-relaxed">{agent.focus}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">OPERATIVE 0{idx + 1}</span>
                    <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. OPERATIVE SUCCESS STORIES & ENDORSEMENTS (AGENCY /06) */}
      <section id="testimonials" className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              (06) // ENDORSEMENTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Hear from the <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-4xl sm:text-6xl">Operatives</span> We've Empowered
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Read how commanders and systems engineers use JARVIS to consolidate multi-channel intelligence, automate daily routines, and run secure operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Elena Rostova',
                role: 'Lead Systems Architect',
                org: 'Orbital Dynamics',
                quote: 'JARVIS replaced 5 disjointed browser tabs for me. Having weather radar, tech RSS intelligence, and Gemini reasoning unified on one screen saves our engineering team hours every morning.',
                stat: 'Saved 14 hrs/week'
              },
              {
                name: 'Marcus Vance',
                role: 'Cybersecurity Analyst',
                org: 'Vanguard Security',
                quote: 'The zero-trust authentication and explicit private memory management gave us complete peace of mind. Truly production-grade architecture with zero data leakage.',
                stat: '100% Zero-Trust Compliance'
              },
              {
                name: 'Dr. Aris Thorne',
                role: 'AI Research Scientist',
                org: 'Nexus Quantum Lab',
                quote: 'The multi-vector search combining arXiv preprints and Google results directly through the JARVIS prompt HUD is nothing short of incredible. Essential for our research pipeline.',
                stat: '3x Faster Literature Synthesis'
              },
              {
                name: 'Sarah Jenkins',
                role: 'Operations Commander',
                org: 'Aero Defense Systems',
                quote: 'Voice synthesis feels astonishingly natural. I conduct morning status debriefs hands-free on my iPad while managing directives seamlessly across devices.',
                stat: '100% Mobile & Desktop Parity'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="glass-fusion p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-cyan-400/40" />
                  </div>
                  <p className="text-xs font-mono text-gray-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="font-hud font-bold text-sm text-white">{t.name}</div>
                  <div className="text-[11px] font-mono text-cyan-400">{t.role}</div>
                  <div className="text-[10px] font-mono text-gray-500">{t.org}</div>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold">
                    {t.stat}
                  </div>
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

      {/* 7. PRICING & SUBSCRIPTION PLANS (AGENCY /05 PRICING) */}
      <section id="pricing" className="py-24 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
              (05) // PRICING PLANS
            </span>
            <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
              Plans That <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-4xl sm:text-6xl">Scale</span> With Your Operations
            </h2>
            <p className="mt-3 text-sm font-mono text-gray-400">
              Transparent, predictable operational tiers. Choose the intelligence capacity engineered for your mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-fusion p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-hud font-bold text-xs text-gray-300">
                    1
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">STARTER</span>
                </div>
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
                POPULAR
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-hud font-bold text-xs text-cyan-300">
                    2
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 tracking-widest uppercase">GROWTH</span>
                </div>
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

            <div className="glass-fusion p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group hover:border-purple-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-hud font-bold text-xs text-gray-300">
                    3
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">SCALE</span>
                </div>
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

      {/* 9. MISSION CONTACT DESK (AGENCY /07 CONTACT) */}
      <section id="contact" className="py-24 relative border-t border-white/5 bg-[#02050f]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-3 py-1 rounded-full glass-pill border border-cyan-500/20">
                  (07) // MISSION DESK
                </span>
                <h2 className="text-3xl sm:text-5xl font-hud font-bold text-white mt-4 uppercase">
                  Let's Build Something <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-4xl sm:text-6xl">Extraordinary</span> Together
                </h2>
                <p className="mt-4 text-xs sm:text-sm font-mono text-gray-400 leading-relaxed">
                  Have an operational challenge, custom integration requirement, or seeking an enterprise-grade autonomous AI deployment? Transmit your directive below.
                </p>
              </div>

              {/* Coordinates & Info Badges */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl glass-fusion border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">HEADQUARTERS</span>
                    <div className="text-sm font-hud font-bold text-white mt-0.5">1234 Market Street, Suite 500</div>
                    <div className="text-xs font-mono text-gray-400">San Francisco, CA 94103, US</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl glass-fusion border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">DIRECT TRANSMISSION</span>
                    <div className="text-sm font-hud font-bold text-white mt-0.5">operatives@jarvis-os.dev</div>
                    <div className="text-xs font-mono text-gray-400">PGP Key ID: 0x9AF4B821 // Encrypted</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl glass-fusion border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">OPERATIONAL SLA</span>
                    <div className="text-sm font-hud font-bold text-emerald-300 mt-0.5">&lt; 15 Minute Triage</div>
                    <div className="text-xs font-mono text-gray-400">24/7/365 Continuous AI Health Monitoring</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Column */}
            <div className="lg:col-span-7">
              <div className="glass-fusion p-6 sm:p-10 rounded-3xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
                {contactSubmitted ? (
                  <div className="py-12 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 animate-pulse">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div className="text-2xl font-hud font-bold text-white uppercase">
                      Transmission Confirmed
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-gray-300 max-w-md">
                      Thank you, Operative. Your mission dispatch has been routed to our tactical operations desk. A briefing response will arrive at <span className="text-cyan-300 font-bold">{contactEmail}</span> shortly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-6 px-6 py-2.5 rounded-full glass-pill border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer"
                    >
                      Transmit Another Directive
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        SECURE MISSION TRANSMISSION PORTAL
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        READY
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                          Operative / Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Commander Sarah Vance"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 text-xs sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                          Communication Frequency (Email) *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. vance@orbital.io"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 text-xs sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                        Directive Classification / Mission Domain
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          'Autonomous Directive',
                          'Enterprise Nexus',
                          'Security Audit',
                          'Custom Integration'
                        ].map((type) => {
                          const active = contactType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setContactType(type);
                              }}
                              className={`p-2.5 rounded-xl text-[11px] font-mono transition-all text-center border cursor-pointer ${
                                active
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 font-bold shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                                  : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                        Directive Payload / Operational Scope *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Detail your operational requirements, preferred latency targets, or custom integration needs..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 text-xs sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-black font-hud font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Directive to Mission Control</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-28 relative border-t border-white/5 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.15)_0%,rgba(100,50,255,0.06)_50%,transparent_70%)] pointer-events-none blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6">
            <AICore state="IDLE" size="100%" interactive={false} />
          </div>

          <h2 className="text-4xl sm:text-6xl font-hud font-black text-white uppercase drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">
            Your Autonomous <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-5xl sm:text-7xl">Intelligence</span> is Ready.
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

      {/* 11. ENTERPRISE FOOTER */}
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
                1234 Market Street, Suite 500, San Francisco, CA 94103, US
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                © {new Date().getFullYear()} J.A.R.V.I.S. Operating System. All rights reserved.
              </div>
            </div>

            <div>
              <span className="font-hud font-bold text-white uppercase tracking-wider block mb-3 text-xs">Architecture</span>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-cyan-300 transition-colors">Services (/01)</a></li>
                <li><a href="#showcase" className="hover:text-cyan-300 transition-colors">Showcases (/02)</a></li>
                <li><a href="#process" className="hover:text-cyan-300 transition-colors">Process Pipeline (/03)</a></li>
                <li><a href="#agents" className="hover:text-cyan-300 transition-colors">Core Agents (/04)</a></li>
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
              <span className="font-hud font-bold text-white uppercase tracking-wider block mb-3 text-xs">Engage & Deploy</span>
              <ul className="space-y-2">
                <li><a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing Plans (/05)</a></li>
                <li><a href="#testimonials" className="hover:text-cyan-300 transition-colors">Endorsements (/06)</a></li>
                <li><a href="#contact" className="hover:text-cyan-300 transition-colors">Mission Desk (/07)</a></li>
                <li><a href="https://github.com/anangipavan362-dotcom/JARVIS-AI" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors flex items-center gap-1">GitHub Repo <ExternalLink className="w-3 h-3" /></a></li>
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
