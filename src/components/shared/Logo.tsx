import Link from 'next/link';
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
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground',
          inverted && 'bg-white text-lab-700',
        )}
      >
        CE
      </div>
      <span className={cn('hidden text-lg sm:block', inverted && 'text-white')}>
        {siteConfig.shortName}
      </span>
    </Link>
  );
}
