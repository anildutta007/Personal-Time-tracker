import React from 'react';
import { ActiveTimer, Activity } from '../types/tracker';
import { formatDurationDigital, formatTime } from '../utils/formatters';
import { IconResolver } from './IconResolver';
import { Square, Play, X, ArrowRight, Clock, Plus } from 'lucide-react';

interface ActiveTrackerCardProps {
  activeTimer: ActiveTimer | null;
  activeElapsedSeconds: number;
  activities: Activity[];
  onStop: (finalNote?: string) => void;
  onDiscard: () => void;
  onUpdateNote: (note: string) => void;
  onStartActivity: (activityId: string) => void;
  onOpenManualEntry: () => void;
}

export const ActiveTrackerCard: React.FC<ActiveTrackerCardProps> = ({
  activeTimer,
  activeElapsedSeconds,
  activities,
  onStop,
  onDiscard,
  onUpdateNote,
  onStartActivity,
  onOpenManualEntry,
}) => {
  if (!activeTimer) {
    // Idle state: invite the user simply
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-600">
          <Clock className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
            What are you doing right now?
          </h2>
          <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
            Choose an activity below to start tracking. Press Stop whenever you finish.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {activities.slice(0, 6).map((act) => (
            <button
              key={act.id}
              onClick={() => onStartActivity(act.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-colors shadow-2xs"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: act.color }} />
              <IconResolver name={act.iconName} className="w-3.5 h-3.5 text-neutral-600" />
              <span>{act.name}</span>
            </button>
          ))}
        </div>

        <div className="pt-2 text-xs text-neutral-400">
          Forgot to start a timer earlier?{' '}
          <button
            onClick={onOpenManualEntry}
            className="text-neutral-700 font-semibold underline hover:text-neutral-900"
          >
            Log a past activity manually
          </button>
        </div>
      </div>
    );
  }

  // Active Timer Recording State
  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden transition-all">
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: activeTimer.color }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Activity Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Recording in progress
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-300">
              Started at {formatTime(activeTimer.startTime)}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{ backgroundColor: activeTimer.color }}
            >
              <IconResolver name={activeTimer.iconName} className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {activeTimer.activityName}
              </h2>
              <span className="text-xs text-neutral-400">
                {activeTimer.category}
              </span>
            </div>
          </div>

          {/* Quick note input */}
          <div className="pt-1">
            <input
              type="text"
              value={activeTimer.note}
              onChange={(e) => onUpdateNote(e.target.value)}
              placeholder="Add optional note (e.g. went to park, grocery shopping)..."
              className="w-full max-w-md text-xs px-3 py-2 bg-neutral-800/80 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>
        </div>

        {/* Right: Big Timer & Tactile STOP Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 shrink-0">
          
          <div className="text-left md:text-right">
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white tabular-nums">
              {formatDurationDigital(activeElapsedSeconds)}
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              Elapsed Time
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onDiscard}
              className="px-3 py-2.5 text-xs text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>

            {/* Big Stop Button */}
            <button
              onClick={() => onStop()}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Activity</span>
            </button>
          </div>

        </div>

      </div>

      {/* Quick switch options right below */}
      <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-400">When finished, switch directly to:</span>
        {activities
          .filter((a) => a.id !== activeTimer.activityId)
          .slice(0, 5)
          .map((act) => (
            <button
              key={act.id}
              onClick={() => onStartActivity(act.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: act.color }} />
              <span>{act.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
};
