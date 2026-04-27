import type { Work, WorkWithAuthors, WorksQuery } from '@/types';
import { apiFetch } from './client';

export const worksApi = {
  list: (params?: WorksQuery) =>
    apiFetch<Work[]>('/works', { params, next: { revalidate: 60 } }),

  get: (id: string) =>
    apiFetch<WorkWithAuthors>(`/works/${id}`, { next: { revalidate: 60 } }),

  create: (data: Omit<Work, '_id' | 'likeCount' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Work>('/works', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Omit<Work, '_id' | 'likeCount' | 'createdAt' | 'updatedAt'>>) =>
    apiFetch<Work>(`/works/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: string) =>
    apiFetch<void>(`/works/${id}`, { method: 'DELETE' }),
};
