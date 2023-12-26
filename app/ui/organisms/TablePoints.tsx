import { type ComponentProps } from "react";
import { trim } from "../utils/trim";
import { PortableText } from "@portabletext/react";
import { IconFromStr } from "../atoms";

type Props = {
  className?: string;
  items: Array<{
    icon?: string;
    imgSrc?: string;
    title: string;
    description?: ComponentProps<typeof PortableText>['value'];
  }>,
}

export const TablePoints = ({ items, className }: Props) => {
  return (
    <div className={trim(`grid grid-cols-2 gap-2 ${className}`)}>
      {items.map((item, i) => (
        <div
          className={trim(`flex flex-row justify-start items-start bg-container-light/75 h-full px-4 py-4 rounded-xs`)}
          key={item.title + item.description}
        >
          {item.imgSrc && <img
            alt={item.title}
            src={item.imgSrc}
            className="object-contain w-5 mr-2 sm:w-8 sm:mr-4 aspect-square"
          />}
          {item.icon && <div className="mt-0.5 mr-2 sm:mr-4 icon-sm sm:icon-md text-primary-500">
            <IconFromStr icon={item.icon} weight="fill" />
          </div>}
          <div>
            <h3 className="text-xs font-medium sm:text-sm lg:text-md">{item.title}</h3>
            <p className="text-2xs sm:text-xs lg:text-sm">
              {item.description && <PortableText value={item.description} />}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}