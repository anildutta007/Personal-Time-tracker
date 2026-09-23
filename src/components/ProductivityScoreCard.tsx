import React from 'react';
import { formatDurationHuman } from '../utils/formatters';
import { Moon, Briefcase, Footprints, Clock, Coffee, AlertCircle, Sun } from 'lucide-react';

interface ProductivityScoreCardProps {
  totalSeconds: number;
  sleepSeconds: number;
  workSeconds: number;
  activeLifeSeconds: number;
  leisureSeconds: number;
  idleSeconds: number;
}

export const ProductivityScoreCard: React.FC<ProductivityScoreCardProps> = ({
  totalSeconds,
  sleepSeconds,
  workSeconds,
  activeLifeSeconds,
  leisureSeconds,
  idleSeconds,
}) => {
  // A day has 24 hours (86,400 seconds)
  const SECONDS_IN_DAY = 24 * 3600;
  const trackedPercentage = Math.min(100, Math.round((totalSeconds / SECONDS_IN_DAY) * 100));

  // Productive time is Office Work + active life routines (Dog Walk, chores, shopping)
  const totalProductiveSeconds = workSeconds + activeLifeSeconds;
  const productiveRate = totalSeconds > 0 ? Math.round((totalProductiveSeconds / totalSeconds) * 100) : 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Daily Balance
          </span>
          <h3 className="text-lg font-bold text-neutral-900">Today's Time Breakdown</h3>
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-500">Tracked Today</div>
          <div className="text-lg font-bold text-neutral-900 font-mono tabular-nums">
            {formatDurationHuman(totalSeconds)}
          </div>
        </div>
      </div>

      {/* Visual Proportional 24-Hour Bar */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
          {sleepSeconds > 0 && (
            <div
              style={{ width: `${(sleepSeconds / Math.max(totalSeconds, 1)) * 100}%` }}
              className="bg-indigo-600 transition-all duration-300"
              title={`Sleep: ${formatDurationHuman(sleepSeconds)}`}
            />
          )}
          {workSeconds > 0 && (
            <div
              style={{ width: `${(workSeconds / Math.max(totalSeconds, 1)) * 100}%` }}
              className="bg-blue-600 transition-all duration-300"
              title={`Office Work: ${formatDurationHuman(workSeconds)}`}
            />
          )}
          {activeLifeSeconds > 0 && (
            <div
              style={{ width: `${(activeLifeSeconds / Math.max(totalSeconds, 1)) * 100}%` }}
              className="bg-emerald-600 transition-all duration-300"
              title={`Routines & Errands: ${formatDurationHuman(activeLifeSeconds)}`}
            />
          )}
          {leisureSeconds > 0 && (
            <div
              style={{ width: `${(leisureSeconds / Math.max(totalSeconds, 1)) * 100}%` }}
              className="bg-amber-500 transition-all duration-300"
              title={`Tea & Leisure: ${formatDurationHuman(leisureSeconds)}`}
            />
          )}
          {idleSeconds > 0 && (
            <div
              style={{ width: `${(idleSeconds / Math.max(totalSeconds, 1)) * 100}%` }}
              className="bg-rose-500 transition-all duration-300"
              title={`Idle (Doing Nothing): ${formatDurationHuman(idleSeconds)}`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            <span>Sleep</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Office Work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Dog Walk & Errands</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Tea & Breaks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Idle Time</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-100">
        
        {/* Sleep */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
          <div className="text-xs text-indigo-700 flex items-center gap-1 font-semibold">
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sleep</span>
          </div>
          <div className="text-lg font-bold text-indigo-950 font-mono tabular-nums mt-1">
            {formatDurationHuman(sleepSeconds)}
          </div>
        </div>

        {/* Office Work */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
          <div className="text-xs text-blue-700 flex items-center gap-1 font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Office Work</span>
          </div>
          <div className="text-lg font-bold text-blue-950 font-mono tabular-nums mt-1">
            {formatDurationHuman(workSeconds)}
          </div>
        </div>

        {/* Dog walk & life routines */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
          <div className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
            <Footprints className="w-3.5 h-3.5 text-emerald-600" />
            <span>Routines & Dog</span>
          </div>
          <div className="text-lg font-bold text-emerald-950 font-mono tabular-nums mt-1">
            {formatDurationHuman(activeLifeSeconds)}
          </div>
        </div>

        {/* Idle time */}
        <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
          <div className="text-xs text-rose-700 flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span>Idle / Nothing</span>
          </div>
          <div className="text-lg font-bold text-rose-950 font-mono tabular-nums mt-1">
            {formatDurationHuman(idleSeconds)}
          </div>
        </div>

      </div>

    </div>
  );
};
