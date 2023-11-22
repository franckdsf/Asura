import { Icon } from "@ui/atoms"
import { trim } from "@ui/utils/trim"

const Element = () => (
  <div className="flex flex-row justify-start items-start pl-10 pr-6 md:pr-10">
    <div className="rounded-full border-neutral-500 text-neutral-600 border p-2.5">
      <Icon.FloppyDisk className="icon-md" />
    </div>
    <div className="ml-5">
      <h6 className="uppercase text-md-semibold">
        recycled
      </h6>
      <p className="text-md mt-2">
        Découvrez notre kit pose d'ongle à l'américaine, la solution idéale pour des ongles sublimes en un éclair !
      </p>
    </div>
  </div>
)

type Props = { className?: string }
export const DescriptionBlock = ({ className = "" }: Props) => {
  return (
    <div className={trim(`px-4 md:px-10 flex flex-col md:flex-row justify-center items-center md:items-stretch gap-x-16 lg:gap-x-24 2xl:gap-x-40 ${className}`)}>
      <img className="h-64 sm:h-128 w-full md:w-112 md:h-auto rounded-full bg-container-light" />
      <div className="max-w-md mt-24 md:py-24">
        <h3 className="uppercase text-2xl font-accent text-neutral-600">Description</h3>
        <p className="md:w-11/12 mt-10 text-sm md:text-md">
          Découvrez notre kit pose d'ongle à l'américaine, la solution idéale pour des ongles sublimes en un éclair ! Une variété de formes d'ongles à votre portée, pour exprimer votre créativité.
          Découvrez notre kit pose d'ongle à l'américaine, la solution idéale pour des ongles sublimes en un éclair ! Une variété de formes d'ongles à votre portée, pour exprimer votre créativité.
        </p>
        <ul className="max-md:float-right space-y-8 mt-14 max-w-md ">
          <li><Element /></li>
          <li><Element /></li>
          <li><Element /></li>
        </ul>
      </div>
    </div>
  )
}