import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../context/AuthContext';
import { NeonButton } from '../components/common/NeonButton';
import { ArcReactor } from '../components/hud/ArcReactor';
import { HolographicCard } from '../components/hud/HolographicCard';
import { ParticleField } from '../components/3d/ParticleField';
import { sound } from '../utils/sound';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [statusSequence, setStatusSequence] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('PLEASE ENTER CREDENTIALS.');
      sound.playAlert();
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      // Futuristic authentication progress sequence
      setStatusSequence('AUTHENTICATING USER...');
      await new Promise((r) => setTimeout(r, 350));
      setStatusSequence('VERIFYING CREDENTIALS...');
      await new Promise((r) => setTimeout(r, 450));
      setStatusSequence('ESTABLISHING SECURE SESSION...');
      
      const res = await login({
        username_or_email: identifier,
        password: password,
      });

      if (res?.user?.status === 'PENDING_VERIFICATION') {
        setStatusSequence('CLEARANCE CODE REQUIRED');
        await new Promise((r) => setTimeout(r, 400));
        navigate(`/verify-otp?email=${encodeURIComponent(res.user.email || identifier)}`);
        return;
      }

      setStatusSequence('ACCESS GRANTED');
      await new Promise((r) => setTimeout(r, 400));
      navigate('/dashboard');
    } catch (err: any) {
      sound.playAlert();
      setStatusSequence(null);
      setErrorMsg(err.message || 'ACCESS DENIED: INVALID CREDENTIALS');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIdentifier('operative_alpha');
    setPassword('DemoOperative123!');
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* 3D Holographic Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <ParticleField count={400} speed={0.4} color="#00e5ff" />
        </Canvas>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Terminal Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <ArcReactor state={loading ? 'THINKING' : (errorMsg ? 'ALERT' : 'IDLE')} size={140} subtext="SECURITY NODE" />
          </div>
          <h1 className="text-2xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            J.A.R.V.I.S.
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-1">
            SECURE ACCESS TERMINAL
          </p>
        </div>

        {/* Security Indicators */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-cyan-400/70">ENCRYPTION</div>
            <div className="text-[10px] font-hud font-bold text-green-400 mt-0.5">● ACTIVE</div>
          </div>
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-cyan-400/70">AUTH PROTOCOL</div>
            <div className="text-[10px] font-hud font-bold text-cyan-300 mt-0.5">● SECURE</div>
          </div>
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-cyan-400/70">NETWORK NODE</div>
            <div className="text-[10px] font-hud font-bold text-blue-400 mt-0.5">● ONLINE</div>
          </div>
        </div>

        {/* Form Panel wrapped in 3D HolographicCard */}
        <HolographicCard glowColor="cyan" className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-500/50 flex items-center gap-2 text-xs font-mono text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusSequence && (
            <div className="mb-4 p-3 rounded bg-cyan-950/60 border border-cyan-400/60 flex items-center gap-2 text-xs font-mono text-cyan-300 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>{statusSequence}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1.5">
                EMAIL / USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="operative@stark.corp or username"
                  className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase">
                  PASSWORD
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-mono text-cyan-400/80 hover:text-white transition-colors"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
                />
              </div>
            </div>

            <NeonButton
              type="submit"
              variant="cyan"
              size="md"
              loading={loading}
              className="w-full mt-2"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              AUTHENTICATE
            </NeonButton>
          </form>

          {/* Social Auth Mock & Registration link */}
          <div className="mt-6 pt-4 border-t border-cyan-500/20 text-center space-y-3">
            <button
              onClick={() => {
                sound.playClick();
                handleDemoLogin();
              }}
              className="w-full py-1.5 px-3 rounded bg-cyan-950/20 border border-cyan-500/30 text-[11px] font-mono text-cyan-300/80 hover:text-white hover:border-cyan-400 transition-all"
            >
              AUTO-FILL DEMO CREDENTIALS
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400">
              <span>NEED CLEARANCE?</span>
              <Link to="/register" className="text-cyan-300 font-hud font-bold hover:underline">
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
