import React, { useState, useEffect } from 'react';
import { ArcReactor } from '../hud/ArcReactor';
import { sound } from '../../utils/sound';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const bootMessages = [
    'INITIALIZING JARVIS OPERATING CORE...',
    'LOADING 3D NEURAL VISUALIZER...',
    'CALIBRATING HOLOGRAPHIC RINGS...',
    'CONNECTING QUANTUM DATABASE...',
    'VOICE & SYNTHESIS SYSTEMS READY...',
    'SECURITY & AUDIT PROTOCOLS ENGAGED...',
    'J.A.R.V.I.S. ONLINE // ALL SYSTEMS NOMINAL'
  ];

  useEffect(() => {
    sound.playBoot();
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev < bootMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            sessionStorage.setItem('jarvis_booted', 'true');
            onComplete();
          }, 350);
          return prev;
        }
      });
    }, 380);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('jarvis_booted', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-4 select-none">
      {/* Background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Center Reactor Visualizer */}
      <div className="relative z-10">
        <ArcReactor state="THINKING" size={220} subtext="SYSTEM BOOT" />
      </div>

      {/* Boot Telemetry Stream */}
      <div className="mt-8 relative z-10 w-full max-w-md font-mono text-xs text-center space-y-1">
        {bootMessages.slice(0, step + 1).map((msg, i) => (
          <div
            key={i}
            className={`transition-all duration-200 tracking-wider ${
              i === step
                ? 'text-white font-bold text-sm text-shadow-glow animate-pulse'
                : 'text-cyan-500/60'
            }`}
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="mt-8 px-4 py-1.5 rounded bg-black/50 border border-cyan-500/40 hover:border-cyan-300 text-xs font-mono text-cyan-400 hover:text-white transition-all tracking-widest relative z-10"
      >
        [ SKIP SEQUENCE ]
      </button>
    </div>
  );
};
