import { Swiper, SwiperClass, SwiperSlide, useSwiperSlide } from "swiper/react"
import { trim } from "../utils/trim";
import { Image } from "@shopify/hydrogen";
import { ComponentProps, useRef, useState } from "react";

type ImageProps = Omit<ComponentProps<typeof Image>, 'id'> & { alt: string };
const ProductImage = ({ alt, ...props }: ImageProps) => {
  const { isPrev, isNext, isActive } = useSwiperSlide();

  const isAny = isPrev || isNext || isActive;

  return (
    <Image {...props}
      alt={alt}
      className={trim(`w-full h-full transition-all duration-1000 self-center object-contain
      ${isActive && 'rounded-none'} ${isPrev && 'max-lg:rounded-full delay-200'} ${isNext && 'max-lg:rounded-full delay-300'} ${!isAny && 'aspect-square'}`)}
    />
  )
}

type Props = {
  className?: string,
  images: ImageProps[];
  defaultIndex?: number;
  getSwiper?: (swiper: SwiperClass) => void;
}
export const CarouselProductImages = ({ getSwiper, defaultIndex = 0, images, className = "" }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const swiper = useRef<SwiperClass>();

  return (
    <div className={trim(`w-full h-full flex-col-center ${className}`)}>
      <Swiper
        className="w-full"
        loop={true}
        slidesPerView={'auto'}
        spaceBetween={16}
        initialSlide={defaultIndex}
        onInit={(s) => {
          swiper.current = s;
          getSwiper && getSwiper(s);
          setTimeout(() => { s.slideToLoop(defaultIndex) }, 500)
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        centeredSlides={true}
        breakpoints={{
          500: {
            spaceBetween: 32
          }
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide className="!w-5/6 h-full !flex-row-center" key={i}>
            <ProductImage {...img} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="pb-4 py-4 w-full overflow-y-hidden overflow-auto gap-x-4 flex flex-row justify-center items-center mt-4 lg:mt-8">
        {images.map((img, i) => (
          <button
            onClick={() => swiper.current?.slideToLoop(i)}
            className={trim(`flex-shrink-0 w-16 h-16 ${currentSlide === i && 'opacity-25'}`)}
            key={i}
          >
            <Image {...img} className="w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  )
}