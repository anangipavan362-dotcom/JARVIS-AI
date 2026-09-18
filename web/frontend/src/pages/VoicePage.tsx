import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Settings,
  Terminal,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AICore } from '../components/3d/AICore';
import { AudioVisualizer } from '../components/3d/AudioVisualizer';
import { HolographicCard } from '../components/hud/HolographicCard';
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
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

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

  const startListening = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the fallback terminal below.');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Acquire audio stream for Web Audio API visualizer
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setAudioStream(stream);
        }
      } catch {
        // Fallback visualizer if stream permission not granted
      }

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
        if (voiceState === 'LISTENING') {
          setVoiceState('READY');
        }
      };

      recognitionRef.current = recog;
      recog.start();
    } catch {
      setVoiceState('ERROR');
      setTimeout(() => setVoiceState('READY'), 2000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach((t) => t.stop());
      setAudioStream(null);
    }
    setVoiceState('READY');
  };

  const processVoiceCommand = async (command: string) => {
    setVoiceState('PROCESSING');
    try {
      const res = await ApiClient.sendChatMessage(command);
      setLastResponse(res.message.content);
      speakText(res.message.content);
    } catch {
      const fallback = 'Command received, Sir. Subsystems are acknowledging the directive.';
      setLastResponse(fallback);
      speakText(fallback);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackText.trim()) return;
    setTranscript(fallbackText);
    const text = fallbackText;
    setFallbackText('');
    processVoiceCommand(text);
  };

  const stateColors: Record<VoiceState, string> = {
    READY: '#00E5FF',
    LISTENING: '#00FF88',
    PROCESSING: '#9D4EDD',
    SPEAKING: '#FF9900',
    ERROR: '#FF2A55',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-black/60 border border-cyan-500/25 tech-corner-tl tech-corner-br">
        <div>
          <h1 className="text-xl sm:text-2xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            VOICE COMMAND MATRIX
          </h1>
          <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mt-0.5">
            ACOUSTIC SYNTHESIS & SPEECH RECOGNITION ENCLAVE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: stateColors[voiceState] }}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-200">
            {voiceState === 'READY' ? 'MIC READY' : (voiceState === 'LISTENING' ? 'LISTENING...' : (voiceState === 'PROCESSING' ? 'PROCESSING...' : (voiceState === 'SPEAKING' ? 'JARVIS SPEAKING...' : 'ERROR')))}
          </span>
        </div>
      </div>

      {/* Main Center Console: Circular Waveform Audio Visualizer & Mic Trigger */}
      <HolographicCard glowColor="cyan" className="flex flex-col items-center justify-center p-8 min-h-[380px]">
        <div className="relative flex items-center justify-center">
          {/* Circular Real-Time Audio Visualizer */}
          <AudioVisualizer
            isActive={voiceState === 'LISTENING' || voiceState === 'SPEAKING'}
            mode={voiceState === 'SPEAKING' ? 'SPEAKING' : (voiceState === 'LISTENING' ? 'LISTENING' : 'IDLE')}
            size={270}
            color={stateColors[voiceState]}
            audioStream={audioStream}
          />

          {/* Central Futuristic Microphone Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (voiceState === 'LISTENING') {
                stopListening();
              } else {
                startListening();
              }
            }}
            className="absolute w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:scale-105"
            style={{
              backgroundColor: voiceState === 'LISTENING' ? '#00FF88' : '#030712',
              border: `2px solid ${stateColors[voiceState]}`,
            }}
          >
            {voiceState === 'LISTENING' ? (
              <MicOff className="w-10 h-10 text-black animate-pulse" />
            ) : (
              <Mic className="w-10 h-10 text-cyan-300 hover:text-white" />
            )}
          </button>
        </div>

        <div className="mt-8 text-center space-y-1">
          <div className="text-xs font-hud font-bold tracking-widest text-cyan-300 uppercase">
            {voiceState === 'LISTENING' ? 'SPEAK INSTRUCTION NOW' : 'CLICK MICROPHONE TO INITIATE VOICE COMMAND'}
          </div>
          <div className="text-[10px] font-mono text-gray-400">
            Web Audio API Waveform Analysis with Automatic Fallback Heuristics
          </div>
        </div>
      </HolographicCard>

      {/* Dialogue Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HolographicCard title="HEARD TRANSCRIPTION" badge="INPUT">
          <p className="text-xs font-mono text-cyan-200 min-h-[70px] leading-relaxed">
            {transcript ? `"${transcript}"` : 'Awaiting vocal transmission...'}
          </p>
        </HolographicCard>

        <HolographicCard title="JARVIS RESPONSE" badge="OUTPUT" glowColor="purple">
          <p className="text-xs font-mono text-gray-300 min-h-[70px] leading-relaxed">
            {lastResponse ? `"${lastResponse}"` : 'Awaiting tactical synthesis...'}
          </p>
        </HolographicCard>
      </div>

      {/* Fallback Keyboard Terminal Input */}
      <HolographicCard title="TACTICAL FALLBACK INPUT" badge="MANUAL">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={fallbackText}
            onChange={(e) => setFallbackText(e.target.value)}
            placeholder="Type vocal simulation command (e.g. 'Status report', 'What is the weather?')..."
            className="flex-1 bg-black/60 border border-cyan-500/30 rounded px-3 py-2 text-xs font-mono text-cyan-200 placeholder:text-gray-600 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-cyan-950/80 border border-cyan-400 text-xs font-hud text-cyan-300 hover:text-white"
          >
            TRANSMIT
          </button>
        </form>
      </HolographicCard>

      {/* Voice Synthesis Settings Card */}
      <HolographicCard title="SYNTHESIS CONFIGURATION" badge="VOCAL ENGINE">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-cyan-400/80 mb-1">VOICE SELECTION</label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="w-full bg-black/60 border border-cyan-500/30 rounded p-1.5 text-xs text-cyan-200 focus:outline-none"
            >
              {availableVoices.map((v, i) => (
                <option key={i} value={i}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-cyan-400/80 mb-1">SPEECH RATE: {speed}x</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-cyan-400/80 mb-1">VOLUME: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </HolographicCard>
    </div>
  );
};
