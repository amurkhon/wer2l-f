import { MatteFrame } from '@/components/shared/MatteFrame';

interface MemberPhotoProps {
  src: string | null | undefined;
  name: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Matted 4:5 portrait. The photo fills the window, anchored to the upper-centre
 * "face zone" so heads line up across cards whatever the original aspect ratio.
 */
export function MemberPhoto({ src, name, sizes, className, priority }: MemberPhotoProps) {
  return (
    <MatteFrame
      src={src}
      alt={name}
      sizes={sizes}
      priority={priority}
      className={className}
      windowClassName="aspect-[4/5]"
      imageClassName="object-cover object-[50%_20%] transition-transform duration-[600ms] ease-[cubic-bezier(.16,.84,.44,1)] group-hover:scale-[1.04]"
      fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-cg-raised bg-[radial-gradient(100%_80%_at_80%_0%,rgb(135_42_254/.5),transparent_60%),radial-gradient(80%_70%_at_10%_100%,rgb(255_81_1/.35),transparent_60%)] font-display text-[56px] font-bold text-white/90">
          {initialsOf(name)}
        </div>
      }
    />
  );
}
