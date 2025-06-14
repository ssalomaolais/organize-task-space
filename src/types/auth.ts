
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stack?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stack?: string;
  created_at: string;
  updated_at: string;
}
