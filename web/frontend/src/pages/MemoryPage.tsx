import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Trash2, Edit2, ShieldAlert, Tag, Search } from 'lucide-react';
import { ApiClient } from '../services/api';
import { Memory } from '../types';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

export const MemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form State
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('preferences');
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadMemories = async () => {
    try {
      const list = await ApiClient.getMemories();
      setMemories(list);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;
    sound.playClick();

    try {
      if (editingId) {
        await ApiClient.updateMemory(editingId, { key: key.trim(), value: value.trim(), category });
      } else {
        await ApiClient.createMemory({ key: key.trim(), value: value.trim(), category });
      }

      setKey('');
      setValue('');
      setCategory('preferences');
      setEditingId(null);
      loadMemories();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    sound.playClick();
    try {
      await ApiClient.deleteMemory(id);
      loadMemories();
    } catch {}
  };

  const handleStartEdit = (m: Memory) => {
    sound.playClick();
    setEditingId(m.id);
    setKey(m.key);
    setValue(m.value);
    setCategory(m.category);
  };

  const filtered = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(search.toLowerCase()) ||
      m.value.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            JARVIS NEURAL MEMORY
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            EXPLICIT USER-APPROVED PARAMETER & PREFERENCE BANKS
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>{memories.length} PARAMETERS STORED</span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 rounded bg-blue-950/30 border border-blue-500/30 flex items-start gap-3 text-xs font-mono text-blue-200">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p>
          PRIVACY DIRECTIVE: J.A.R.V.I.S. only commits memory facts via explicit user instruction. No sensitive credentials or credentials are stored silently. All records can be audited, edited, or purged at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Commit Form */}
        <div className="cyber-panel rounded-lg p-5 tech-corner-tl tech-corner-br h-fit">
          <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20">
            {editingId ? 'EDIT STORED PARAMETER' : 'COMMIT NEW PARAMETER'}
          </h3>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                PARAMETER KEY / TOPIC
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FavoriteLanguage, CoffeePreference"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                MEMORY VALUE / FACT
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. 'I prefer Python for backend engineering and React for HUDs.'"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                CATEGORY CLASSIFICATION
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-200 focus:outline-none"
              >
                <option value="preferences">User Preferences</option>
                <option value="technical">Technical Specs</option>
                <option value="routine">Mission Routines</option>
                <option value="general">General Notes</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <NeonButton type="submit" variant="cyan" size="md" className="flex-1">
                {editingId ? 'UPDATE PARAMETER' : 'COMMIT TO MEMORY'}
              </NeonButton>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setKey('');
                    setValue('');
                  }}
                  className="px-3 py-1.5 rounded border border-gray-600 text-xs font-mono text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Memory Grid */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search Box */}
          <div className="cyber-panel p-2.5 rounded-lg flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400 ml-1" />
            <input
              type="text"
              placeholder="Search memory banks by key, category, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none"
            />
          </div>

          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-cyan-400 animate-pulse">
              ACCESSING NEURAL MEMORY STORAGE BANKS...
            </div>
          ) : filtered.length === 0 ? (
            <div className="cyber-panel p-10 rounded-lg text-center font-mono text-xs text-gray-500">
              No memory parameters recorded.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="cyber-panel p-4 rounded-lg tech-corner-tl flex flex-col justify-between group hover:border-cyan-400 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono pb-2 mb-2 border-b border-cyan-500/15">
                      <span className="font-bold text-cyan-300 truncate mr-2">{m.key}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0">
                        {m.category}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-gray-200 leading-relaxed whitespace-pre-wrap">
                      "{m.value}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-cyan-500/10 text-[10px] font-mono text-gray-400">
                    <span>Stored: {new Date(m.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(m)}
                        className="hover:text-cyan-300 text-gray-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="hover:text-red-400 text-gray-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
