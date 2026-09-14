import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../services/api';
import { NeonButton } from '../components/common/NeonButton';
import { ArcReactor } from '../components/hud/ArcReactor';
import { sound } from '../utils/sound';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || newPassword.length < 8) {
      setErrorMsg('PLEASE PROVIDE VALID TOKEN AND 8+ CHARACTER PASSWORD.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await ApiClient.resetPassword({ token, new_password: newPassword });
      setSuccess(true);
      sound.playAccessGranted();
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      sound.playAlert();
      setErrorMsg(err.message || 'PASSWORD RESET FAILED.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <ArcReactor state="THINKING" size={110} subtext="SECURITY OVERRIDE" />
          </div>
          <h1 className="text-2xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            RESET ACCESS KEY
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-1">
            ESTABLISH NEW CREDENTIALS
          </p>
        </div>

        <div className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br">
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-500/50 flex items-center gap-2 text-xs font-mono text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="p-3 rounded bg-green-950/40 border border-green-400/60 text-green-300 text-xs font-mono">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p>ACCESS CREDENTIALS OVERWRITTEN SUCCESSFULLY. REDIRECTING TO TERMINAL...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  SECURITY RESET TOKEN
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste recovery token"
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <NeonButton
                type="submit"
                variant="cyan"
                size="md"
                loading={loading}
                className="w-full mt-2"
              >
                OVERRIDE PASSWORD
              </NeonButton>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-mono text-gray-400 hover:text-cyan-300">
                  CANCEL & RETURN
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
