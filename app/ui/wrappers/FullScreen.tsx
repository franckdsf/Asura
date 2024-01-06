import { createPortal } from "react-dom"
import { type ReactNode, useEffect } from "react";

type Props = {
  onClose?: () => void;
  children?: ReactNode;
}
export const FullScreen = ({ children, onClose }: Props) => {
  useEffect(() => {
    // on press escape key close
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose && onClose();
    }
    document.addEventListener('keydown', handleKeyPress);

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyPress);
    }

  }, [onClose])

  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  return createPortal(<div className="fixed top-0 left-0 w-screen h-screen bg-white animate-fadeIn" style={{ zIndex: 999 }} onClick={(e) => {
    // get the list of all parents of the target until this current element
    const parents = [];
    let current = e.target as HTMLElement | null;
    while (current) {
      parents.push(current);
      current = (current as HTMLElement).parentElement;
    }
    // if clicking on a button or a child of a button, cancel close
    if (parents.some((el) => el instanceof HTMLButtonElement)) return;
    onClose && onClose();
  }}>
    {children}
  </div>, document.body)
}