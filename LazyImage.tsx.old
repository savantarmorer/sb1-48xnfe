import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

export function LazyImage({ src, alt, placeholderSrc, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={`relative ${props.className || ''}`}
    >
      {isIntersecting && (
        <img
          {...props}
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {(!isIntersecting || !isLoaded) && placeholderSrc && (
        <img
          {...props}
          src={placeholderSrc}
          alt={alt}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}