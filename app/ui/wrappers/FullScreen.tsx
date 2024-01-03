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

  return createPortal(<div className="fixed top-0 left-0 w-screen h-screen bg-white animate-fadeIn" style={{ zIndex: 999 }}>
    {children}
  </div>, document.body)
}