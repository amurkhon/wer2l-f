'use client';

import type { Member } from '@/types';
import { MemberForm } from '@/components/admin/MemberForm';
import type { MemberFormValues } from '@/lib/schemas';

interface EditMemberFormProps {
  member: Member;
}

export function EditMemberForm({ member }: EditMemberFormProps) {
  const handleSubmit = async (values: MemberFormValues) => {
    await fetch(`/api/proxy/members/${member._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
    });
  };

  return <MemberForm member={member} onSubmit={handleSubmit} />;
}
