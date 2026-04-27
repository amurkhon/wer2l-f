import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateMemberForm } from '@/components/admin/CreateMemberForm';

export const metadata: Metadata = {
  title: 'Add Member — Admin',
  robots: { index: false },
};

export default function NewMemberPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/members">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Add Member</h1>
      </div>
      <CreateMemberForm />
    </div>
  );
}
