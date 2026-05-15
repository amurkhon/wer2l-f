'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { z } from 'zod';
import type { Highlight } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeImage } from '@/components/shared/SafeImage';

const highlightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['news', 'award', 'publication', 'event']),
  status: z.enum(['draft', 'published']),
  coverImage: z.string().optional(),
  featured: z.boolean(),
  publishedAt: z.string().optional(),
});

type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightFormProps {
  highlight?: Highlight;
  onSubmit: (values: HighlightFormValues) => Promise<void>;
}

export function HighlightForm({ highlight, onSubmit }: HighlightFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<HighlightFormValues>({
    resolver: zodResolver(highlightSchema),
    defaultValues: {
      title: highlight?.title ?? '',
      summary: highlight?.summary ?? '',
      content: highlight?.content ?? '',
      type: highlight?.type ?? 'news',
      status: highlight?.status ?? 'draft',
      coverImage: highlight?.coverImage ?? '',
      featured: highlight?.featured ?? false,
      publishedAt: highlight?.publishedAt
        ? new Date(highlight.publishedAt).toISOString().split('T')[0]
        : '',
    },
  });

  const coverImage = form.watch('coverImage');

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/proxy/uploads/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      const { fileUrl } = await res.json() as { fileUrl: string };
      form.setValue('coverImage', fileUrl, { shouldDirty: true });
    } catch {
      toast({ title: 'Upload failed', description: 'Could not upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (values: HighlightFormValues) => {
    try {
      await onSubmit(values);
      toast({ title: highlight ? 'Highlight updated' : 'Highlight created' });
      router.push('/admin/highlights');
      router.refresh();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Highlight Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Highlight title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="award">Award</SelectItem>
                        <SelectItem value="publication">Publication</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short teaser shown on cards"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full content shown on the detail page"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image upload */}
            <FormField
              control={form.control}
              name="coverImage"
              render={() => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Preview */}
                      <div className="relative h-40 w-full overflow-hidden rounded-lg border bg-muted">
                        <SafeImage
                          src={coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                          unoptimized
                          fallback={
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                          }
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploading}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploading
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Upload className="mr-2 h-4 w-4" />}
                          {uploading ? 'Uploading…' : 'Upload Image'}
                        </Button>
                        {coverImage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => form.setValue('coverImage', '', { shouldDirty: true })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="sr-only"
                        onChange={handleCoverUpload}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="w-48" {...field} />
                  </FormControl>
                  <FormDescription>Leave blank to auto-set on publish.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>Show this highlight prominently on the site.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {highlight ? 'Save Changes' : 'Create Highlight'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/highlights')}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
