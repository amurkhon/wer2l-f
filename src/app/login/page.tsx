import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/shared/Logo';

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold">Sign In</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Admin access only
            </p>
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
