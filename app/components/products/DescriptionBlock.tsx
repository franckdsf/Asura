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
  title?: string;
  description?: string | ComponentProps<typeof PortableText>['value'];
  list: Array<ElementProps>
}

export const DescriptionBlock = ({ title, imageSrc, videoSrc, description, list, className = "" }: Props) => {
  const mediaBlockClass = "object-cover w-full h-96 rounded-[128px] sm:rounded-full sm:h-128 md:w-128 2xl:w-144 md:h-auto bg-container-light";

  const hasTitleOrDesc = title || description;

  return (
    <div className={trim(`px-4 md:px-10 flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-x-16 lg:gap-x-24 ${hasTitleOrDesc && '2xl:gap-x-40'} ${className}`)}>
      {!videoSrc && <img className={mediaBlockClass} alt="description cover" src={imageSrc} />}
      {videoSrc && <video preload="none" src={videoSrc} className={mediaBlockClass} autoPlay={true} muted={true} loop={true} />}
      <div className={trim(`max-w-md mt-16 ${hasTitleOrDesc ? 'mt-16 sm:mt-24' : 'md:mt-0 lg:py-32'} md:py-24`)}>
        {title && <h3 className="mb-10 text-2xl uppercase font-accent text-neutral-600">{title}</h3>}
        {description && <div className="md:w-11/12 mb-14 text-md">
          {typeof description === "string" ? <p dangerouslySetInnerHTML={{ __html: description }}>
          </p> : <div><PortableText value={description} /></div>}
        </div>}
        <ul className={trim(`max-w-md ${description ? 'space-y-8' : 'space-y-12'} max-md:float-right text-md`)}>
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