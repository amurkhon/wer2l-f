import { SafeImage } from '@/components/shared/SafeImage';
import { cn } from '@/lib/utils';

interface MatteFrameProps {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  fallback: React.ReactNode;
  /** Outer frame (sizing/placement). */
  className?: string;
  /** Picture window: its aspect ratio and background. */
  windowClassName?: string;
  /** How the picture sits in the window (object-fit/position, hover motion). */
  imageClassName?: string;
  priority?: boolean;
}

/**
 * Matte-and-frame layering so pictures of any size/aspect look uniform on the same card base.
 *
 * Layers, outside → in:
 *   frame  — thin outer border with a soft lift
 *   matte  — even-width tinted border, identical for every picture
 *   window — fixed-aspect opening the picture sits in (set via windowClassName)
 *   bevel  — inset hairline over the picture, like the cut edge of a real mat
 */
export function MatteFrame({
  src,
  alt,
  sizes,
  fallback,
  className,
  windowClassName,
  imageClassName,
  priority,
}: MatteFrameProps) {
  return (
    <div className={cn('rounded-[16px] border border-cg-hover bg-cg-raised p-2', className)}>
      <div className={cn('relative overflow-hidden rounded-[10px] bg-cg-hover', windowClassName)}>
        <SafeImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('absolute inset-0 h-full w-full', imageClassName)}
          fallback={fallback}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08),inset_0_1px_3px_rgba(0,0,0,.12)]"
        />
      </div>
    </div>
  );
}
