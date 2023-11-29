import { useState } from "react";
import { Icon, Link } from "../atoms"

type Props = {
  products: Array<{
    link: string;
    title: string;
    descriptionHtml: string;
    imageSrc: string;
  }>
}
export const ProductsSpotlight = ({ products }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (products.length <= 0) return null;

  const product = products[selectedIndex];

  return (
    <div className="mb-32 lg:mb-48">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent -ml-[10vw]">spotlight</h3>
        <h3 className="text-2xl sm:text-4xl lg:text-7xl uppercase font-accent mt-3 lg:my-5 ml-[10vw]">produits</h3>
      </div>
      <div className="flex flex-col justify-start mt-16 sm:flex-row sm:items-center lg:mt-32">
        <img
          alt={product.title}
          src={product.imageSrc}
          className="object-cover rounded-r-full w-11/12 sm:w-1/2 bg-container-light max-sm:h-112 sm:aspect-[7/10] lg:aspect-[6/9] 2xl:aspect-[5/4] mr-16 2xl:mr-32"
        />
        <div className="self-center max-w-lg px-4 pr-6 text-left max-sm:mt-16">
          <div className="flex flex-row items-center justify-start text-neutral-600">
            <span>{selectedIndex + 1 < 10 ? `0${selectedIndex + 1}` : selectedIndex + 1}</span>
            <hr className="w-16 mx-4 border-neutral-600" />
            <span>{products.length < 10 ? `0${products.length}` : products.length}</span>
          </div>
          <Link href={product.link}>
            <h4 className="text-3xl uppercase lg:text-4xl font-accent my-9">
              {product.title}
            </h4>
          </Link>
          <p className="max-w-xs text-lg mb-9" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}>
          </p>
          <div className="flex flex-row items-center justify-start mt-8 gap-x-4 sm:gap-x-6">
            {products.map((p, i) => (
              <button onClick={() => setSelectedIndex(i)} key={p.imageSrc} className={i === selectedIndex ? "opacity-25" : ""}>
                <img src={p.imageSrc} className="object-cover w-16 rounded-full sm:w-20 aspect-square bg-container-light" alt={p.title} />
              </button>
            ))}
          </div>
          <div className="flex flex-row items-center justify-start mt-8 gap-x-4">
            <button className="p-3 border rounded-full border-neutral-300" onClick={() => setSelectedIndex((i) => i < 1 ? products.length - 1 : i - 1)}>
              <Icon.ArrowLeft className="icon-sm lg:icon-lg" />
            </button>
            <button className="p-3 border rounded-full border-neutral-300" onClick={() => setSelectedIndex((i) => i >= products.length - 1 ? 0 : i + 1)}>
              <Icon.ArrowRight className="icon-sm lg:icon-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}