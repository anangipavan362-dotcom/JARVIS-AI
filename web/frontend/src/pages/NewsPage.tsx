import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Search, RefreshCw } from 'lucide-react';
import { ApiClient } from '../services/api';
import { NewsArticle } from '../types';
import { sound } from '../utils/sound';

export const NewsPage: React.FC = () => {
  const [category, setCategory] = useState('top');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const categories = [
    { id: 'top', label: 'Top News' },
    { id: 'india', label: 'India' },
    { id: 'world', label: 'World' },
    { id: 'technology', label: 'Technology' },
    { id: 'ai', label: 'AI' },
    { id: 'business', label: 'Business' },
    { id: 'science', label: 'Science' },
    { id: 'education', label: 'Education' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  const fetchNews = async (cat: string, q?: string) => {
    setLoading(true);
    try {
      const res = await ApiClient.getNews(cat, q);
      setArticles(res.articles || []);
      setIsDemo(res.is_demo);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    sound.playClick();
    fetchNews(category, query.trim());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            JARVIS NEWS CENTER
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            WORLDWIDE INFORMATION & REAL-TIME DISPATCH MATRIX
          </p>
        </div>

        {isDemo && (
          <span className="px-3 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-mono">
            DEMO CACHED FEED
          </span>
        )}
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.playClick();
              setCategory(c.id);
            }}
            className={`px-3 py-1.5 rounded text-xs font-hud uppercase tracking-wider whitespace-nowrap transition-all border ${
              category === c.id
                ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'bg-black/40 border-cyan-500/20 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="cyber-panel p-3 rounded-lg flex items-center gap-3">
        <Search className="w-4 h-4 text-cyan-400 ml-1" />
        <input
          type="text"
          placeholder={`Search within ${category} headlines...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          className="flex-1 bg-transparent text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-1 rounded bg-cyan-950 border border-cyan-400 text-xs font-hud text-cyan-300 hover:text-white"
        >
          FILTER
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-cyan-400 animate-pulse">
          INTERCEPTING WIRE SIGNALS ACROSS SATELLITE NODES...
        </div>
      ) : articles.length === 0 ? (
        <div className="cyber-panel p-8 rounded-lg text-center font-mono text-xs text-gray-500">
          No dispatches match the specified parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className="cyber-panel rounded-lg p-4 tech-corner-tl tech-corner-br flex flex-col justify-between group hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2 pb-1.5 border-b border-cyan-500/15">
                  <span className="font-bold truncate">{item.source}</span>
                  <span className="text-gray-400 shrink-0">{item.time}</span>
                </div>

                <h3 className="text-xs font-hud font-bold text-cyan-100 group-hover:text-cyan-300 line-clamp-3 leading-snug mb-2 transition-colors">
                  {item.headline}
                </h3>

                <p className="text-[11px] font-mono text-gray-400 line-clamp-3 leading-relaxed mb-4">
                  {item.summary}
                </p>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-[11px] font-hud text-cyan-300 hover:text-white transition-all mt-auto"
              >
                <span>READ MORE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
