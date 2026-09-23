import React, { useState } from 'react';
import { Activity, ActivityType } from '../types/tracker';
import { IconResolver } from './IconResolver';
import { Plus, Trash2, X } from 'lucide-react';

interface ActivityCatalogViewProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onAddActivity: (act: Omit<Activity, 'id' | 'isPredefined'>) => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivityCatalogView: React.FC<ActivityCatalogViewProps> = ({
  isOpen,
  onClose,
  activities,
  onAddActivity,
  onDeleteActivity,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Daily Routine');
  const [type, setType] = useState<ActivityType>('productive');
  const [color, setColor] = useState('#2563eb');
  const [iconName, setIconName] = useState('Clock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddActivity({
      name: name.trim(),
      category: category.trim(),
      type,
      color,
      iconName,
    });

    setName('');
    onClose();
  };

  const colors = [
    '#2563eb', // blue
    '#4f46e5', // indigo
    '#059669', // emerald
    '#0d9488', // teal
    '#d97706', // amber
    '#ea580c', // orange
    '#7c3aed', // violet
    '#e11d48', // rose
    '#475569', // slate
  ];

  const icons = [
    'Moon',
    'Briefcase',
    'Footprints',
    'Utensils',
    'Coffee',
    'Bath',
    'ShoppingCart',
    'Clock',
    'Home',
    'Tv',
    'Dumbbell',
    'BookOpen',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Add Custom Activity</h3>
            <p className="text-xs text-neutral-500">
              Create another activity for your daily life (e.g. Gardening, Gym, Reading)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gym Workout, Reading a Book, Gardening"
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Exercise, Hobbies, Chores"
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Color Accent
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-neutral-900 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIconName(ic)}
                  className={`p-2 rounded-xl border transition-colors ${
                    iconName === ic
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <IconResolver name={ic} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold"
            >
              Add Activity
            </button>
          </div>
        </form>

        {/* Existing Custom activities list if any */}
        {activities.some((a) => !a.isPredefined) && (
          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <div className="text-xs font-semibold text-neutral-700">Your Custom Activities:</div>
            <div className="space-y-1">
              {activities
                .filter((a) => !a.isPredefined)
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                      <span className="font-semibold text-neutral-900">{a.name}</span>
                      <span className="text-neutral-400">({a.category})</span>
                    </div>
                    <button
                      onClick={() => onDeleteActivity(a.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
