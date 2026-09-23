import React, { useState, useMemo } from 'react';
import { Activity, TimeEntry } from '../types/tracker';
import { formatDurationHuman, formatTime, formatDate } from '../utils/formatters';
import { X, Clock, AlertCircle, ArrowRight, Moon } from 'lucide-react';

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
  const startD = new Date(entry.startTime);
  const endD = new Date(entry.endTime);

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

  const getTomorrowDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    return formatLocalDate(dateObj);
  };

  const [startDate, setStartDate] = useState(formatLocalDate(startD));
  const [startTime, setStartTime] = useState(formatLocalTime(startD));
  const [endDate, setEndDate] = useState(formatLocalDate(endD));
  const [endTime, setEndTime] = useState(formatLocalTime(endD));
  const [activityId, setActivityId] = useState(entry.activityId);
  const [note, setNote] = useState(entry.note || '');
  const [error, setError] = useState<string | null>(null);

  // Real-time calculation based strictly on dates & times
  const calculation = useMemo(() => {
    if (!startDate || !startTime || !endDate || !endTime) return null;

    try {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const [sh, smin] = startTime.split(':').map(Number);
      const [ey, em, ed] = endDate.split('-').map(Number);
      const [eh, emin] = endTime.split(':').map(Number);

      const sObj = new Date(sy, sm - 1, sd, sh, smin, 0, 0);
      const eObj = new Date(ey, em - 1, ed, eh, emin, 0, 0);

      const startMs = sObj.getTime();
      const endMs = eObj.getTime();

      if (isNaN(startMs) || isNaN(endMs)) return null;

      const diffSec = Math.floor((endMs - startMs) / 1000);

      return {
        startMs,
        endMs,
        diffSec,
        diffMinutes: Math.round(diffSec / 60),
        isValid: diffSec > 0,
        formattedStart: `${formatDate(startMs)}, ${formatTime(startMs)}`,
        formattedEnd: `${formatDate(endMs)}, ${formatTime(endMs)}`,
        isCrossDay: startDate !== endDate,
      };
    } catch {
      return null;
    }
  }, [startDate, startTime, endDate, endTime]);

  const isTimeInvertedOnSameDate = useMemo(() => {
    if (startDate !== endDate || !startTime || !endTime) return false;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return (eh * 60 + em) < (sh * 60 + sm);
  }, [startDate, endDate, startTime, endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!calculation || !calculation.isValid) {
      setError('End date & time must be strictly after start date & time.');
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

          {/* Start Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm font-semibold"
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-sm font-semibold"
              />
            </div>
          </div>

          {/* Helper for inverted time on same date */}
          {isTimeInvertedOnSameDate && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs">
                  End time ({endTime}) is earlier than start time ({startTime}). Did this task end the next morning?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEndDate(getTomorrowDate(startDate))}
                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 rounded-lg text-xs shrink-0 transition-colors"
              >
                Set End Date to Tomorrow
              </button>
            </div>
          )}

          {/* Real-Time Live Calculation Preview */}
          {calculation && (
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                calculation.isValid
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
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
                      {calculation.diffMinutes} mins ({formatDurationHuman(calculation.diffSec)})
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
                  {calculation.isCrossDay && (
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                      Overnight / Multi-day
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
