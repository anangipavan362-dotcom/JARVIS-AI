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
      subtitle="DIGITAL HUMAN COGNITIVE ENGINE"
      badge={isDemo ? 'GUEST DEMO' : 'ONLINE'}
      headerAction={
        <StatusIndicator
          label="AI HEURISTICS"
          status={isDemo ? 'DEMO' : 'ACTIVE'}
        />
      }
    >
      <div className="space-y-3">
        {isDemo && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 text-gray-300 text-[11px] font-mono flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">GUEST MODE ACTIVE:</span> Autonomous quantum fallback operating. Add <code className="bg-black/80 px-1 py-0.5 rounded text-white border border-white/20">GEMINI_API_KEY</code> in Settings for live cloud generative streaming.
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-gray-400 block text-[10px]">CURRENT MODEL</span>
            <span className="text-white font-bold">
              {isDemo ? 'JARVIS-Digital-Human' : 'Gemini 2.5 Flash'}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-gray-400 block text-[10px]">MEMORY CONTEXT</span>
            <span className="text-white font-bold">
              {data?.recent_memories?.length || 0} Parameters Loaded
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="w-full mt-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white text-xs font-hud text-gray-200 hover:text-white transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-white" />
            <span>COMMENCE MISSION CONSULTATION</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </CyberCard>
  );
};
export default AIStatusWidget;
