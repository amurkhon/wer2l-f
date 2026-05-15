import Link from 'next/link';
import { User } from 'lucide-react';
import { SafeImage } from '@/components/shared/SafeImage';
import type { Member } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MEMBER_ROLE_LABELS, formatDate } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member._id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-square overflow-hidden bg-muted">
          <SafeImage
            src={member.profileImage}
            alt={member.fullName}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-20 w-20 text-muted-foreground/30" />
              </div>
            }
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif font-semibold leading-tight">{member.fullName}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {MEMBER_ROLE_LABELS[member.role] ?? member.role}
            </Badge>
            {member.status !== 'active' && (
              <Badge variant="outline" className="text-xs">
                {member.status}
              </Badge>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Joined {formatDate(member.joinedDate, 'MMM yyyy')}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
