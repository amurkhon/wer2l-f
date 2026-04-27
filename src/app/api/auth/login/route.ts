import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function POST(request: NextRequest) {
  const body = await request.json() as { email: string; password: string };

  const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  if (!backendRes.ok) {
    const text = await backendRes.text();
    let message: string;
    try {
      const json = JSON.parse(text) as { message?: string };
      message = json.message ?? 'Invalid credentials';
    } catch {
      message = 'Invalid credentials';
    }
    return NextResponse.json({ message }, { status: backendRes.status });
  }

  const data = await backendRes.json() as { accessToken: string };

  const response = NextResponse.json({ ok: true }, { status: 200 });

  response.cookies.set('access_token', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 minutes, matches JWT_ACCESS_EXPIRY
    path: '/',
  });

  const setCookieHeader = backendRes.headers.get('set-cookie');
  if (setCookieHeader) {
    const match = setCookieHeader.match(/refresh_token=([^;]+)/);
    if (match) {
      response.cookies.set('refresh_token', match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days, matches JWT_REFRESH_EXPIRY
        path: '/api',
      });
    }
  }

  return response;
}
