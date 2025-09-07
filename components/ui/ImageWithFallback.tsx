"use client";
import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function ImageWithFallback({ fallbackSrc = '/img/win-logo.png', onError, ...rest }: Props) {
  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    if (img.src.endsWith(fallbackSrc)) return;
    img.src = fallbackSrc;
    if (onError) onError(e);
  };
  return <img {...rest} onError={handleError} />;
}

