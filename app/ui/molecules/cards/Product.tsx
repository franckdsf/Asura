import { Image, Money } from "@shopify/hydrogen"
import { ComponentProps } from "react"

type Props = {
  img: ComponentProps<typeof Image>['data'];
  price: ComponentProps<typeof Money>['data'];
}
export const Product = ({ img, price }: Props) => {
  return (
    <div className="w-56 lg:w-72">
      <Image data={img} className="w-full aspect-product bg-container-light" sizes="33vw" />
      <span className="text-2xs lg:text-xs line-clamp-1 uppercase mt-2 lg:mt-4">KIT ONGLE GEL PROFESIONNEL COMPLET</span>
      <Money className="text-2xs lg:text-xs line-clamp-1 mt-1" data={price} />
    </div>
  )
}