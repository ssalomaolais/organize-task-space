
import { TaskStatus } from '@/lib/utils';

export type EventType = 'Forum Técnico' | 'Meetup Interno' | 'Meetup Externo' | 'Techup Interno' | 'Techup Externo' | 'Outros';

export interface Task {
  id: string;
  title: string;
  description: string;
  responsible: string;
  start_date: string;
  end_date: string;
  hours: number;
  people: number;
  status: string;
  stack: string;
  event_type: EventType;
  user_id?: string;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}
