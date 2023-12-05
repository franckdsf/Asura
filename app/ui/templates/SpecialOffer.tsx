import { type ReactNode } from "react";
import { Link } from "../atoms";
import { trim } from "../utils/trim";

type CTA = { text: string, link: string }
type Props = {
  className?: string,
  type?: 'center' | 'right',
  showSectionTitle?: boolean,
  catchPhrase: string;
  title: string;
  content: string;
  mainMedia: {
    imageSrc?: string;
    videoSrc?: string;
  };
  additionalMedia?: {
    imageSrc?: string;
    videoSrc?: string;
  };
  cta?: ReactNode | CTA;
}
export const SpecialOffer = ({ catchPhrase, title, content, mainMedia, additionalMedia, cta, showSectionTitle = true, className = "", type = "center" }: Props) => (
  <div className={trim(`text-center mb-32 sm:mb-48 relative ${className}`)} >
    {showSectionTitle && <>
      <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent -ml-[20vw]">offre</h3>
      <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent my-5 ml-[10vw]">spéciale</h3>
    </>}
    <div className={trim(`sm:pl-8 flex flex-col md:flex-row ${type === "right" ? "gap-x-8 2xl:gap-x-32 justify-end items-end md:items-center" : "gap-x-16 xl:gap-x-32 justify-center items-center"} mt-24 xl:mt-32`)}>
      {type === "center" &&
        (mainMedia.imageSrc ? <img src={mainMedia.imageSrc} className={trim(`object-cover bg-container-light aspect-3/4 w-86 xl:w-112 rounded-full`)} alt="special offer" /> :
          <video src={mainMedia.videoSrc} className={trim(`object-cover bg-container-light aspect-3/4 w-86 xl:w-112 rounded-full`)} autoPlay muted loop />)}
      {type === "right" && (mainMedia.videoSrc ?
        <video className="object-cover md:order-2 rounded-l-full w-11/12 sm:w-1/2 bg-container-light max-sm:h-112 sm:aspect-[7/10] lg:aspect-[8/9] 2xl:aspect-[5/4]"
          autoPlay muted loop src={mainMedia.videoSrc} />
        :
        <img src={mainMedia.imageSrc} alt="special offer" className="object-cover md:order-2 rounded-l-full w-11/12 sm:w-1/2 bg-container-light max-sm:h-112 sm:aspect-[7/10] lg:aspect-[8/9] 2xl:aspect-[5/4]" />)}
      <div className={trim(`max-w-lg text-left px-4 pr-6 max-md:mt-16 ${type === 'right' && 'md:order-1 max-md:self-start'}`)}>
        <div className="flex flex-row items-center justify-start">
          <span className="text-lg uppercase text-neutral-600">
            {catchPhrase}
          </span>
          <hr className="w-16 ml-3 border-neutral-600" />
        </div>
        <h4 className="text-3xl uppercase sm:text-4xl font-accent my-9">
          {title}
        </h4>
        <p className="max-w-xs text-lg mb-9">
          {content}
        </p>
        {cta && ((cta as CTA).link ? <Link href={(cta as CTA).link} className="uppercase text-md-semibold" underline>
          {(cta as CTA).text}
        </Link> : (cta as ReactNode))}
      </div>
    </div>
    {additionalMedia &&
      (additionalMedia.imageSrc ? <img src={additionalMedia.imageSrc} className="object-cover w-48 h-24 mt-12 ml-8 rounded-full bg-container-light sm:absolute right-32 -bottom-12" alt="additional visual" />
        : <video src={additionalMedia.videoSrc} className="object-cover w-48 h-24 mt-12 ml-8 rounded-full bg-container-light sm:absolute right-32 -bottom-12" autoPlay muted loop />)
    }
  </div >
)