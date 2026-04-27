'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface WorkFiltersProps {
  categories: Category[];
  type?: string;
  category?: string;
  status?: string;
  search?: string;
}

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'paper', label: 'Paper' },
  { value: 'project', label: 'Project' },
  { value: 'patent', label: 'Patent' },
  { value: 'thesis', label: 'Thesis' },
];

export function WorkFilters({ categories, type, category, status, search }: WorkFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      if (type && key !== 'type') params.set('type', type);
      if (category && key !== 'category') params.set('category', category);
      if (status && key !== 'status') params.set('status', status);
      if (search && key !== 'search') params.set('search', search);
      if (value) params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [type, category, status, search, router, pathname],
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
            placeholder="Search works..."
            className="w-full"
          />
        </form>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-semibold">Type</Label>
        <div className="flex flex-col gap-1">
          {TYPES.map((t) => (
            <Button
              key={t.value}
              variant={type === t.value || (!type && !t.value) ? 'secondary' : 'ghost'}
              size="sm"
              className="justify-start"
              onClick={() => updateParam('type', t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <>
          <Separator />
          <div>
            <Label className="mb-2 block text-sm font-semibold">Category</Label>
            <div className="flex flex-col gap-1">
              <Button
                variant={!category ? 'secondary' : 'ghost'}
                size="sm"
                className="justify-start"
                onClick={() => updateParam('category', '')}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat._id}
                  variant={category === cat._id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="justify-start"
                  onClick={() => updateParam('category', cat._id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
