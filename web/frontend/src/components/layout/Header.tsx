import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, ShieldCheck, Cpu, Database, Check } from 'lucide-react';
import { SoundToggle } from '../common/SoundToggle';
import { ApiClient } from '../../services/api';
import { Notification } from '../../types';
import { sound } from '../../utils/sound';

interface HeaderProps {
  title?: string;
  onOpenMobile?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'COMMAND CENTER',
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
    <header className="h-16 border-b border-cyan-500/25 bg-black/60 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-20 select-none">
      {/* Left Area: Mobile Toggle & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded border border-cyan-500/30 text-cyan-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm lg:text-base font-hud font-bold tracking-wider text-cyan-200 uppercase">
            {title}
          </h2>
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-cyan-400/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-400" /> SECURE TLS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> NEURAL ACTIVE
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-400" /> DB ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Command Palette Quick Search Trigger */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-4 py-1.5 rounded bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-gray-400 hover:border-cyan-400 hover:text-cyan-200 transition-all tech-corner-tl"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Execute Command or Query...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-cyan-500/40 text-[9px] text-cyan-300">
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
          <span className="text-[9px] font-mono text-cyan-400/60 -mt-1 tracking-wider uppercase">
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
            className="relative p-2 rounded border border-cyan-500/30 bg-black/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-[#050E1A] border border-cyan-500/40 rounded shadow-2xl p-3 z-50 tech-corner-tl tech-corner-br">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 mb-2">
                <span className="text-xs font-hud font-bold text-cyan-200 uppercase">
                  SYSTEM LOGS & ALERTS
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-mono text-cyan-400 hover:text-white flex items-center gap-1"
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
                      className={`p-2 rounded border text-xs ${
                        n.read
                          ? 'border-cyan-500/10 bg-black/30 text-gray-400'
                          : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-100'
                      }`}
                    >
                      <div className="font-hud font-bold tracking-wide text-cyan-300">
                        {n.title}
                      </div>
                      <div className="text-[11px] font-mono mt-0.5 text-gray-300">
                        {n.message}
                      </div>
                      <div className="text-[9px] font-mono text-cyan-400/50 mt-1">
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
