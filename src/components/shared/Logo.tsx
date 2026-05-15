import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

export function Logo({ className, inverted }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 font-serif font-bold', className)}
    >
      <Image
        src="/images/Image 1.png"
        alt={siteConfig.shortName}
        width={36}
        height={36}
        className="shrink-0"
      />
      <span className={cn('hidden text-lg sm:block', inverted && 'text-white')}>
        WER<sup className="text-xs">2</sup>L
      </span>
    </Link>
  );
}
