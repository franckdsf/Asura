import { useState, useEffect, useRef, type RefObject, type ReactNode } from 'react';

type Props = { children: (ref: RefObject<HTMLDivElement>) => ReactNode }
export const DelayHeight = ({ children }: Props) => {
  const [parentHeight, setParentHeight] = useState<number>(0);
  const childRef = useRef<HTMLDivElement>(null);
  const sizetimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // observe the height of the childRef
    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;

      // if the child height changes within 500ms reset the timer
      if (sizetimer.current)
        clearTimeout(sizetimer.current);
      sizetimer.current = setTimeout(() => {
        setParentHeight(height);
      }, 400);

    });

    observer.observe(childRef.current!);
    return () => { observer.disconnect() }
  }, []);

  useEffect(() => {
    // on click of child ref track the height for 500ms
    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setParentHeight(height);
    });

    childRef.current?.addEventListener('click', () => {
      observer.observe(childRef.current!);
      setTimeout(() => { observer.disconnect() }, 500);
    });

    return () => { observer.disconnect() }
  }, [])

  return (
    <div style={{ height: `${parentHeight}px` }} className="w-full">
      {/* <div className="overflow-hidden"> */}
      {children(childRef)}
    </div>
  );
}