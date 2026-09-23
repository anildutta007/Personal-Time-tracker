import React, { useState } from 'react';
import { formatDurationHuman } from '../utils/formatters';
import { Moon, Briefcase, Footprints, Clock, Coffee, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const maxSec = Math.max(totalSeconds, 1);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2.5">
      {/* Header bar with total tracked and expand toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-900">Today's Balance</span>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-xs font-semibold text-neutral-700 font-mono">
            {formatDurationHuman(totalSeconds)} tracked
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Visual Proportional 24-Hour Bar */}
      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
        {sleepSeconds > 0 && (
          <div
            style={{ width: `${(sleepSeconds / maxSec) * 100}%` }}
            className="bg-indigo-600 transition-all duration-300"
            title={`Sleep: ${formatDurationHuman(sleepSeconds)}`}
          />
        )}
        {workSeconds > 0 && (
          <div
            style={{ width: `${(workSeconds / maxSec) * 100}%` }}
            className="bg-blue-600 transition-all duration-300"
            title={`Work: ${formatDurationHuman(workSeconds)}`}
          />
        )}
        {activeLifeSeconds > 0 && (
          <div
            style={{ width: `${(activeLifeSeconds / maxSec) * 100}%` }}
            className="bg-emerald-600 transition-all duration-300"
            title={`Routines & Errands: ${formatDurationHuman(activeLifeSeconds)}`}
          />
        )}
        {leisureSeconds > 0 && (
          <div
            style={{ width: `${(leisureSeconds / maxSec) * 100}%` }}
            className="bg-amber-500 transition-all duration-300"
            title={`Tea & Leisure: ${formatDurationHuman(leisureSeconds)}`}
          />
        )}
        {idleSeconds > 0 && (
          <div
            style={{ width: `${(idleSeconds / maxSec) * 100}%` }}
            className="bg-rose-500 transition-all duration-300"
            title={`Idle: ${formatDurationHuman(idleSeconds)}`}
          />
        )}
      </div>

      {/* Compact horizontal metrics chips */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-neutral-600">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
          <span>Sleep: <strong className="text-neutral-900 font-mono">{formatDurationHuman(sleepSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <span>Work: <strong className="text-neutral-900 font-mono">{formatDurationHuman(workSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span>Routines: <strong className="text-neutral-900 font-mono">{formatDurationHuman(activeLifeSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Tea: <strong className="text-neutral-900 font-mono">{formatDurationHuman(leisureSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>Idle: <strong className="text-neutral-900 font-mono">{formatDurationHuman(idleSeconds)}</strong></span>
        </div>
      </div>

      {/* Optional Expanded Breakdown */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-xs">
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg">
            <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-600" />
              <span>Sleep</span>
            </div>
            <div className="text-base font-bold text-indigo-950 font-mono mt-0.5">
              {formatDurationHuman(sleepSeconds)}
            </div>
          </div>
          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg">
            <div className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-blue-600" />
              <span>Office Work</span>
            </div>
            <div className="text-base font-bold text-blue-950 font-mono mt-0.5">
              {formatDurationHuman(workSeconds)}
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Footprints className="w-3 h-3 text-emerald-600" />
              <span>Routines & Dog</span>
            </div>
            <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
              {formatDurationHuman(activeLifeSeconds)}
            </div>
          </div>
          <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-lg">
            <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-600" />
              <span>Idle Time</span>
            </div>
            <div className="text-base font-bold text-rose-950 font-mono mt-0.5">
              {formatDurationHuman(idleSeconds)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
