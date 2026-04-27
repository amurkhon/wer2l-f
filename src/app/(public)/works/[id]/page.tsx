import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { worksApi } from '@/lib/api/works';
import { uploadsApi } from '@/lib/api/uploads';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WorkCard } from '@/components/public/WorkCard';
import { LikeButton } from '@/components/public/LikeButton';
import {
  WORK_TYPE_LABELS,
  WORK_STATUS_LABELS,
  AUTHORSHIP_ROLE_LABELS,
  formatDate,
  formatFileSize,
} from '@/lib/utils';
import { ApiError } from '@/lib/api/client';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const work = await worksApi.get(id);
    return {
      title: work.title,
      description: work.description?.slice(0, 160),
      openGraph: {
        title: work.title,
        description: work.description?.slice(0, 160),
        images: work.coverImage ? [work.coverImage] : [],
        type: 'article',
        publishedTime: work.completionDate,
        authors: work.authors.map((a) => a.member.fullName),
      },
    };
  } catch {
    return { title: 'Work Not Found' };
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;

  let work;
  try {
    work = await worksApi.get(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [attachmentsResult, relatedResult] = await Promise.allSettled([
    uploadsApi.listByWork(id),
    worksApi.list({ category: work.categoryId, status: 'published' }),
  ]);

  const attachments = attachmentsResult.status === 'fulfilled' ? attachmentsResult.value : [];
  const relatedWorks =
    relatedResult.status === 'fulfilled'
      ? relatedResult.value.filter((w) => w._id !== id).slice(0, 4)
      : [];

  const sortedAuthors = [...work.authors].sort((a, b) => a.order - b.order);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: work.title,
    description: work.description,
    author: sortedAuthors.map((a) => ({
      '@type': 'Person',
      name: a.member.fullName,
    })),
    datePublished: work.completionDate,
    image: work.coverImage,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link href="/works">
            <ArrowLeft className="h-4 w-4" />
            Back to Works
          </Link>
        </Button>

        {/* Hero */}
        {work.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <Image
              src={work.coverImage}
              alt={work.title}
              width={900}
              height={450}
              className="h-72 w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{WORK_TYPE_LABELS[work.type] ?? work.type}</Badge>
          {work.category && <Badge variant="outline">{work.category.name}</Badge>}
          <Badge
            variant={
              work.status === 'published'
                ? 'success'
                : work.status === 'in_progress'
                  ? 'warning'
                  : 'secondary'
            }
          >
            {WORK_STATUS_LABELS[work.status]}
          </Badge>
          {work.featured && <Badge variant="info">Featured</Badge>}
        </div>

        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight">{work.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {work.completionDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(work.completionDate, 'MMMM d, yyyy')}
            </span>
          )}
          <LikeButton workId={work._id} initialCount={work.likeCount} />
        </div>

        <Separator className="my-8" />

        {/* Authors */}
        {sortedAuthors.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-serif text-xl font-semibold">Authors</h2>
            <div className="space-y-3">
              {sortedAuthors.map((authorship) => (
                <Link
                  key={authorship._id}
                  href={`/members/${authorship.memberId}`}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={authorship.member.profileImage}
                      alt={authorship.member.fullName}
                    />
                    <AvatarFallback>
                      {authorship.member.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{authorship.member.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {AUTHORSHIP_ROLE_LABELS[authorship.role]}
                      {authorship.contribution && ` · ${authorship.contribution}`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {work.description && (
          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-semibold">Abstract</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {work.description}
            </p>
          </section>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-serif text-xl font-semibold">Downloads</h2>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <a
                  key={attachment._id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent"
                >
                  <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm font-medium">{attachment.originalName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related Works */}
        {relatedWorks.length > 0 && (
          <>
            <Separator className="my-10" />
            <section>
              <h2 className="mb-6 font-serif text-2xl font-semibold">Related Works</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedWorks.map((rw) => (
                  <WorkCard key={rw._id} work={rw} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
