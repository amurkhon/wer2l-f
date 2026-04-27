export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ParamValue = string | number | boolean | undefined;
type FetchOptions = RequestInit & {
  params?: Record<string, ParamValue>;
};

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  let url: URL;

  if (typeof window === 'undefined') {
    const base = process.env.BACKEND_URL ?? 'http://localhost:4000';
    url = new URL(path, base);
  } else {
    url = new URL(`/api/proxy${path}`, window.location.origin);
  }

  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const headers = new Headers(opts.headers);
  if (!headers.has('Content-Type') && opts.method && opts.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url.toString(), { ...opts, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
