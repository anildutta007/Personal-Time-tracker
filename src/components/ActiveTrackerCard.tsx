import React, { useState } from 'react';
import { ActiveTimer, Activity } from '../types/tracker';
import { formatDurationDigital, formatTime } from '../utils/formatters';
import { IconResolver } from './IconResolver';
import { Square, X, Edit3, Check, Plus } from 'lucide-react';

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
  onStop,
  onDiscard,
  onUpdateNote,
  onOpenManualEntry,
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState('');

  // When no timer is running, show a compact banner that doesn't waste vertical space
  if (!activeTimer) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 shadow-2xs flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold text-neutral-800">
            Choose an activity below to start tracking
          </span>
          <span className="hidden sm:inline text-neutral-400">· Tap again to stop anytime</span>
        </div>
        <button
          onClick={onOpenManualEntry}
          className="text-neutral-600 hover:text-neutral-900 font-semibold underline shrink-0 transition-colors"
        >
          Log past time
        </button>
      </div>
    );
  }

  // Active Timer: High-visibility, compact recording bar
  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-md relative overflow-hidden border border-neutral-800">
      {/* Accent top highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: activeTimer.color }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Activity Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: activeTimer.color }}
          >
            <IconResolver name={activeTimer.iconName} className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Recording Now
              </span>
              <span className="text-neutral-600 text-xs">·</span>
              <span className="text-[11px] text-neutral-400 truncate">
                Started {formatTime(activeTimer.startTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {activeTimer.activityName}
              </h3>
              <span className="text-xs text-neutral-400 hidden xs:inline">
                ({activeTimer.category})
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Digital Timer & Stop Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t border-neutral-800 sm:border-0">
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white tabular-nums leading-none">
              {formatDurationDigital(activeElapsedSeconds)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Note toggle */}
            {!isEditingNote && (
              <button
                onClick={() => {
                  setNoteValue(activeTimer.note || '');
                  setIsEditingNote(true);
                }}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                title={activeTimer.note ? `Note: ${activeTimer.note}` : 'Add note'}
              >
                <Edit3 className="w-4 h-4" />
                {activeTimer.note && (
                  <span className="max-w-[70px] truncate text-[11px] text-neutral-300">
                    {activeTimer.note}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onDiscard}
              className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
              title="Cancel recording"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bold Stop Button */}
            <button
              onClick={() => onStop()}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Note input expander */}
      {isEditingNote && (
        <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Add note (e.g. walked in park)..."
            className="flex-1 text-xs px-2.5 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white"
            autoFocus
          />
          <button
            onClick={() => {
              onUpdateNote(noteValue);
              setIsEditingNote(false);
            }}
            className="p-1.5 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsEditingNote(false)}
            className="p-1.5 text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
