import type { User } from '@/types';
import { authApi } from '@/lib/api/auth';

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await authApi.me();
  } catch {
    return null;
  }
}

export function getAccessToken(): string | undefined {
  if (typeof window !== 'undefined') return undefined;
  return undefined; // handled by apiFetch reading cookies
}
