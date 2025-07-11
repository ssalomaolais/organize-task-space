import { Responsible } from "@/types/task";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  stack?: string;
  active?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  stack?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
  responsibles?: Responsible[];
}

export interface HashParams {
  access_token?: string;
  type?: string;
  expires_at?: string;
  expires_in?: string;
  refresh_token?: string;
  token_type?: string;
}

export function parseHash(hash: string): HashParams {
  if (!hash) return {};
  
  const params = new URLSearchParams(hash.replace('#', ''));
  const result: HashParams = {};
  
  params.forEach((value, key) => {
    result[key as keyof HashParams] = value;
  });
  
  return result;
}