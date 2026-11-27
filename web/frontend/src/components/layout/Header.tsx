import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, ShieldCheck, Cpu, Database, Check } from 'lucide-react';
import { SoundToggle } from '../common/SoundToggle';
import { ApiClient } from '../../services/api';
import { Notification } from '../../types';
import { sound } from '../../utils/sound';

interface HeaderProps {
  title?: string;
  italicWord?: string;
  indexBadge?: string;
  onOpenMobile?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Command',
  italicWord = 'Center',
  indexBadge = '/01',
  onOpenMobile,
  onOpenCommandPalette
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotifs = async () => {
    try {
      const list = await ApiClient.getNotifications();
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch {}
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    sound.playClick();
    await ApiClient.markAllNotificationsRead();
    fetchNotifs();
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#02050f]/80 backdrop-blur-2xl px-4 lg:px-6 flex items-center justify-between z-20 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Left Area: Mobile Toggle, View Title & Agenciy Numbered Index */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl border border-white/10 glass-fusion text-cyan-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {indexBadge && (
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
              {indexBadge}
            </span>
          )}

          <div>
            <h2 className="text-sm lg:text-base font-hud font-bold tracking-wider text-white uppercase flex items-baseline gap-1.5">
              <span>{title}</span>
              {italicWord && (
                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 lowercase text-base lg:text-lg">
                  {italicWord}
                </span>
              )}
            </h2>
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-300">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> ZERO-TRUST TLS 1.3
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-300">
                <Cpu className="w-3 h-3 text-indigo-400" /> GEMINI 2.5 FLASH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Command Palette Quick Search Trigger (Agenciy Pill) */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full glass-fusion border border-white/10 text-xs font-mono text-gray-400 hover:border-cyan-400/50 hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Execute Command or Directive...</span>
          <kbd className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-cyan-300 font-mono">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Area: Telemetry Clock, Audio Toggle, Notifications */}
      <div className="flex items-center gap-3">
        {/* HUD Clock */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-mono font-bold tracking-widest text-cyan-300">
            {timeStr}
          </span>
          <span className="text-[9px] font-mono text-gray-400 -mt-1 tracking-wider uppercase">
            {dateStr}
          </span>
        </div>

        <SoundToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              sound.playClick();
              setShowNotifMenu(!showNotifMenu);
            }}
            className="relative p-2 rounded-full border border-white/10 glass-fusion text-cyan-300 hover:text-white hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[9px] font-mono font-bold text-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 glass-fusion bg-[#030612]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3.5 z-50 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-hud font-bold text-cyan-200 uppercase tracking-wider">
                  SYSTEM LOGS & ALERTS
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-mono text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs font-mono text-gray-500 text-center py-4">
                    No active mission notices.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        n.read
                          ? 'border-white/5 bg-black/40 text-gray-400'
                          : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-100 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                      }`}
                    >
                      <div className="font-hud font-bold tracking-wide text-cyan-300">
                        {n.title}
                      </div>
                      <div className="text-[11px] font-mono mt-0.5 text-gray-300 leading-relaxed">
                        {n.message}
                      </div>
                      <div className="text-[9px] font-mono text-gray-500 mt-1">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
