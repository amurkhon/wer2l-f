import type { MetadataRoute } from 'next';
import { worksApi } from '@/lib/api/works';
import { membersApi } from '@/lib/api/members';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4006';

  const [works, members] = await Promise.allSettled([
    worksApi.list({ status: 'published' }),
    membersApi.list({ status: 'active' }),
  ]);

  const workUrls: MetadataRoute.Sitemap =
    works.status === 'fulfilled'
      ? works.value.map((w) => ({
          url: `${base}/works/${w._id}`,
          lastModified: new Date(w.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      : [];

  const memberUrls: MetadataRoute.Sitemap =
    members.status === 'fulfilled'
      ? members.value.map((m) => ({
          url: `${base}/members/${m._id}`,
          lastModified: new Date(m.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
      : [];

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/members`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/works`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...workUrls,
    ...memberUrls,
  ];
}
