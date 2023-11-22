import { useState, useEffect } from 'react';

export const useBreakpoint = (value: number) => {
  const [isGreater, setIsWidthGreater] = useState(typeof window !== 'undefined' && window.innerWidth > value);
  const [width, setWidth] = useState(typeof window !== 'undefined' && window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsWidthGreater(window.innerWidth > value);
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, isGreater };
};
