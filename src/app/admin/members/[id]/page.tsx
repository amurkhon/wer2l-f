import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditMemberForm } from '@/components/admin/EditMemberForm';
import { membersApi } from '@/lib/api/members';
import { ApiError } from '@/lib/api/client';

export const metadata: Metadata = {
  title: 'Edit Member — Admin',
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;

  let member;
  try {
    member = await membersApi.get(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/members">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Edit Member</h1>
      </div>
      <EditMemberForm member={member} />
    </div>
  );
}
