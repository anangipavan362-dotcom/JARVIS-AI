import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bot,
  Mic,
  CloudSun,
  Trophy,
  Newspaper,
  CheckSquare,
  FileText,
  Activity,
  Cpu,
  Settings,
  X
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { title: 'Ask JARVIS AI', desc: 'Initialize conversational AI consultation', path: '/chat', icon: Bot },
    { title: 'Voice Assistant', desc: 'Open speech-recognition command module', path: '/voice', icon: Mic },
    { title: 'Meteorological Sensors', desc: 'Check global weather, humidity, and forecasts', path: '/weather', icon: CloudSun },
    { title: 'Sports Center', desc: 'Cricket, Football, and F1 updates', path: '/sports', icon: Trophy },
    { title: 'Global News Feed', desc: 'Latest technology, AI, and science dispatches', path: '/news', icon: Newspaper },
    { title: 'Task Registry', desc: 'Add, view, or organize mission objectives', path: '/tasks', icon: CheckSquare },
    { title: 'Daily Briefing', desc: 'Synthesized daily situational briefing', path: '/briefing', icon: FileText },
    { title: 'System Telemetry', desc: 'Monitor server, database, and latency metrics', path: '/system', icon: Activity },
    { title: 'Memory Banks', desc: 'Inspect user preferences and stored parameters', path: '/memory', icon: Cpu },
    { title: 'System Configuration', desc: 'HUD theme, voice speed, and privacy settings', path: '/settings', icon: Settings },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else sound.playClick();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    sound.playClick();
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 z-50 p-4">
      <div className="w-full max-w-xl bg-[#06101E] border border-cyan-400/60 rounded-lg shadow-[0_0_40px_rgba(0,229,255,0.25)] tech-corner-tl tech-corner-br overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-cyan-500/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-cyan-100 placeholder-cyan-500/40 text-sm font-mono focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-cyan-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-gray-500">
              No matching JARVIS command routines located.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-cyan-950/50 border border-transparent hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="p-2 rounded bg-black/60 border border-cyan-500/30 group-hover:border-cyan-400">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-hud font-bold text-cyan-200 group-hover:text-white uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2 bg-black/40 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-cyan-400/50">
          <span>Navigate: ↑ ↓</span>
          <span>Select: [Enter]</span>
          <span>Close: [Esc]</span>
        </div>
      </div>
    </div>
  );
};
