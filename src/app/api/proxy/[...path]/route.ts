import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/');
  const url = new URL(`/${path}`, BACKEND_URL);

  const { searchParams } = request.nextUrl;
  searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const accessToken = request.cookies.get('access_token')?.value;
  const headers = new Headers();
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.blob()
      : undefined;

  const backendRes = await fetch(url.toString(), {
    method: request.method,
    headers,
    body,
  });

  if (backendRes.status === 401) {
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refresh_token=${request.cookies.get('refresh_token')?.value ?? ''}`,
      },
    });

    if (refreshRes.ok) {
      const { accessToken: newToken } = await refreshRes.json() as { accessToken: string };
      headers.set('Authorization', `Bearer ${newToken}`);

      const retryRes = await fetch(url.toString(), {
        method: request.method,
        headers,
        body,
      });

      const retryData = retryRes.status === 204 ? null : await retryRes.text();
      const response = new NextResponse(retryData, { status: retryRes.status });
      response.cookies.set('access_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60,
        path: '/',
      });
      return response;
    }

    const response = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    response.cookies.delete('access_token');
    return response;
  }

  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.text();
  return new NextResponse(data, {
    status: backendRes.status,
    headers: { 'Content-Type': backendRes.headers.get('content-type') ?? 'application/json' },
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
