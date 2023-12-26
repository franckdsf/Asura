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
    <div className={trim(`grid grid-cols-2 xl:flex flex-row items-start justify-around w-full px-4 lg:px-10 py-6 bg-container-light/50 text-neutral-900 ${className}`)}>
      {items.map(item => <div key={item.title + item.description}
        className="flex flex-col items-center justify-center m-4 my-10 text-center lg:scale-95"
      >
        {item.imgSrc && <img
          alt={item.title}
          src={item.imgSrc}
          className="object-contain w-16 mb-4 xl:mb-8 md:w-32 aspect-square"
        />}
        {item.icon && <div className="text-[64px] md:text-[128px] mb-4 xl:mb-8">
          <IconFromStr icon={item.icon} />
        </div>}
        <h3 className="max-w-xs mb-4 text-lg font-medium sm:text-2xl font-accent">{item.title}</h3>
        <div className="max-w-xs text-xs sm:text-md text-neutral-600">
          {item.description && <PortableText value={item.description} />}
        </div>
      </div>)}
    </div>
  )
}