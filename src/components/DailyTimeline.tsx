import React, { useState } from 'react';
import { TimeEntry } from '../types/tracker';
import { formatTime, formatDurationHuman, formatDate } from '../utils/formatters';
import { IconResolver } from './IconResolver';
import { Clock, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

interface DailyTimelineProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (id: string, updates: Partial<TimeEntry>) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  entries,
  onDeleteEntry,
  onUpdateEntry,
}) => {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  // Sort entries ascending by time
  const sortedEntries = [...entries].sort((a, b) => b.startTime - a.startTime);

  const handleStartEdit = (entry: TimeEntry) => {
    setEditingEntryId(entry.id);
    setEditNote(entry.note || '');
  };

  const handleSaveEdit = (entryId: string) => {
    onUpdateEntry(entryId, { note: editNote.trim() || undefined });
    setEditingEntryId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">My Daily Routine Log</h2>
          <p className="text-xs text-neutral-500">
            Chronological timeline of everything you did throughout the day
          </p>
        </div>
        <div className="text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
          {entries.length} recorded events
        </div>
      </div>

      {/* Chronological List of Sessions */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        {sortedEntries.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            <Clock className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
            <p className="text-base font-medium text-neutral-600">No activities recorded yet</p>
            <p className="text-xs text-neutral-400 mt-1">
              Select an activity like Sleep, Dog Walk, or Breakfast to start logging.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {sortedEntries.map((entry) => {
              const isEditing = editingEntryId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Activity Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: entry.color }}
                    >
                      <IconResolver name={entry.iconName} className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-neutral-900">
                          {entry.activityName}
                        </span>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="text-xs text-neutral-500 font-medium">
                          {entry.category}
                        </span>
                      </div>

                      {/* Exact Start & Stop Times */}
                      <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
                        <span className="text-neutral-900 font-semibold">{formatDate(entry.startTime)}</span>
                        <span>·</span>
                        <span>{formatTime(entry.startTime)} → {formatTime(entry.endTime)}</span>
                        <span>·</span>
                        <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                          {formatDurationHuman(entry.duration)}
                        </span>
                      </div>

                      {/* Note or Edit Input */}
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder="Add details (e.g. walked in park)..."
                            className="text-xs px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 w-64"
                          />
                          <button
                            onClick={() => handleSaveEdit(entry.id)}
                            className="p-1.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingEntryId(null)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-800"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        entry.note && (
                          <p className="text-xs text-neutral-600 bg-neutral-50 border-l-2 border-neutral-300 pl-2.5 py-0.5 mt-1 italic">
                            "{entry.note}"
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
