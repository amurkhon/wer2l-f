import Link from 'next/link';
import { SafeImage } from '@/components/shared/SafeImage';
import type { Member } from '@/types';
import { MEMBER_ROLE_LABELS } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function MemberCard({ member }: MemberCardProps) {
  const initials = initialsOf(member.fullName);

  return (
    <Link href={`/members/${member._id}`} className="group block h-full">
      <div className="flex h-full flex-col items-center rounded-[20px] border border-[#ececf5] bg-white px-5 py-8 text-center transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(.16,.84,.44,1)] group-hover:-translate-y-[7px] group-hover:border-[#dcdef5] group-hover:shadow-[0_24px_50px_-22px_rgba(40,36,120,.32)]">
        <div className="relative h-[82px] w-[82px] overflow-hidden rounded-full bg-gradient-to-br from-lab-500 to-lab-800">
          <SafeImage
            src={member.profileImage}
            alt={member.fullName}
            width={164}
            height={164}
            className="h-full w-full object-cover"
            fallback={
              <div className="flex h-full w-full items-center justify-center font-serif text-[27px] font-bold text-white">
                {initials}
              </div>
            }
          />
        </div>
        <h3 className="mt-[18px] text-[16.5px] font-semibold text-[#191a36]">{member.fullName}</h3>
        <div className="mt-1.5 text-[13.5px] font-medium text-lab-600">
          {MEMBER_ROLE_LABELS[member.role] ?? member.role}
        </div>
        {member.status !== 'active' && (
          <div className="mt-1 text-[12px] capitalize text-[#9094ad]">{member.status}</div>
        )}
      </div>
    </Link>
  );
}
