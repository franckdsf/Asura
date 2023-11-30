import FreeItemImg from '../../../public/assets/ebook.webp';

export const FreeItem = () => {
  return (
    <li key={"free-cart-item"} className="cart-line border-b border-neutral-300 !py-6">
      <img
        alt="free item"
        src={FreeItemImg}
        width={100}
        height={135}
      />

      <div>
        <p className="uppercase text-xs-semibold">
          Le Guide Ultime Du Nail Art Maison
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