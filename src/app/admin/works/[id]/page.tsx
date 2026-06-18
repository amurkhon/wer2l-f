import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditWorkForm } from '@/components/admin/EditWorkForm';
import { worksApi } from '@/lib/api/works';
import { membersApi } from '@/lib/api/members';
import { ApiError } from '@/lib/api/client';

export const metadata: Metadata = {
  title: 'Edit Work — Admin',
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: Props) {
  const { id } = await params;

  let work;
  try {
    work = await worksApi.get(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const members = await membersApi.list({});

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/works">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Edit Work</h1>
      </div>
      <EditWorkForm work={work} allMembers={members} />
    </div>
  );
}
