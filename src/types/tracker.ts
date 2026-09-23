export type ActivityType = 'productive' | 'essential' | 'leisure' | 'idle';

export interface Activity {
  id: string;
  name: string;
  category: string;
  type: ActivityType; // Productive, Essential (Sleep/Meals), Leisure, Idle
  color: string;
  iconName: string;
  isPredefined: boolean;
  description?: string;
}

export interface TimeEntry {
  id: string;
  activityId: string;
  activityName: string;
  category: string;
  type: ActivityType;
  color: string;
  iconName: string;
  startTime: number; // ms
  endTime: number;   // ms
  duration: number;  // seconds
  note?: string;
}

export interface ActiveTimer {
  activityId: string;
  activityName: string;
  category: string;
  type: ActivityType;
  color: string;
  iconName: string;
  startTime: number; // ms
  note: string;
}
