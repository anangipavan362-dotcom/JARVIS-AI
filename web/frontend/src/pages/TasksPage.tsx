import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { ApiClient } from '../services/api';
import { Task } from '../types';
import { NeonButton } from '../components/common/NeonButton';
import { sound } from '../utils/sound';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Natural language reminder prompt
  const [naturalPrompt, setNaturalPrompt] = useState('');

  const loadTasks = async () => {
    try {
      const list = await ApiClient.getTasks();
      setTasks(list);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    sound.playClick();

    try {
      if (editingTaskId) {
        await ApiClient.updateTask(editingTaskId, {
          title: title.trim(),
          description,
          priority,
          category,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });
      } else {
        await ApiClient.createTask({
          title: title.trim(),
          description,
          priority,
          category,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('General');
      setDueDate('');
      setEditingTaskId(null);
      loadTasks();
    } catch {}
  };

  const handleNaturalLanguageParse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalPrompt.trim()) return;
    sound.playProcessing();

    // Parse simple patterns like "Remind me to study DSA at 7 PM"
    let parsedTitle = naturalPrompt.trim();
    let parsedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    let parsedCategory = 'Reminder';

    if (parsedTitle.toLowerCase().startsWith('remind me to ')) {
      parsedTitle = parsedTitle.slice(13);
    } else if (parsedTitle.toLowerCase().startsWith('remind me ')) {
      parsedTitle = parsedTitle.slice(10);
    }

    if (naturalPrompt.toLowerCase().includes('urgent') || naturalPrompt.toLowerCase().includes('asap')) {
      parsedPriority = 'URGENT';
    }

    setTitle(parsedTitle);
    setCategory(parsedCategory);
    setPriority(parsedPriority);
    setNaturalPrompt('');
  };

  const handleToggle = async (t: Task) => {
    sound.playClick();
    try {
      await ApiClient.updateTask(t.id, { completed: !t.completed });
      loadTasks();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    sound.playClick();
    try {
      await ApiClient.deleteTask(id);
      loadTasks();
    } catch {}
  };

  const handleStartEdit = (t: Task) => {
    sound.playClick();
    setEditingTaskId(t.id);
    setTitle(t.title);
    setDescription(t.description || '');
    setPriority(t.priority);
    setCategory(t.category);
    setDueDate(t.due_date ? t.due_date.slice(0, 10) : '');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'PENDING') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            MY TASKS & MISSION REMINDERS
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            TACTICAL OBJECTIVE REGISTRY & AGENDA SCHEDULER
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded bg-black/60 border border-cyan-500/30">
          {(['ALL', 'PENDING', 'COMPLETED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                sound.playClick();
                setFilter(f);
              }}
              className={`px-3 py-1 rounded text-xs font-hud uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-cyan-950 border border-cyan-400 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Reminder Parsing Bar */}
      <div className="cyber-panel p-4 rounded-lg tech-corner-tl">
        <form onSubmit={handleNaturalLanguageParse} className="flex gap-2">
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Natural Language Parser (e.g. 'Remind me to study DSA at 7 PM' or 'Deploy microservices')..."
              value={naturalPrompt}
              onChange={(e) => setNaturalPrompt(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <NeonButton type="submit" variant="cyan" size="sm">
            PARSE & DRAFT
          </NeonButton>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Add / Edit Form */}
        <div className="cyber-panel rounded-lg p-5 tech-corner-tl tech-corner-br h-fit">
          <h3 className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/20">
            {editingTaskId ? 'EDIT MISSION DIRECTIVE' : 'LOG NEW DIRECTIVE'}
          </h3>

          <form onSubmit={handleSaveTask} className="space-y-3">
            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                OBJECTIVE TITLE
              </label>
              <input
                type="text"
                required
                placeholder="Directive summary..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                rows={2}
                placeholder="Tactical details, parameters, notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  PRIORITY
                </label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full px-2 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-200 focus:outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                  CATEGORY
                </label>
                <input
                  type="text"
                  placeholder="Security, Intel..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-hud tracking-wider text-cyan-300 uppercase mb-1">
                DUE DATE
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <NeonButton type="submit" variant="cyan" size="md" className="flex-1">
                {editingTaskId ? 'UPDATE' : 'ENROLL DIRECTIVE'}
              </NeonButton>
              {editingTaskId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTaskId(null);
                    setTitle('');
                    setDescription('');
                  }}
                  className="px-3 py-1.5 rounded border border-gray-600 text-xs font-mono text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Task List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-cyan-400 animate-pulse">
              SYNCING TASK MANIFEST...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="cyber-panel p-10 rounded-lg text-center font-mono text-xs text-gray-500">
              No directives logged in this view filter.
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`cyber-panel p-4 rounded-lg flex items-start justify-between gap-3 group transition-all ${
                  t.completed ? 'opacity-60 border-cyan-500/10' : 'hover:border-cyan-400'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggle(t)}
                    className="mt-0.5 text-cyan-400 hover:text-white"
                  >
                    {t.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-400" />
                    ) : (
                      <Square className="w-5 h-5 text-cyan-500/50" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-hud font-bold ${
                        t.completed ? 'line-through text-gray-500' : 'text-cyan-100'
                      }`}
                    >
                      {t.title}
                    </h4>
                    {t.description && (
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        {t.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] font-mono text-gray-400">
                      <span className="flex items-center gap-1 text-cyan-400/80">
                        <Tag className="w-3 h-3" /> {t.category}
                      </span>
                      {t.due_date && (
                        <span className="flex items-center gap-1 text-amber-300/80">
                          <Calendar className="w-3 h-3" /> Due: {new Date(t.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-hud font-bold uppercase border ${
                      t.priority === 'URGENT'
                        ? 'border-red-500 bg-red-950/60 text-red-300'
                        : t.priority === 'HIGH'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                    }`}
                  >
                    {t.priority}
                  </span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(t)}
                      className="p-1 hover:text-cyan-300 text-gray-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1 hover:text-red-400 text-gray-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
