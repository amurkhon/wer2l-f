'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallback: React.ReactNode;
}

// Absolute http(s) URLs may point at arbitrary, admin-entered CDNs. Those hosts
// aren't (and can't all be) whitelisted in next.config, so next/image would throw.
// We optimize local/relative uploads and render external URLs with a plain <img>.
function isExternal(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function SafeImage({ src, fallback, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback}</>;

  if (isExternal(src)) {
    const { width, height, className, style, sizes, priority } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ''}
        width={width as number | undefined}
        height={height as number | undefined}
        sizes={sizes}
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
      />
    );
  }

  return <Image src={src} alt={alt ?? ''} {...props} onError={() => setFailed(true)} />;
}
