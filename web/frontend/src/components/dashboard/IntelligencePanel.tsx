import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <HolographicCard title="INTELLIGENCE" badge="TELEMETRY" index="(03)" className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* 3D Global Network Visualizer (Monochrome) */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/60 border border-white/5">
          <Globe size={180} status="ONLINE" networkLatency={latency} />
        </div>

        {/* Tactical Subsystems Matrix */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
              <Zap className="w-3 h-3 text-white" />
              <span>AI ENGINE</span>
            </div>
            <div className="font-bold text-white mt-1 text-xs font-hud">
              {isDemo ? 'DEMO CORE' : 'DIGITAL HUMAN'}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
              <ShieldCheck className="w-3 h-3 text-white" />
              <span>SECURITY</span>
            </div>
            <div className="font-bold text-white mt-1 text-xs font-hud">
              ENCRYPTED
            </div>
          </div>
        </div>

        {/* Live Activity Telemetry Stream */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-hud font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10 mb-2">
            <span>AUDIT TRAIL</span>
            <span className="text-[9px] font-mono text-gray-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE FEED
            </span>
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
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] flex flex-col"
                >
                  <span className="text-white font-bold tracking-tight">
                    {act.action}
                  </span>
                  <span className="text-gray-400 text-[10px] truncate mt-0.5">
                    {act.details}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Diagnostics Action */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => {
            sound.playClick();
            navigate('/system');
          }}
          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-xs font-hud font-bold text-gray-300 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>SYSTEM DIAGNOSTICS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </HolographicCard>
  );
};
export default IntelligencePanel;
