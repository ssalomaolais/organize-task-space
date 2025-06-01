
export type UserRole = 'admin' | 'user';

export type Stack = 'Java' | '.NET' | 'PHP' | 'Python' | 'Dados';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stack?: Stack;
}
