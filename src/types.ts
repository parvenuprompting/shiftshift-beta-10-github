export interface Session {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  breaks: { start: string; end?: string }[];
  notes: string;
  tasks: { id: string; text: string; completed: boolean }[];
  breakTime?: number;
  expenses?: Expense[];
}

export interface User {
  id: string;
  username: string;
  hourlyRate?: number;
}

export interface Expense {
  id: string;
  sessionId: string;
  userId: string;
  type: 'toll' | 'meal' | 'fuel' | 'other';
  amount: number;
  description: string;
  timestamp: string;
  receipt?: string;
}

export interface PlannedNote {
  id: string;
  userId: string;
  date: string;
  content: string;
  timestamp: string;
  isReminder: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  category: 'rest_areas' | 'restaurants' | 'routes' | 'tips' | 'other';
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export interface Document {
  id: string;
  userId: string;
  sessionId?: string;
  type: 'freight_letter' | 'delivery_note' | 'invoice' | 'other';
  title: string;
  fileUrl: string;
  timestamp: string;
  metadata?: {
    size: number;
    mimeType: string;
    originalName: string;
  };
}