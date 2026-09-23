import { TimeEntry, ActivityType } from '../types/tracker';
import { formatDurationHuman, formatDate, formatTime } from './formatters';

export interface DayLifeMetrics {
  totalSeconds: number;
  sleepSeconds: number;
  workSeconds: number;
  activeLifeSeconds: number; // Dog walk, errands, chores
  leisureSeconds: number;    // Tea, TV
  idleSeconds: number;       // Doing nothing
  sessionCount: number;
}

export interface ActivityBreakdown {
  activityId: string;
  activityName: string;
  category: string;
  type: ActivityType;
  color: string;
  iconName: string;
  totalSeconds: number;
  sessionCount: number;
  percentageOfTotal: number;
}

export function calculateDayLifeMetrics(
  entries: TimeEntry[],
  additionalActiveSeconds = 0,
  activeActivityId?: string,
  activeType?: ActivityType
): DayLifeMetrics {
  let total = 0;
  let sleep = 0;
  let work = 0;
  let activeLife = 0;
  let leisure = 0;
  let idle = 0;

  for (const entry of entries) {
    total += entry.duration;
    if (entry.activityId === 'act-sleep' || entry.activityName.toLowerCase().includes('sleep')) {
      sleep += entry.duration;
    } else if (entry.activityId === 'act-office-work' || entry.activityName.toLowerCase().includes('office work')) {
      work += entry.duration;
    } else if (entry.activityId === 'act-idle' || entry.type === 'idle') {
      idle += entry.duration;
    } else if (entry.type === 'productive' || entry.type === 'essential') {
      activeLife += entry.duration;
    } else if (entry.type === 'leisure') {
      leisure += entry.duration;
    }
  }

  if (additionalActiveSeconds > 0 && activeType) {
    total += additionalActiveSeconds;
    if (activeActivityId === 'act-sleep') sleep += additionalActiveSeconds;
    else if (activeActivityId === 'act-office-work') work += additionalActiveSeconds;
    else if (activeActivityId === 'act-idle' || activeType === 'idle') idle += additionalActiveSeconds;
    else if (activeType === 'productive' || activeType === 'essential') activeLife += additionalActiveSeconds;
    else if (activeType === 'leisure') leisure += additionalActiveSeconds;
  }

  return {
    totalSeconds: total,
    sleepSeconds: sleep,
    workSeconds: work,
    activeLifeSeconds: activeLife,
    leisureSeconds: leisure,
    idleSeconds: idle,
    sessionCount: entries.length + (additionalActiveSeconds > 0 ? 1 : 0),
  };
}

export function getActivityBreakdowns(entries: TimeEntry[]): ActivityBreakdown[] {
  const map = new Map<string, ActivityBreakdown>();
  const totalSeconds = entries.reduce((acc, curr) => acc + curr.duration, 0);

  for (const entry of entries) {
    const existing = map.get(entry.activityId);
    if (existing) {
      existing.totalSeconds += entry.duration;
      existing.sessionCount += 1;
    } else {
      map.set(entry.activityId, {
        activityId: entry.activityId,
        activityName: entry.activityName,
        category: entry.category,
        type: entry.type,
        color: entry.color,
        iconName: entry.iconName,
        totalSeconds: entry.duration,
        sessionCount: 1,
        percentageOfTotal: 0,
      });
    }
  }

  const list = Array.from(map.values()).map((item) => ({
    ...item,
    percentageOfTotal: totalSeconds > 0 ? Math.round((item.totalSeconds / totalSeconds) * 100) : 0,
  }));

  // Sort descending by total duration
  return list.sort((a, b) => b.totalSeconds - a.totalSeconds);
}

export function generateCSV(entries: TimeEntry[]): string {
  const headers = ['Date', 'Start Time', 'End Time', 'Duration (Minutes)', 'Duration (Formatted)', 'Activity', 'Category', 'Notes'];
  const rows = entries.map((e) => {
    const durationMin = Math.round(e.duration / 60);
    const dateStr = formatDate(e.startTime);
    const startStr = formatTime(e.startTime);
    const endStr = formatTime(e.endTime);
    const cleanNote = (e.note || '').replace(/"/g, '""');
    return [
      `"${dateStr}"`,
      `"${startStr}"`,
      `"${endStr}"`,
      durationMin,
      `"${formatDurationHuman(e.duration)}"`,
      `"${e.activityName}"`,
      `"${e.category}"`,
      `"${cleanNote}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function generateSummaryReport(entries: TimeEntry[], title = "My Daily Life Report"): string {
  const metrics = calculateDayLifeMetrics(entries);
  const breakdowns = getActivityBreakdowns(entries);

  let report = `========================================\n`;
  report += `${title}\n`;
  report += `========================================\n\n`;
  report += `DAILY OVERVIEW:\n`;
  report += `• Sleep:              ${formatDurationHuman(metrics.sleepSeconds)}\n`;
  report += `• Office Work:        ${formatDurationHuman(metrics.workSeconds)}\n`;
  report += `• Daily Life/Routine: ${formatDurationHuman(metrics.activeLifeSeconds)}\n`;
  report += `• Breaks & Tea:       ${formatDurationHuman(metrics.leisureSeconds)}\n`;
  report += `• Idle (Doing nothing): ${formatDurationHuman(metrics.idleSeconds)}\n`;
  report += `• Total Tracked Time: ${formatDurationHuman(metrics.totalSeconds)}\n\n`;

  report += `TIME SPENT ON ACTIVITIES:\n`;
  breakdowns.forEach((item, index) => {
    report += `${index + 1}. ${item.activityName} (${item.category})\n`;
    report += `   Time: ${formatDurationHuman(item.totalSeconds)} (${item.percentageOfTotal}%) - ${item.sessionCount} time(s)\n`;
  });

  report += `\nCHRONOLOGICAL LOG OF THE DAY:\n`;
  const sorted = [...entries].sort((a, b) => a.startTime - b.startTime);
  sorted.forEach((e) => {
    const noteText = e.note ? ` - "${e.note}"` : '';
    report += `• ${formatTime(e.startTime)} -> ${formatTime(e.endTime)} (${formatDurationHuman(e.duration)}) : ${e.activityName}${noteText}\n`;
  });

  return report;
}
