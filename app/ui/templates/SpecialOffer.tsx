import { Link } from "../atoms";
import { trim } from "../utils/trim";

type Props = {
  className?: string,
  type?: 'center' | 'right',
  showSectionTitle?: boolean,
  cta?: {
    text: string,
    link: string,
  }
}
export const SpecialOffer = ({ cta, showSectionTitle = true, className = "", type = "center" }: Props) => (
  <div className={trim(`text-center mb-32 sm:mb-48 relative ${className}`)} >
    {showSectionTitle && <>
      <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent -ml-[20vw]">offre</h3>
      <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent my-5 ml-[10vw]">spéciale</h3>
    </>}
    <div className={trim(`sm:pl-8 flex flex-col md:flex-row ${type === "right" ? "gap-x-8 justify-end items-end md:items-center" : "gap-x-16 xl:gap-x-32 justify-center items-center"} mt-24 xl:mt-32`)}>
      {type === "center" && <img src="" className={trim(`bg-container-light aspect-3/4 w-86 xl:w-112 rounded-full`)} />}
      {type === "right" && <img src="" className="md:order-2 rounded-l-full w-11/12 sm:w-1/2 bg-container-light max-sm:h-112 sm:aspect-[7/10] lg:aspect-[8/9] 2xl:aspect-[5/4]" />}
      <div className={trim(`max-w-lg text-left px-4 pr-6 max-md:mt-16 ${type === 'right' && 'md:order-1 max-md:self-start'}`)}>
        <div className="flex flex-row justify-start items-center">
          <span className="uppercase text-neutral-600 text-lg">
            aujourdh’ui seulement
          </span>
          <hr className="w-16 ml-3 border-neutral-600" />
        </div>
        <h4 className="text-3xl sm:text-4xl uppercase font-accent my-9">
          Le Guide Ultime Du Nail Art Maison
        </h4>
        <p className="text-lg max-w-xs mb-9">
          Pour vous remercier de votre confiance, nous vous offrons notre ebook pour tout achat effectué aujourd’hui.
        </p>
        {cta && <Link href={cta.link} className="uppercase text-md-semibold" underline>
          {cta.text}
        </Link>}
      </div>
    </div>
    <img src="" className="ml-8 mt-12 bg-container-light w-48 rounded-full h-24 sm:absolute right-32 -bottom-12" />
  </div >
)