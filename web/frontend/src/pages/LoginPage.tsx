import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../context/AuthContext';
import { NeonButton } from '../components/common/NeonButton';
import { JarvisAvatar } from '../components/3d/JarvisAvatar';
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
      setStatusSequence('AUTHENTICATING OPERATIVE...');
      await new Promise((r) => setTimeout(r, 350));
      setStatusSequence('VERIFYING BIOMETRICS & CLEARANCE...');
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

      setStatusSequence('ACCESS GRANTED // WELCOME');
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

  const handleGuestLogin = async () => {
    setIdentifier('guest_operative');
    setPassword('Guest@2026');
    try {
      setLoading(true);
      setErrorMsg('');
      setStatusSequence('INITIALIZING VISITOR CLEARANCE...');
      await new Promise((r) => setTimeout(r, 300));
      await login({ username_or_email: 'guest_operative', password: 'Guest@2026' });
      setStatusSequence('GUEST CLEARANCE GRANTED // WELCOME OPERATIVE');
      await new Promise((r) => setTimeout(r, 400));
      navigate('/dashboard');
    } catch (err: any) {
      sound.playAlert();
      setStatusSequence(null);
      setErrorMsg(err.message || 'Guest authorization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FFFFFF] flex items-center justify-center p-4 selection:bg-white selection:text-black overflow-hidden">
      {/* 3D Holographic Particle Background (Monochrome) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <ParticleField count={300} speed={0.3} color="#FFFFFF" />
        </Canvas>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Terminal Header with Mini 3D Digital Human Avatar */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border border-white/20 bg-black shadow-[0_0_25px_rgba(255,255,255,0.15)]">
            <JarvisAvatar
              state={loading ? 'THINKING' : errorMsg ? 'ERROR' : 'IDLE'}
              interactive={false}
              className="w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-hud font-black tracking-widest text-white uppercase">
            J.A.R.V.I.S.
          </h1>
          <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mt-1">
            SECURE ACCESS TERMINAL // MONOCHROME CORE
          </p>
        </div>

        {/* Security Indicators (Monochrome) */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-gray-400">ENCRYPTION</div>
            <div className="text-[10px] font-hud font-bold text-white mt-0.5">● ACTIVE</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-gray-400">PROTOCOL</div>
            <div className="text-[10px] font-hud font-bold text-white mt-0.5">● ZERO TRUST</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-gray-400">CORE STATUS</div>
            <div className="text-[10px] font-hud font-bold text-white mt-0.5">● ONLINE</div>
          </div>
        </div>

        {/* Form Panel wrapped in 3D HolographicCard */}
        <HolographicCard glowColor="white" className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/30 flex items-center gap-2 text-xs font-mono text-white">
              <AlertTriangle className="w-4 h-4 text-white shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusSequence && (
            <div className="mb-4 p-3 rounded-xl bg-white/10 border border-white/40 flex items-center gap-2 text-xs font-mono text-white animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>{statusSequence}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-hud tracking-wider text-gray-300 uppercase mb-1.5">
                EMAIL / USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="pavan or guest_operative"
                  className="w-full pl-9 pr-3 py-3 sm:py-2.5 min-h-[46px] sm:min-h-0 bg-[#0A0A0A] border border-white/15 rounded-xl text-base sm:text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-hud tracking-wider text-gray-300 uppercase">
                  PASSWORD
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-mono text-gray-400 hover:text-white transition-colors"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-3 sm:py-2.5 min-h-[46px] sm:min-h-0 bg-[#0A0A0A] border border-white/15 rounded-xl text-base sm:text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all"
                />
              </div>
            </div>

            <NeonButton
              type="submit"
              variant="solid"
              size="md"
              loading={loading}
              className="w-full mt-2 min-h-[46px]"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              AUTHENTICATE
            </NeonButton>
          </form>

          {/* Guest Access & Admin Notice */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-3">
            <button
              onClick={() => {
                sound.playClick();
                handleGuestLogin();
              }}
              className="w-full py-2.5 px-3 min-h-[44px] rounded-xl bg-white/5 border border-white/20 text-xs font-mono text-gray-200 hover:text-black hover:bg-white hover:border-white transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              🚀 1-CLICK GUEST ACCESS (VISITORS & FRIENDS)
            </button>

            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              🔒 ADMIN ACCESS RESERVED FOR PAVAN (USE CREDENTIALS ABOVE)
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400 pt-1">
              <span>NEED CLEARANCE?</span>
              <Link to="/register" className="text-white font-hud font-bold hover:underline">
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
export default LoginPage;
