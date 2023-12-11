import { Image, Money } from "@shopify/hydrogen"
import { type ComponentProps } from "react"
import { JudgeMeReviewStars } from "~/components/products";
import { trim } from "~/ui/utils/trim";

type Props = {
  name: string;
  img: ComponentProps<typeof Image>['data'];
  price: ComponentProps<typeof Money>['data'];
  compareAtPrice?: ComponentProps<typeof Money>['data'];
  id?: string;
}
export const Product = ({ compareAtPrice, id, name, img, price }: Props) => {
  return (
    <div className="w-56 lg:w-72">
      <Image data={img} className="w-full aspect-product bg-container-light" sizes="33vw" />
      {id && <JudgeMeReviewStars productId={id} className="mt-2 lg:mt-4" />}
      <span className={trim(`uppercase text-2xs lg:text-xs line-clamp-1 mt-2 ${!id && 'lg:mt-4'}`)}>{name}</span>
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Money className="mt-1 text-2xs lg:text-xs line-clamp-1" data={price} />
        {compareAtPrice && <Money className="mt-1 line-through text-2xs lg:text-xs line-clamp-1 text-neutral-600" data={compareAtPrice} />}
      </div>
    </div>
  )
}