import { IconFromStr } from "@ui/atoms"
import { trim } from "@ui/utils/trim"
import { type ComponentProps } from "react";
import { PortableText } from '@portabletext/react';
type ElementProps = {
  icon?: string;
  title: string;
  content: string;
}
const Element = ({ icon, title, content }: ElementProps) => {


  return (
    <div className="flex flex-row items-start justify-start pl-6 pr-4 md:pl-10 md:pr-10">
      <div className="icon-md rounded-full border-neutral-500 text-neutral-600 border p-2.5">
        <IconFromStr icon={icon} />
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
  imageSrc?: string;
  videoSrc?: string;
  description: string | ComponentProps<typeof PortableText>['value'];
  list: Array<ElementProps>
}

export const DescriptionBlock = ({ imageSrc, videoSrc, description, list, className = "" }: Props) => {
  const mediaBlockClass = "object-cover w-full h-96 rounded-[128px] sm:rounded-full sm:h-128 md:w-128 2xl:w-144 md:h-auto bg-container-light";
  return (
    <div className={trim(`px-4 md:px-10 flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-x-16 lg:gap-x-24 2xl:gap-x-40 ${className}`)}>
      {!videoSrc && <img className={mediaBlockClass} alt="description cover" src={imageSrc} />}
      {videoSrc && <video preload="none" src={videoSrc} className={mediaBlockClass} autoPlay={true} muted={true} loop={true} />}
      <div className="max-w-md mt-16 sm:mt-24 md:py-24">
        <h3 className="text-2xl uppercase font-accent text-neutral-600">Description</h3>
        <div className="mt-10 text-sm md:w-11/12 md:text-md">
          {typeof description === "string" ? <p dangerouslySetInnerHTML={{ __html: description }}>
          </p> : <div><PortableText value={description} /></div>}
        </div>
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