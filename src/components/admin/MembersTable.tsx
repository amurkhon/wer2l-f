'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { SafeImage } from '@/components/shared/SafeImage';
import type { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { AdminMembersActions } from '@/components/admin/AdminMembersActions';
import { MEMBER_ROLE_LABELS, MEMBER_STATUS_LABELS, formatDate } from '@/lib/utils';

interface MembersTableProps {
  members: Member[];
}

const columns = [
  {
    key: 'name',
    header: 'Member',
    width: 'w-72',
    cell: (m: Member) => (
      <Link href={`/admin/members/${m._id}`} className="flex items-center gap-3 hover:text-primary">
        <SafeImage
          src={m.profileImage}
          alt={m.fullName}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          fallback={
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          }
        />
        <span className="font-medium">{m.fullName}</span>
      </Link>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    cell: (m: Member) => (
      <Badge variant="secondary">{MEMBER_ROLE_LABELS[m.role] ?? m.role}</Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (m: Member) => (
      <Badge variant={m.status === 'active' ? 'default' : 'outline'}>
        {MEMBER_STATUS_LABELS[m.status] ?? m.status}
      </Badge>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    cell: (m: Member) => formatDate(m.joinedDate),
  },
  {
    key: 'actions',
    header: '',
    width: 'w-24',
    cell: (m: Member) => <AdminMembersActions memberId={m._id} />,
  },
];

export function MembersTable({ members }: MembersTableProps) {
  return (
    <DataTable
      data={members}
      columns={columns}
      searchPlaceholder="Search members..."
      searchKeys={['fullName', 'role', 'status']}
    />
  );
}
