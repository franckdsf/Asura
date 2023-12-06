import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react"
import { Card } from "../molecules"
import { Icon } from "../atoms"
import { type ComponentProps, useRef } from "react"
import { Link } from "@remix-run/react"

type Props = {
  products: Array<{
    name: string;
    img: ComponentProps<typeof Card.Product>['img'];
    price: ComponentProps<typeof Card.Product>['price'];
    link: string;
  }>
}
export const CarouselProducts = ({ products }: Props) => {
  const swiper = useRef<SwiperClass>();

  return (
    <div className="w-full overflow-hidden md:pl-8">
      <Swiper
        className="w-full max-md:!pl-4"
        slidesPerView={'auto'}
        onInit={(s) => swiper.current = s}
        loop={true}
        initialSlide={0}
      >
        {products.map((product, i) => (
          <SwiperSlide key={i} className="!w-56 md:!w-auto pr-4 md:pr-8">
            <Link to={product.link} className="flex-row-center">
              <Card.Product name={product.name} img={product.img} price={product.price} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-8 flex-row-center gap-x-4">
        <button className="p-3 border rounded-full border-neutral-300" onClick={() => swiper.current?.slidePrev()}
          aria-label="previous product"
        >
          <Icon.ArrowLeft className="icon-sm lg:icon-lg" />
        </button>
        <button className="p-3 border rounded-full border-neutral-300" onClick={() => swiper.current?.slideNext()}
          aria-label="next product"
        >
          <Icon.ArrowRight className="icon-sm lg:icon-lg" />
        </button>
      </div>
    </div>
  )
}