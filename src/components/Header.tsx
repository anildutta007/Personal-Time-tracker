import React from 'react';
import { ActiveTimer } from '../types/tracker';
import { formatDurationDigital } from '../utils/formatters';
import { Plus, Download, Clock } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: 'tracker' | 'timeline' | 'reports';
  setCurrentTab: (tab: 'tracker' | 'timeline' | 'reports') => void;
  activeTimer: ActiveTimer | null;
  activeElapsedSeconds: number;
  onOpenManualEntry: () => void;
  onOpenExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeTimer,
  activeElapsedSeconds,
  onOpenManualEntry,
  onOpenExportReport,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ☀️
          </div>
          <button
            onClick={() => setCurrentTab('tracker')}
            className="text-lg font-bold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors text-left"
          >
            MyDay Tracker
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-600">
          <button
            onClick={() => setCurrentTab('tracker')}
            className={`transition-colors relative py-1 ${
              currentTab === 'tracker'
                ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                : 'hover:text-neutral-900'
            }`}
          >
            Record Time
          </button>
          <button
            onClick={() => setCurrentTab('timeline')}
            className={`transition-colors relative py-1 ${
              currentTab === 'timeline'
                ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                : 'hover:text-neutral-900'
            }`}
          >
            Daily Routine Log
          </button>
          <button
            onClick={() => setCurrentTab('reports')}
            className={`transition-colors relative py-1 ${
              currentTab === 'reports'
                ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                : 'hover:text-neutral-900'
            }`}
          >
            Time Reports
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />

          {activeTimer && (
            <button
              onClick={() => setCurrentTab('tracker')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-mono tabular-nums">
                {formatDurationDigital(activeElapsedSeconds)}
              </span>
              <span className="hidden sm:inline text-neutral-700 truncate max-w-[120px]">
                {activeTimer.activityName}
              </span>
            </button>
          )}

          <button
            onClick={onOpenManualEntry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
            title="Log a past activity like Sleep from 22:00 to 06:00"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Past Time</span>
          </button>

          <button
            onClick={onOpenExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex border-t border-neutral-100 px-4 py-2 gap-2 bg-neutral-50/50">
        <button
          onClick={() => setCurrentTab('tracker')}
          className={`flex-1 py-1.5 text-xs rounded-lg font-semibold text-center ${
            currentTab === 'tracker' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Record
        </button>
        <button
          onClick={() => setCurrentTab('timeline')}
          className={`flex-1 py-1.5 text-xs rounded-lg font-semibold text-center ${
            currentTab === 'timeline' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Daily Log
        </button>
        <button
          onClick={() => setCurrentTab('reports')}
          className={`flex-1 py-1.5 text-xs rounded-lg font-semibold text-center ${
            currentTab === 'reports' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
