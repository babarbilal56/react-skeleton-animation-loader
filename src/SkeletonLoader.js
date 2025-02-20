import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const useSkeletonLoader = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const divRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { width, height } = divRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { size, divRef };
};

const SkeletonLoader = ({
  type = 'text',
  isLoading,
  children,
  skeletonWidth,
  skeletonHeight,
  count = 1,
}) => {
  const { size, divRef } = useSkeletonLoader();

  const getSkeletonStyle = () => ({
    width: skeletonWidth || size.width || '100%',
    height: skeletonHeight || size.height || '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  });

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
      case 'image':
        return (
          <div
            className="skeleton-loader skeleton-shimmer"
            style={{
              ...getSkeletonStyle(),
              borderRadius: type === 'image' ? '8px' : '4px',
            }}
          ></div>
        );
      case 'custom':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-loader skeleton-shimmer" style={getSkeletonStyle()}></div>
            ))}
          </div>
        );
      default:
        return <div className="skeleton-loader skeleton-shimmer" style={getSkeletonStyle()}></div>;
    }
  };

  return (
    <div ref={divRef} style={{ width: '100%', height: '100%' }}>
      {isLoading ? renderSkeleton() : children}
    </div>
  );
};

export default SkeletonLoader;
