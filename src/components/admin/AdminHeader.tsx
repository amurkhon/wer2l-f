'use client';

import { useRouter } from 'next/navigation';
import { LogOut, ExternalLink } from 'lucide-react';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user: _ }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="text-sm text-muted-foreground">Admin Panel</div>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View Site
          </a>
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
