import { type ComponentProps, useState } from "react";
import { trim } from "../utils/trim";
import { PortableText } from "@portabletext/react";

const minusIcon = '-'
const plusIcon = '+'

type PortableTextProp = ComponentProps<typeof PortableText>['value'];
type Props = {
  title: string,
  content: string | string[] | PortableTextProp,
  className?: string
  showBorder?: boolean
}
export const Accordion = ({ showBorder = true, title, className, content }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);

  const basicFormat = typeof content === "string" || typeof content !== "object" && typeof content[0] === "string";

  return (
    <button className={trim(`w-full my-2 cursor-pointer sm:my-4 md:my-6 ${showBorder && 'border-b'} border-neutral-600 ${className}`)} onClick={toggleExpanded}>
      <div className="flex flex-row items-center justify-between h-16 px-6 pb-4 text-left select-none">
        <h5 className="flex-1 uppercase text-md-semibold md:text-lg-semibold">
          {title}
        </h5>
        <div className="flex-none pl-2">{expanded ? minusIcon : plusIcon}</div>
      </div>
      <div className={`px-6 pt-0 overflow-hidden transition-[max-height] duration-500 ease-in ${expanded ? "max-h-screen xl:max-h-screen" : "max-h-0"}`}>
        {basicFormat && [...(typeof content === "string" ? [content] : content)].map((c) => (
          <p className="pb-8 text-left text-md" key={c}>
            {c}
          </p>
        ))}
        {!basicFormat && <div className="pb-8 text-left text-md [&>p]:mb-4" >
          <PortableText value={content as PortableTextProp} />
        </div>
        }
      </div>
    </button>
  )
}