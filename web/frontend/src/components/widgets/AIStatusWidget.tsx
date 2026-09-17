import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { CyberCard } from '../common/CyberCard';
import { StatusIndicator } from '../hud/StatusIndicator';
import { DashboardData } from '../../types';

export const AIStatusWidget: React.FC<{ data?: DashboardData }> = ({ data }) => {
  const navigate = useNavigate();
  const isDemo = data?.is_demo ?? true;

  return (
    <CyberCard
      title="NEURAL CORE STATUS"
      subtitle="GEMINI COGNITIVE ENGINE"
      badge={isDemo ? 'DEMO MODE' : 'ONLINE'}
      headerAction={
        <StatusIndicator
          label="AI HEURISTICS"
          status={isDemo ? 'DEMO' : 'ACTIVE'}
        />
      }
    >
      <div className="space-y-3">
        {isDemo && (
          <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">JARVIS DEMO MODE ACTIVE:</span> Intelligent rule heuristics are responding. Add your <code className="bg-black/50 px-1 py-0.5 rounded text-amber-200">GEMINI_API_KEY</code> in Settings to activate live Gemini generative streaming.
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
            <span className="text-gray-400 block text-[10px]">CURRENT MODEL</span>
            <span className="text-cyan-200 font-bold">
              {isDemo ? 'JARVIS-Demo-Core' : 'Gemini 2.5 Flash'}
            </span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
            <span className="text-gray-400 block text-[10px]">MEMORY CONTEXT</span>
            <span className="text-cyan-200 font-bold">
              {data?.recent_memories?.length || 0} Parameters Loaded
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="w-full mt-1 flex items-center justify-between px-3 py-2 rounded bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-300 text-xs font-hud text-cyan-300 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>COMMENCE MISSION CONSULTATION</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </CyberCard>
  );
};
