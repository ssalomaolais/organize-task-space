
export type UserRole = 'admin' | 'user';

export type Stack = 'Java' | 'Python' | 'JavaScript' | 'React' | 'Angular' | 'Vue' | 'Node.js' | 'PHP' | 'C#' | '.NET';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stack?: string;
  active?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stack?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
}
