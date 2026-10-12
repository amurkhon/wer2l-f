'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
            placeholder="Search works..."
            className="h-10 w-full rounded-full border-transparent bg-cg-raised px-4 text-cg-fg placeholder:text-cg-fg3 focus-visible:ring-cg-hero"
          />
        </form>
      </div>

      <Separator className="bg-cg-hover" />

      <div>
        <Label className="type-overline mb-3 block text-cg-fg3">Type</Label>
        <div className="flex flex-col gap-1">
          {TYPES.map((t) => (
            <Button
              key={t.value}
              variant="ghost"
              size="sm"
              className={cn(
                'justify-start rounded-full px-4',
                type === t.value || (!type && !t.value)
                  ? 'bg-cg-fg text-cg-canvas hover:bg-cg-fg hover:text-cg-canvas'
                  : 'text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg',
              )}
              onClick={() => updateParam('type', t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <>
          <Separator className="bg-cg-hover" />
          <div>
            <Label className="type-overline mb-3 block text-cg-fg3">Category</Label>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'justify-start rounded-full px-4',
                  !category
                    ? 'bg-cg-fg text-cg-canvas hover:bg-cg-fg hover:text-cg-canvas'
                    : 'text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg',
                )}
                onClick={() => updateParam('category', '')}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat._id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'justify-start rounded-full px-4',
                    category === cat._id
                      ? 'bg-cg-fg text-cg-canvas hover:bg-cg-fg hover:text-cg-canvas'
                      : 'text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg',
                  )}
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
