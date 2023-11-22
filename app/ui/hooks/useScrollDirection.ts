import { useState, useEffect } from 'react';

const useScrollDirection = () => {
  const [lastScrollTop, setLastScrollTop] = useState(-1);
  const [scrollDirection, setScrollDirection] = useState('up');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else if (currentScrollTop < lastScrollTop) {
        setScrollDirection('up');
      }
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return { scrolled: lastScrollTop >= 0, direction: scrollDirection, scrollPosition: lastScrollTop };
};

export default useScrollDirection;
