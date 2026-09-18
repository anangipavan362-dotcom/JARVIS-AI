import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Activity, Cpu, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { HolographicCard } from '../hud/HolographicCard';
import { Globe } from '../3d/Globe';
import { ApiClient } from '../../services/api';
import { sound } from '../../utils/sound';

interface IntelligencePanelProps {
  isDemo?: boolean;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ isDemo = false }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [latency, setLatency] = useState<number>(18);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const sys = await ApiClient.getSystemStatus();
        if (sys) {
          setActivities(sys.recent_activities || []);
          setLatency(sys.database_latency_ms || 18);
        }
      } catch {}
    };
    fetchActivities();
    const interval = setInterval(fetchActivities, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HolographicCard title="LIVE INTELLIGENCE" badge="TELEMETRY" className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* 3D Global Network Visualizer */}
        <div className="flex flex-col items-center justify-center p-2 rounded bg-black/40 border border-cyan-500/20">
          <Globe size={180} status="ONLINE" networkLatency={latency} />
        </div>

        {/* Tactical Subsystems Matrix */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
            <div className="flex items-center gap-1 text-[10px] text-cyan-400/70">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>AI ENGINE</span>
            </div>
            <div className="font-bold text-cyan-200 mt-0.5">
              {isDemo ? 'DEMO CORE' : 'GEMINI ACTIVE'}
            </div>
          </div>

          <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
            <div className="flex items-center gap-1 text-[10px] text-green-400/70">
              <ShieldCheck className="w-3 h-3 text-green-400" />
              <span>SECURITY</span>
            </div>
            <div className="font-bold text-green-400 mt-0.5">
              ENCRYPTED
            </div>
          </div>
        </div>

        {/* Live Activity Telemetry Stream */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-hud font-bold text-cyan-300 uppercase tracking-wider pb-1.5 border-b border-cyan-500/20 mb-2">
            <span>AUDIT TRAIL</span>
            <span className="text-[9px] font-mono text-cyan-500">LIVE FEED</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs font-mono">
            {activities.length === 0 ? (
              <div className="text-[11px] text-gray-500 py-3 text-center">
                Subsystems idling in nominal state.
              </div>
            ) : (
              activities.slice(0, 4).map((act, i) => (
                <div
                  key={act.id || i}
                  className="p-1.5 rounded bg-black/30 border border-cyan-500/10 text-[11px] flex flex-col"
                >
                  <span className="text-cyan-300 font-bold tracking-tight">
                    {act.action}
                  </span>
                  <span className="text-gray-400 text-[10px] truncate">
                    {act.details}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Diagnostics Action */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20">
        <button
          onClick={() => {
            sound.playClick();
            navigate('/system');
          }}
          className="w-full py-1.5 px-3 rounded bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-300 text-xs font-hud font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
        >
          <span>FULL SYSTEM DIAGNOSTICS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </HolographicCard>
  );
};
