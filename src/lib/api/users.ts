import type { User, UserAccessLevel } from '@/types';
import { apiFetch } from './client';

export interface CreateUserPayload {
  email: string;
  password: string;
  accessLevel: UserAccessLevel;
  memberId?: string;
}

export const usersApi = {
  list: () =>
    apiFetch<User[]>('/users', { cache: 'no-store' }),

  get: (id: string) =>
    apiFetch<User>(`/users/${id}`, { cache: 'no-store' }),

  create: (data: CreateUserPayload) =>
    apiFetch<User>('/users', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<CreateUserPayload>) =>
    apiFetch<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: string) =>
    apiFetch<void>(`/users/${id}`, { method: 'DELETE' }),
};
