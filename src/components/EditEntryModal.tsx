import React, { useState, useMemo } from 'react';
import { Activity, TimeEntry } from '../types/tracker';
import { formatDurationHuman, formatTime, formatDate } from '../utils/formatters';
import { X, Clock, AlertCircle, ArrowRight, Check } from 'lucide-react';

interface EditEntryModalProps {
  isOpen: boolean;
  entry: TimeEntry | null;
  activities: Activity[];
  onClose: () => void;
  onSave: (entryId: string, updates: Partial<TimeEntry>) => void;
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  isOpen,
  entry,
  activities,
  onClose,
  onSave,
}) => {
  if (!isOpen || !entry) return null;

  // Extract initial date and time
  const startDate = new Date(entry.startTime);
  const endDate = new Date(entry.endTime);

  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatLocalTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
  };

  const [date, setDate] = useState(formatLocalDate(startDate));
  const [startTime, setStartTime] = useState(formatLocalTime(startDate));
  const [endTime, setEndTime] = useState(formatLocalTime(endDate));
  const [activityId, setActivityId] = useState(entry.activityId);
  const [note, setNote] = useState(entry.note || '');
  const [error, setError] = useState<string | null>(null);

  // Check if initial entry crossed midnight or ended on a later day
  const initialCrossedMidnight = endDate.getDate() !== startDate.getDate() || (entry.endTime - entry.startTime >= 86400 * 1000);
  const [userToggledNextDay, setUserToggledNextDay] = useState<boolean | null>(
    // If original duration was suspiciously > 24 hours, default next day to false so user can easily fix it
    entry.duration > 86400 ? false : (initialCrossedMidnight ? true : null)
  );

  // Auto-detect if endTime is earlier than startTime (e.g. 23:00 to 06:00)
  const autoCrossesMidnight = useMemo(() => {
    if (!startTime || !endTime) return false;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return (endH * 60 + endM) < (startH * 60 + startM);
  }, [startTime, endTime]);

  const endsNextDay = userToggledNextDay !== null ? userToggledNextDay : autoCrossesMidnight;

  // Real-time calculation
  const calculation = useMemo(() => {
    if (!date || !startTime || !endTime) return null;

    try {
      const [y, m, d] = date.split('-').map(Number);
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);

      const sObj = new Date(y, m - 1, d, startH, startM, 0, 0);
      let eObj = new Date(y, m - 1, d, endH, endM, 0, 0);

      if (endsNextDay) {
        eObj = new Date(eObj.getTime() + 24 * 60 * 60 * 1000);
      }

      const startMs = sObj.getTime();
      const endMs = eObj.getTime();

      if (isNaN(startMs) || isNaN(endMs)) return null;

      const diffSec = Math.floor((endMs - startMs) / 1000);

      return {
        startMs,
        endMs,
        diffSec,
        isValid: diffSec > 0,
        formattedStart: `${formatDate(startMs)}, ${formatTime(startMs)}`,
        formattedEnd: `${formatDate(endMs)}, ${formatTime(endMs)}`,
      };
    } catch {
      return null;
    }
  }, [date, startTime, endTime, endsNextDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!calculation || !calculation.isValid) {
      setError('End time must be after start time.');
      return;
    }

    const selectedAct = activities.find((a) => a.id === activityId);

    onSave(entry.id, {
      activityId,
      activityName: selectedAct ? selectedAct.name : entry.activityName,
      category: selectedAct ? selectedAct.category : entry.category,
      type: selectedAct ? selectedAct.type : entry.type,
      color: selectedAct ? selectedAct.color : entry.color,
      iconName: selectedAct ? selectedAct.iconName : entry.iconName,
      startTime: calculation.startMs,
      endTime: calculation.endMs,
      duration: calculation.diffSec,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Edit Time Entry</h3>
              <p className="text-xs text-neutral-500">Correct start time, end time, duration, or notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Activity Selector */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Activity</label>
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white font-medium text-sm text-neutral-900"
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium"
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setUserToggledNextDay(null);
                }}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setUserToggledNextDay(null);
                }}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm font-semibold"
              />
            </div>
          </div>

          {/* Crosses Midnight Checkbox */}
          <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editCrossMidnight"
                checked={endsNextDay}
                onChange={(e) => setUserToggledNextDay(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
              />
              <label htmlFor="editCrossMidnight" className="text-neutral-700 font-medium cursor-pointer select-none">
                Ends on the next day (+1 day)
              </label>
            </div>
            {autoCrossesMidnight && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                Overnight detected
              </span>
            )}
          </div>

          {/* Real-Time Live Calculation Preview */}
          {calculation && (
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                calculation.isValid
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  New Calculated Duration
                </span>
                <span className="text-sm font-mono font-bold">
                  {calculation.isValid ? (
                    <>
                      {formatDurationHuman(calculation.diffSec)} ({Math.round(calculation.diffSec / 60)} mins)
                    </>
                  ) : (
                    'Invalid Time Range'
                  )}
                </span>
              </div>

              {calculation.isValid && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-700 flex-wrap">
                  <span className="font-semibold">{calculation.formattedStart}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-semibold">{calculation.formattedEnd}</span>
                  {endsNextDay && (
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                      +1 Day (Overnight)
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Notes</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. morning walk with dog"
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!calculation || !calculation.isValid}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
