import type { Attachment } from '@/types';
import { apiFetch } from './client';

export const uploadsApi = {
  listByWork: (workId: string) =>
    apiFetch<Attachment[]>(`/uploads/work/${workId}`, { next: { revalidate: 60 } }),

  upload: async (file: File, workId: string, label?: string): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workId', workId);
    if (label) formData.append('label', label);

    const res = await fetch('/api/proxy/uploads', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Attachment>;
  },

  remove: (id: string) =>
    apiFetch<void>(`/uploads/${id}`, { method: 'DELETE' }),
};
