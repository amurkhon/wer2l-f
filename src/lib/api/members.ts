import type { Member, MembersQuery } from '@/types';
import { apiFetch } from './client';

export const membersApi = {
  list: (params?: MembersQuery) =>
    apiFetch<Member[]>('/members', { params, next: { revalidate: 60 } }),

  get: (id: string) =>
    apiFetch<Member>(`/members/${id}`, { next: { revalidate: 60 } }),

  create: (data: Omit<Member, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Member>('/members', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Omit<Member, '_id' | 'createdAt' | 'updatedAt'>>) =>
    apiFetch<Member>(`/members/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: string) =>
    apiFetch<void>(`/members/${id}`, { method: 'DELETE' }),
};
