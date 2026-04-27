'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Tag,
  UserCog,
} from 'lucide-react';
import type { User } from '@/types';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/members', icon: Users, label: 'Members' },
  { href: '/admin/works', icon: BookOpen, label: 'Works' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
];

const ADMIN_ONLY_ITEMS = [
  { href: '/admin/users', icon: UserCog, label: 'Users' },
];

interface AdminSidebarProps {
  user: User;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Logo inverted />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}

        {user.accessLevel === 'admin' &&
          ADMIN_ONLY_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-md px-3 py-2 text-xs text-sidebar-foreground/60">
          <div className="font-medium text-sidebar-foreground/80 truncate">{user.email}</div>
          <div className="capitalize">{user.accessLevel}</div>
        </div>
      </div>
    </aside>
  );
}
