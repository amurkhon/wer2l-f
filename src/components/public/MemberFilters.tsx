'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MemberFiltersProps {
  role?: string;
  status?: string;
  search?: string;
}

const ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'professor', label: 'Professor' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'student', label: 'Student' },
  { value: 'alumni', label: 'Alumni' },
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'emeritus', label: 'Emeritus' },
];

export function MemberFilters({ role, status, search }: MemberFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      if (role && key !== 'role') params.set('role', role);
      if (status && key !== 'status') params.set('status', status);
      if (search && key !== 'search') params.set('search', search);
      if (value) params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [role, status, search, router, pathname],
  );

  return (
    <div className="space-y-6">
      <div>
        <Label className="type-overline mb-3 block text-cg-fg3">Search</Label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            updateParam('search', fd.get('search') as string);
          }}
        >
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by name..."
            className="h-10 w-full rounded-full border-transparent bg-cg-raised px-4 text-cg-fg placeholder:text-cg-fg3 focus-visible:ring-cg-hero"
          />
        </form>
      </div>

      <Separator className="bg-cg-hover" />

      <div>
        <Label className="type-overline mb-3 block text-cg-fg3">Role</Label>
        <div className="flex flex-col gap-1">
          {ROLES.map((r) => (
            <Button
              key={r.value}
              variant="ghost"
              size="sm"
              className={cn(
                'justify-start rounded-full px-4',
                role === r.value || (!role && !r.value)
                  ? 'bg-cg-fg text-cg-canvas hover:bg-cg-fg hover:text-cg-canvas'
                  : 'text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg',
              )}
              onClick={() => updateParam('role', r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-cg-hover" />

      <div>
        <Label className="type-overline mb-3 block text-cg-fg3">Status</Label>
        <div className="flex flex-col gap-1">
          {STATUSES.map((s) => (
            <Button
              key={s.value}
              variant="ghost"
              size="sm"
              className={cn(
                'justify-start rounded-full px-4',
                status === s.value || (!status && !s.value)
                  ? 'bg-cg-fg text-cg-canvas hover:bg-cg-fg hover:text-cg-canvas'
                  : 'text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg',
              )}
              onClick={() => updateParam('status', s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
