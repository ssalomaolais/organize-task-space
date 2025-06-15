
export type UserRole = 'admin' | 'user';

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
