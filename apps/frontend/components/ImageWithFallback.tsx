// apps/frontend/components/ImageWithFallback.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from './placeholder';

interface ImageWithFallbackProps {
  src: string | undefined | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  fill = false,
  className = '',
  sizes,
  width,
  height,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src && src.trim() !== '' ? src : PLACEHOLDER_IMAGE);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes}
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
    />
  );
}