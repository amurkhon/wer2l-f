import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4005';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: `refresh_token=${refreshToken}` },
  });

  if (!backendRes.ok) {
    const response = NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  const data = await backendRes.json() as { accessToken: string };
  const response = NextResponse.json({ ok: true });
  response.cookies.set('access_token', data.accessToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });
  return response;
}
