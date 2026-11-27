import React, { useState, useEffect } from 'react';
import { Shield, Activity, Cpu, Wifi, Clock } from 'lucide-react';
import { ApiClient } from '../../services/api';

interface HUDProps {
  title?: string;
  subtext?: string;
}

export const HUD: React.FC<HUDProps> = ({
  title = 'J.A.R.V.I.S. AI COMMAND SYSTEM',
  subtext = 'ALL SUBSYSTEMS NOMINAL // DIGITAL HUMAN INTELLIGENCE ACTIVE',
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
      {/* Top Futuristic Telemetry HUD (Strict Monochrome) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[#080808]/90 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Left: Identity & Core Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-2xl border border-white/30 bg-[#111111] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse shadow-[0_0_12px_#FFFFFF]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                (00) // COCKPIT
              </span>
              <span className="text-[10px] font-mono text-[#C8C8C8] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
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

        {/* Right: Live Telemetry Stats Ribbon (Monochrome Glass Pills) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-200">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] text-gray-400">CPU</span>
            <span className="font-bold text-white">{telemetry.cpu}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-200">
            <Activity className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] text-gray-400">RAM</span>
            <span className="font-bold text-white">{telemetry.ram} MB</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-200">
            <Wifi className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] text-gray-400">PING</span>
            <span className="font-bold text-white">{telemetry.latency}ms</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white">
            <Clock className="w-3.5 h-3.5 text-white" />
            <span className="font-bold tracking-widest text-white">{timeStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HUD;
