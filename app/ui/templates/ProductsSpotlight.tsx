import { Icon, Link } from "../atoms"

export const ProductsSpotlight = () => {
  return (
    <div className="mb-32 lg:mb-48">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent -ml-[10vw]">spotlight</h3>
        <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent mt-3 lg:my-5 ml-[10vw]">produits</h3>
      </div>
      <div className="flex flex-col sm:flex-row justify-start sm:items-center mt-16 lg:mt-32">
        <img src="" className="rounded-r-full w-11/12 sm:w-1/2 bg-container-light max-sm:h-112 sm:aspect-[7/10] lg:aspect-[6/9] 2xl:aspect-[5/4] mr-16 2xl:mr-32" />
        <div className="max-w-lg text-left px-4 pr-6 max-sm:mt-16 self-center">
          <div className="flex flex-row justify-start items-center text-neutral-600">
            <span>01</span>
            <hr className="w-16 mx-3 border-neutral-600" />
            <span>04</span>
          </div>
          <Link href="/">
            <h4 className="text-3xl lg:text-4xl uppercase font-accent my-9">
              Le Guide Ultime Du Nail Art Maison
            </h4>
          </Link>
          <p className="text-lg max-w-xs mb-9">
            Pour vous remercier de votre confiance, nous vous offrons notre ebook pour tout achat effectué aujourd’hui.
          </p>
          <div className="mt-8 flex flex-row justify-start items-center gap-x-4 sm:gap-x-6">
            <img src="" className="rounded-full w-16 sm:w-20 aspect-square bg-container-light" />
            <img src="" className="rounded-full w-16 sm:w-20 aspect-square bg-container-light" />
            <img src="" className="rounded-full w-16 sm:w-20 aspect-square bg-container-light" />
            <img src="" className="rounded-full w-16 sm:w-20 aspect-square bg-container-light" />
          </div>
          <div className="flex flex-row justify-start items-center gap-x-4 mt-8">
            <button className="p-3 rounded-full border border-neutral-300" >
              <Icon.ArrowLeft className="icon-sm lg:icon-lg" />
            </button>
            <button className="p-3 rounded-full border border-neutral-300" >
              <Icon.ArrowRight className="icon-sm lg:icon-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}