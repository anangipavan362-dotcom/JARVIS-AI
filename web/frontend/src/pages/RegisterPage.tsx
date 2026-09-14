import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NeonButton } from '../components/common/NeonButton';
import { ArcReactor } from '../components/hud/ArcReactor';
import { sound } from '../utils/sound';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation heuristics
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  let strengthLabel = 'WEAK';
  let strengthColor = 'bg-red-500 text-red-400';
  if (passedCount >= 4) {
    strengthLabel = 'STRONG';
    strengthColor = 'bg-green-400 text-green-400';
  } else if (passedCount >= 3) {
    strengthLabel = 'MEDIUM';
    strengthColor = 'bg-amber-400 text-amber-400';
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('PASSWORDS DO NOT MATCH.');
      sound.playAlert();
      return;
    }
    if (passedCount < 4) {
      setErrorMsg('PASSWORD MUST MEET AT LEAST 4 COMPLEXITY REQUIREMENTS.');
      sound.playAlert();
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await register({
        full_name: fullName,
        username,
        email,
        password,
        avatar_url: avatarUrl || undefined,
      });

      setSuccessMsg('ACCOUNT CREATED. PROCEEDING TO COMMAND CENTER...');
      sound.playAccessGranted();
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err: any) {
      sound.playAlert();
      setErrorMsg(err.message || 'REGISTRATION REJECTED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-md my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <ArcReactor state="IDLE" size={110} subtext="ENROLLMENT" />
          </div>
          <h1 className="text-2xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            CREATE JARVIS ACCOUNT
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-1">
            INITIALIZE NEW OPERATIVE CLEARANCE
          </p>
        </div>

        {/* Panel */}
        <div className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br">
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-500/50 flex items-center gap-2 text-xs font-mono text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded bg-green-950/60 border border-green-400/60 flex items-center gap-2 text-xs font-mono text-green-300">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                FULL NAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tony Stark"
                  className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  USERNAME
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ironman"
                  className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  EMAIL
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tony@stark.corp"
                    className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 p-2 rounded bg-black/40 border border-cyan-500/20 text-[10px] font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">PASSWORD COMPLEXITY:</span>
                    <span className={`font-hud font-bold ${strengthColor.split(' ')[1]}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor.split(' ')[0]} transition-all`}
                      style={{ width: `${(passedCount / 5) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2 text-[9px]">
                    <span className={hasMinLen ? 'text-green-400' : 'text-gray-500'}>
                      {hasMinLen ? '✓' : '○'} 8+ Characters
                    </span>
                    <span className={hasUpper ? 'text-green-400' : 'text-gray-500'}>
                      {hasUpper ? '✓' : '○'} Uppercase Letter
                    </span>
                    <span className={hasLower ? 'text-green-400' : 'text-gray-500'}>
                      {hasLower ? '✓' : '○'} Lowercase Letter
                    </span>
                    <span className={hasNumber ? 'text-green-400' : 'text-gray-500'}>
                      {hasNumber ? '✓' : '○'} Numeric Digit
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <NeonButton
              type="submit"
              variant="cyan"
              size="md"
              loading={loading}
              className="w-full mt-3"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              ENROLL OPERATIVE
            </NeonButton>
          </form>

          <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center text-xs font-mono text-gray-400">
            <span>ALREADY ENROLLED?</span>{' '}
            <Link to="/login" className="text-cyan-300 font-hud font-bold hover:underline">
              AUTHENTICATE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
