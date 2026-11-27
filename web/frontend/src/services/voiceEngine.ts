// ============================================================================
// J.A.R.V.I.S. VOICE AI & SPEECH SYNTHESIS ENGINE
// Real-time Speech-to-Text, Text-to-Speech & Viseme Audio Analysis
// Synchronized with Holographic 3D Digital Human Avatar
// ============================================================================

import { ApiClient } from './api';

export type AvatarState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'PROCESSING' | 'ERROR' | 'SLEEPING';

export interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceIndex: number;
  continuous: boolean;
}

type StateListener = (state: AvatarState) => void;
type AudioLevelListener = (level: number) => void;
type TranscriptListener = (transcript: string, isFinal: boolean) => void;

class VoiceEngine {
  private state: AvatarState = 'IDLE';
  private audioLevel: number = 0;
  private settings: VoiceSettings = {
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    voiceIndex: 0,
    continuous: false,
  };

  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private speechOscillatorTimer: any = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  private stateListeners: Set<StateListener> = new Set();
  private audioListeners: Set<AudioLevelListener> = new Set();
  private transcriptListeners: Set<TranscriptListener> = new Set();

  constructor() {
    this.initVoices();
  }

  // -------------------------------------------------------------
  // Voice Synthesis Initialization
  // -------------------------------------------------------------
  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.availableVoices = voices;
        // Prefer natural, English, or masculine/cyber AI voices if available
        const preferred = voices.findIndex(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('David') ||
              v.name.includes('George') ||
              v.name.includes('Daniel') ||
              v.name.includes('Guy'))
        );
        if (preferred >= 0) {
          this.settings.voiceIndex = preferred;
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...partial };
  }

  // -------------------------------------------------------------
  // State & Subscriber Management
  // -------------------------------------------------------------
  public getState(): AvatarState {
    return this.state;
  }

  public setState(next: AvatarState): void {
    if (this.state === next) return;
    this.state = next;
    this.stateListeners.forEach((fn) => fn(next));
  }

  public getAudioLevel(): number {
    return this.audioLevel;
  }

  private setAudioLevel(lvl: number): void {
    const clamped = Math.max(0, Math.min(1, lvl));
    this.audioLevel = clamped;
    this.audioListeners.forEach((fn) => fn(clamped));
  }

  public onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => this.stateListeners.delete(listener);
  }

  public onAudioLevel(listener: AudioLevelListener): () => void {
    this.audioListeners.add(listener);
    return () => this.audioListeners.delete(listener);
  }

  public onTranscript(listener: TranscriptListener): () => void {
    this.transcriptListeners.add(listener);
    return () => this.transcriptListeners.delete(listener);
  }

  // -------------------------------------------------------------
  // Web Audio Analyser (Live Microphone)
  // -------------------------------------------------------------
  private async setupMicrophoneAnalysis(): Promise<void> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStream = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const pollAudio = () => {
          if (!this.analyser || this.state !== 'LISTENING') return;
          this.analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength;
          // Normalize 0..255 to 0..1 with non-linear curve for expressive animation
          const norm = Math.min(1.0, Math.pow(avg / 128.0, 1.4));
          this.setAudioLevel(norm);

          this.animFrameId = requestAnimationFrame(pollAudio);
        };

        pollAudio();
      }
    } catch {
      // Microphone permissions denied or unneeded
    }
  }

  private teardownMicrophoneAnalysis(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
  }

  // -------------------------------------------------------------
  // Speech Recognition (STT)
  // -------------------------------------------------------------
  public async startListening(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.setState('ERROR');
      return false;
    }

    // Stop speaking if currently active
    this.stopSpeaking();

    try {
      await this.setupMicrophoneAnalysis();

      const recog = new SpeechRecognition();
      recog.continuous = this.settings.continuous;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onstart = () => {
        this.setState('LISTENING');
      };

      recog.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        const text = finalText || interimText;
        this.transcriptListeners.forEach((fn) => fn(text, Boolean(finalText)));

        if (finalText.trim().length > 0) {
          this.stopListening();
          this.processDirective(finalText.trim());
        }
      };

      recog.onerror = () => {
        this.setState('ERROR');
        setTimeout(() => {
          if (this.state === 'ERROR') this.setState('IDLE');
        }, 1800);
      };

      recog.onend = () => {
        this.teardownMicrophoneAnalysis();
        if (this.state === 'LISTENING') {
          this.setState('IDLE');
        }
      };

      this.recognition = recog;
      recog.start();
      return true;
    } catch {
      this.setState('ERROR');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
    this.teardownMicrophoneAnalysis();
    if (this.state === 'LISTENING') {
      this.setState('IDLE');
    }
    this.setAudioLevel(0);
  }

  // -------------------------------------------------------------
  // Speech Synthesis & Viseme Generation (TTS)
  // -------------------------------------------------------------
  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.setState('IDLE');
        resolve();
        return;
      }

      this.stopSpeaking();
      this.setState('SPEAKING');

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.availableVoices[this.settings.voiceIndex]) {
        utterance.voice = this.availableVoices[this.settings.voiceIndex];
      }
      utterance.pitch = this.settings.pitch;
      utterance.rate = this.settings.rate;
      utterance.volume = this.settings.volume;

      // Realistic speech modulation simulation for real-time jaw articulation
      let phase = 0;
      this.speechOscillatorTimer = setInterval(() => {
        phase += 0.35;
        // Complex multi-frequency wave mimicking speech cadence & syllable bursts
        const speechWave =
          Math.sin(phase) * 0.4 +
          Math.sin(phase * 2.3) * 0.3 +
          Math.cos(phase * 0.7) * 0.2 +
          0.3;
        this.setAudioLevel(Math.max(0.08, Math.min(0.95, speechWave)));
      }, 50);

      utterance.onend = () => {
        this.cleanupSpeech();
        if (this.settings.continuous) {
          this.startListening();
        } else {
          this.setState('IDLE');
        }
        resolve();
      };

      utterance.onerror = () => {
        this.cleanupSpeech();
        this.setState('IDLE');
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.cleanupSpeech();
    if (this.state === 'SPEAKING') {
      this.setState('IDLE');
    }
  }

  private cleanupSpeech(): void {
    if (this.speechOscillatorTimer) {
      clearInterval(this.speechOscillatorTimer);
      this.speechOscillatorTimer = null;
    }
    this.setAudioLevel(0);
  }

  // -------------------------------------------------------------
  // Full Voice Directive Pipeline (Reasoning + Vocalization)
  // -------------------------------------------------------------
  public async processDirective(command: string): Promise<string> {
    this.setState('THINKING');

    try {
      const res = await ApiClient.sendChatMessage(command);
      const answer = res.message.content || 'Directive processed, sir.';
      await this.speak(answer);
      return answer;
    } catch {
      this.setState('ERROR');
      const fallback = 'Neural uplink temporarily degraded. Standing by for local instructions.';
      await this.speak(fallback);
      return fallback;
    }
  }

  // Immediate interrupt
  public interrupt(): void {
    this.stopListening();
    this.stopSpeaking();
    this.setState('IDLE');
  }
}

export const voiceEngine = new VoiceEngine();
