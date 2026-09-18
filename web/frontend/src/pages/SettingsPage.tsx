import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Bot,
  Mic,
  Monitor,
  Shield,
  Bell,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { ApiClient } from '../services/api';
import { UserSettings } from '../types';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'ai' | 'voice' | 'appearance' | 'privacy' | 'notifications'>('account');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [config, sessionList] = await Promise.all([
          ApiClient.getUserSettings(),
          ApiClient.getSessions(),
        ]);
        setSettings(config);
        setSessions(sessionList);
      } catch {}
    };
    fetchConfig();
  }, []);

  const handleUpdate = async (updates: Partial<UserSettings>) => {
    if (!settings) return;
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    setSaving(true);
    sound.playClick();
    try {
      await ApiClient.updateUserSettings(updates);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    sound.playAlert();
    try {
      await ApiClient.revokeOtherSessions();
      const updated = await ApiClient.getSessions();
      setSessions(updated);
    } catch {}
  };

  const tabs = [
    { id: 'account', label: 'Account & Sessions', icon: User },
    { id: 'ai', label: 'AI Parameters', icon: Bot },
    { id: 'voice', label: 'Voice & Speech', icon: Mic },
    { id: 'appearance', label: 'HUD & Appearance', icon: Monitor },
    { id: 'privacy', label: 'Privacy & Retention', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            SYSTEM CONFIGURATION
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            CUSTOMIZE J.A.R.V.I.S. INTERACTION & TELEMETRY PARAMETERS
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 rounded bg-green-950/60 border border-green-400 text-green-300 text-xs font-mono flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIG SAVED</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cyan-500/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-hud uppercase tracking-wider transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'bg-black/40 border-cyan-500/20 text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Panels */}
      <div className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br">
        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2">
                ACTIVE HARDWARE SESSIONS
              </h3>
              <p className="text-xs font-mono text-gray-400 mb-4">
                Active access nodes connected to this personal command center.
              </p>

              <div className="space-y-3">
                {sessions.map((s, i) => (
                  <div
                    key={s.id || i}
                    className="p-3.5 rounded bg-black/50 border border-cyan-500/25 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-cyan-200 block">
                          {s.device_info || 'Terminal Node'} ({s.browser || 'Web Client'})
                        </span>
                        <span className="text-[10px] text-gray-400">
                          IP: {s.ip_address} • Last Active: {new Date(s.last_active).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-hud uppercase text-green-400">
                      ● ACTIVE
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-cyan-500/20">
                <NeonButton
                  variant="alert"
                  size="sm"
                  onClick={handleRevokeOtherSessions}
                >
                  LOG OUT OTHER SESSIONS
                </NeonButton>
              </div>
            </div>
          </div>
        )}

        {/* AI PARAMETERS TAB */}
        {activeTab === 'ai' && settings && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2">
                NEURAL PERSONALITY & MODEL MATRIX
              </h3>
              <p className="text-xs font-mono text-gray-400 mb-4">
                Configure neural cognitive tone and response depth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">AI PERSONALITY PROFILE:</label>
                <select
                  value={settings.ai_personality}
                  onChange={(e) => handleUpdate({ ai_personality: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="jarvis">J.A.R.V.I.S. (Intelligent, Polite, Witty)</option>
                  <option value="friday">F.R.I.D.A.Y. (Direct, Tactical, Fast)</option>
                  <option value="academic">Scientific & Technical (Formal)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">RESPONSE LENGTH BEHAVIOR:</label>
                <select
                  value={settings.response_length}
                  onChange={(e) => handleUpdate({ response_length: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="adaptive">Adaptive (Auto-Sized)</option>
                  <option value="concise">Tactical Concise (Military style)</option>
                  <option value="exhaustive">Comprehensive Exhaustive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* VOICE & SPEECH TAB */}
        {activeTab === 'voice' && settings && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2">
                SPEECH RECOGNITION & SYNTHESIS
              </h3>
              <p className="text-xs font-mono text-gray-400 mb-4">
                Control speech recognition heuristics and audio playback speed.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voice_enabled}
                  onChange={(e) => handleUpdate({ voice_enabled: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span className="text-cyan-200">ENABLE VOICE RECOGNITION MODULE</span>
              </label>

              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>SPEECH RATE MULTIPLIER:</span>
                  <span className="text-cyan-300">{settings.voice_speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.1"
                  value={settings.voice_speed}
                  onChange={(e) => handleUpdate({ voice_speed: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && settings && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2">
                HUD VISUAL THEME & INTENSITY
              </h3>
              <p className="text-xs font-mono text-gray-400 mb-4">
                Adjust holographic glow, particle matrices, and HUD density.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">COLOR MATRIX THEME:</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleUpdate({ theme: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="jarvis_dark">JARVIS Dark (Pitch Black / Cyan Neon)</option>
                  <option value="midnight_blue">Midnight Blue (Deep Space Navy)</option>
                  <option value="high_contrast">High Contrast Cyber</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">GLOW INTENSITY:</label>
                <select
                  value={settings.glow_intensity}
                  onChange={(e) => handleUpdate({ glow_intensity: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="high">High Luminous Aura</option>
                  <option value="normal">Standard Hologram</option>
                  <option value="low">Subtle Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">3D HOLOGRAPHIC RENDERING:</label>
                <select
                  defaultValue={localStorage.getItem('jarvis_3d_enabled') || 'enabled'}
                  onChange={(e) => {
                    localStorage.setItem('jarvis_3d_enabled', e.target.value);
                    sound.playClick();
                  }}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="enabled">Enabled (WebGL 3D Core)</option>
                  <option value="disabled">Disabled (Lightweight 2D Mode)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">PERFORMANCE MODE:</label>
                <select
                  defaultValue={localStorage.getItem('jarvis_perf_mode') || 'high'}
                  onChange={(e) => {
                    localStorage.setItem('jarvis_perf_mode', e.target.value);
                    sound.playClick();
                  }}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="high">High Fidelity (Full Particle Matrix)</option>
                  <option value="battery">Battery Saver (Optimized FPS)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">ANIMATION INTENSITY:</label>
                <select
                  defaultValue={localStorage.getItem('jarvis_anim_intensity') || 'high'}
                  onChange={(e) => {
                    localStorage.setItem('jarvis_anim_intensity', e.target.value);
                    sound.playClick();
                  }}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="high">Dynamic Kinetic Orbitals</option>
                  <option value="balanced">Balanced Motion</option>
                  <option value="minimal">Minimal Ambient</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">INTERFACE SOUND EFFECTS:</label>
                <select
                  defaultValue={localStorage.getItem('jarvis_sound_enabled') || 'true'}
                  onChange={(e) => {
                    localStorage.setItem('jarvis_sound_enabled', e.target.value);
                    sound.playClick();
                  }}
                  className="w-full px-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-cyan-200 focus:outline-none"
                >
                  <option value="true">Active (Tactile Audio Feedback)</option>
                  <option value="false">Muted (Silent Protocol)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === 'privacy' && settings && (
          <div className="space-y-4 text-xs font-mono">
            <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2">
              PRIVACY & DATA RETENTION
            </h3>
            <p className="text-gray-400 mb-4">
              Control storage policies for mission dialogues and telemetry.
            </p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.history_retention}
                onChange={(e) => handleUpdate({ history_retention: e.target.checked })}
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="text-cyan-200">RETAIN CONSULTATION HISTORY IN DATABASE</span>
            </label>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && settings && (
          <div className="space-y-4 text-xs font-mono">
            <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-2">
              DISPATCH NOTIFICATION PREFERENCES
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notify_news}
                  onChange={(e) => handleUpdate({ notify_news: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span className="text-cyan-200">BREAKING INTELLIGENCE DISPATCHES</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notify_sports}
                  onChange={(e) => handleUpdate({ notify_sports: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span className="text-cyan-200">LIVE SPORTS FIXTURES & UPDATES</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notify_tasks}
                  onChange={(e) => handleUpdate({ notify_tasks: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
                <span className="text-cyan-200">MISSION TASK REMINDERS</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
