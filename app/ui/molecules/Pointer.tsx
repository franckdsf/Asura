import { useRef, useEffect } from "react"
import { Icon } from "../atoms";

type Props = {
  className?: string;
}
export const Pointer = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contRef = ref.current?.parentElement;
    if (!contRef) return;

    // check if mouse is over the container or a child
    const handleMouseOver = (e: MouseEvent) => {
      // get the mouse position x & y
      const x = e.clientX;
      const y = e.clientY;
      // get the position of the container
      const { left, top } = contRef.getBoundingClientRect();
      // get the ref dimensions
      const { width, height } = ref.current?.getBoundingClientRect() || { width: 0, height: 0 };
      // set the position of the pointer
      ref.current?.style.setProperty('left', `${x - left - width / 2}px`);
      ref.current?.style.setProperty('top', `${y - top - height / 2}px`);
    }

    const handleMouseOut = () => {
      ref.current?.style.setProperty('display', 'none');
      contRef.style.setProperty('cursor', 'auto');
    }

    const handleMouseEnter = () => {
      ref.current?.style.setProperty('display', 'block');
      contRef.style.setProperty('cursor', 'none');
    }

    // add event listener
    contRef.addEventListener('mousemove', handleMouseOver);
    contRef.addEventListener('mouseleave', handleMouseOut);
    contRef.addEventListener('mouseenter', handleMouseEnter);

    // remove event listener
    return () => {
      contRef?.removeEventListener('mousemove', handleMouseOver);
      contRef?.removeEventListener('mouseleave', handleMouseOut);
      contRef?.removeEventListener('mouseenter', handleMouseEnter);
    }

  }, [])

  return (
    <div className="absolute z-50 p-1 bg-white rounded-full pointer-events-none border-neutral-300 text-neutral-900" ref={ref}>
      <Icon.Plus />
    </div>
  )
}