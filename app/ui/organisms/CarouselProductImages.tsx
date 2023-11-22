import { Swiper, SwiperClass, SwiperSlide, useSwiperSlide } from "swiper/react"
import { trim } from "../utils/trim";
import { Image } from "@shopify/hydrogen";
import { ComponentProps, useState } from "react";

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

  return (
    <div className={trim(`w-full h-full flex-col-center ${className}`)}>
      <Swiper
        className="w-full"
        loop={true}
        slidesPerView={'auto'}
        spaceBetween={16}
        initialSlide={defaultIndex}
        onInit={(s) => {
          getSwiper && getSwiper(s);
          setTimeout(() => { s.slideToLoop(defaultIndex) }, 500)
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
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
      <div className="lg:absolute right-10 flex flex-row lg:flex-col justify-start items-center text-neutral-600 mt-8 lg:mt-12">
        <span>{currentSlide < 10 ? `0${currentSlide}` : currentSlide}</span>
        <hr className="h-16 lg:border-r lg:my-3 lg:w-1px w-16 mx-3 border-neutral-600" />
        <span>{images.length < 10 ? `0${images.length}` : images.length}</span>
      </div>
    </div>
  )
}