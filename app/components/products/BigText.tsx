import { trim } from "@ui/utils/trim"

type Props = {
  className?: string;
  title: string;
  bigTitle: string;
  imageSrc: string;
  showDesktopImage?: boolean;
}
export const BigText = ({ imageSrc, title, bigTitle, showDesktopImage = false, className = "" }: Props) => {
  return (
    <div className={trim(`max-w-6xl xl:w-5/6 xl:max-w-full mx-auto ${className}`)}>
      <h6 className="text-2xl uppercase text-neutral-600 font-accent">{title}</h6>
      <h1 className="mt-6 text-4xl uppercase md:text-6xl lg:text-[6vw] lg:leading-[6vw] font-medium md:mt-14">{bigTitle}</h1>
      <div className={trim(`flex flex-row justify-end mt-6 ${!showDesktopImage && 'lg:hidden'}`)}>
        <img
          src={imageSrc}
          alt="decoration"
          className="object-cover w-32 rounded-t-full aspect-3/4 lg:w-48 bg-container-light"
        />
      </div>
    </div>
  )
}