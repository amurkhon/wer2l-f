'use client';

import { WorkForm } from '@/components/admin/WorkForm';
import type { WorkFormValues } from '@/lib/schemas';

export function CreateWorkForm() {
  const handleSubmit = async (values: WorkFormValues) => {
    await fetch('/api/proxy/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
    });
  };

  return <WorkForm onSubmit={handleSubmit} />;
}
