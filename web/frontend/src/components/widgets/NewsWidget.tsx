import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CyberCard } from '../common/CyberCard';
import { ApiClient } from '../../services/api';
import { NewsArticle } from '../../types';

export const NewsWidget: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await ApiClient.getNews('technology');
        setArticles(data.articles?.slice(0, 3) || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <CyberCard
      title="INTELLIGENCE WIRE"
      subtitle="TECHNOLOGY & AI DISPATCHES"
      headerAction={
        <button
          onClick={() => navigate('/news')}
          className="text-cyan-400 hover:text-white text-xs font-mono flex items-center gap-1"
        >
          <span>ALL DISPATCHES</span> <ArrowRight className="w-3 h-3" />
        </button>
      }
    >
      {loading ? (
        <div className="py-6 text-center font-mono text-xs text-cyan-400/60 animate-pulse">
          INTERCEPTING RSS WIRE FEEDS...
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-2.5">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded bg-black/40 border border-cyan-500/15 hover:border-cyan-500/40 transition-all text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-hud font-bold text-cyan-200 hover:text-cyan-400 line-clamp-2 transition-colors"
                >
                  {item.headline}
                </a>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-500/60 shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-gray-400">
                <span className="text-cyan-400/80">{item.source}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs font-mono text-gray-500 py-4 text-center">
          No dispatches received.
        </div>
      )}
    </CyberCard>
  );
};
