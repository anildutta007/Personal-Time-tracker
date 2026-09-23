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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Daily Activities</h3>
          <p className="text-xs text-neutral-500">
            Press any button to start tracking your time
          </p>
        </div>

        <button
          onClick={onOpenCreateActivity}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-xl transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Grid of clean, friendly activity buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
              className={`p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between group shadow-2xs relative overflow-hidden ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-neutral-900 shadow-md'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 hover:shadow-xs'
              }`}
            >
              {/* Active Pulsing Indicator Badge */}
              {isActive && (
                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}

              <div className="space-y-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                    isActive ? 'bg-white/20' : ''
                  }`}
                  style={{ backgroundColor: isActive ? undefined : act.color }}
                >
                  <IconResolver name={act.iconName} className="w-5 h-5" />
                </div>

                <div>
                  <h4 className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-neutral-900'}`}>
                    {act.name}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {act.category}
                  </p>
                </div>
              </div>

              {/* Bottom Action Hint */}
              <div className="mt-4 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isActive ? 'text-emerald-400' : 'text-neutral-600'}`}>
                  {isActive ? 'Recording Now' : 'Tap to start'}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-rose-600 text-white' : 'bg-neutral-100 group-hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {isActive ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
