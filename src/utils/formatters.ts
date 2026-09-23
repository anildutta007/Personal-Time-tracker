import { ActivityType } from '../types/tracker';

/**
 * Format seconds into digital display (e.g. 01:23:45 or 23:45)
 */
export function formatDurationDigital(totalSeconds: number): string {
  const sec = Math.floor(Math.max(0, totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format seconds into friendly text (e.g. 7h 45m or 25m)
 */
export function formatDurationHuman(totalSeconds: number): string {
  const sec = Math.floor(Math.max(0, totalSeconds));
  if (sec < 60) return `${sec}s`;

  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Format timestamp into standard 12-hour time (e.g. 06:15 AM)
 */
export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Format timestamp into date string (e.g. Sep 23, 2026)
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

/**
 * Check if timestamp belongs to today
 */
export function isToday(timestamp: number): boolean {
  const target = new Date(timestamp);
  const today = new Date();
  return (
    target.getDate() === today.getDate() &&
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if timestamp belongs to yesterday
 */
export function isYesterday(timestamp: number): boolean {
  const target = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    target.getDate() === yesterday.getDate() &&
    target.getMonth() === yesterday.getMonth() &&
    target.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if timestamp is within the last 7 days
 */
export function isWithinDays(timestamp: number, days: number): boolean {
  const now = Date.now();
  const past = now - days * 24 * 60 * 60 * 1000;
  return timestamp >= past;
}

export function getActivityTypeBadge(type: ActivityType): {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
} {
  switch (type) {
    case 'productive':
      return {
        label: 'Productive',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-500',
      };
    case 'essential':
      return {
        label: 'Sleep & Health',
        textColor: 'text-indigo-700',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        dotColor: 'bg-indigo-500',
      };
    case 'leisure':
      return {
        label: 'Break & Leisure',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'idle':
      return {
        label: 'Idle / Doing Nothing',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        dotColor: 'bg-rose-500',
      };
  }
}
