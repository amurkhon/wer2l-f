import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { usersApi } from '@/lib/api/users';
import { membersApi } from '@/lib/api/members';
import { UsersManager } from '@/components/admin/UsersManager';

export const metadata: Metadata = {
  title: 'Users — Admin',
  robots: { index: false },
};

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  if (!me || me.accessLevel !== 'admin') redirect('/admin/dashboard');

  const [users, members] = await Promise.all([
    usersApi.list(),
    membersApi.list({}),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-serif text-3xl font-bold">Users</h1>
      <UsersManager initialUsers={users} members={members} />
    </div>
  );
}
