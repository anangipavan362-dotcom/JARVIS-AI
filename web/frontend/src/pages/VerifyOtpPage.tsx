import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../context/AuthContext';
import { NeonButton } from '../components/common/NeonButton';
import { ArcReactor } from '../components/hud/ArcReactor';
import { HolographicCard } from '../components/hud/HolographicCard';
import { ParticleField } from '../components/3d/ParticleField';
import { sound } from '../utils/sound';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [expirationSeconds, setExpirationSeconds] = useState(600);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiration countdown timer
  useEffect(() => {
    if (expirationSeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirationSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [expirationSeconds]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setErrorMsg('');

    // Advance to next box if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-trigger verification
    if (index === 5 && value && newDigits.every((d) => d !== '')) {
      const fullCode = newDigits.join('');
      executeVerification(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasted)) {
      setErrorMsg('Please paste a valid 6-digit numeric verification code.');
      sound.playAlert();
      return;
    }

    const pastedDigits = pasted.split('');
    setDigits(pastedDigits);
    inputRefs.current[5]?.focus();
    executeVerification(pasted);
  };

  const executeVerification = async (codeToVerify: string) => {
    if (!email) {
      setErrorMsg('Email address missing. Please return to registration.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await verifyOtp(email, codeToVerify);
      setSuccessMsg('TACTICAL CLEARANCE VERIFIED. INITIALIZING DASHBOARD...');
      sound.playAccessGranted();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      sound.playAlert();
      setErrorMsg(err.message || 'Verification rejected. Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your clearance code.');
      sound.playAlert();
      return;
    }
    executeVerification(fullCode);
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setResending(true);
    setErrorMsg('');
    try {
      const res = await resendOtp(email);
      setSuccessMsg('NEW CLEARANCE CODE DISPATCHED TO EMAIL.');
      setCooldown(res.cooldown_seconds || 60);
      setExpirationSeconds(600);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      sound.playAlert();
      setErrorMsg(err.message || 'Failed to dispatch new clearance code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black overflow-hidden select-none">
      {/* 3D Ambient Holographic Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <ParticleField count={450} speed={0.35} color="#00e5ff" />
        </Canvas>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Holographic Arc Reactor Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <ArcReactor
              state={loading ? 'THINKING' : (errorMsg ? 'ALERT' : 'LISTENING')}
              size={140}
              subtext="OTP GATEWAY"
            />
          </div>
          <h1 className="text-2xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            CLEARANCE VERIFICATION
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-1">
            ENTER 6-DIGIT TACTICAL CODE
          </p>
        </div>

        {/* Expiration & Node Status */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-center">
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-cyan-400/70 uppercase">CODE EXPIRES IN</div>
            <div className="text-xs font-hud font-bold text-amber-400 mt-0.5">
              {formatTimer(expirationSeconds)}
            </div>
          </div>
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-cyan-400/70 uppercase">DESTINATION</div>
            <div className="text-[10px] font-mono text-cyan-200 mt-0.5 truncate px-1" title={email}>
              {email || 'N/A'}
            </div>
          </div>
        </div>

        {/* 3D Holographic Card Form */}
        <HolographicCard glowColor="cyan" className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-950/50 border border-red-500/60 flex items-center gap-2 text-xs font-mono text-red-400">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded bg-green-950/60 border border-green-400/60 flex items-center gap-2 text-xs font-mono text-green-300 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-hud tracking-widest text-cyan-300 uppercase mb-3 text-center">
                6-DIGIT CLEARANCE OTP
              </label>

              {/* 6 Individual Input Boxes */}
              <div className="flex justify-between items-center gap-2" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-hud font-black text-cyan-200 bg-black/70 border border-cyan-500/40 rounded focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
                  />
                ))}
              </div>
            </div>

            <NeonButton
              type="submit"
              variant="cyan"
              size="md"
              loading={loading}
              className="w-full"
              icon={<KeyRound className="w-4 h-4" />}
            >
              VERIFY CLEARANCE
            </NeonButton>
          </form>

          {/* Resend Actions & Cooldown */}
          <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-col items-center space-y-3">
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className={`text-xs font-mono flex items-center gap-1.5 transition-colors ${
                cooldown > 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-cyan-400 hover:text-white hover:underline'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 ? `RESEND CODE IN ${cooldown}s` : 'DISPATCH NEW CLEARANCE CODE'}
              </span>
            </button>

            <div className="flex items-center justify-between w-full text-[11px] font-mono text-gray-400 pt-2">
              <Link to="/register" className="hover:text-cyan-300 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                <span>CHANGE EMAIL</span>
              </Link>
              <Link to="/login" className="hover:text-cyan-300">
                RETURN TO LOGIN
              </Link>
            </div>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
