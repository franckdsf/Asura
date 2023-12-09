import { useState, useEffect, useRef } from 'react';

const useScrollDirection = () => {
  const lastScrollTop = useRef<number>(0);
  const [scrollPourcent, setScrollPourcent] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const lastScroll = lastScrollTop.current;

      if (currentScrollTop > 0) setHasScrolled(true);

      if (currentScrollTop > lastScroll) {
        setScrollDirection('down');
      } else if (currentScrollTop < lastScroll) {
        setScrollDirection('up');
      }
      lastScrollTop.current = (currentScrollTop <= 0 ? 0 : currentScrollTop);
      setScrollPourcent(Math.round((currentScrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollPourcent, scrolled: hasScrolled, direction: scrollDirection };
};

export default useScrollDirection;
