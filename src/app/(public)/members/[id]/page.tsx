import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Mail,
  ExternalLink,
  User,
  Calendar,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { membersApi } from '@/lib/api/members';
import { worksApi } from '@/lib/api/works';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WorkCard } from '@/components/public/WorkCard';
import {
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
  WORK_TYPE_LABELS,
  formatDate,
} from '@/lib/utils';
import type { WorkType } from '@/types';
import { ApiError } from '@/lib/api/client';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const member = await membersApi.get(id);
    return {
      title: member.fullName,
      description: member.biography?.slice(0, 160),
      openGraph: {
        title: member.fullName,
        description: member.biography?.slice(0, 160),
        images: member.profileImage ? [member.profileImage] : [],
        type: 'profile',
      },
    };
  } catch {
    return { title: 'Member Not Found' };
  }
}

const WORK_TYPE_ORDER: WorkType[] = ['paper', 'project', 'patent', 'thesis'];

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;

  let member;
  try {
    member = await membersApi.get(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const works = await worksApi.list({ authorId: id, status: 'published' }).catch(() => []);

  const worksByType = WORK_TYPE_ORDER.reduce<Record<WorkType, typeof works>>(
    (acc, type) => {
      acc[type] = works.filter((w) => w.type === type);
      return acc;
    },
    { paper: [], project: [], patent: [], thesis: [] },
  );

  const initials = member.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Profile header */}
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="shrink-0">
          {member.profileImage ? (
            <Image
              src={member.profileImage}
              alt={member.fullName}
              width={200}
              height={200}
              className="h-48 w-48 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-muted">
              <span className="font-serif text-4xl font-bold text-muted-foreground">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">{member.fullName}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="default">{MEMBER_ROLE_LABELS[member.role] ?? member.role}</Badge>
              <Badge variant={member.status === 'active' ? 'success' : 'outline'}>
                {MEMBER_STATUS_LABELS[member.status] ?? member.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(member.joinedDate, 'MMMM yyyy')}
            </span>
            {member.leftDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Left {formatDate(member.leftDate, 'MMMM yyyy')}
              </span>
            )}
          </div>

          {member.biography && (
            <p className="text-muted-foreground leading-relaxed">{member.biography}</p>
          )}

          {/* Social links */}
          <div className="flex flex-wrap gap-2">
            {member.socialLinks.email && (
              <Button asChild variant="outline" size="sm">
                <Link href={`mailto:${member.socialLinks.email}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </Link>
              </Button>
            )}
            {member.socialLinks.googleScholar && (
              <Button asChild variant="outline" size="sm">
                <Link href={member.socialLinks.googleScholar} target="_blank" rel="noopener noreferrer">
                  <GraduationCap className="h-4 w-4" />
                  Google Scholar
                </Link>
              </Button>
            )}
            {member.socialLinks.orcid && (
              <Button asChild variant="outline" size="sm">
                <Link href={member.socialLinks.orcid} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  ORCID
                </Link>
              </Button>
            )}
            {member.socialLinks.linkedin && (
              <Button asChild variant="outline" size="sm">
                <Link href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
            )}
            {member.socialLinks.personalSite && (
              <Button asChild variant="outline" size="sm">
                <Link href={member.socialLinks.personalSite} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Personal Site
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Works by type */}
      {works.length > 0 && (
        <div className="mt-16 space-y-12">
          <h2 className="font-serif text-2xl font-bold">Authored Works</h2>
          {WORK_TYPE_ORDER.filter((type) => worksByType[type].length > 0).map((type) => (
            <div key={type}>
              <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold">
                <BookOpen className="h-5 w-5 text-primary" />
                {WORK_TYPE_LABELS[type]}s ({worksByType[type].length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {worksByType[type].map((work) => (
                  <WorkCard key={work._id} work={work} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {works.length === 0 && (
        <div className="mt-16 text-center text-muted-foreground">
          <User className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>No published works yet.</p>
        </div>
      )}
    </div>
  );
}
