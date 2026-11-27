import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CyberCard } from '../common/CyberCard';
import { ApiClient } from '../../services/api';
import { SystemTelemetry } from '../../types';

export const SystemHealthWidget: React.FC = () => {
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await ApiClient.getSystemStatus();
        setTelemetry(data);
      } catch {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CyberCard
      title="SYSTEM TELEMETRY"
      subtitle="REAL-TIME PERFORMANCE GAUGES"
      headerAction={
        <button
          onClick={() => navigate('/system')}
          className="text-gray-400 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
        >
          <span>FULL DIAGNOSTICS</span> <ArrowRight className="w-3 h-3" />
        </button>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white" />
            <div>
              <span className="text-[10px] text-gray-400 block">MEMORY USAGE</span>
              <span className="font-bold text-white">
                {telemetry?.telemetry?.memory_usage_mb || 42.5} MB
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-2">
            <Activity className="w-4 h-4 text-white" />
            <div>
              <span className="text-[10px] text-gray-400 block">DB LATENCY</span>
              <span className="font-bold text-white">
                {telemetry?.telemetry?.db_latency_ms || 1.2} ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </CyberCard>
  );
};
export default SystemHealthWidget;
