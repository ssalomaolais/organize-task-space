export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
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
  // Campos adicionais
  responsibles?: Responsible[];
  student_count?: number;
  vacancy_count?: number;
  syllabus?: string;
  seniority?: string;
  schedule?: Schedule[];
}

export interface Schedule {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  instructor: string;
}

export interface Responsible {
  id: string;
  name: string;
  type: string;
  discipline?: string;
  email?: string;
  syllabus?: string;
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
