import { type ComponentProps } from "react";
import { trim } from "../utils/trim";
import { PortableText } from "@portabletext/react";
import { IconFromStr } from "../atoms";

type Props = {
  items: Array<{
    icon?: string;
    imgSrc?: string;
    title: string;
    description?: ComponentProps<typeof PortableText>['value'];
  }>,
  className?: string;
}

export const BulletsBand = ({ items, className = '' }: Props) => {
  return (
    <div className={trim(`grid grid-cols-2 xl:flex flex-row items-start justify-around w-full px-4 
      lg:px-10 pt-4 pb-2 bg-container-light/50 text-neutral-900 ${className}`)}>
      {items.map(item => <div key={item.title + item.description}
        className="flex flex-col items-center justify-center m-4 my-2 text-center lg:my-6"
      >
        {item.imgSrc && <img
          alt={item.title}
          src={item.imgSrc}
          className="object-contain w-12 mb-4 xl:mb-8 md:w-20 aspect-square"
        />}
        {item.icon && <div className="text-[48px] md:text-[80px] mb-4 xl:mb-8">
          <IconFromStr icon={item.icon} weight="fill" />
        </div>}
        <h3 className="max-w-xs mb-4 text-lg font-medium">{item.title}</h3>
        <div className="max-w-xs text-xs sm:text-md text-neutral-600">
          {item.description && <PortableText value={item.description} />}
        </div>
      </div>)}
    </div>
  )
}