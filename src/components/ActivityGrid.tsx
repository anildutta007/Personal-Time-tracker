import React from 'react';
import { Activity, ActiveTimer } from '../types/tracker';
import { IconResolver } from './IconResolver';
import { Play, Square, Plus } from 'lucide-react';

interface ActivityGridProps {
  activities: Activity[];
  activeTimer: ActiveTimer | null;
  onStartActivity: (activityId: string) => void;
  onStopActiveTimer: () => void;
  onOpenCreateActivity: () => void;
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities,
  activeTimer,
  onStartActivity,
  onStopActiveTimer,
  onOpenCreateActivity,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            All Activities ({activities.length})
          </h2>
          <span className="text-[11px] text-neutral-500 hidden sm:inline">
            Tap to start or switch instantly
          </span>
        </div>

        <button
          onClick={onOpenCreateActivity}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* High-density, all-inclusive Grid that fits on one screen without scrolling */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {activities.map((act) => {
          const isActive = activeTimer?.activityId === act.id;

          return (
            <button
              key={act.id}
              onClick={() => {
                if (isActive) {
                  onStopActiveTimer();
                } else {
                  onStartActivity(act.id);
                }
              }}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-100 flex items-center justify-between gap-2.5 group relative select-none ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-emerald-500 shadow-sm'
                  : 'bg-white text-neutral-900 border-neutral-200/90 hover:border-neutral-400 hover:bg-neutral-50/50 shadow-2xs active:scale-[0.98]'
              }`}
            >
              {/* Active pulsing dot */}
              {isActive && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}

              <div className="flex items-center gap-2.5 min-w-0">
                {/* Colored icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs ${
                    isActive ? 'ring-1 ring-white/30' : ''
                  }`}
                  style={{ backgroundColor: act.color }}
                >
                  <IconResolver name={act.iconName} className="w-4 h-4" />
                </div>

                {/* Name & Category */}
                <div className="min-w-0">
                  <div
                    className={`text-xs sm:text-sm font-bold truncate leading-tight ${
                      isActive ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {act.name}
                  </div>
                  <div
                    className={`text-[10px] sm:text-[11px] truncate leading-normal ${
                      isActive ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {act.category}
                  </div>
                </div>
              </div>

              {/* Action Indicator Icon */}
              <div className="shrink-0">
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-rose-600 text-white'
                      : 'bg-neutral-100 group-hover:bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {isActive ? (
                    <Square className="w-2.5 h-2.5 fill-current" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  )}
                </span>
              </div>
            </button>
          );
        })}

        {/* Quick Add Custom Button Tile in the grid */}
        <button
          onClick={onOpenCreateActivity}
          className="p-2.5 sm:p-3 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-100/70 text-left transition-all duration-100 flex items-center gap-2.5 text-neutral-600 active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-neutral-800 truncate leading-tight">
              + Custom Task
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              Add new routine
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
