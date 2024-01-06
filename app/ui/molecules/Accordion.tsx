import { type ComponentProps, useRef, useState, useCallback } from "react";
import { trim } from "../utils/trim";
import { PortableText } from "@portabletext/react";
import { IconFromStr } from "../atoms";

const minusIcon = '-'
const plusIcon = '+'

type PortableTextProp = ComponentProps<typeof PortableText>['value'];
type Props = {
  title: string,
  icon?: string;
  content: string | string[] | PortableTextProp,
  className?: string
  showBorder?: boolean;
  size?: 'small' | 'default';
}
export const Accordion = ({ size = 'default', icon, showBorder = true, title, className, content }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<number>(0);

  const basicFormat = typeof content === "string" || Array.isArray(content) && typeof content[0] === "string";

  const toggleExpanded = useCallback(() => {
    setExpanded((current) => current === 0 ? ref.current!.scrollHeight : 0)
  }, [])

  return (
    <button className={trim(`w-full my-2 cursor-pointer ${size === "small" ? 'my-2' : 'sm:my-4 md:my-6'} ${showBorder && 'border-b'} border-neutral-600 ${className}`)} onClick={toggleExpanded}>
      <div className={trim(`flex flex-row items-center justify-between ${size === "small" ? 'h-12 pb-0' : 'h-16 pb-4'} px-2 text-left select-none sm:px-6`)}>
        <h5 className="flex-1 uppercase text-md-semibold">
          <span className="inline-block mr-3 icon-md">{icon && <IconFromStr icon={icon} />}</span>
          {title}
        </h5>
        <div className="flex-none pl-4">{expanded ? minusIcon : plusIcon}</div>
      </div>
      <div ref={ref} style={{ maxHeight: expanded }} className={`px-6 pt-2 overflow-hidden transition-[max-height] duration-300 ease-in`}>
        {basicFormat && [...(typeof content === "string" ? [content] : content)].map((c) => (
          <p className="pb-8 text-left text-md" key={c.toString()}>
            {c.toString()}
          </p>
        ))}
        {!basicFormat && <div className="pb-8 text-left text-md [&>p]:mb-4 [&>ul]:list-disc md:[&>ul]:pl-2" >
          <PortableText value={content as PortableTextProp} />
        </div>
        }
      </div>
    </button>
  )
}

Accordion.Small = ({ ...props }: Props) => <Accordion {...props} size="small" />