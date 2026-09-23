import React, { useState, useMemo } from 'react';
import { TimeEntry } from '../types/tracker';
import {
  calculateDayLifeMetrics,
  getActivityBreakdowns,
  generateCSV,
  generateSummaryReport,
} from '../utils/analytics';
import {
  formatDurationHuman,
  formatTime,
  formatDate,
  isToday,
  isYesterday,
  isWithinDays,
} from '../utils/formatters';
import { IconResolver } from './IconResolver';
import {
  Download,
  Copy,
  Check,
  Calendar,
  Clock,
  Briefcase,
  Moon,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

interface ReportsViewProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (id: string, updates: Partial<TimeEntry>) => void;
}

type Period = 'today' | 'yesterday' | 'week' | 'all';

export const ReportsView: React.FC<ReportsViewProps> = ({
  entries,
  onDeleteEntry,
  onUpdateEntry,
}) => {
  const [period, setPeriod] = useState<Period>('today');
  const [copied, setCopied] = useState(false);

  // Filter entries
  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (period === 'today') return isToday(e.startTime);
      if (period === 'yesterday') return isYesterday(e.startTime);
      if (period === 'week') return isWithinDays(e.startTime, 7);
      return true;
    });
  }, [entries, period]);

  const metrics = useMemo(() => calculateDayLifeMetrics(filtered), [filtered]);
  const breakdowns = useMemo(() => getActivityBreakdowns(filtered), [filtered]);

  const handleExportCSV = () => {
    const csv = generateCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-day-report-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const report = generateSummaryReport(filtered, `Daily Time Report (${period.toUpperCase()})`);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const periodTitle = {
    today: "Today",
    yesterday: "Yesterday",
    week: "Last 7 Days",
    all: "All Time",
  }[period];

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Time Analysis
          </span>
          <h2 className="text-xl font-bold text-neutral-900">Activity Report ({periodTitle})</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl">
            {(['today', 'yesterday', 'week', 'all'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                  period === p
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {p === 'week' ? '7 Days' : p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-xl transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>Total Tracked</span>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums mt-2">
            {formatDurationHuman(metrics.totalSeconds)}
          </div>
          <div className="text-xs text-neutral-400 mt-1 font-mono">
            {metrics.sessionCount} activities
          </div>
        </div>

        <div className="bg-white border border-indigo-100 rounded-2xl p-4 sm:p-5 shadow-xs bg-indigo-50/20">
          <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-indigo-600" />
            <span>Sleep</span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-900 tabular-nums mt-2">
            {formatDurationHuman(metrics.sleepSeconds)}
          </div>
          <div className="text-xs text-indigo-600 mt-1">
            Rest & Recovery
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs bg-blue-50/20">
          <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Office Work</span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-900 tabular-nums mt-2">
            {formatDurationHuman(metrics.workSeconds)}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Productive work hours
          </div>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-4 sm:p-5 shadow-xs bg-rose-50/20">
          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Idle (Doing Nothing)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-900 tabular-nums mt-2">
            {formatDurationHuman(metrics.idleSeconds)}
          </div>
          <div className="text-xs text-rose-600 mt-1">
            Unplanned idle time
          </div>
        </div>
      </div>

      {/* Main Breakdown by Activity */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Time Spent in Different Activities</h3>
            <p className="text-xs text-neutral-500">Ranked by most hours spent</p>
          </div>
          <span className="text-xs font-semibold text-neutral-500 font-mono">
            {breakdowns.length} distinct activities
          </span>
        </div>

        {breakdowns.length === 0 ? (
          <div className="p-8 text-center text-neutral-400">
            No entries for this period.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {breakdowns.map((item, idx) => (
              <div key={item.activityId} className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-neutral-400 w-5">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconResolver name={item.iconName} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-neutral-900">
                        {item.activityName}
                      </span>
                      <span className="text-xs text-neutral-400 ml-2">
                        ({item.category})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                      {formatDurationHuman(item.totalSeconds)}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono ml-2">
                      ({item.percentageOfTotal}%)
                    </span>
                  </div>
                </div>

                {/* Proportional visual bar */}
                <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${item.percentageOfTotal}%`,
                      backgroundColor: item.color,
                    }}
                    className="h-full rounded-full transition-all duration-300"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
                  <span>Logged {item.sessionCount} time{item.sessionCount > 1 ? 's' : ''}</span>
                  <span>{Math.round(item.totalSeconds / 60)} total minutes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
