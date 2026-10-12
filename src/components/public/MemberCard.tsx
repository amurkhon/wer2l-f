import Link from 'next/link';
import { Plus } from 'lucide-react';
import { initialsOf } from '@/components/public/MemberPhoto';
import { SafeImage } from '@/components/shared/SafeImage';
import type { Member } from '@/types';
import { MEMBER_ROLE_LABELS } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
}

/**
 * Persona card: full-bleed 4:5 portrait anchored on the face zone, darkened
 * from the bottom-left so the role/name overlay always reads.
 */
export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member._id}`} className="group block h-full">
      <div className="card-cg card-cg-lift relative h-full overflow-hidden rounded-[20px]">
        <div className="relative aspect-[4/5] overflow-hidden">
          <SafeImage
            src={member.profileImage}
            alt={member.fullName}
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
            fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-cg-raised bg-[radial-gradient(100%_80%_at_80%_0%,rgb(135_42_254/.5),transparent_60%),radial-gradient(80%_70%_at_10%_100%,rgb(255_81_1/.35),transparent_60%)] pb-16 font-display text-[64px] font-bold text-white/90">
                {initialsOf(member.fullName)}
              </div>
            }
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgb(0 0 0 / .42) 0%, rgb(0 0 0 / .17) 55%, transparent 100%), linear-gradient(to top, rgb(0 0 0 / .85) 0%, rgb(0 0 0 / .45) 32%, transparent 62%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-cg-hero">
                {MEMBER_ROLE_LABELS[member.role] ?? member.role}
              </div>
              <h3 className="mt-0.5 text-[18px] font-semibold leading-snug text-white">{member.fullName}</h3>
              {member.status !== 'active' && (
                <div className="mt-0.5 text-[12.5px] capitalize text-white/70">{member.status}</div>
              )}
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-[transform,background-color] duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-90 group-hover:bg-cg-hero">
              <Plus className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
