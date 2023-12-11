import FreeItemImg from '../../../public/assets/ebook.webp';

type Props = {
  name: string;
  imgSrc: string;
}
export const FreeItem = ({ name, imgSrc }: Props) => {
  return (
    <li key={"free-cart-item"} className="cart-line border-b border-neutral-300 !py-6">
      <img
        alt="free item"
        src={imgSrc}
        width={100}
        height={135}
      />

      <div>
        <p className="uppercase text-xs-semibold">         {name}
        </p>
        <small className="text-xs uppercase">
          AUJOURD&apos;HUI SEULEMENT !
        </small>
        <div className="mt-2">
          <p className="text-xs uppercase">
            <span className="line-through text-neutral-600">19,99€</span>
            <span className="ml-2">Gratuit</span>
          </p>
        </div>
      </div>
    </li>
  )
}

FreeItem.Nail = () => (
  <FreeItem name={"Le Guide Ultime Du Nail Art Maison"} imgSrc={FreeItemImg} />
)

FreeItem.Hair = () => (
  <FreeItem name={"Le Guide Cheveux Maison"} imgSrc={FreeItemImg} />
)

type FreeItemsProps = {
  cart: Array<string>;
  filters: [{ type: 'nails', products: Array<string> }, { type: 'hair', products: Array<string> }];
}
export const FreeItems = ({ cart, filters }: FreeItemsProps) => {
  return (
    <>
      {cart.some((e) => filters[0].products.includes(e)) && <FreeItem.Nail />}
      {cart.some((e) => filters[1].products.includes(e)) && <FreeItem.Hair />}
    </>
  )
}