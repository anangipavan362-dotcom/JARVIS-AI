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
    <div className="w-full select-none mb-4">
      {/* Sci-Fi Top Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 rounded-lg bg-black/60 border border-cyan-500/30 backdrop-blur-xl tech-corner-tl tech-corner-br">
        {/* Left: Identity & Core Status */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full border border-cyan-400/60 bg-cyan-950/60 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00E5FF]" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-hud font-black tracking-widest text-cyan-200 uppercase">
              {title}
            </h1>
            <p className="text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase">
              {subtext}
            </p>
          </div>
        </div>

        {/* Right: Live Telemetry Gauges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-cyan-400/70">CPU:</span>
            <span className="font-bold">{telemetry.cpu}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-500/20 text-blue-300">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-blue-400/70">RAM:</span>
            <span className="font-bold">{telemetry.ram} MB</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-500/20 text-green-300">
            <Wifi className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[10px] text-green-400/70">PING:</span>
            <span className="font-bold">{telemetry.latency}ms</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold tracking-widest">{timeStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
