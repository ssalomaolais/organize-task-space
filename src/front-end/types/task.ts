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
  seniority?: number;
  schedule?: Schedule[];
  vacancy: string;
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

export interface Knowledge {
  id: string;
  name: string;
  min: number;
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

export interface Vacancy {
  id: string;
  title: string;
  teams: string;
  daytoday: string;
  seniority: -1 | 0 | 1 | 2 | 3 | 4; // 0=Jovem Aprendiz, 1=Júnior, 2=Pleno, 3=Senior, 4=Especialista
  regime: "offsite" | "hybrid" | "físico";
  quantity: number;
  gupylink: string;
  local: string;
  detail: string;
  knowledge: string;
  knowledges: Array<{
    knowledge: string;
    required: boolean;
  }>;
  active: boolean;
  created_at: string;
  updated_at: string;
}
