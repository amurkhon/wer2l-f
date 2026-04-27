'use client';

import { MemberForm } from '@/components/admin/MemberForm';
import type { MemberFormValues } from '@/lib/schemas';

export function CreateMemberForm() {
  const handleSubmit = async (values: MemberFormValues) => {
    await fetch('/api/proxy/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
    });
  };

  return <MemberForm onSubmit={handleSubmit} />;
}
