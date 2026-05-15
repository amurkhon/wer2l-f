'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallback: React.ReactNode;
}

export function SafeImage({ src, fallback, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback}</>;

  return <Image src={src} {...props} onError={() => setFailed(true)} />;
}
