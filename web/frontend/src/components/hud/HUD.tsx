import React, { useState, useEffect } from 'react';
import { Shield, Activity, Cpu, Wifi, Clock } from 'lucide-react';
import { ApiClient } from '../../services/api';

interface HUDProps {
  title?: string;
  subtext?: string;
}

export const HUD: React.FC<HUDProps> = ({
  title = 'J.A.R.V.I.S. AI COMMAND SYSTEM',
  subtext = 'ALL SUBSYSTEMS NOMINAL // LIVE NEURAL MATRIX'
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [telemetry, setTelemetry] = useState<{
    cpu: number;
    ram: number;
    latency: number;
  }>({
    cpu: 1.8,
    ram: 46.4,
    latency: 18,
  });

  // Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real system telemetry
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await ApiClient.getSystemStatus();
        if (data) {
          setTelemetry({
            cpu: data.cpu_percent || 1.8,
            ram: data.memory_rss_mb || 46.4,
            latency: data.database_latency_ms || 18,
          });
        }
      } catch {
        // Fallback default
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full select-none mb-6">
      {/* Agenciy Top Telemetry Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl glass-fusion border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Left: Identity & Core Status with Editorial Typography */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-2xl border border-cyan-400/50 bg-cyan-950/70 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00E5FF]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                (00) // COCKPIT
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                NOMINAL
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-hud font-bold tracking-wider text-white uppercase mt-0.5 flex flex-wrap items-baseline gap-1.5">
              <span>{title}</span>
            </h1>
            <p className="text-[10px] font-mono text-gray-400 tracking-wider">
              {subtext}
            </p>
          </div>
        </div>

        {/* Right: Live Telemetry Stats Ribbon */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-white/10 text-cyan-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-gray-400">CPU</span>
            <span className="font-bold text-white">{telemetry.cpu}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-white/10 text-indigo-300">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] text-gray-400">RAM</span>
            <span className="font-bold text-white">{telemetry.ram} MB</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-white/10 text-emerald-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-gray-400">PING</span>
            <span className="font-bold text-emerald-400">{telemetry.latency}ms</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-white/10 text-cyan-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold tracking-widest text-cyan-300">{timeStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
