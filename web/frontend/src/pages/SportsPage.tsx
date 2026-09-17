import React, { useState, useEffect } from 'react';
import { Trophy, ExternalLink, Activity, Calendar, Radio } from 'lucide-react';
import { ApiClient } from '../services/api';
import { SportsEvent } from '../types';
import { sound } from '../utils/sound';

export const SportsPage: React.FC = () => {
  const [category, setCategory] = useState('cricket');
  const [tab, setTab] = useState<'live' | 'upcoming' | 'recent'>('live');
  const [events, setEvents] = useState<SportsEvent[]>([]);
  const [statusText, setStatusText] = useState('ONLINE');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'cricket', label: 'Cricket' },
    { id: 'football', label: 'Football' },
    { id: 'f1', label: 'Formula 1' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'basketball', label: 'Basketball' },
  ];

  const commands = [
    'Sports update',
    'Latest cricket score',
    'India next match',
    "Today's football",
    'Latest F1 news',
  ];

  const fetchSports = async (cat: string, currentTab: string) => {
    setLoading(true);
    try {
      const res = await ApiClient.getSports(cat, currentTab);
      setEvents(res.events || []);
      setStatusText(res.status || 'ONLINE');
    } catch {
      setStatusText('LIVE DATA UNAVAILABLE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports(category, tab);
  }, [category, tab]);

  const handleCommand = (cmd: string) => {
    sound.playClick();
    if (cmd.includes('cricket')) setCategory('cricket');
    else if (cmd.includes('football')) setCategory('football');
    else if (cmd.includes('F1')) setCategory('f1');
    fetchSports(category, tab);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            JARVIS SPORTS CENTER
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            GLOBAL ATHLETIC TELEMETRY & FIXTURE RADAR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded text-xs font-hud font-bold border uppercase ${
              statusText === 'ONLINE'
                ? 'bg-green-950/60 border-green-400 text-green-300'
                : 'bg-red-950/60 border-red-400 text-red-300'
            }`}
          >
            {statusText}
          </span>
        </div>
      </div>

      {/* Quick Tactical Command Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">QUICK PROTOCOLS:</span>
        {commands.map((cmd, i) => (
          <button
            key={i}
            onClick={() => handleCommand(cmd)}
            className="px-2.5 py-1 rounded bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400 text-[11px] font-mono text-cyan-300 whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Sport Category Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.playClick();
              setCategory(c.id);
            }}
            className={`px-4 py-2 rounded text-xs font-hud uppercase tracking-wider transition-all border ${
              category === c.id
                ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'bg-black/40 border-cyan-500/20 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Status Tabs: LIVE / UPCOMING / RECENT */}
      <div className="flex border-b border-cyan-500/30">
        {(['live', 'upcoming', 'recent'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              sound.playClick();
              setTab(t);
            }}
            className={`px-6 py-2.5 font-hud text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-[2px] ${
              tab === t
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-gray-400 hover:text-cyan-200'
            }`}
          >
            {t === 'live' && '● '}
            {t}
          </button>
        ))}
      </div>

      {/* Events Listing */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-cyan-400 animate-pulse">
          ACQUIRING SPORTS BROADCAST TELEMETRY...
        </div>
      ) : events.length === 0 ? (
        <div className="cyber-panel p-8 rounded-lg text-center font-mono text-xs text-gray-500">
          LIVE DATA UNAVAILABLE FOR THIS SELECTION.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e, idx) => (
            <div
              key={idx}
              className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 pb-2 mb-2 border-b border-cyan-500/15">
                  <span className="font-bold">{e.tournament}</span>
                  <span className="text-gray-400">{e.date}</span>
                </div>

                <h3 className="text-sm font-hud font-bold text-cyan-100 mb-2">
                  {e.title}
                </h3>

                <div className="flex items-center justify-between text-xs font-mono p-2 rounded bg-black/50 border border-cyan-500/20 mb-3">
                  <span className="text-gray-400">FIXTURE STATUS:</span>
                  <span className="text-cyan-300 font-bold">{e.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-500/15 text-[11px] font-mono">
                <span className="text-gray-400">SOURCE: {e.source}</span>
                <a
                  href={e.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-300 hover:text-white"
                >
                  <span>OFFICIAL COVERAGE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
