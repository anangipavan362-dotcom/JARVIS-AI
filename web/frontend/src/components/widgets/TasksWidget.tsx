import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Square, Plus, ArrowRight } from 'lucide-react';
import { CyberCard } from '../common/CyberCard';
import { Task } from '../../types';
import { ApiClient } from '../../services/api';
import { sound } from '../../utils/sound';

interface TasksWidgetProps {
  tasks: Task[];
  onRefresh?: () => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ tasks, onRefresh }) => {
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      sound.playClick();
      await ApiClient.createTask({
        title: newTitle.trim(),
        priority: 'MEDIUM',
        category: 'Mission Directive',
      });
      setNewTitle('');
      setAdding(false);
      onRefresh?.();
    } catch {}
  };

  const handleToggle = async (t: Task) => {
    sound.playClick();
    try {
      await ApiClient.updateTask(t.id, { completed: !t.completed });
      onRefresh?.();
    } catch {}
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT': return 'text-red-400 border-red-500/50 bg-red-950/40';
      case 'HIGH': return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
      case 'LOW': return 'text-gray-400 border-gray-500/50 bg-gray-950/40';
      default: return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40';
    }
  };

  return (
    <CyberCard
      title="MISSION DIRECTIVES"
      subtitle="TACTICAL OBJECTIVES"
      headerAction={
        <button
          onClick={() => navigate('/tasks')}
          className="text-cyan-400 hover:text-white text-xs font-mono flex items-center gap-1"
        >
          <span>ALL TASKS</span> <ArrowRight className="w-3 h-3" />
        </button>
      }
    >
      <div className="space-y-3">
        {/* Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="Log new mission directive..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="p-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-900 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Task Items */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-xs font-mono text-gray-500 py-3 text-center">
              All tactical objectives accomplished.
            </p>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded bg-black/40 border border-cyan-500/15 text-xs font-mono"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => handleToggle(t)}
                    className="text-cyan-400 hover:text-white transition-colors"
                  >
                    {t.completed ? (
                      <CheckSquare className="w-4 h-4 text-green-400" />
                    ) : (
                      <Square className="w-4 h-4 text-cyan-500/50" />
                    )}
                  </button>
                  <span
                    className={`truncate ${
                      t.completed ? 'line-through text-gray-500' : 'text-cyan-100'
                    }`}
                  >
                    {t.title}
                  </span>
                </div>
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-mono rounded border uppercase shrink-0 ${getPriorityColor(
                    t.priority
                  )}`}
                >
                  {t.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </CyberCard>
  );
};
