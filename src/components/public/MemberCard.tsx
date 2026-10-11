import Link from 'next/link';
import { MemberPhoto } from '@/components/public/MemberPhoto';
import type { Member } from '@/types';
import { MEMBER_ROLE_LABELS } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member._id}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-[20px] border border-[#ececf5] bg-white p-3.5 text-center transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(.16,.84,.44,1)] group-hover:-translate-y-[7px] group-hover:border-[#dcdef5] group-hover:shadow-[0_24px_50px_-22px_rgba(40,36,120,.32)]">
        <MemberPhoto
          src={member.profileImage}
          name={member.fullName}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
          className="w-full"
        />
        <div className="flex flex-1 flex-col items-center px-2 pb-3 pt-5">
          <h3 className="text-[16.5px] font-semibold text-[#191a36]">{member.fullName}</h3>
          <div className="mt-1.5 text-[13.5px] font-medium text-lab-600">
            {MEMBER_ROLE_LABELS[member.role] ?? member.role}
          </div>
          {member.status !== 'active' && (
            <div className="mt-1 text-[12px] capitalize text-[#9094ad]">{member.status}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
