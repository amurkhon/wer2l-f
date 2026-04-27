import { apiFetch } from './client';

export const likesApi = {
  like: (workId: string, anonymousId: string) =>
    apiFetch<void>(`/works/${workId}/likes`, {
      method: 'POST',
      body: JSON.stringify({ anonymousId }),
    }),

  unlike: (workId: string, anonymousId: string) =>
    apiFetch<void>(`/works/${workId}/likes/${anonymousId}`, {
      method: 'DELETE',
    }),

  getCount: (workId: string) =>
    apiFetch<{ count: number }>(`/works/${workId}/likes/count`),
};
