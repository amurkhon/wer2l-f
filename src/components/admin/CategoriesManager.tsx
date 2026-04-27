'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { Category } from '@/types';
import { categorySchema, type CategoryFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { CATEGORY_DOMAIN_LABELS } from '@/lib/utils';

interface CategoriesManagerProps {
  initialCategories: Category[];
}

const DOMAINS = [
  'structural',
  'geotechnical',
  'transportation',
  'hydraulic',
  'materials',
  'other',
] as const;

function CategoryRow({
  category,
  onDelete,
}: {
  category: Category;
  onDelete: (id: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1">
        <span className="font-medium">{category.name}</span>
        <div className="mt-0.5 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {CATEGORY_DOMAIN_LABELS[category.domain] ?? category.domain}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{category.slug}</span>
        </div>
        {category.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{category.description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        disabled={deleting}
        onClick={async () => {
          setDeleting(true);
          await onDelete(category._id).finally(() => setDeleting(false));
        }}
      >
        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', domain: 'structural', description: '' },
  });

  const handleCreate = async (values: CategoryFormValues) => {
    const res = await fetch('/api/proxy/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error(await res.text());
    const newCat = await res.json() as Category;
    setCategories((prev) => [...prev, newCat]);
    form.reset();
    setShowForm(false);
    toast({ title: 'Category created' });
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/proxy/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
      return;
    }
    setCategories((prev) => prev.filter((c) => c._id !== id));
    toast({ title: 'Category deleted' });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Categories ({categories.length})</CardTitle>
            <Button size="sm" onClick={() => setShowForm((s) => !s)}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  try {
                    await handleCreate(values);
                  } catch {
                    toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' });
                  }
                })}
                className="mb-4 rounded-lg border bg-muted/30 p-4 space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Structural Analysis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DOMAINS.map((d) => (
                              <SelectItem key={d} value={d}>
                                {CATEGORY_DOMAIN_LABELS[d]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional description..." {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {categories.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="divide-y">
              {categories.map((cat) => (
                <CategoryRow key={cat._id} category={cat} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
