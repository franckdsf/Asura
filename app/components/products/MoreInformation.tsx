import { trim } from "@ui/utils/trim";
import { useState } from "react";

const minusIcon = '-'
const plusIcon = '+'

const Accordion = ({ title, content }: { title: string, content: string }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current)

  return (
    <button className="w-full my-2 border-b cursor-pointer sm:my-4 md:my-6 border-neutral-600" onClick={toggleExpanded}>
      <div className="flex flex-row items-center justify-between px-6 text-left select-none h-14">
        <h5 className="flex-1 uppercase text-md-semibold md:text-lg-semibold">
          {title}
        </h5>
        <div className="flex-none pl-2">{expanded ? minusIcon : plusIcon}</div>
      </div>
      <div className={`px-6 pt-0 overflow-hidden transition-[max-height] duration-500 ease-in ${expanded ? "max-h-40" : "max-h-0"}`}>
        <p className="pb-8 text-left text-md">
          {content}
        </p>
      </div>
    </button>
  )
}

type Props = {
  className?: string;
  showTitleOnMobile?: boolean;
  included?: string;
  delivery?: string;
  guaranty?: string;
}

export const MoreInformation = ({ included, delivery, guaranty, showTitleOnMobile = true, className = "" }: Props) => (
  <div className={trim(`px-4 md:px-10 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-x-48 xl:gap-x-72 ${className}`)}>
    <h3 className={trim(`${!showTitleOnMobile && 'max-md:hidden'} pt-8 lg:max-w-xs uppercase max-md:scale-75 text-2xl lg:text-4xl font-accent text-neutral-600`)}>
      plus d’informations
    </h3>
    <ul className="flex-shrink-0 w-full max-w-md mt-8 lg:-mt-2">
      {included && <li>
        <Accordion
          title="inclus"
          content={included}
        />
      </li>}
      {delivery && <li>
        <Accordion
          title="livraison"
          content={delivery}
        />
      </li>}
      {guaranty && <li>
        <Accordion
          title="garantie"
          content={guaranty}
        />
      </li>}
    </ul>
  </div>
)