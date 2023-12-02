import { Image, Money } from "@shopify/hydrogen"
import { type ComponentProps } from "react"

type Props = {
  name: string;
  img: ComponentProps<typeof Image>['data'];
  price: ComponentProps<typeof Money>['data'];
}
export const Product = ({ name, img, price }: Props) => {
  return (
    <div className="w-56 lg:w-72">
      <Image data={img} className="w-full aspect-product bg-container-light" sizes="33vw" />
      <span className="mt-2 uppercase text-2xs lg:text-xs line-clamp-1 lg:mt-4">{name}</span>
      <Money className="mt-1 text-2xs lg:text-xs line-clamp-1" data={price} />
    </div>
  )
}