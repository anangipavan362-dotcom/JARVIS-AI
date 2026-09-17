import React, { useState } from 'react';
import { Search, ExternalLink, Globe, Youtube, Newspaper, Cpu, GraduationCap } from 'lucide-react';
import { ApiClient } from '../services/api';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('google');
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'google', label: 'Web Index', icon: Globe },
    { id: 'youtube', label: 'YouTube Intel', icon: Youtube },
    { id: 'news', label: 'News Wire', icon: Newspaper },
    { id: 'technology', label: 'Tech Databases', icon: Cpu },
    { id: 'academic', label: 'Scholar / Academic', icon: GraduationCap },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    sound.playProcessing();

    try {
      const data = await ApiClient.performSearch(query, category);
      setResults(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
          TACTICAL SEARCH HUB
        </h1>
        <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
          GLOBAL INTERNET INTELLIGENCE RECONNAISSANCE
        </p>
      </div>

      {/* Search Input Box */}
      <div className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              placeholder="Enter search parameters or technical query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/70 border border-cyan-500/40 rounded text-sm font-mono text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            />
          </div>

          {/* Engine Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCategory(c.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-hud uppercase tracking-wider transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'bg-black/40 border-cyan-500/20 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          <NeonButton
            type="submit"
            variant="cyan"
            size="md"
            loading={loading}
            className="w-full"
            icon={<Search className="w-4 h-4" />}
          >
            EXECUTE INTELLIGENCE QUERY
          </NeonButton>
        </form>
      </div>

      {/* Results / Providers Matrix */}
      {results && (
        <div className="cyber-panel rounded-lg p-6 tech-corner-tl tech-corner-br space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div>
              <span className="text-xs font-hud font-bold text-cyan-300 uppercase">
                QUERY DISPATCH TARGETS: "{results.query}"
              </span>
              <p className="text-[10px] font-mono text-cyan-500/70 mt-0.5">
                {results.instructions}
              </p>
            </div>
            <a
              href={results.target_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-400 text-xs font-hud text-cyan-200 hover:text-white"
            >
              <span>PRIMARY LAUNCH</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.providers?.map((p: any, i: number) => (
              <a
                key={i}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/30 flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-xs font-hud font-bold text-cyan-200 group-hover:text-white">
                    {p.name}
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-500/70 uppercase">
                    TYPE: {p.type}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-cyan-500 group-hover:text-cyan-300 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
