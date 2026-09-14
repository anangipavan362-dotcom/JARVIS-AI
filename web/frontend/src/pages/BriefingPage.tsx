import React, { useState, useEffect } from 'react';
import { Play, Square, FileText, CloudSun, CheckSquare, Newspaper, Trophy, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/api';
import { NeonButton } from '../components/common/NeonButton';
import { ArcReactor } from '../components/hud/ArcReactor';
import { WaveformVisualizer } from '../components/hud/WaveformVisualizer';
import { sound } from '../utils/sound';

export const BriefingPage: React.FC = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [briefingText, setBriefingText] = useState('');
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [topHeadlines, setTopHeadlines] = useState<string[]>([]);
  const [sportsHeadlines, setSportsHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compileBriefing = async () => {
      try {
        const [w, tasks, newsData, sportsData] = await Promise.all([
          ApiClient.getWeather('San Francisco').catch(() => null),
          ApiClient.getTasks().catch(() => []),
          ApiClient.getNews('top').catch(() => ({ articles: [] })),
          ApiClient.getSports('cricket', 'live').catch(() => ({ events: [] })),
        ]);

        setWeatherInfo(w);
        const incomplete = tasks.filter((t: any) => !t.completed);
        setTaskCount(incomplete.length);

        const headlines = (newsData.articles || []).slice(0, 3).map((a: any) => a.headline);
        setTopHeadlines(headlines);

        const sHeadlines = (sportsData.events || []).slice(0, 2).map((e: any) => e.title);
        setSportsHeadlines(sHeadlines);

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const weatherSummary = w ? `${w.temperature} degrees Celsius with ${w.condition} in ${w.city}` : 'atmospheric conditions within nominal operational thresholds';
        const taskSummary = incomplete.length > 0 ? `You have ${incomplete.length} pending mission objectives scheduled in your active task manifest.` : 'Your tactical task manifest is completely cleared for today.';
        const newsSummary = headlines.length > 0 ? `In current intelligence dispatches: ${headlines.join('. ')}.` : 'Intelligence dispatches report stable global communications.';

        const fullScript = `Good day, ${user?.full_name || 'Operative'}. Today is ${dateStr}, and the current time is ${timeStr}. The meteorological telemetry indicates ${weatherSummary}. ${taskSummary} ${newsSummary} All systems remain fully operational. Standing by for your instructions.`;

        setBriefingText(fullScript);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    compileBriefing();
  }, [user]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (!briefingText) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(briefingText);
      utterance.rate = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsPlaying(true);
        sound.playProcessing();
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Audio speech synthesis is not supported on this device.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
          GOOD MORNING BRIEFING
        </h1>
        <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
          DAILY SITUATION REPORT & TACTICAL OVERVIEW
        </p>
      </div>

      {/* Main Console */}
      <div className="cyber-panel rounded-lg p-6 sm:p-8 tech-corner-tl tech-corner-br flex flex-col items-center justify-center relative">
        <div className="my-2">
          <ArcReactor state={isPlaying ? 'SPEAKING' : 'IDLE'} size={200} subtext={isPlaying ? 'VOCALIZING' : 'SYNCHRONIZED'} />
        </div>

        <div className="w-full max-w-sm my-3">
          <WaveformVisualizer active={isPlaying} barCount={22} />
        </div>

        <NeonButton
          variant={isPlaying ? 'alert' : 'cyan'}
          size="lg"
          onClick={handleTogglePlay}
          icon={isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        >
          {isPlaying ? 'PAUSE BRIEFING' : 'PLAY BRIEFING'}
        </NeonButton>

        {/* Script Preview Box */}
        <div className="w-full mt-6 p-4 rounded bg-black/60 border border-cyan-500/30 font-mono text-xs text-cyan-200/90 leading-relaxed max-h-60 overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-cyan-500/20 text-cyan-400 font-bold uppercase text-[10px]">
            <Volume2 className="w-3.5 h-3.5" />
            <span>TRANSCRIBED BRIEFING DISPATCH</span>
          </div>
          {loading ? 'COMPILING MISSION PARAMETERS...' : briefingText}
        </div>
      </div>

      {/* Briefing Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
          <div className="flex items-center gap-2 text-cyan-300 font-hud font-bold text-xs uppercase mb-2">
            <CloudSun className="w-4 h-4" />
            <span>METEOROLOGY</span>
          </div>
          <p className="text-xs font-mono text-gray-300">
            {weatherInfo ? `${weatherInfo.temperature}°C, ${weatherInfo.condition}` : 'Clear conditions'}
          </p>
        </div>

        <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
          <div className="flex items-center gap-2 text-cyan-300 font-hud font-bold text-xs uppercase mb-2">
            <CheckSquare className="w-4 h-4" />
            <span>DIRECTIVES</span>
          </div>
          <p className="text-xs font-mono text-gray-300">
            {taskCount} pending objective{taskCount === 1 ? '' : 's'} today.
          </p>
        </div>

        <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
          <div className="flex items-center gap-2 text-cyan-300 font-hud font-bold text-xs uppercase mb-2">
            <Newspaper className="w-4 h-4" />
            <span>TOP HEADLINE</span>
          </div>
          <p className="text-xs font-mono text-gray-300 line-clamp-2">
            {topHeadlines[0] || 'Global news channels steady.'}
          </p>
        </div>
      </div>
    </div>
  );
};
