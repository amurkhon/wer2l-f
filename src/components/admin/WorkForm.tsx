'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { workSchema, type WorkFormValues } from '@/lib/schemas';
import type { Work } from '@/types';
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

interface WorkFormProps {
  work?: Work;
  onSubmit: (values: WorkFormValues) => Promise<void>;
  children?: React.ReactNode;
}

export function WorkForm({ work, onSubmit, children }: WorkFormProps) {
  const router = useRouter();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: work?.title ?? '',
      type: work?.type ?? 'paper',
      paperUrl: work?.paperUrl ?? '',
      pdfFile: work?.pdfFile ?? '',
      description: work?.description ?? '',
      coverImage: work?.coverImage ?? '',
      status: work?.status ?? 'in_progress',
      completionDate: work?.completionDate
        ? new Date(work.completionDate).toISOString().split('T')[0] ?? ''
        : '',
      featured: work?.featured ?? false,
    },
  });

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/proxy/uploads/pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: unknown };
        throw new Error(typeof err.message === 'string' ? err.message : 'Could not upload PDF');
      }
      const { fileUrl } = await res.json() as { fileUrl: string };
      form.setValue('pdfFile', fileUrl, { shouldDirty: true });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload PDF',
        variant: 'destructive',
      });
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const pdfFile = form.watch('pdfFile');
  // Stored names are "<uuid>-<original name>.pdf"; show only the original part.
  const pdfFileName = pdfFile?.split('/').pop()?.replace(/^[0-9a-f-]{36}-/i, '');

  const handleSubmit = async (values: WorkFormValues) => {
    try {
      await onSubmit(values);
      toast({ title: work ? 'Work updated' : 'Work created' });
      router.push('/admin/works');
      router.refresh();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Work Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Work title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paper">Paper</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="patent">Patent</SelectItem>
                      <SelectItem value="thesis">Thesis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paperUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper Link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://doi.org/..."
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>Link to the published paper.</FormDescription>
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pdfFile"
              render={() => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>PDF File</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap items-center gap-3">
                      {pdfFile && (
                        <a
                          href={pdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-w-0 items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                        >
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{pdfFileName}</span>
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploadingPdf}
                          onClick={() => pdfInputRef.current?.click()}
                        >
                          {uploadingPdf
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Upload className="mr-2 h-4 w-4" />}
                          {uploadingPdf ? 'Uploading…' : pdfFile ? 'Replace PDF' : 'Upload PDF'}
                        </Button>
                        {pdfFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove PDF"
                            className="text-destructive hover:text-destructive"
                            onClick={() => form.setValue('pdfFile', '', { shouldDirty: true })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        className="sr-only"
                        onChange={handlePdfUpload}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Visitors can download this file from the publication page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Abstract / Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Describe the work..."
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4 sm:col-span-2">
                  <div>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>Show on the landing page featured section.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Author management is passed as children on edit pages */}
        {children}

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {work ? 'Update Work' : 'Create Work'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
