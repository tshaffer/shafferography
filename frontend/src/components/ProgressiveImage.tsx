import React, { useState, useEffect, useRef } from 'react';

export interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** URL of the high-resolution image */
  src: string;
  /** URL of a low-resolution placeholder image */
  placeholderSrc: string;
  /** Optional style for the container */
  containerStyle?: React.CSSProperties;
}

/**
 * ProgressiveImage loads a low-res placeholder first and then fades in the high-res image once it’s loaded.
 * It uses IntersectionObserver to start loading only when the image is near the viewport.
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholderSrc,
  containerStyle,
  style,
  ...rest
}) => {
  const [isInView, setIsInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Set up an intersection observer to trigger loading when the image is near the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' } // start loading a bit before the image is fully in view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      {/* Placeholder image */}
      <img
        src={placeholderSrc}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(10px)',
          transition: 'opacity 0.5s ease',
          opacity: loaded ? 0 : 1,
        }}
      />
      {/* High-resolution image loads only when in view */}
      {isInView && (
        <img
          src={src}
          alt={rest.alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease',
            opacity: loaded ? 1 : 0,
            ...style,
          }}
          {...rest}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
