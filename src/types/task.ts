
export type TaskStatus = 'Pendente' | 'Em Andamento' | 'Completo' | 'Cancelado';

export type Stack = 'Java' | '.NET' | 'PHP' | 'Python' | 'Dados';

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
  stack: Stack;
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
