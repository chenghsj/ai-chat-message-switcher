import { useEffect, useRef, useState } from 'react';

export const RESIZE_TRANSITION_DELAY = 200;

export function useWindowResize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isResized, setIsResized] = useState(false);
  const prevSizeRef = useRef(size);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        prevSizeRef.current = size;
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        setIsResized(true);
      }, 100); // Throttle updates
    };

    window.addEventListener('resize', handleResize, { signal });

    return () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      controller.abort();
    };
  }, [size]);

  useEffect(() => {
    if (isResized) {
      transitionTimeoutRef.current = setTimeout(() => {
        setIsResized(false);
      }, RESIZE_TRANSITION_DELAY);
    }
    return () => {
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, [isResized]);

  return {
    currentSize: size,
    previousSize: prevSizeRef.current,
    isResized,
  };
}
