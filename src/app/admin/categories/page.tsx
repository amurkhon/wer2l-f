import type { Metadata } from 'next';
import { categoriesApi } from '@/lib/api/categories';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export const metadata: Metadata = {
  title: 'Categories — Admin',
  robots: { index: false },
};

export default async function AdminCategoriesPage() {
  const categories = await categoriesApi.list();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl font-bold">Categories</h1>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
