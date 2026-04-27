import type { User } from '@/types';
import { apiFetch } from './client';

export const authApi = {
  me: () =>
    apiFetch<User>('/auth/me', { cache: 'no-store' }),

  refresh: (refreshToken: string) =>
    apiFetch<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
    }),
};
