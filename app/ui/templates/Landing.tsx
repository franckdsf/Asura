import { trim } from '../utils/trim';
import { Icon, Link } from '../atoms';
import { Swiper, type SwiperClass, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useRef, useState } from 'react';
import { motion } from '../motion';

const DEFAULT_INDEX = 1;

type DefaultProps = {
  className?: string;

}
type CarouseImageProps = DefaultProps & {
  src: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  position: 'odd' | 'even';
}
const CarouselImage = ({ src, position, loading = 'lazy' }: CarouseImageProps) => {
  const e = useSwiperSlide();

  const isDefault = !(e.isActive || e.isNext || e.isPrev);
  const rotation = isDefault ? (position === 'even' ? 'rotate-[17deg]' : '-rotate-[13deg]') : ((e.isNext || e.isPrev) ? '-rotate-[17deg]' : 'rotate-[13deg]');

  return (
    <img src={src} alt="carousel item" width={600} height={900} loading={loading}
      className={trim(`object-cover rounded-none ${isDefault && 'w-5/6 h-5/6'} ${e.isActive && 'w-full h-full scale-110'} ${(e.isNext || e.isPrev) && 'w-11/12 h-11/12'}
      aspect-product transition-all delay-200 bg-contain ${rotation}`)}
    />
  )
}

type ImagesCarouselProps = DefaultProps & {
  images: Array<string>;
  updateSwiper?: (newSwiper: SwiperClass) => void;
  onSlideChange?: (newSwiper: SwiperClass) => void;
}
const ImagesCarousel = ({ images, className, onSlideChange, updateSwiper }: ImagesCarouselProps) => {
  return (
    <Swiper
      className={trim(`carousel-rotated-images ${className}`)}
      direction='horizontal'
      slidesPerView={2}
      onInit={(s) => updateSwiper && updateSwiper(s)}
      onSlideChange={(s) => onSlideChange && onSlideChange(s)}
      breakpoints={{
        612: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
        1575: {
          slidesPerView: 7,
        },
      }}
      loop={true}
      centeredSlides={true}
      modules={[Autoplay]}
      initialSlide={0}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SwiperSlide className={trim(`!flex-row-center w-114 h-128 py-16`)} key={`${src}${i}`}>
          <CarouselImage position={i % 2 === 0 ? 'even' : 'odd'} src={src} loading={i === DEFAULT_INDEX ? 'eager' : 'lazy'} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

type CarouselButtonProps = DefaultProps & { arrow: 'left' | 'right', onClick: () => void };
const CarouselButton = ({ className, arrow, onClick }: CarouselButtonProps) => {
  return (
    <button onClick={onClick}
      className={trim(`${className} p-3 rounded-full border border-neutral-300`)}
      aria-label={arrow === "left" ? 'left carousel button' : 'right carousel button'}
    >
      {arrow === "left" ? <Icon.ArrowLeft className="icon-xl" /> : <Icon.ArrowRight className="icon-xl" />}
    </button>
  )
}

type Props = {
  carousel: Array<string>;
  cta: {
    text: string;
    link: string;
  }
}
export const Landing = ({ carousel, cta }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(DEFAULT_INDEX);
  const swiper = useRef<SwiperClass>();

  const updateSwiper = (newSwiper: SwiperClass) => swiper.current = newSwiper;

  return (
    <div className="relative w-full mb-0">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="max-md:hidden rounded-[336px/50vh] border border-neutral-300 h-screen w-168 absolute -rotate-[20deg] inset-x-center -top-1/4" />
      </div>
      <div className="flex flex-col items-center justify-center pt-[6vh] relative z-10">
        <div className="mb-10 flex-row-center gap-x-2 text-neutral-600">
          <span>{currentSlide < 10 ? `0${currentSlide}` : currentSlide}</span>
          <hr className="w-16 border-neutral-600" />
          <span>{carousel.length < 10 ? `0${carousel.length}` : carousel.length}</span>
        </div>
        <div className="text-4xl text-center uppercase xl:text-6xl font-accent">
          <h1>Vos mains</h1>
          <div className="flex flex-row items-start justify-center">
            <h1>notre expertise</h1>
            <span className="ml-4 text-2xl font-medium lg:text-3xl text-neutral-600">+</span>
          </div>
        </div>
        <CarouselButton className="absolute hidden top-1/4 left-10 lg:block" arrow='left' onClick={() => swiper.current?.slidePrev()} />
        <CarouselButton className="absolute hidden top-1/4 right-10 lg:block" arrow='right' onClick={() => swiper.current?.slideNext()} />
        <Link href={cta.link} underline className={"uppercase mt-10 text-sm lg:text-md"}>{cta.text}</Link>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ImagesCarousel className="mt-16 lg:mt-24 -z-10"
          images={carousel}
          updateSwiper={(s) => updateSwiper(s)}
          onSlideChange={(s) => setCurrentSlide(s.realIndex + 1)}
        />
      </motion.div>
    </div>
  )
}