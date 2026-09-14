import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Lock,
  Download,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/api';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Delete account confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    try {
      await ApiClient.updateProfile({ full_name: fullName, avatar_url: avatarUrl });
      setIsEditing(false);
      refreshUser();
    } catch {}
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    setPwdError('');
    try {
      sound.playClick();
      await ApiClient.changePassword({ old_password: oldPassword, new_password: newPassword });
      setPwdSuccess('ACCESS KEY UPDATED.');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setShowPasswordChange(false), 1500);
    } catch (err: any) {
      sound.playAlert();
      setPwdError(err.message || 'PASSWORD CHANGE FAILED');
    }
  };

  const handleDownloadMyData = async () => {
    sound.playClick();
    try {
      const data = await ApiClient.exportUserData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JARVIS_Data_Export_${user?.username}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    sound.playAlert();
    try {
      await ApiClient.deleteAccount();
      logout();
      navigate('/register');
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
          MY OPERATIVE PROFILE
        </h1>
        <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
          CREDENTIAL CLEARANCE & PERSONNEL ARCHIVES
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="cyber-panel rounded-lg p-6 sm:p-8 tech-corner-tl tech-corner-br">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-cyan-500/20">
          <div className="w-24 h-24 rounded-full border-2 border-cyan-400 bg-cyan-950/60 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-cyan-300" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-hud font-bold text-white uppercase tracking-wider">
                  {user?.full_name}
                </h2>
                <p className="text-xs font-mono text-cyan-400">@{user?.username}</p>
              </div>

              <span className="px-3 py-1 rounded bg-cyan-950/80 border border-cyan-400 text-xs font-hud font-bold text-cyan-300 uppercase self-center sm:self-auto">
                CLEARANCE: {user?.role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 text-xs font-mono text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Enrolled: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="pt-6 space-y-4">
            <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase">UPDATE PERSONNEL DATA</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-hud text-gray-400 uppercase mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-hud text-gray-400 uppercase mb-1">AVATAR URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <NeonButton type="submit" variant="cyan" size="sm">
                SAVE CHANGES
              </NeonButton>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded border border-gray-600 text-xs font-mono text-gray-400 hover:text-white"
              >
                CANCEL
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-6 flex flex-wrap items-center gap-3">
            <NeonButton
              variant="cyan"
              size="sm"
              onClick={() => setIsEditing(true)}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            >
              EDIT PROFILE
            </NeonButton>

            <NeonButton
              variant="electric"
              size="sm"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              icon={<Lock className="w-3.5 h-3.5" />}
            >
              CHANGE PASSWORD
            </NeonButton>

            <NeonButton
              variant="ghost"
              size="sm"
              onClick={handleDownloadMyData}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              DOWNLOAD MY DATA
            </NeonButton>
          </div>
        )}

        {/* Change Password Form */}
        {showPasswordChange && (
          <form onSubmit={handleChangePassword} className="mt-6 pt-6 border-t border-cyan-500/20 space-y-3">
            <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase">CHANGE ACCESS PASSWORD</h3>
            {pwdError && (
              <div className="p-2 rounded bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="p-2 rounded bg-green-950/40 border border-green-500/40 text-green-300 text-xs font-mono">
                {pwdSuccess}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                required
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="password"
                required
                placeholder="New Password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <NeonButton type="submit" variant="electric" size="sm">
              UPDATE ACCESS KEY
            </NeonButton>
          </form>
        )}
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 rounded-lg bg-red-950/20 border border-red-500/30 space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-hud font-bold text-sm uppercase">
          <AlertTriangle className="w-5 h-5" />
          <span>RESTRICTED ZONE • DECOMMISSION ACCOUNT</span>
        </div>
        <p className="text-xs font-mono text-gray-300">
          Decommissioning permanently purges your profile, all mission conversations, tasks, and memory banks. This action cannot be reversed.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded bg-red-950/60 border border-red-500 text-xs font-hud font-bold text-red-300 hover:bg-red-900 hover:text-white transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>DELETE JARVIS ACCOUNT</span>
        </button>
      </div>

      {/* Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="cyber-panel p-6 rounded-lg max-w-md w-full border-red-500/60 space-y-4 tech-corner-tl">
            <h3 className="text-sm font-hud font-black text-red-400 uppercase">
              CONFIRM PERMANENT ACCOUNT DELETION
            </h3>
            <p className="text-xs font-mono text-gray-300 leading-relaxed">
              "This action permanently removes your account and associated data according to the application's retention policy."
            </p>
            <p className="text-xs font-mono text-amber-300">
              Type <strong className="text-white">DELETE</strong> to authorize system purge:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 bg-black border border-red-500/50 rounded text-xs font-mono text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded border border-gray-600 text-xs font-mono text-gray-400 hover:text-white"
              >
                ABORT
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-hud text-xs font-bold disabled:opacity-40"
              >
                {deleting ? 'PURGING...' : 'AUTHORIZE PURGE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
