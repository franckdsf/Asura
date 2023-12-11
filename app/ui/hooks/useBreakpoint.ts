import { useState, useEffect } from 'react';

export const useBreakpoint = (value: number) => {
  const [isGreater, setIsWidthGreater] = useState(false); // typeof window !== 'undefined' && window.innerWidth > value
  const [width, setWidth] = useState(415); // typeof window !== 'undefined' && window.innerWidth

  useEffect(() => {
    const handleResize = () => {
      setIsWidthGreater(window.innerWidth > value);
      setWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, isGreater };
};
