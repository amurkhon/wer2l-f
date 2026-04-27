import type { Category } from '@/types';
import { apiFetch } from './client';

export const categoriesApi = {
  list: () =>
    apiFetch<Category[]>('/categories', { next: { revalidate: 300 } }),

  get: (id: string) =>
    apiFetch<Category>(`/categories/${id}`, { next: { revalidate: 300 } }),

  create: (data: Omit<Category, '_id' | 'slug' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Omit<Category, '_id' | 'slug' | 'createdAt' | 'updatedAt'>>) =>
    apiFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: string) =>
    apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
};
