import type { Highlight, HighlightsQuery } from '@/types';
import { apiFetch } from './client';

export const highlightsApi = {
  list: (params?: HighlightsQuery) =>
    apiFetch<Highlight[]>('/highlights', { params, next: { revalidate: 60 } }),

  get: (id: string) =>
    apiFetch<Highlight>(`/highlights/${id}`, { next: { revalidate: 60 } }),

  create: (data: Omit<Highlight, '_id' | 'slug' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Highlight>('/highlights', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Omit<Highlight, '_id' | 'slug' | 'createdAt' | 'updatedAt'>>) =>
    apiFetch<Highlight>(`/highlights/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: string) =>
    apiFetch<void>(`/highlights/${id}`, { method: 'DELETE' }),
};
