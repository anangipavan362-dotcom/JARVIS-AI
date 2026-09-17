import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ApiClient } from '../services/api';
import { NeonButton } from '../components/common/NeonButton';
import { ArcReactor } from '../components/hud/ArcReactor';
import { sound } from '../utils/sound';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [dispatched, setDispatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await ApiClient.forgotPassword(email);
      setDispatched(true);
      sound.playAccessGranted();
    } catch {
      setDispatched(true); // Secure: always pretend dispatched
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E8FFFF] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <ArcReactor state="THINKING" size={120} subtext="SECURITY KEY" />
          </div>
          <h1 className="text-2xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            RECOVER JARVIS ACCESS
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-1">
            KEY RECOVERY DISPATCH PROTOCOL
          </p>
        </div>

        <div className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br">
          {dispatched ? (
            <div className="text-center py-4 space-y-4">
              <div className="p-3 rounded bg-green-950/40 border border-green-400/60 text-green-300 text-xs font-mono">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p>If an account matching this address exists in the JARVIS registry, recovery instructions have been dispatched.</p>
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-hud text-cyan-400 hover:text-white">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO ACCESS TERMINAL</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs font-mono text-gray-400">
                Input your enrolled operative email address. A cryptographic recovery token will be dispatched.
              </p>
              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operative@stark.corp"
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
                SEND RECOVERY LINK
              </NeonButton>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-mono text-gray-400 hover:text-cyan-300">
                  BACK TO LOGIN
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
