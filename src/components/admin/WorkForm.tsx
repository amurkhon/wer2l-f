'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FileText, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { workSchema, type WorkFormValues } from '@/lib/schemas';
import type { Work } from '@/types';
import { SafeImage } from '@/components/shared/SafeImage';
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

// Must match PDF_MAX_BYTES in the backend's uploads.service.ts.
const PDF_MAX_MB = 50;

/** Uploads a file to POST /uploads/{kind} and returns its stored /uploads/... path. */
async function uploadFile(kind: 'image' | 'pdf', file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`/api/proxy/uploads/${kind}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: unknown };
    const fallback = kind === 'pdf' ? 'Could not upload PDF' : 'Could not upload image';
    throw new Error(typeof err.message === 'string' ? err.message : fallback);
  }
  const { fileUrl } = await res.json() as { fileUrl: string };
  return fileUrl;
}

export function WorkForm({ work, onSubmit, children }: WorkFormProps) {
  const router = useRouter();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

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
      if (file.size > PDF_MAX_MB * 1024 * 1024) {
        const sizeMb = (file.size / 1024 / 1024).toFixed(1);
        throw new Error(`This PDF is ${sizeMb} MB; the limit is ${PDF_MAX_MB} MB.`);
      }
      form.setValue('pdfFile', await uploadFile('pdf', file), { shouldDirty: true });
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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      form.setValue('coverImage', await uploadFile('image', file), { shouldDirty: true });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const coverImage = form.watch('coverImage');
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
              render={() => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-muted">
                        {/* key resets SafeImage's error state when a new image replaces a broken one */}
                        <SafeImage
                          key={coverImage}
                          src={coverImage}
                          alt="Cover preview"
                          fill
                          sizes="448px"
                          className="h-full w-full object-contain"
                          unoptimized
                          fallback={
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploadingCover}
                          onClick={() => coverInputRef.current?.click()}
                        >
                          {uploadingCover
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Upload className="mr-2 h-4 w-4" />}
                          {uploadingCover ? 'Uploading…' : coverImage ? 'Replace Image' : 'Upload Image'}
                        </Button>
                        {coverImage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove cover image"
                            className="text-destructive hover:text-destructive"
                            onClick={() => form.setValue('coverImage', '', { shouldDirty: true })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="sr-only"
                        onChange={handleCoverUpload}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Shown on the publication card and page. JPEG, PNG, GIF or WebP.
                  </FormDescription>
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
                    Visitors can download this file from the publication page. Max {PDF_MAX_MB} MB.
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
