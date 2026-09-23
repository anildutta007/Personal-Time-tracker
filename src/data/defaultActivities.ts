import { Activity, TimeEntry } from '../types/tracker';

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'act-sleep',
    name: 'Sleep',
    category: 'Rest',
    type: 'essential',
    color: '#4f46e5', // indigo-600
    iconName: 'Moon',
    isPredefined: true,
    description: 'Night sleep and daytime naps',
  },
  {
    id: 'act-office-work',
    name: 'Office Work',
    category: 'Work',
    type: 'productive',
    color: '#2563eb', // blue-600
    iconName: 'Briefcase',
    isPredefined: true,
    description: 'Working on job, projects, and office tasks',
  },
  {
    id: 'act-dog-walk',
    name: 'Taking Dog for Walk',
    category: 'Outdoors',
    type: 'productive',
    color: '#059669', // emerald-600
    iconName: 'Footprints',
    isPredefined: true,
    description: 'Walking the dog, park visits, and outdoor steps',
  },
  {
    id: 'act-breakfast',
    name: 'Breakfast',
    category: 'Meals',
    type: 'essential',
    color: '#d97706', // amber-600
    iconName: 'Utensils',
    isPredefined: true,
    description: 'Morning breakfast and nutrition',
  },
  {
    id: 'act-tea',
    name: 'Cup of Tea / Coffee',
    category: 'Break',
    type: 'leisure',
    color: '#ea580c', // orange-600
    iconName: 'Coffee',
    isPredefined: true,
    description: 'Enjoying tea, coffee, and short breaks',
  },
  {
    id: 'act-toilet',
    name: 'Restroom & Hygiene',
    category: 'Routine',
    type: 'essential',
    color: '#0891b2', // cyan-600
    iconName: 'Bath',
    isPredefined: true,
    description: 'Going to toilet, showering, brushing teeth',
  },
  {
    id: 'act-shopping',
    name: 'Supermarket & Shopping',
    category: 'Errands',
    type: 'productive',
    color: '#7c3aed', // violet-600
    iconName: 'ShoppingCart',
    isPredefined: true,
    description: 'Grocery shopping, supermarket runs, and errands',
  },
  {
    id: 'act-idle',
    name: 'Idle Time (Doing Nothing)',
    category: 'Idle',
    type: 'idle',
    color: '#e11d48', // rose-600
    iconName: 'Clock',
    isPredefined: true,
    description: 'Spacing out, phone scrolling, unplanned idle time',
  },
  {
    id: 'act-chores',
    name: 'Cooking & Chores',
    category: 'Home',
    type: 'productive',
    color: '#0d9488', // teal-600
    iconName: 'Home',
    isPredefined: true,
    description: 'Cooking meals, dishes, cleaning, and laundry',
  },
  {
    id: 'act-tv',
    name: 'TV & Leisure',
    category: 'Leisure',
    type: 'leisure',
    color: '#475569', // slate-600
    iconName: 'Tv',
    isPredefined: true,
    description: 'Watching TV shows, movies, reading, relaxing',
  },
];

export function getSampleEntries(): TimeEntry[] {
  const todayAt = (h: number, m: number) => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };

  const yesterdayAt = (h: number, m: number) => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };

  return [
    // Today's Routine
    {
      id: 'today-sleep',
      activityId: 'act-sleep',
      activityName: 'Sleep',
      category: 'Rest',
      type: 'essential',
      color: '#4f46e5',
      iconName: 'Moon',
      startTime: yesterdayAt(22, 30),
      endTime: todayAt(6, 15),
      duration: 465 * 60, // 7h 45m
      note: 'Good night sleep',
    },
    {
      id: 'today-toilet',
      activityId: 'act-toilet',
      activityName: 'Restroom & Hygiene',
      category: 'Routine',
      type: 'essential',
      color: '#0891b2',
      iconName: 'Bath',
      startTime: todayAt(6, 15),
      endTime: todayAt(6, 40),
      duration: 25 * 60,
      note: 'Morning shower & getting dressed',
    },
    {
      id: 'today-tea-1',
      activityId: 'act-tea',
      activityName: 'Cup of Tea / Coffee',
      category: 'Break',
      type: 'leisure',
      color: '#ea580c',
      iconName: 'Coffee',
      startTime: todayAt(6, 40),
      endTime: todayAt(7, 0),
      duration: 20 * 60,
      note: 'First morning tea in the kitchen',
    },
    {
      id: 'today-dog-1',
      activityId: 'act-dog-walk',
      activityName: 'Taking Dog for Walk',
      category: 'Outdoors',
      type: 'productive',
      color: '#059669',
      iconName: 'Footprints',
      startTime: todayAt(7, 0),
      endTime: todayAt(7, 45),
      duration: 45 * 60,
      note: 'Morning walk in the neighborhood park',
    },
    {
      id: 'today-breakfast',
      activityId: 'act-breakfast',
      activityName: 'Breakfast',
      category: 'Meals',
      type: 'essential',
      color: '#d97706',
      iconName: 'Utensils',
      startTime: todayAt(7, 45),
      endTime: todayAt(8, 20),
      duration: 35 * 60,
      note: 'Toast, eggs & orange juice',
    },
    {
      id: 'today-work-1',
      activityId: 'act-office-work',
      activityName: 'Office Work',
      category: 'Work',
      type: 'productive',
      color: '#2563eb',
      iconName: 'Briefcase',
      startTime: todayAt(8, 30),
      endTime: todayAt(12, 15),
      duration: 225 * 60, // 3h 45m
      note: 'Morning work block',
    },
    {
      id: 'today-shopping',
      activityId: 'act-shopping',
      activityName: 'Supermarket & Shopping',
      category: 'Errands',
      type: 'productive',
      color: '#7c3aed',
      iconName: 'ShoppingCart',
      startTime: todayAt(12, 30),
      endTime: todayAt(13, 20),
      duration: 50 * 60,
      note: 'Weekly grocery shopping at supermarket',
    },
    {
      id: 'today-idle-1',
      activityId: 'act-idle',
      activityName: 'Idle Time (Doing Nothing)',
      category: 'Idle',
      type: 'idle',
      color: '#e11d48',
      iconName: 'Clock',
      startTime: todayAt(13, 30),
      endTime: todayAt(14, 0),
      duration: 30 * 60,
      note: 'Scrolling phone on the couch after shopping',
    },
    {
      id: 'today-work-2',
      activityId: 'act-office-work',
      activityName: 'Office Work',
      category: 'Work',
      type: 'productive',
      color: '#2563eb',
      iconName: 'Briefcase',
      startTime: todayAt(14, 0),
      endTime: todayAt(17, 30),
      duration: 210 * 60, // 3h 30m
      note: 'Afternoon work session',
    },
    {
      id: 'today-dog-2',
      activityId: 'act-dog-walk',
      activityName: 'Taking Dog for Walk',
      category: 'Outdoors',
      type: 'productive',
      color: '#059669',
      iconName: 'Footprints',
      startTime: todayAt(17, 45),
      endTime: todayAt(18, 30),
      duration: 45 * 60,
      note: 'Evening dog walk',
    },
  ];
}
