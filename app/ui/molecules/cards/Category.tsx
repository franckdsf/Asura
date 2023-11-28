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
      <Image {...image} className="w-32 rounded-full object-over xl:w-52 aspect-product bg-container-light" />
      <span className="mt-6 text-lg text-neutral-600">+</span>
      <h3 className="text-md lg:text-[32px] font-accent uppercase mt-2 lg:mt-4 pb-1 text-neutral-600">{text}</h3>
    </div>
  )
}