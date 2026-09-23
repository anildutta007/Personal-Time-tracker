import React, { useState } from 'react';
import { Activity } from '../types/tracker';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onAddManualEntry: (data: {
    activityId: string;
    startTime: number;
    endTime: number;
    note?: string;
  }) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  activities,
  onAddManualEntry,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('22:00');
  const [endTime, setEndTime] = useState('06:00');
  const [activityId, setActivityId] = useState(activities[0]?.id || 'act-sleep');
  const [isCrossMidnight, setIsCrossMidnight] = useState(true);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startDateObj = new Date(`${date}T${startTime}:00`);
    let endDateObj = new Date(`${date}T${endTime}:00`);

    // If it crosses midnight (e.g. 22:00 to 06:00), end time is the following day
    if (isCrossMidnight || endDateObj.getTime() <= startDateObj.getTime()) {
      endDateObj = new Date(endDateObj.getTime() + 24 * 60 * 60 * 1000);
    }

    const start = startDateObj.getTime();
    const end = endDateObj.getTime();

    if (isNaN(start) || isNaN(end)) {
      setError('Please provide valid date and time values.');
      return;
    }

    if (end <= start) {
      setError('End time must be after start time.');
      return;
    }

    onAddManualEntry({
      activityId,
      startTime: start,
      endTime: end,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">Log Past Activity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Activity *
            </label>
            <select
              value={activityId}
              onChange={(e) => {
                setActivityId(e.target.value);
                if (e.target.value === 'act-sleep') {
                  setStartTime('22:00');
                  setEndTime('06:00');
                  setIsCrossMidnight(true);
                } else if (e.target.value === 'act-toilet') {
                  setStartTime('06:15');
                  setEndTime('06:30');
                  setIsCrossMidnight(false);
                } else if (e.target.value === 'act-breakfast') {
                  setStartTime('07:30');
                  setEndTime('08:00');
                  setIsCrossMidnight(false);
                } else if (e.target.value === 'act-dog-walk') {
                  setStartTime('07:00');
                  setEndTime('07:45');
                  setIsCrossMidnight(false);
                }
              }}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-medium text-sm"
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="crossMidnight"
              checked={isCrossMidnight}
              onChange={(e) => setIsCrossMidnight(e.target.checked)}
              className="rounded text-neutral-900"
            />
            <label htmlFor="crossMidnight" className="text-neutral-600 font-medium select-none cursor-pointer">
              Crosses midnight (e.g. slept at 22:00, woke up next day at 06:00)
            </label>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. morning walk with dog, grocery run"
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
