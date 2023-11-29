import { Icon } from "@ui/atoms"
import { trim } from "@ui/utils/trim"
import { useMemo } from "react";

type ElementProps = {
  icon?: string;
  title: string;
  content: string;
}
const Element = ({ icon, title, content }: ElementProps) => {
  const iconComponent = useMemo(() => {
    const iconLower = icon?.toLowerCase();

    switch (iconLower) {
      case 'leaf':
        return <Icon.Leaf />
      case 'pencil':
        return <Icon.Pencil />
      case 'tree':
        return <Icon.Tree />
      default:
        return <Icon.Pencil />
    }

  }, [icon])

  return (
    <div className="flex flex-row items-start justify-start pl-10 pr-6 md:pr-10">
      <div className="icon-md rounded-full border-neutral-500 text-neutral-600 border p-2.5">
        {iconComponent}
      </div>
      <div className="ml-5">
        <h6 className="uppercase text-md-semibold">
          {title}
        </h6>
        <p className="mt-2 text-md">
          {content}
        </p>
      </div>
    </div>
  )
}

type Props = {
  className?: string;
  imageSrc: string;
  description: string;
  list: Array<ElementProps>
}
export const DescriptionBlock = ({ imageSrc, description, list, className = "" }: Props) => {
  return (
    <div className={trim(`px-4 md:px-10 flex flex-col md:flex-row justify-center items-center md:items-stretch gap-x-16 lg:gap-x-24 2xl:gap-x-40 ${className}`)}>
      <img
        className="object-cover w-full h-64 rounded-full sm:h-128 md:w-112 md:h-auto bg-container-light"
        alt="description cover"
        src={imageSrc}
      />
      <div className="max-w-md mt-16 sm:mt-24 md:py-24">
        <h3 className="text-2xl uppercase font-accent text-neutral-600">Description</h3>
        <p className="mt-10 text-sm md:w-11/12 md:text-md">
          {description}
        </p>
        <ul className="max-w-md space-y-8 max-md:float-right mt-14 ">
          {list.map((i) => (
            <li key={JSON.stringify(i)}>
              <Element
                {...i}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}