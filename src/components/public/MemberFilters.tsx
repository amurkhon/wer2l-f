'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
        <Label className="mb-2 block text-sm font-semibold">Search</Label>
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
            className="w-full"
          />
        </form>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-semibold">Role</Label>
        <div className="flex flex-col gap-1">
          {ROLES.map((r) => (
            <Button
              key={r.value}
              variant={role === r.value || (!role && !r.value) ? 'secondary' : 'ghost'}
              size="sm"
              className="justify-start"
              onClick={() => updateParam('role', r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-semibold">Status</Label>
        <div className="flex flex-col gap-1">
          {STATUSES.map((s) => (
            <Button
              key={s.value}
              variant={status === s.value || (!status && !s.value) ? 'secondary' : 'ghost'}
              size="sm"
              className="justify-start"
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
