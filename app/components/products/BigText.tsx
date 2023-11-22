import { trim } from "@ui/utils/trim"

type Props = { className?: string }
export const BigText = ({ className = "" }: Props) => {
  return (
    <div className={trim(`max-w-6xl mx-auto ${className}`)}>
      <h6 className="text-neutral-600 uppercase text-2xl font-accent">COMMMENT UTILISER</h6>
      <h1 className="uppercase text-4xl md:text-6xl-regular mt-6 md:mt-14">Découvrez notre kit pose d'ongle à l'américaine!</h1>
      <div className="flex flex-row justify-end -mt-4">
        <img src="" className="aspect-3/4 lg:w-48 w-32 rounded-t-full bg-container-light" />
      </div>
    </div>
  )
}