import { useState, useEffect } from 'react';

const useScrollDirection = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollPourcent, setScrollPourcent] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > 0) setHasScrolled(true);

      if (currentScrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else if (currentScrollTop < lastScrollTop) {
        setScrollDirection('up');
      }
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
      setScrollPourcent(Math.round((currentScrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return { scrollPourcent, scrolled: hasScrolled, direction: scrollDirection, scrollPosition: lastScrollTop };
};

export default useScrollDirection;
