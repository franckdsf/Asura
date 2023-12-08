import { type RefObject, useEffect, useState } from "react"

export const useSticky = (element: RefObject<HTMLElement>) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        e.target.classList.toggle("is-pinned", e.intersectionRatio < 1);
        setIsSticky(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );

    if (element.current)
      observer.observe(element.current)
  }, [])

  return {
    isSticky
  }
}