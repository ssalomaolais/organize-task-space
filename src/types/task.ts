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
  event_type: string;
  user_id: string; // Now required since it's NOT NULL in database
  created_at: string;
  updated_at: string;
  comments?: Comment[];
  attachments?: string[];
}

export interface ListValue {
  value: string;
  label: string;
  color?: string
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}
