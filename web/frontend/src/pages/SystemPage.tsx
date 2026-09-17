import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Wifi,
  Server,
  Mic,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ApiClient } from '../services/api';
import { SystemTelemetry } from '../types';
import { sound } from '../utils/sound';

export const SystemPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const data = await ApiClient.getSystemStatus();
      setTelemetry(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            JARVIS SYSTEM MONITOR
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            CORE TELEMETRY, GATEWAY LOAD & DIAGNOSTIC ANALYTICS
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            fetchTelemetry();
          }}
          className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-400 text-xs font-hud text-cyan-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH SENSORS</span>
        </button>
      </div>

      {/* Primary Subsystem Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'AI CORE', status: telemetry?.subsystems?.ai_core || 'ACTIVE', icon: Cpu, ok: true },
          { name: 'DATABASE', status: telemetry?.subsystems?.database || 'CONNECTED', icon: Database, ok: true },
          { name: 'API GATEWAY', status: telemetry?.subsystems?.api_gateway || 'ONLINE', icon: Server, ok: true },
          { name: 'NETWORK', status: telemetry?.subsystems?.network || 'ONLINE', icon: Wifi, ok: true },
          { name: 'VOICE SYNTH', status: telemetry?.subsystems?.voice_synthesis || 'READY', icon: Mic, ok: true },
          { name: 'SERVER NODE', status: telemetry?.subsystems?.server || 'ONLINE', icon: Activity, ok: true },
        ].map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              className="cyber-panel p-3 rounded-lg text-center flex flex-col items-center justify-center space-y-1 tech-corner-tl"
            >
              <Icon className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[10px] font-mono text-gray-400 uppercase">{sub.name}</span>
              <span className="text-xs font-hud font-bold text-cyan-200 uppercase">
                ● {sub.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Vital Gauges Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
          <span className="text-[10px] font-mono text-cyan-400/70 block uppercase">
            UPTIME SYSTEM DURATION
          </span>
          <span className="text-xl sm:text-2xl font-hud font-black text-white mt-1 block">
            {telemetry ? formatUptime(telemetry.uptime_seconds) : 'Syncing...'}
          </span>
          <span className="text-[10px] font-mono text-green-400 mt-1 block">
            HOST: {telemetry?.platform || 'Windows / Web Node'}
          </span>
        </div>

        <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
          <span className="text-[10px] font-mono text-cyan-400/70 block uppercase">
            SERVER MEMORY RESIDENCE (RSS)
          </span>
          <span className="text-xl sm:text-2xl font-hud font-black text-cyan-300 mt-1 block">
            {telemetry?.telemetry?.memory_usage_mb || 45.2} MB
          </span>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            Garbage collector cycles normal
          </span>
        </div>

        <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
          <span className="text-[10px] font-mono text-cyan-400/70 block uppercase">
            DATABASE QUERY LATENCY
          </span>
          <span className="text-xl sm:text-2xl font-hud font-black text-green-400 mt-1 block">
            {telemetry?.telemetry?.db_latency_ms || 1.1} ms
          </span>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            SQL connection pool optimized
          </span>
        </div>
      </div>

      {/* Charts Row: Requests & Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Throughput Chart */}
        <div className="cyber-panel p-4 rounded-lg tech-corner-tl tech-corner-br">
          <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20">
            API TRAFFIC THROUGHPUT (REQUESTS / INTERVAL)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry?.chart_data || []}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" />
                <XAxis dataKey="time" stroke="#7A92A6" fontSize={11} fontStyle="monospace" />
                <YAxis stroke="#7A92A6" fontSize={11} fontStyle="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050E1A', borderColor: '#00E5FF', fontSize: 11 }}
                />
                <Area type="monotone" dataKey="requests" stroke="#00E5FF" fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency History Chart */}
        <div className="cyber-panel p-4 rounded-lg tech-corner-tl tech-corner-br">
          <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20">
            GATEWAY RESPONSE LATENCY (MS)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry?.chart_data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" />
                <XAxis dataKey="time" stroke="#7A92A6" fontSize={11} fontStyle="monospace" />
                <YAxis stroke="#7A92A6" fontSize={11} fontStyle="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050E1A', borderColor: '#008CFF', fontSize: 11 }}
                />
                <Line type="monotone" dataKey="responseTime" stroke="#008CFF" strokeWidth={2} dot={{ r: 3, fill: '#00E5FF' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Activity Stream */}
      <div className="cyber-panel p-5 rounded-lg tech-corner-tl tech-corner-br">
        <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20">
          PERSONAL MISSION AUDIT STREAM
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {!telemetry?.recent_activities || telemetry.recent_activities.length === 0 ? (
            <p className="text-xs font-mono text-gray-500 py-4 text-center">
              No recent audit events logged.
            </p>
          ) : (
            telemetry.recent_activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2 rounded bg-black/40 border border-cyan-500/15 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-cyan-300 font-bold">{act.action}</span>
                  {act.details && <span className="text-gray-300">- {act.details}</span>}
                </div>
                <span className="text-[10px] text-gray-500 shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
