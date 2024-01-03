import { Swiper, type SwiperClass, SwiperSlide, useSwiperSlide } from "swiper/react"
import { trim } from "../utils/trim";
import { Image } from "@shopify/hydrogen";
import { type ComponentProps, useRef, useState } from "react";
import { Icon } from "../atoms";
import { FullScreen } from "../wrappers/FullScreen";

type ImageProps = Omit<ComponentProps<typeof Image>, 'id'> & { alt: string };
const ProductImage = ({ alt, ...props }: ImageProps) => {
  const { isPrev, isNext, isActive } = useSwiperSlide();

  const isAny = isPrev || isNext || isActive;

  return (
    <Image {...props}
      alt={alt}
      className={trim(`w-full h-full transition-all duration-1000 self-center object-contain
       ${!isAny && 'aspect-square '}`)}
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
  const [fullScreen, setFullScreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(defaultIndex);
  const swiper = useRef<SwiperClass>();
  const fullScreenSwiper = useRef<SwiperClass>();
  const swiperPagination = useRef<SwiperClass>();

  const setSlide = (index: number) => {
    const i = index < 0 ? images.length - 1 : (index > images.length - 1 ? 0 : index);
    swiper.current?.slideToLoop(i);
    swiperPagination.current?.slideToLoop(i);
    fullScreenSwiper.current?.slideToLoop(i);
  }

  return (
    <>
      {fullScreen && <FullScreen onClose={() => setFullScreen(false)}>
        <>
          <Swiper className="w-full h-full" initialSlide={currentSlide} spaceBetween={16}
            onInit={(s) => fullScreenSwiper.current = s}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            draggable={false}
          >
            {images.map((img, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <SwiperSlide key={`${img.src}${i}`}>
                <ProductImage {...img} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute z-50 inset-x-center bottom-8 flex-row-center gap-x-4">
            <button onClick={() => setSlide(currentSlide - 1)} className="p-2 bg-white rounded-full"
              aria-label="previous image"
            >
              <Icon.ArrowLeft />
            </button>
            <button aria-label="close" className="p-2 bg-white rounded-full"
              onClick={() => setFullScreen(false)}
            >
              <Icon.X />
            </button>
            <button onClick={() => setSlide(currentSlide + 1)} className="p-2 bg-white rounded-full"
              aria-label="next image"
            >
              <Icon.ArrowRight />
            </button>
          </div>
        </>
      </FullScreen>}
      <div className={trim(`w-full h-full flex-col-center select-none ${className}`)}>
        <Swiper
          className="w-full h-full"
          loop={true}
          slidesPerView={'auto'}
          spaceBetween={16}
          initialSlide={defaultIndex}
          onInit={(s) => {
            swiper.current = s;
            getSwiper && getSwiper(s);
            setTimeout(() => { s.slideToLoop(defaultIndex, 0) }, 500)
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
            // eslint-disable-next-line react/no-array-index-key
            <SwiperSlide className={`!w-5/6 h-full !flex-row-center cursor-zoom-in`} key={`${img.src}${i}`}
              style={{ maxWidth: 800 }}
              onClick={() => setFullScreen(true)}
            >
              <ProductImage {...img} loading={[defaultIndex, 0].includes(i) ? "eager" : "lazy"} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="max-w-full lg:max-w-xl 2xl:max-w-3xl">
          <div className={trim(`flex flex-row items-center justify-start w-full px-4 py-4 pb-4 mt-4 overflow-auto overflow-y-hidden gap-x-4 lg:mt-8`)}>
            <button onClick={() => setSlide(currentSlide - 1)} className="p-2 border rounded-full border-neutral-300"
              aria-label="previous image"
            >
              <Icon.ArrowLeft />
            </button>
            <Swiper className="w-full"
              slidesPerView={'auto'}
              spaceBetween={12}
              initialSlide={defaultIndex}
              onInit={(s) => swiperPagination.current = s}
            >
              {images.map((img, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <SwiperSlide key={`${img.src}${i}`} className="!w-16 !h-16">
                  <button
                    onClick={() => setSlide(i)}
                    aria-label={`image ${i}`}
                    className={trim(`flex-shrink-0 w-full h-full ${currentSlide === i && 'opacity-25'}`)}
                  >
                    <Image {...img} className="w-full h-full" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
            <button onClick={() => setSlide(currentSlide + 1)} className="p-2 border rounded-full border-neutral-300"
              aria-label="previous image"
            >
              <Icon.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}