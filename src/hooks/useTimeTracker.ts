import { useState, useEffect, useCallback } from 'react';
import { Activity, TimeEntry, ActiveTimer, ActivityType } from '../types/tracker';
import { DEFAULT_ACTIVITIES, getSampleEntries } from '../data/defaultActivities';

const STORAGE_KEY_ACTIVITIES = 'daily_life_activities_v2';
const STORAGE_KEY_ENTRIES = 'daily_life_entries_v2';
const STORAGE_KEY_TIMER = 'daily_life_timer_v2';

/**
 * Automatically sanitizes entries by repairing any entry where endTime
 * was accidentally offset forward by 24h (86,400,000ms), and guarantees
 * duration strictly equals (endTime - startTime).
 */
export function sanitizeEntries(rawEntries: TimeEntry[]): TimeEntry[] {
  return rawEntries.map((entry) => {
    let { startTime, endTime } = entry;

    // If endTime is >= 24h after startTime, automatically strip the extra 24-hour offsets
    if (endTime - startTime >= 86400 * 1000) {
      while (endTime - startTime >= 86400 * 1000) {
        endTime -= 86400 * 1000;
      }
    }

    const duration = Math.max(1, Math.floor((endTime - startTime) / 1000));
    return {
      ...entry,
      endTime,
      duration,
    };
  });
}

export function useTimeTracker() {
  // Load activities
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ACTIVITIES;
  });

  // Load entries and immediately auto-repair any corrupted 24h offsets
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeEntries(parsed);
      }
    } catch (e) {
      console.error(e);
    }
    return getSampleEntries();
  });

  // Load active timer
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIMER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Active elapsed seconds
  const [activeElapsedSeconds, setActiveElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!activeTimer) {
      setActiveElapsedSeconds(0);
      return;
    }

    const update = () => {
      const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
      setActiveElapsedSeconds(Math.max(0, elapsed));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  // Persist activities
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  // Persist entries
  useEffect(() => {
    try {
      const sanitized = sanitizeEntries(entries);
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(sanitized));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  // Persist active timer
  useEffect(() => {
    try {
      if (activeTimer) {
        localStorage.setItem(STORAGE_KEY_TIMER, JSON.stringify(activeTimer));
      } else {
        localStorage.removeItem(STORAGE_KEY_TIMER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTimer]);

  /**
   * Start recording an activity
   * If a previous activity was ongoing, finish it automatically and start this one!
   */
  const startActivity = useCallback((activityId: string, initialNote?: string) => {
    const act = activities.find((a) => a.id === activityId);
    if (!act) return;

    const now = Date.now();

    setActiveTimer((prevTimer) => {
      if (prevTimer) {
        // Complete previous timer
        const duration = Math.max(1, Math.floor((now - prevTimer.startTime) / 1000));
        const newEntry: TimeEntry = {
          id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          activityId: prevTimer.activityId,
          activityName: prevTimer.activityName,
          category: prevTimer.category,
          type: prevTimer.type,
          color: prevTimer.color,
          iconName: prevTimer.iconName,
          startTime: prevTimer.startTime,
          endTime: now,
          duration,
          note: prevTimer.note || undefined,
        };
        setEntries((prev) => [newEntry, ...prev]);
      }

      return {
        activityId: act.id,
        activityName: act.name,
        category: act.category,
        type: act.type,
        color: act.color,
        iconName: act.iconName,
        startTime: now,
        note: initialNote || '',
      };
    });
  }, [activities]);

  /**
   * Stop active timer and save entry
   */
  const stopActiveTimer = useCallback((finalNote?: string) => {
    if (!activeTimer) return;

    const now = Date.now();
    const duration = Math.max(1, Math.floor((now - activeTimer.startTime) / 1000));
    const noteToSave = finalNote !== undefined ? finalNote : activeTimer.note;

    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      activityId: activeTimer.activityId,
      activityName: activeTimer.activityName,
      category: activeTimer.category,
      type: activeTimer.type,
      color: activeTimer.color,
      iconName: activeTimer.iconName,
      startTime: activeTimer.startTime,
      endTime: now,
      duration,
      note: noteToSave.trim() || undefined,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setActiveTimer(null);
  }, [activeTimer]);

  /**
   * Cancel / Discard active timer
   */
  const discardActiveTimer = useCallback(() => {
    setActiveTimer(null);
  }, []);

  /**
   * Update active timer note
   */
  const updateActiveTimerNote = useCallback((note: string) => {
    setActiveTimer((prev) => (prev ? { ...prev, note } : null));
  }, []);

  /**
   * Add manual past entry (e.g. "I went to sleep at 22:00, woke up at 06:00")
   */
  const addManualEntry = useCallback((data: {
    activityId: string;
    startTime: number;
    endTime: number;
    note?: string;
  }) => {
    const act = activities.find((a) => a.id === data.activityId);
    if (!act) return;

    const duration = Math.max(1, Math.floor((data.endTime - data.startTime) / 1000));

    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      activityId: act.id,
      activityName: act.name,
      category: act.category,
      type: act.type,
      color: act.color,
      iconName: act.iconName,
      startTime: data.startTime,
      endTime: data.endTime,
      duration,
      note: data.note?.trim() || undefined,
    };

    setEntries((prev) => [newEntry, ...prev]);
  }, [activities]);

  /**
   * Delete entry
   */
  const deleteEntry = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }, []);

  /**
   * Update entry
   */
  const updateEntry = useCallback((entryId: string, updates: Partial<TimeEntry>) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== entryId) return e;
        const updated = { ...e, ...updates };
        if (updates.startTime && updates.endTime) {
          updated.duration = Math.max(1, Math.floor((updates.endTime - updates.startTime) / 1000));
        }
        return updated;
      })
    );
  }, []);

  /**
   * Add custom activity
   */
  const addActivity = useCallback((newAct: Omit<Activity, 'id' | 'isPredefined'>) => {
    const act: Activity = {
      ...newAct,
      id: `act-custom-${Date.now()}`,
      isPredefined: false,
    };
    setActivities((prev) => [...prev, act]);
    return act;
  }, []);

  /**
   * Delete custom activity
   */
  const deleteActivity = useCallback((activityId: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
  }, []);

  /**
   * Reset data to sample routine
   */
  const resetToDefaults = useCallback(() => {
    setActivities(DEFAULT_ACTIVITIES);
    setEntries(getSampleEntries());
    setActiveTimer(null);
  }, []);

  /**
   * Clear all entries
   */
  const clearAllEntries = useCallback(() => {
    setEntries([]);
    setActiveTimer(null);
  }, []);

  return {
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
  };
}
