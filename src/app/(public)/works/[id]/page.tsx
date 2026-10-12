import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Download,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { worksApi } from '@/lib/api/works';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WorkCard } from '@/components/public/WorkCard';
import { LikeButton } from '@/components/public/LikeButton';
import { MatteFrame } from '@/components/shared/MatteFrame';
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

  const relatedWorks = await worksApi
    .list({ category: work.categoryId, status: 'published' })
    .then((works) => works.filter((w) => w._id !== id).slice(0, 4))
    .catch(() => []);

  // Comes with the public work response; GET /uploads/work/:id is admin-only.
  const attachments = work.attachments ?? [];

  const sortedAuthors = [...work.authors].sort((a, b) => a.order - b.order);

  // Only link http(s) URLs — the backend accepts any string for paperUrl.
  const paperHref =
    work.paperUrl && /^https?:\/\//i.test(work.paperUrl) ? work.paperUrl : undefined;

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

      <div className="mx-auto max-w-[860px] px-6 pb-28 pt-12 md:px-10">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-3 mb-8 rounded-full text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg"
        >
          <Link href="/works">
            <ArrowLeft className="h-4 w-4" />
            Back to Works
          </Link>
        </Button>

        {/* Hero */}
        {work.coverImage && (
          <MatteFrame
            src={work.coverImage}
            alt={work.title}
            sizes="(min-width: 896px) 860px, 100vw"
            priority
            className="press-tile anim-blur-in mb-10"
            windowClassName="aspect-video bg-white"
            imageClassName="object-contain"
            fallback={<div className="absolute inset-0 bg-cg-raised" />}
          />
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

        <h1 className="mt-6 font-display text-[clamp(2.25rem,4.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-cg-fg">
          {paperHref ? (
            <a
              href={paperHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-colors hover:text-cg-hero"
            >
              {work.title}
              <ExternalLink className="ml-2 inline-block h-6 w-6 align-baseline text-cg-fg3 transition-colors group-hover:text-cg-hero" />
            </a>
          ) : (
            work.title
          )}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-cg-fg2">
          {work.completionDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(work.completionDate, 'MMMM d, yyyy')}
            </span>
          )}
          <LikeButton workId={work._id} initialCount={work.likeCount} />
        </div>

        {work.pdfFile && (
          <a href={work.pdfFile} download={`${work.title}.pdf`} className="btn-cg btn-cg--primary mt-7">
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        )}

        <Separator className="my-10 bg-cg-hover" />

        {/* Authors */}
        {sortedAuthors.length > 0 && (
          <section className="mb-8">
            <h2 className="type-headline mb-4 text-cg-fg">Authors</h2>
            <div className="space-y-3">
              {sortedAuthors.map((authorship) => (
                <Link
                  key={authorship._id}
                  href={`/members/${authorship.memberId}`}
                  className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-cg-raised"
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
                    <div className="font-semibold text-cg-fg">{authorship.member.fullName}</div>
                    <div className="text-xs text-cg-fg2">
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
            <h2 className="type-headline mb-3 text-cg-fg">Abstract</h2>
            <p className="type-body whitespace-pre-wrap text-cg-fg2">
              {work.description}
            </p>
          </section>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <section className="mb-8">
            <h2 className="type-headline mb-4 text-cg-fg">Downloads</h2>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <a
                  key={attachment._id}
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-cg-base p-4 transition-colors hover:bg-cg-raised"
                >
                  <Download className="h-4 w-4 shrink-0 text-cg-hero" />
                  <span className="flex-1 text-sm font-medium text-cg-fg">
                    {attachment.caption ?? attachment.fileUrl.split('/').pop()}
                  </span>
                  <span className="text-xs text-cg-fg3">
                    {attachment.sizeBytes != null ? formatFileSize(attachment.sizeBytes) : ''}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related Works */}
        {relatedWorks.length > 0 && (
          <>
            <Separator className="my-12 bg-cg-hover" />
            <section>
              <h2 className="type-section mb-8 text-cg-fg">Related Works</h2>
              <div className="grid gap-5 sm:grid-cols-2">
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
