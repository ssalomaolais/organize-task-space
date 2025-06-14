
import { TaskStatus } from '@/lib/utils';

export type EventType = 'Forum Técnico' | 'Meetup Interno' | 'Meetup Externo' | 'Techup Interno' | 'Techup Externo' | 'Outros';

export interface Task {
  id: string;
  title: string;
  description: string;
  responsible: string;
  startDate: string;
  endDate: string;
  hours: number;
  people: number;
  status: TaskStatus;
  stack: string;
  eventType: EventType;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}
