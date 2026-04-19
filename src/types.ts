export type Role = 'student' | 'teacher' | 'parent';

export interface SubjectInfo {
  icon: string;
  fg: string;
  bg: string;
  bar: string;
}

export interface Task {
  id: number;
  subject: string;
  title: string;
  due: string;
  urgent?: boolean;
  status: 'pending' | 'submitted' | 'graded';
}

export interface Note {
  id: number;
  title: string;
  uploaded: string;
  pages: number;
  isNew: boolean;
  recording?: boolean;
}

export interface Student {
  id: number;
  name: string;
  class: string;
  batch: string;
  fee: 'Paid' | 'Due' | 'Overdue';
  submissions: number;
  avatar: string;
}

export interface Submission {
  id: number;
  student: string;
  subject: string;
  title: string;
  time: string;
  avatar: string;
  class: string;
}

export interface CalendarEvent {
  id: number;
  day: string;
  date: number;
  subject?: string;
  title?: string;
  batch: string;
  time?: string;
  duration?: number;
  type: 'class' | 'due';
  color: string;
}

export interface Feedback {
  id: number;
  subject: string;
  title: string;
  gradedAt: string;
  reaction: 'great' | 'good' | 'work';
  icon: string;
  label: string;
  rc: string;
  rbg: string;
  comment: string;
  replied: boolean;
}

export interface FeeRecord {
  month: string;
  amount: number;
  status: 'paid' | 'due' | 'pending_confirm';
  paidDate?: string;
  dueDate?: string;
}
