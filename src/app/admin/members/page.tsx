import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { membersApi } from '@/lib/api/members';
import { MembersTable } from '@/components/admin/MembersTable';

export const metadata: Metadata = {
  title: 'Members — Admin',
  robots: { index: false },
};

export default async function AdminMembersPage() {
  const members = await membersApi.list({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">{members.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/members/new">
            <Plus className="h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      <MembersTable members={members} />
    </div>
  );
}
