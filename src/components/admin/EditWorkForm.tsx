'use client';

import type { WorkWithAuthors, Member } from '@/types';
import { WorkForm } from '@/components/admin/WorkForm';
import { AuthorManager } from '@/components/admin/AuthorManager';
import type { WorkFormValues } from '@/lib/schemas';

interface EditWorkFormProps {
  work: WorkWithAuthors;
  allMembers: Member[];
}

export function EditWorkForm({ work, allMembers }: EditWorkFormProps) {
  const handleSubmit = async (values: WorkFormValues) => {
    await fetch(`/api/proxy/works/${work._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
    });
  };

  return (
    <WorkForm work={work} onSubmit={handleSubmit}>
      <AuthorManager
        workId={work._id}
        initialAuthors={work.authors}
        allMembers={allMembers}
      />
    </WorkForm>
  );
}
