import { type ComponentProps, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);

  const basicFormat = typeof content === "string" || Array.isArray(content) && typeof content[0] === "string";

  return (
    <button className={trim(`w-full my-2 cursor-pointer ${size === "small" ? 'my-2' : 'sm:my-4 md:my-6'} ${showBorder && 'border-b'} border-neutral-600 ${className}`)} onClick={toggleExpanded}>
      <div className={trim(`flex flex-row items-center justify-between ${size === "small" ? 'h-12 pb-0' : 'h-16 pb-4'} px-2 text-left select-none sm:px-6`)}>
        <h5 className="flex-1 uppercase text-md-semibold">
          <span className="inline-block mr-3">{icon && <IconFromStr icon={icon} />}</span>
          {title}
        </h5>
        <div className="flex-none pl-4">{expanded ? minusIcon : plusIcon}</div>
      </div>
      <div className={`px-6 pt-2 overflow-hidden transition-[max-height] duration-500 ease-in ${expanded ? "max-h-screen xl:max-h-screen" : "max-h-0"}`}>
        {basicFormat && [...(typeof content === "string" ? [content] : content)].map((c) => (
          <p className="pb-8 text-left text-md" key={c.toString()}>
            {c.toString()}
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

Accordion.Small = ({ ...props }: Props) => <Accordion {...props} size="small" />