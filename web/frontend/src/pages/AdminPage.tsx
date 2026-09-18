import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  RefreshCw,
  UserCheck,
  Search,
  Sliders,
  Cpu,
  Volume2,
  FileText,
  BarChart3,
  KeyRound,
  Eye,
  X,
  AlertTriangle,
  Clock,
  Radio,
  Server
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ApiClient } from '../services/api';
import { User, AdminUserDetail, AdminAnalytics, AuditLog, SecurityEvent, SystemSetting } from '../types';
import { HolographicCard } from '../components/hud/HolographicCard';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

type AdminTab = 'USERS' | 'ANALYTICS' | 'SECURITY' | 'AI_VOICE' | 'AUDIT_LOGS';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('USERS');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters for users
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Editable settings local state
  const [settingEdits, setSettingEdits] = useState<Record<string, string>>({});
  const [settingSaveStatus, setSettingSaveStatus] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, u, a, logs, sec, setts] = await Promise.all([
        ApiClient.getAdminStats().catch(() => null),
        ApiClient.getAdminUsers().catch(() => []),
        ApiClient.getAdminAnalytics().catch(() => null),
        ApiClient.getAdminAuditLogs().catch(() => []),
        ApiClient.getAdminSecurityEvents().catch(() => []),
        ApiClient.getAdminSettings().catch(() => []),
      ]);
      setStats(s);
      setUsers(u);
      setAnalytics(a);
      setAuditLogs(logs);
      setSecurityEvents(sec);
      setSettings(setts);

      // Seed local editable settings
      const editMap: Record<string, string> = {};
      setts.forEach((st: SystemSetting) => {
        editMap[st.key] = st.value;
      });
      setSettingEdits(editMap);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInspectUser = async (user: User) => {
    sound.playClick();
    setDetailLoading(true);
    try {
      const detail = await ApiClient.getAdminUserDetail(user.id);
      setSelectedUserDetail(detail);
    } catch (e) {
      sound.playAlert();
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    sound.playClick();
    try {
      await ApiClient.updateAdminUser(user.id, { is_active: !user.is_active });
      loadData();
    } catch {}
  };

  const handleToggleRole = async (user: User) => {
    sound.playClick();
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await ApiClient.updateAdminUser(user.id, { role: newRole });
      loadData();
    } catch {}
  };

  const handleToggleStatus = async (user: User, newStatus: string) => {
    sound.playClick();
    try {
      await ApiClient.updateAdminUser(user.id, { status: newStatus });
      loadData();
      if (selectedUserDetail && selectedUserDetail.user.id === user.id) {
        handleInspectUser({ ...user, status: newStatus as any });
      }
    } catch {}
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Authorize permanent decommissioning of operative account?')) return;
    sound.playAlert();
    try {
      await ApiClient.deleteAdminUser(id);
      if (selectedUserDetail?.user.id === id) {
        setSelectedUserDetail(null);
      }
      loadData();
    } catch {}
  };

  const handleSaveSetting = async (key: string) => {
    sound.playClick();
    const val = settingEdits[key];
    if (val === undefined) return;
    try {
      await ApiClient.updateAdminSetting(key, val);
      setSettingSaveStatus(`Saved '${key}'`);
      setTimeout(() => setSettingSaveStatus(null), 3000);
      loadData();
    } catch {
      sound.playAlert();
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.username.toLowerCase().includes(q) ||
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchSearch && matchStatus && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none pb-12">
      {/* Admin Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
              JARVIS CYBER COMMAND CENTER
            </h1>
          </div>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            EXECUTIVE CONTROL, CLEARANCE GOVERNANCE & TELEMETRY SURVEILLANCE
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            loadData();
          }}
          className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-400 text-xs font-hud text-cyan-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>SYNCHRONIZE CORE</span>
        </button>
      </div>

      {/* Stats Counter Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'TOTAL OPERATIVES', val: stats?.total_users || users.length, glow: 'cyan' as const },
          { label: 'ACTIVE CLEARANCE', val: stats?.active_users || 0, glow: 'green' as const },
          { label: 'PENDING OTP', val: users.filter((u) => u.status === 'PENDING_VERIFICATION').length, glow: 'purple' as const },
          { label: 'ACTIVE SESSIONS', val: stats?.active_sessions || 0, glow: 'blue' as const },
          { label: 'SUSPENDED', val: users.filter((u) => u.status === 'SUSPENDED').length, glow: 'red' as const },
          { label: 'SECURITY EVENTS', val: securityEvents.length, glow: 'amber' as const },
          { label: 'HEALTH CORE', val: stats?.system_health || 'OPTIMAL', glow: 'green' as const },
        ].map((s, idx) => (
          <HolographicCard
            key={idx}
            glowColor={s.glow === 'amber' ? 'red' : s.glow}
            className="p-3 text-center"
          >
            <span className="text-[9px] font-mono text-gray-400 block uppercase">{s.label}</span>
            <span className="text-sm sm:text-base font-hud font-bold text-cyan-200 mt-1 block">
              {s.val}
            </span>
          </HolographicCard>
        ))}
      </div>

      {/* Command Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cyan-500/20 pb-2">
        {[
          { id: 'USERS', label: 'PERSONNEL DIRECTORY', icon: Users },
          { id: 'SECURITY', label: 'OTP & SECURITY GOVERNANCE', icon: KeyRound },
          { id: 'AI_VOICE', label: 'AI & VOCAL DIRECTIVES', icon: Cpu },
          { id: 'ANALYTICS', label: 'TELEMETRY ANALYTICS', icon: BarChart3 },
          { id: 'AUDIT_LOGS', label: 'AUDIT TRAIL', icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(t.id as AdminTab);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-hud tracking-wider uppercase transition-all ${
                isActive
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-black/60 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONNEL DIRECTORY */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="cyber-panel p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search operative, username, email..."
                className="w-full pl-9 pr-3 py-1.5 bg-black/70 border border-cyan-500/30 rounded text-xs font-mono text-cyan-200 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-gray-400 text-[10px]">STATUS:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/70 border border-cyan-500/30 rounded px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none"
                >
                  <option value="ALL">ALL STATES</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="PENDING_VERIFICATION">PENDING OTP</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-gray-400 text-[10px]">ROLE:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-black/70 border border-cyan-500/30 rounded px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none"
                >
                  <option value="ALL">ALL ROLES</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table wrapped in HolographicCard */}
          <HolographicCard glowColor="cyan" className="p-5">
            <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>PERSONNEL REGISTRY ({filteredUsers.length} OPERATIVES MATCHED)</span>
              </span>
            </h3>

            {loading ? (
              <div className="py-16 text-center font-mono text-xs text-cyan-400 animate-pulse">
                SCANNING CREDENTIAL ROSTER...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-gray-400">
                No operatives match current filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-cyan-500/30 text-[10px] font-hud text-cyan-400 uppercase">
                      <th className="pb-3 pr-4">OPERATIVE</th>
                      <th className="pb-3 px-4">EMAIL</th>
                      <th className="pb-3 px-4">ROLE</th>
                      <th className="pb-3 px-4">CLEARANCE STATE</th>
                      <th className="pb-3 px-4">ENROLLED</th>
                      <th className="pb-3 pl-4 text-right">TACTICAL ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-cyan-950/20">
                        <td className="py-3 pr-4">
                          <div className="font-bold text-cyan-100">{u.full_name}</div>
                          <div className="text-[10px] text-gray-400">@{u.username}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleRole(u)}
                            className={`px-2 py-0.5 rounded text-[9px] font-hud uppercase border ${
                              u.role === 'ADMIN'
                                ? 'border-purple-400 bg-purple-950 text-purple-300'
                                : 'border-cyan-500/40 bg-black text-cyan-300'
                            }`}
                          >
                            {u.role}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              u.status === 'VERIFIED'
                                ? 'text-green-400 bg-green-950/40 border border-green-500/30'
                                : u.status === 'PENDING_VERIFICATION'
                                ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                                : 'text-red-400 bg-red-950/40 border border-red-500/30'
                            }`}
                          >
                            {u.status === 'VERIFIED' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {u.status || (u.is_active ? 'VERIFIED' : 'SUSPENDED')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-[11px]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 pl-4 text-right space-x-2">
                          <button
                            onClick={() => handleInspectUser(u)}
                            title="Inspect Operative Dossier"
                            className="p-1 rounded bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 inline-flex items-center gap-1 text-[10px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>DOSSIER</span>
                          </button>
                          <button
                            onClick={() => handleToggleActive(u)}
                            title={u.is_active ? 'Suspend Operative' : 'Activate Operative'}
                            className="p-1 hover:text-cyan-300 text-gray-400"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            title="Purge Account"
                            className="p-1 hover:text-red-400 text-gray-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </HolographicCard>
        </div>
      )}

      {/* USER DOSSIER MODAL DRAWER */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl">
            <HolographicCard glowColor="purple" className="p-6 relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="absolute top-4 right-4 p-1 rounded bg-black/60 border border-cyan-500/30 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-purple-500/20 pb-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-400 flex items-center justify-center font-hud font-bold text-purple-300">
                  {selectedUserDetail.user.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-hud font-bold text-white">
                    {selectedUserDetail.user.full_name}
                  </h3>
                  <p className="text-xs font-mono text-purple-300">
                    @{selectedUserDetail.user.username} • {selectedUserDetail.user.email}
                  </p>
                </div>
              </div>

              {/* Status Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center text-xs font-mono">
                <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">ROLE</span>
                  <span className="font-bold text-cyan-300">{selectedUserDetail.user.role}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">CLEARANCE</span>
                  <span className="font-bold text-green-400">{selectedUserDetail.user.status}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">ACTIVE SESSIONS</span>
                  <span className="font-bold text-purple-300">
                    {selectedUserDetail.active_sessions_count}
                  </span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
                  <span className="text-[9px] text-gray-400 block">AI MESSAGES</span>
                  <span className="font-bold text-cyan-200">
                    {selectedUserDetail.messages_count}
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 mb-4 p-2 rounded bg-black/60 border border-purple-500/20 text-xs font-mono">
                <span className="text-gray-400">STATUS CONTROL:</span>
                {['VERIFIED', 'PENDING_VERIFICATION', 'SUSPENDED', 'DISABLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleToggleStatus(selectedUserDetail.user, st)}
                    className={`px-2 py-1 rounded text-[10px] font-hud uppercase ${
                      selectedUserDetail.user.status === st
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-black border border-purple-500/30 text-gray-300 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Recent Activity Stream */}
              <div className="space-y-2">
                <h4 className="text-xs font-hud font-bold text-cyan-300 uppercase">
                  RECENT MISSION ACTIVITY
                </h4>
                {selectedUserDetail.recent_activities.length === 0 ? (
                  <p className="text-xs font-mono text-gray-500 py-2">No activity events recorded.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedUserDetail.recent_activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-2 rounded bg-black/50 border border-cyan-500/10 text-xs font-mono flex items-center justify-between"
                      >
                        <div>
                          <span className="text-cyan-400 font-bold">{act.action}</span>
                          {act.details && <span className="text-gray-300 ml-2">- {act.details}</span>}
                        </div>
                        <span className="text-[10px] text-gray-500 shrink-0">
                          {new Date(act.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </HolographicCard>
          </div>
        </div>
      )}

      {/* TAB 2: OTP & SECURITY GOVERNANCE */}
      {activeTab === 'SECURITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OTP Policy Parameters */}
          <HolographicCard glowColor="purple" className="p-5 space-y-4">
            <h3 className="text-xs font-hud font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2 border-b border-purple-500/20 pb-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>CRYPTOGRAPHIC OTP CONFIGURATION</span>
            </h3>

            {settingSaveStatus && (
              <div className="p-2 rounded bg-green-950/50 border border-green-500/50 text-xs font-mono text-green-300 animate-pulse">
                ✓ {settingSaveStatus}
              </div>
            )}

            <div className="space-y-3 text-xs font-mono">
              {[
                { key: 'otp_length', label: 'OTP DIGIT LENGTH', desc: 'Length of numeric clearance code' },
                { key: 'otp_expiration_minutes', label: 'EXPIRATION DURATION (MINUTES)', desc: 'Valid duration before OTP code expires' },
                { key: 'otp_max_attempts', label: 'MAX VALIDATION ATTEMPTS', desc: 'Attempts before code is locked & invalidated' },
                { key: 'otp_resend_cooldown_sec', label: 'RESEND COOLDOWN (SECONDS)', desc: 'Required delay between resend dispatches' },
              ].map((item) => (
                <div key={item.key} className="p-3 rounded bg-black/60 border border-purple-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-hud font-bold text-purple-300">{item.label}</span>
                    <button
                      onClick={() => handleSaveSetting(item.key)}
                      className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-400 text-[10px] hover:text-white"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                  <input
                    type="text"
                    value={settingEdits[item.key] || ''}
                    onChange={(e) =>
                      setSettingEdits({ ...settingEdits, [item.key]: e.target.value })
                    }
                    className="w-full px-2.5 py-1 bg-black/80 border border-purple-500/40 rounded text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-300"
                  />
                </div>
              ))}
            </div>
          </HolographicCard>

          {/* Live Security Incidents Feed */}
          <HolographicCard glowColor="red" className="p-5 space-y-4">
            <h3 className="text-xs font-hud font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 border-b border-red-500/20 pb-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>SECURITY INCIDENT LOG ({securityEvents.length} RECORDED)</span>
            </h3>

            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {securityEvents.length === 0 ? (
                <p className="text-xs font-mono text-gray-500 py-8 text-center">
                  No security incidents or brute-force attempts recorded.
                </p>
              ) : (
                securityEvents.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-2.5 rounded bg-black/60 border border-red-500/20 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-bold">{sec.event_type}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(sec.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-300">{sec.details}</div>
                    <div className="text-[10px] text-gray-500">
                      IP: {sec.ip_address} • Target: {sec.identifier || 'N/A'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </HolographicCard>
        </div>
      )}

      {/* TAB 3: AI & VOCAL DIRECTIVES */}
      {activeTab === 'AI_VOICE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HolographicCard glowColor="cyan" className="p-5 space-y-4">
            <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>NEURAL AI DIRECTIVES</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              {[
                { key: 'ai_provider', label: 'PRIMARY AI PROVIDER', desc: 'Active cloud intelligence backend' },
                { key: 'ai_default_model', label: 'DEFAULT NEURAL MODEL', desc: 'Gemini model identifier' },
                { key: 'ai_temperature', label: 'TEMPERATURE / CREATIVITY', desc: '0.0 (Deterministic) - 1.0 (Creative)' },
              ].map((item) => (
                <div key={item.key} className="p-3 rounded bg-black/60 border border-cyan-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-hud font-bold text-cyan-300">{item.label}</span>
                    <button
                      onClick={() => handleSaveSetting(item.key)}
                      className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 text-[10px] hover:text-white"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                  <input
                    type="text"
                    value={settingEdits[item.key] || ''}
                    onChange={(e) =>
                      setSettingEdits({ ...settingEdits, [item.key]: e.target.value })
                    }
                    className="w-full px-2.5 py-1 bg-black/80 border border-cyan-500/40 rounded text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-300"
                  />
                </div>
              ))}
            </div>
          </HolographicCard>

          <HolographicCard glowColor="green" className="p-5 space-y-4">
            <h3 className="text-xs font-hud font-bold text-green-300 uppercase tracking-wider flex items-center gap-2 border-b border-green-500/20 pb-2">
              <Volume2 className="w-4 h-4 text-green-400" />
              <span>VOCAL SYNTHESIS DIRECTIVES</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              {[
                { key: 'voice_enabled', label: 'SPEECH SYNTHESIS ENGINE', desc: 'Enable/disable browser vocalization' },
                { key: 'voice_default_rate', label: 'PLAYBACK RATE / SPEED', desc: 'Audio cadence multiplier (1.0 = normal)' },
                { key: 'ui_3d_effects', label: '3D WEBGL RENDERING', desc: 'Enable central core & globe rendering' },
              ].map((item) => (
                <div key={item.key} className="p-3 rounded bg-black/60 border border-green-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-hud font-bold text-green-300">{item.label}</span>
                    <button
                      onClick={() => handleSaveSetting(item.key)}
                      className="px-2 py-0.5 rounded bg-green-950 text-green-300 border border-green-400 text-[10px] hover:text-white"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                  <input
                    type="text"
                    value={settingEdits[item.key] || ''}
                    onChange={(e) =>
                      setSettingEdits({ ...settingEdits, [item.key]: e.target.value })
                    }
                    className="w-full px-2.5 py-1 bg-black/80 border border-green-500/40 rounded text-xs font-mono text-green-200 focus:outline-none focus:border-green-300"
                  />
                </div>
              ))}
            </div>
          </HolographicCard>
        </div>
      )}

      {/* TAB 4: TELEMETRY ANALYTICS */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Registrations Chart */}
            <HolographicCard glowColor="cyan" className="p-5">
              <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20">
                OPERATIVE REGISTRATIONS (REAL TIMELINE)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.registration_timeline || []}>
                    <defs>
                      <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="#7A92A6" fontSize={11} fontStyle="monospace" />
                    <YAxis stroke="#7A92A6" fontSize={11} fontStyle="monospace" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050E1A', borderColor: '#00E5FF', fontSize: 11 }} />
                    <Area type="monotone" dataKey="registrations" stroke="#00E5FF" fillOpacity={1} fill="url(#regGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </HolographicCard>

            {/* AI Traffic Throughput Chart */}
            <HolographicCard glowColor="purple" className="p-5">
              <h3 className="text-xs font-hud font-bold text-purple-300 uppercase tracking-wider mb-4 pb-2 border-b border-purple-500/20">
                AI CONVERSATION TRAFFIC (MESSAGES)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.ai_activity_timeline || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(189, 0, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="#7A92A6" fontSize={11} fontStyle="monospace" />
                    <YAxis stroke="#7A92A6" fontSize={11} fontStyle="monospace" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050E1A', borderColor: '#BD00FF', fontSize: 11 }} />
                    <Bar dataKey="messages" fill="#BD00FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </HolographicCard>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === 'AUDIT_LOGS' && (
        <HolographicCard glowColor="cyan" className="p-5">
          <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>EXECUTIVE AUDIT TRAIL ({auditLogs.length} LOGGED ACTIONS)</span>
            </span>
          </h3>

          {auditLogs.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-gray-500">
              No executive audit actions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-cyan-500/30 text-[10px] font-hud text-cyan-400 uppercase">
                    <th className="pb-3 pr-4">ACTION</th>
                    <th className="pb-3 px-4">ACTOR</th>
                    <th className="pb-3 px-4">TARGET</th>
                    <th className="pb-3 px-4">DETAILS</th>
                    <th className="pb-3 px-4">IP ADDRESS</th>
                    <th className="pb-3 pl-4 text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-cyan-950/20">
                      <td className="py-2.5 pr-4 font-bold text-cyan-300">{log.action}</td>
                      <td className="py-2.5 px-4 text-gray-300">{log.actor_username || 'SYSTEM'}</td>
                      <td className="py-2.5 px-4 text-purple-300">
                        {log.target_type}: {log.target_id || 'GLOBAL'}
                      </td>
                      <td className="py-2.5 px-4 text-gray-400 max-w-xs truncate">{log.details}</td>
                      <td className="py-2.5 px-4 text-gray-500">{log.ip_address}</td>
                      <td className="py-2.5 pl-4 text-right text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </HolographicCard>
      )}
    </div>
  );
};
