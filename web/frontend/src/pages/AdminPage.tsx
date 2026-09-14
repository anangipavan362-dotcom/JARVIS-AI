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
  UserCheck
} from 'lucide-react';
import { ApiClient } from '../services/api';
import { User } from '../types';
import { sound } from '../utils/sound';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        ApiClient.getAdminStats(),
        ApiClient.getAdminUsers(),
      ]);
      setStats(s);
      setUsers(u);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleActive = async (user: User) => {
    sound.playClick();
    try {
      await ApiClient.updateAdminUser(user.id, { is_active: !user.is_active });
      loadAdminData();
    } catch {}
  };

  const handleToggleRole = async (user: User) => {
    sound.playClick();
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await ApiClient.updateAdminUser(user.id, { role: newRole });
      loadAdminData();
    } catch {}
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Authorize permanent decommissioning of operative account?')) return;
    sound.playAlert();
    try {
      await ApiClient.deleteAdminUser(id);
      loadAdminData();
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            ADMIN TERMINAL CONTROL
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            PERSONNEL DIRECTORY & HIGH-LEVEL SYSTEM ADMINISTRATION
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            loadAdminData();
          }}
          className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-400 text-xs font-hud text-cyan-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH ADMIN TELEMETRY</span>
        </button>
      </div>

      {/* Stats Counter Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'TOTAL OPERATIVES', val: stats?.total_users || 0 },
          { label: 'ACTIVE USERS', val: stats?.active_users || 0 },
          { label: 'NEW TODAY', val: stats?.new_users_today || 0 },
          { label: 'SESSIONS', val: stats?.active_sessions || 0 },
          { label: 'API STATUS', val: stats?.api_status || 'NOMINAL' },
          { label: 'ERROR RATE', val: `${(stats?.error_rate || 0.02) * 100}%` },
          { label: 'HEALTH', val: stats?.system_health || 'OPTIMAL' },
        ].map((s, idx) => (
          <div
            key={idx}
            className="cyber-panel p-3 rounded-lg text-center tech-corner-tl"
          >
            <span className="text-[9px] font-mono text-gray-400 block uppercase">{s.label}</span>
            <span className="text-sm sm:text-base font-hud font-bold text-cyan-200 mt-1 block">
              {s.val}
            </span>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="cyber-panel rounded-lg p-5 tech-corner-tl tech-corner-br">
        <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>PERSONNEL REGISTRY MANAGEMENT</span>
        </h3>

        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-cyan-400 animate-pulse">
            SCANNING CREDENTIAL ROSTER...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyan-500/30 text-[10px] font-hud text-cyan-400 uppercase">
                  <th className="pb-3 pr-4">OPERATIVE</th>
                  <th className="pb-3 px-4">EMAIL</th>
                  <th className="pb-3 px-4">ROLE</th>
                  <th className="pb-3 px-4">STATUS</th>
                  <th className="pb-3 px-4">ENROLLED</th>
                  <th className="pb-3 pl-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {users.map((u) => (
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
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold ${
                          u.is_active ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {u.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 pl-4 text-right space-x-2">
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
      </div>
    </div>
  );
};
