type Props = {
  name: string;
  compareAtPrice: number;
  imgSrc: string;
}
export const FreeItem = ({ name, compareAtPrice, imgSrc }: Props) => {
  return (
    <li key={"free-cart-item"} className="cart-line border-b border-neutral-300 !py-6">
      <img
        alt="free item"
        src={imgSrc}
        width={100}
        height={135}
      />

      <div>
        <p className="uppercase text-xs-semibold">
          {name}
        </p>
        <small className="text-xs uppercase">
          AUJOURD&apos;HUI SEULEMENT !
        </small>
        <div className="mt-2">
          <p className="text-xs uppercase">
            <span className="line-through text-neutral-600">{compareAtPrice}€</span>
            <span className="ml-2">Offert</span>
          </p>
        </div>
      </div>
    </li>
  )
}