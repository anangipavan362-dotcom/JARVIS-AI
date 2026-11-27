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

  return (
    <CyberCard
      title="MISSION DIRECTIVES"
      subtitle="TACTICAL OBJECTIVES"
      headerAction={
        <button
          onClick={() => navigate('/tasks')}
          className="text-gray-400 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
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
            className="flex-1 px-3 py-1.5 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-white text-black hover:bg-[#E5E5E5] transition-all cursor-pointer font-bold"
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
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => handleToggle(t)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {t.completed ? (
                      <CheckSquare className="w-4 h-4 text-white" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`truncate ${
                      t.completed ? 'line-through text-gray-500' : 'text-gray-200'
                    }`}
                  >
                    {t.title}
                  </span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300 shrink-0">
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
export default TasksWidget;
