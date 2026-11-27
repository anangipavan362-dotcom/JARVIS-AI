import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Settings,
  Terminal,
  Sparkles,
  Zap,
  CheckCircle,
  RefreshCw,
  Repeat,
} from 'lucide-react';
import { JarvisAvatar, AvatarState } from '../components/3d/JarvisAvatar';
import { HolographicCard } from '../components/hud/HolographicCard';
import { voiceEngine, VoiceSettings } from '../services/voiceEngine';
import { sound } from '../utils/sound';

export const VoicePage: React.FC = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>('IDLE');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [fallbackText, setFallbackText] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(voiceEngine.getSettings());

  useEffect(() => {
    // Subscribe to voiceEngine events
    const unsubState = voiceEngine.onStateChange((st) => setAvatarState(st));
    const unsubAudio = voiceEngine.onAudioLevel((lvl) => setAudioLevel(lvl));
    const unsubTranscript = voiceEngine.onTranscript((text) => setTranscript(text));

    setAvailableVoices(voiceEngine.getVoices());
    const interval = setInterval(() => {
      const v = voiceEngine.getVoices();
      if (v.length > 0) {
        setAvailableVoices(v);
        clearInterval(interval);
      }
    }, 500);

    return () => {
      unsubState();
      unsubAudio();
      unsubTranscript();
      clearInterval(interval);
    };
  }, []);

  const handleToggleListening = async () => {
    sound.playClick();
    if (avatarState === 'LISTENING') {
      voiceEngine.stopListening();
    } else if (avatarState === 'SPEAKING') {
      voiceEngine.stopSpeaking();
    } else {
      await voiceEngine.startListening();
    }
  };

  const handleStopSpeaking = () => {
    sound.playClick();
    voiceEngine.stopSpeaking();
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackText.trim()) return;
    sound.playClick();
    const query = fallbackText.trim();
    setTranscript(query);
    setFallbackText('');
    const reply = await voiceEngine.processDirective(query);
    setLastResponse(reply);
  };

  const handleToggleContinuous = () => {
    sound.playClick();
    const nextContinuous = !settings.continuous;
    const updated = { ...settings, continuous: nextContinuous };
    setSettings(updated);
    voiceEngine.updateSettings({ continuous: nextContinuous });
  };

  const handleVoiceChange = (voiceIndex: number) => {
    const updated = { ...settings, voiceIndex };
    setSettings(updated);
    voiceEngine.updateSettings({ voiceIndex });
  };

  const handleRateChange = (rate: number) => {
    const updated = { ...settings, rate };
    setSettings(updated);
    voiceEngine.updateSettings({ rate });
  };

  const handleVolumeChange = (volume: number) => {
    const updated = { ...settings, volume };
    setSettings(updated);
    voiceEngine.updateSettings({ volume });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-[#080808]/90 border border-white/10 backdrop-blur-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-hud font-black tracking-widest text-white uppercase">
            DIGITAL HUMAN // VOICE MATRIX
          </h1>
          <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mt-0.5">
            REAL-TIME ACOUSTIC SYNTHESIS • SPEECH RECOGNITION • VISEME LIP-SYNC
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              avatarState === 'LISTENING'
                ? 'bg-white animate-ping'
                : avatarState === 'SPEAKING'
                ? 'bg-white animate-pulse'
                : 'bg-gray-500'
            }`}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {avatarState === 'IDLE'
              ? 'MIC READY'
              : avatarState === 'LISTENING'
              ? 'LISTENING TO OPERATIVE...'
              : avatarState === 'THINKING'
              ? 'NEURAL REASONING...'
              : avatarState === 'SPEAKING'
              ? 'JARVIS VOCALIZING...'
              : avatarState}
          </span>
        </div>
      </div>

      {/* Main Center Console: Hero 3D Holographic Digital Human Avatar */}
      <HolographicCard glowColor="white" className="flex flex-col items-center justify-center p-6 min-h-[440px]">
        {/* 3D Human Avatar Viewport */}
        <div className="w-full h-[360px] sm:h-[440px] relative rounded-3xl overflow-hidden bg-[#050505] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          <JarvisAvatar
            state={avatarState}
            audioLevel={audioLevel}
            interactive={true}
            className="w-full h-full"
          />

          {/* Central Trigger Action Overlay */}
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4 z-20">
            <button
              onClick={handleToggleListening}
              className={`px-6 py-3 rounded-full flex items-center justify-center gap-2.5 text-xs font-hud font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer ${
                avatarState === 'LISTENING'
                  ? 'bg-white text-black animate-pulse shadow-[0_0_35px_rgba(255,255,255,0.6)]'
                  : 'bg-black/80 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white'
              }`}
            >
              {avatarState === 'LISTENING' ? (
                <>
                  <MicOff className="w-4 h-4 text-black" />
                  <span>STOP LISTENING</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-white" />
                  <span>ENGAGE MICROPHONE</span>
                </>
              )}
            </button>

            {avatarState === 'SPEAKING' && (
              <button
                onClick={handleStopSpeaking}
                className="px-4 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white text-xs font-hud font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
              >
                <Square className="w-3.5 h-3.5" />
                <span>INTERRUPT</span>
              </button>
            )}

            {/* Continuous Dialogue Mode Toggle */}
            <button
              onClick={handleToggleContinuous}
              title="Continuous Hands-Free Dialogue Mode"
              className={`px-4 py-3 rounded-full border text-xs font-hud font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                settings.continuous
                  ? 'bg-white text-black border-white'
                  : 'bg-black/80 text-gray-400 hover:text-white border-white/20 hover:border-white/40'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>CONTINUOUS: {settings.continuous ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center space-y-1">
          <div className="text-xs font-hud font-bold tracking-widest text-white uppercase">
            {avatarState === 'LISTENING'
              ? 'SPEAK YOUR DIRECTIVE INTO THE MICROPHONE'
              : 'CLICK TO ACTIVATE NATURAL VOICE CONVERSATION'}
          </div>
          <div className="text-[10px] font-mono text-gray-400">
            Procedural 3D Cranial Anatomy • Biological Blinking • Neural Synapse Core
          </div>
        </div>
      </HolographicCard>

      {/* Dialogue Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HolographicCard title="HEARD TRANSCRIPTION" badge="INPUT" glowColor="white">
          <p className="text-xs font-mono text-white min-h-[70px] leading-relaxed">
            {transcript ? `"${transcript}"` : 'Awaiting vocal transmission...'}
          </p>
        </HolographicCard>

        <HolographicCard title="JARVIS RESPONSE" badge="OUTPUT" glowColor="white">
          <p className="text-xs font-mono text-gray-300 min-h-[70px] leading-relaxed">
            {lastResponse ? `"${lastResponse}"` : 'Awaiting tactical synthesis...'}
          </p>
          {lastResponse && (
            <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => voiceEngine.speak(lastResponse)}
                className="px-4 py-1.5 rounded-full bg-white text-black font-black text-xs font-hud hover:bg-[#E5E5E5] flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,255,255,0.25)] cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>REPLAY VOCAL RESPONSE</span>
              </button>
            </div>
          )}
        </HolographicCard>
      </div>

      {/* Fallback Keyboard Terminal Input */}
      <HolographicCard title="TACTICAL FALLBACK INPUT" badge="MANUAL" glowColor="white">
        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={fallbackText}
            onChange={(e) => setFallbackText(e.target.value)}
            placeholder="Type vocal simulation directive (e.g. 'Status report', 'What is the weather?')..."
            className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-3 min-h-[46px] sm:min-h-0 text-sm font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="px-6 py-3 min-h-[46px] sm:min-h-0 rounded-xl bg-white text-black text-xs font-hud font-black uppercase hover:bg-[#E5E5E5] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSMIT</span>
          </button>
        </form>
      </HolographicCard>

      {/* Voice Synthesis Settings Card */}
      <HolographicCard title="SYNTHESIS CONFIGURATION" badge="VOCAL ENGINE" glowColor="white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-gray-400 mb-1">VOICE SELECTION</label>
            <select
              value={settings.voiceIndex}
              onChange={(e) => handleVoiceChange(Number(e.target.value))}
              className="w-full bg-black/70 border border-white/15 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-white"
            >
              {availableVoices.map((v, i) => (
                <option key={i} value={i} className="bg-black text-white">
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">SPEECH RATE: {settings.rate}x</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.rate}
              onChange={(e) => handleRateChange(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">VOLUME: {Math.round(settings.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.1"
              value={settings.volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      </HolographicCard>
    </div>
  );
};
export default VoicePage;
