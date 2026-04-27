import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateWorkForm } from '@/components/admin/CreateWorkForm';
import { categoriesApi } from '@/lib/api/categories';

export const metadata: Metadata = {
  title: 'Add Work — Admin',
  robots: { index: false },
};

export default async function NewWorkPage() {
  const categories = await categoriesApi.list();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/works">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Add Work</h1>
      </div>
      <CreateWorkForm categories={categories} />
    </div>
  );
}
