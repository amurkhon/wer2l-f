'use client';

import type { WorkWithAuthors, Category, Member } from '@/types';
import { WorkForm } from '@/components/admin/WorkForm';
import { AuthorManager } from '@/components/admin/AuthorManager';
import type { WorkFormValues } from '@/lib/schemas';

interface EditWorkFormProps {
  work: WorkWithAuthors;
  categories: Category[];
  allMembers: Member[];
}

export function EditWorkForm({ work, categories, allMembers }: EditWorkFormProps) {
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
    <WorkForm work={work} categories={categories} onSubmit={handleSubmit}>
      <AuthorManager
        workId={work._id}
        initialAuthors={work.authors}
        allMembers={allMembers}
      />
    </WorkForm>
  );
}
