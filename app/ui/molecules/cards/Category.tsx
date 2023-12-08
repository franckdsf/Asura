import { Image } from '@shopify/hydrogen';
import { type ComponentProps } from 'react';
type Props = {
  text: string;
  posX?: number;
  image?: ComponentProps<typeof Image>;
}
export const Category = ({ image, text, posX = 60 }: Props) => {
  return (
    <div className="overflow-hidden flex-col-center">
      <Image {...image} className="w-32 h-48 rounded-full xl:h-72 xl:w-52 aspect-product bg-container-light" style={{ objectFit: "cover" }} />
      <span className="mt-6 text-lg text-neutral-600">+</span>
      <div className="pb-1 mt-2 w-36 lg:w-56 flex-row-center lg:mt-4">
        <h3 className="text-md lg:text-[32px] lg:leading-[32px] font-accent uppercase text-neutral-600 text-center">
          {text}
        </h3>
      </div>
    </div>
  )
}