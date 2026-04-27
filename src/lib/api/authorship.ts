import type { Authorship, AuthorshipRole } from '@/types';
import { apiFetch } from './client';

export interface CreateAuthorshipPayload {
  memberId: string;
  order: number;
  role: AuthorshipRole;
  contribution?: string;
}

export interface ReorderItem {
  authorshipId: string;
  order: number;
}

export const authorshipApi = {
  add: (workId: string, data: CreateAuthorshipPayload) =>
    apiFetch<Authorship>(`/works/${workId}/authors`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (workId: string, authorshipId: string, data: Partial<Omit<CreateAuthorshipPayload, 'memberId'>>) =>
    apiFetch<Authorship>(`/works/${workId}/authors/${authorshipId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  reorder: (workId: string, items: ReorderItem[]) =>
    apiFetch<void>(`/works/${workId}/authors/order`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),

  remove: (workId: string, authorshipId: string) =>
    apiFetch<void>(`/works/${workId}/authors/${authorshipId}`, {
      method: 'DELETE',
    }),
};
