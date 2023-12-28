import { useEffect, useRef, useState } from "react";
import { Icon, IconFromStr } from "../atoms"

type Props = {
  title: string;
  icon?: string;
  details?: string;
}
export const Pin = ({ icon, title, details }: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // hide went mouse out
    const handleMouseOut = (e: MouseEvent) => {
      setShow(false);
    }
    const target = ref.current;
    if (!target) return;

    target.addEventListener('mouseout', handleMouseOut)
    return () => target.removeEventListener('mouseout', handleMouseOut)
  }, [])

  return (
    <button
      ref={ref}
      className="relative inline-flex px-4 py-2 mt-6 text-black uppercase rounded-full bg-container-light align-center gap-x-2 group"
      onClick={() => setShow((s) => !s)}
    >
      {icon && <IconFromStr icon={icon} />}
      <span className="text-xs">{title}</span>
      {details && <Icon.Question className="cursor-pointer" />}
      {details && <div className={`${show ? 'block' : 'lg:group-hover:block hidden'} rounded-xs absolute left-0 w-[120%] max-w-xs px-4 pb-2 pt-3 text-sm normal-case bg-neutral-900 bottom-12`}>
        <p className="flex flex-row items-center justify-start mb-1.5 text-xs font-semibold text-white uppercase">
          <Icon.Question className="mr-1 icon-sm" />
          détails
        </p>
        <p className="text-left text-white">
          {details}
        </p>
      </div>}
    </button>
  )
}