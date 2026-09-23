import React, { useState, useMemo, useEffect } from 'react';
import { useTimeTracker } from './hooks/useTimeTracker';
import { Header } from './components/Header';
import { ActiveTrackerCard } from './components/ActiveTrackerCard';
import { ActivityGrid } from './components/ActivityGrid';
import { ProductivityScoreCard } from './components/ProductivityScoreCard';
import { DailyTimeline } from './components/DailyTimeline';
import { ReportsView } from './components/ReportsView';
import { ActivityCatalogView } from './components/ActivityCatalogView';
import { ManualEntryModal } from './components/ManualEntryModal';
import { ExportModal } from './components/ExportModal';
import { calculateDayLifeMetrics } from './utils/analytics';
import { isToday } from './utils/formatters';

export default function App() {
  const {
    activities,
    entries,
    activeTimer,
    activeElapsedSeconds,
    startActivity,
    stopActiveTimer,
    discardActiveTimer,
    updateActiveTimerNote,
    addManualEntry,
    deleteEntry,
    updateEntry,
    addActivity,
    deleteActivity,
    resetToDefaults,
    clearAllEntries,
  } = useTimeTracker();

  const [currentTab, setCurrentTab] = useState<'tracker' | 'timeline' | 'reports'>('tracker');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);

  // Compute today's entries
  const todayEntries = useMemo(() => {
    return entries.filter((e) => isToday(e.startTime));
  }, [entries]);

  // Compute today's metrics including ongoing live timer
  const todayMetrics = useMemo(() => {
    return calculateDayLifeMetrics(
      todayEntries,
      activeTimer ? activeElapsedSeconds : 0,
      activeTimer?.activityId,
      activeTimer?.type
    );
  }, [todayEntries, activeTimer, activeElapsedSeconds]);

  // Keyboard shortcut (Space to stop recording if active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeTimer) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        stopActiveTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTimer, stopActiveTimer]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeTimer={activeTimer}
        activeElapsedSeconds={activeElapsedSeconds}
        onOpenManualEntry={() => setIsManualEntryOpen(true)}
        onOpenExportReport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-5 space-y-3 sm:space-y-4">
        
        {/* TAB 1: RECORD TIME */}
        {currentTab === 'tracker' && (
          <div className="space-y-3 sm:space-y-3.5">
            
            {/* Live Active Recording Banner or Minimal Ready Strip */}
            <ActiveTrackerCard
              activeTimer={activeTimer}
              activeElapsedSeconds={activeElapsedSeconds}
              activities={activities}
              onStop={stopActiveTimer}
              onDiscard={discardActiveTimer}
              onUpdateNote={updateActiveTimerNote}
              onStartActivity={startActivity}
              onOpenManualEntry={() => setIsManualEntryOpen(true)}
            />

            {/* Quick Activity Button Grid - All Tasks selectable immediately */}
            <ActivityGrid
              activities={activities}
              activeTimer={activeTimer}
              onStartActivity={startActivity}
              onStopActiveTimer={stopActiveTimer}
              onOpenCreateActivity={() => setIsCreateActivityOpen(true)}
            />

            {/* Compact Daily 24-Hour Balance Summary */}
            <ProductivityScoreCard
              totalSeconds={todayMetrics.totalSeconds}
              sleepSeconds={todayMetrics.sleepSeconds}
              workSeconds={todayMetrics.workSeconds}
              activeLifeSeconds={todayMetrics.activeLifeSeconds}
              leisureSeconds={todayMetrics.leisureSeconds}
              idleSeconds={todayMetrics.idleSeconds}
            />

          </div>
        )}

        {/* TAB 2: DAILY LOG */}
        {currentTab === 'timeline' && (
          <DailyTimeline
            entries={entries}
            activities={activities}
            onDeleteEntry={deleteEntry}
            onUpdateEntry={updateEntry}
          />
        )}

        {/* TAB 3: REPORTS */}
        {currentTab === 'reports' && (
          <ReportsView
            entries={entries}
            onDeleteEntry={deleteEntry}
            onUpdateEntry={updateEntry}
          />
        )}

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>MyDay Personal Time & Routine Tracker</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsManualEntryOpen(true)}
              className="hover:text-neutral-900 font-medium"
            >
              Log Past Time
            </button>
            <span>·</span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-neutral-900 font-medium"
            >
              Export & Share
            </button>
            <span>·</span>
            <button
              onClick={resetToDefaults}
              className="hover:text-neutral-900 font-medium"
            >
              Reset Sample Routine
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ManualEntryModal
        isOpen={isManualEntryOpen}
        onClose={() => setIsManualEntryOpen(false)}
        activities={activities}
        onAddManualEntry={addManualEntry}
      />

      <ActivityCatalogView
        isOpen={isCreateActivityOpen}
        onClose={() => setIsCreateActivityOpen(false)}
        activities={activities}
        onAddActivity={addActivity}
        onDeleteActivity={deleteActivity}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        entries={entries}
        onResetData={resetToDefaults}
        onClearAll={clearAllEntries}
      />

    </div>
  );
}
