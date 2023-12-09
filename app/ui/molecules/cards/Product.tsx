import { Image, Money } from "@shopify/hydrogen"
import { type ComponentProps } from "react"
import { JudgeMeReviewStars } from "~/components/products";
import { trim } from "~/ui/utils/trim";

type Props = {
  name: string;
  img: ComponentProps<typeof Image>['data'];
  price: ComponentProps<typeof Money>['data'];
  id?: string;
}
export const Product = ({ id, name, img, price }: Props) => {
  return (
    <div className="w-56 lg:w-72">
      <Image data={img} className="w-full aspect-product bg-container-light" sizes="33vw" />
      {id && <JudgeMeReviewStars productId={id} className="mt-2 lg:mt-4" />}
      <span className={trim(`uppercase text-2xs lg:text-xs line-clamp-1 mt-2 ${!id && 'lg:mt-4'}`)}>{name}</span>
      <Money className="mt-1 text-2xs lg:text-xs line-clamp-1" data={price} />
    </div>
  )
}