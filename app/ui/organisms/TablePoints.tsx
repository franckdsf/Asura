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
          className={trim(`flex flex-row justify-start items-center bg-container-light border-container-light h-full px-4 py-3 rounded-sm`)}
          key={item.title + item.description}
        >
          {item.imgSrc && <img
            alt={item.title}
            src={item.imgSrc}
            className="object-contain w-5 mr-3 sm:w-6 sm:mr-4 aspect-square"
          />}
          {item.icon && <div className="mt-0.5 mr-3 sm:mr-4 icon-sm sm:icon-md text-primary-500">
            <IconFromStr icon={item.icon} weight="fill" />
          </div>}
          <div>
            <h3 className="text-xs sm:text-sm lg:text-md">{item.title}</h3>
            {item.description && <p className="mt-1 text-2xs sm:text-xs lg:text-sm text-neutral-600">
              <PortableText value={item.description} />
            </p>}
          </div>
        </div>
      ))}
    </div>
  )
}