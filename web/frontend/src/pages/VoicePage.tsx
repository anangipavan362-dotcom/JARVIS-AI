import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Settings,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { ArcReactor, ReactorState } from '../components/hud/ArcReactor';
import { WaveformVisualizer } from '../components/hud/WaveformVisualizer';
import { NeonButton } from '../components/common/NeonButton';
import { ApiClient } from '../services/api';
import { sound } from '../utils/sound';

type VoiceState = 'READY' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export const VoicePage: React.FC = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>('READY');
  const [transcript, setTranscript] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [fallbackText, setFallbackText] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);

  const recognitionRef = useRef<any>(null);

  // Populate browser SpeechSynthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex];
    }
    utterance.rate = speed;
    utterance.volume = volume;

    utterance.onstart = () => {
      setVoiceState('SPEAKING');
    };

    utterance.onend = () => {
      setVoiceState('READY');
    };

    utterance.onerror = () => {
      setVoiceState('READY');
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the fallback input terminal below.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onstart = () => {
        setVoiceState('LISTENING');
        setTranscript('');
        sound.playProcessing();
      };

      recog.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceCommand(text);
      };

      recog.onerror = () => {
        setVoiceState('ERROR');
        setTimeout(() => setVoiceState('READY'), 2000);
      };

      recog.onend = () => {
        // Only reset to READY if we didn't transition to PROCESSING
        setVoiceState((prev) => (prev === 'LISTENING' ? 'READY' : prev));
      };

      recognitionRef.current = recog;
      recog.start();
    } catch {
      setVoiceState('ERROR');
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setVoiceState('READY');
  };

  const processVoiceCommand = async (command: string) => {
    setVoiceState('PROCESSING');
    sound.playProcessing();
    try {
      const res = await ApiClient.sendChatMessage(command);
      setLastResponse(res.response);
      speakText(res.response);
    } catch (err: any) {
      const errMsg = "I encountered an operational anomaly processing that voice directive.";
      setLastResponse(errMsg);
      speakText(errMsg);
    }
  };

  const handleFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackText.trim()) return;
    const cmd = fallbackText.trim();
    setFallbackText('');
    setTranscript(cmd);
    processVoiceCommand(cmd);
  };

  const getReactorState = (): ReactorState => {
    switch (voiceState) {
      case 'LISTENING': return 'LISTENING';
      case 'PROCESSING': return 'THINKING';
      case 'SPEAKING': return 'SPEAKING';
      case 'ERROR': return 'ALERT';
      default: return 'IDLE';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none pb-8">
      {/* Top Banner */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
          VOICE COMMAND MATRIX
        </h1>
        <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
          SPEECH RECOGNITION & NEURAL SYNTHESIS TERMINAL
        </p>
      </div>

      {/* Central Interactive Voice Orb */}
      <div className="cyber-panel rounded-lg p-8 tech-corner-tl tech-corner-br flex flex-col items-center justify-center relative min-h-[380px]">
        {/* Dynamic State Indicator Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-cyan-500/30 text-xs font-hud font-bold">
          <span
            className={`w-2 h-2 rounded-full ${
              voiceState === 'LISTENING'
                ? 'bg-green-400 animate-ping'
                : voiceState === 'SPEAKING'
                ? 'bg-amber-400 animate-pulse'
                : voiceState === 'PROCESSING'
                ? 'bg-purple-400 animate-spin'
                : 'bg-cyan-400'
            }`}
          />
          <span className="text-cyan-300">{voiceState}</span>
        </div>

        {/* Central Arc Reactor Visualizer */}
        <div className="my-4">
          <ArcReactor
            state={getReactorState()}
            size={240}
            interactive={true}
            onClick={voiceState === 'LISTENING' ? stopListening : startListening}
            subtext={`STATUS: ${voiceState}`}
          />
        </div>

        {/* Waveform Bar */}
        <div className="w-full max-w-sm mt-2">
          <WaveformVisualizer active={voiceState === 'LISTENING' || voiceState === 'SPEAKING'} barCount={24} />
        </div>

        {/* Central Microphone Action Button */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={voiceState === 'LISTENING' ? stopListening : startListening}
            className={`px-6 py-3 rounded-full font-hud font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all select-none ${
              voiceState === 'LISTENING'
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_25px_rgba(255,48,48,0.7)] animate-pulse'
                : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 hover:text-white shadow-[0_0_20px_rgba(0,229,255,0.4)]'
            }`}
          >
            {voiceState === 'LISTENING' ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>TERMINATE LISTENING</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>INITIALIZE VOICE COMMAND</span>
              </>
            )}
          </button>
        </div>

        {/* Spoken Transcript / Response Area */}
        <div className="w-full max-w-xl mt-6 space-y-2">
          {transcript && (
            <div className="p-3 rounded bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-200">
              <span className="text-gray-400 block text-[10px] uppercase">HEARD DIRECTIVE:</span>
              "{transcript}"
            </div>
          )}

          {lastResponse && (
            <div className="p-3 rounded bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-gray-200">
              <div className="flex items-center justify-between text-cyan-300 text-[10px] uppercase font-bold mb-1">
                <span>J.A.R.V.I.S. VOCAL TRANSMISSION:</span>
                <button
                  onClick={() => speakText(lastResponse)}
                  className="hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> REPLAY
                </button>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{lastResponse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fallback Text Input Terminal */}
      <div className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br">
        <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>DIRECTIVE FALLBACK TERMINAL</span>
        </h3>
        <form onSubmit={handleFallbackSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type directive if microphone is unavailable (e.g. 'Status report')..."
            value={fallbackText}
            onChange={(e) => setFallbackText(e.target.value)}
            className="flex-1 px-3 py-2 bg-black/70 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400"
          />
          <NeonButton type="submit" variant="cyan" size="sm">
            EXECUTE
          </NeonButton>
        </form>
      </div>

      {/* Acoustic Settings Panel */}
      <div className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br">
        <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>SYNTHESIS ACOUSTIC CONTROLS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-gray-400 mb-1">SELECT VOICE:</label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-200 focus:outline-none"
            >
              {availableVoices.length === 0 ? (
                <option value={0}>Default Synthesizer</option>
              ) : (
                availableVoices.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>SPEECH SPEED:</span>
              <span className="text-cyan-300">{speed}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>VOLUME:</span>
              <span className="text-cyan-300">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
