import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  }).catch(() => {});

  const response = NextResponse.json({ ok: true });
  response.cookies.delete('access_token');
  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/api',
  });
  return response;
}
