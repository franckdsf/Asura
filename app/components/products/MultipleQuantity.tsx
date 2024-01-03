import { Money } from "@shopify/hydrogen";
import { type MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import { useMemo, useState } from "react";
import type { ProductFragment } from "storefrontapi.generated";
import { AddToCartButton } from "~/tracking/components";
import { Icon } from "~/ui/atoms";
import { trim } from "~/ui/utils/trim";

type ComponentProps = {
  name: string;
  quantity: number;
  discountPercentage: number;
  compareAtPricePerAmount?: MoneyV2 | null;
  pricePerAmount: MoneyV2;
  selected?: boolean;
  onClick?: () => void;
}
const Component = ({ selected, pricePerAmount, compareAtPricePerAmount, discountPercentage, quantity, name, onClick }: ComponentProps) => {
  const compareAtPrice = compareAtPricePerAmount ? Number(compareAtPricePerAmount?.amount) * quantity : null;
  const price = Number(pricePerAmount.amount) * quantity;

  const finalPrice = price * (1 - (discountPercentage / 100));
  const finalDiscountPercentage = compareAtPrice ? Math.round((1 - (finalPrice / compareAtPrice)) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={trim(`flex flex-row items-center justify-between w-full p-4 border rounded-sm  border-neutral-300 gap-x-4
      ${selected && 'bg-container-light'}`)}
    >
      <div className="flex flex-row items-center justify-start text-xs sm:text-sm gap-x-2 sm:gap-x-4">
        {selected ? <Icon.CheckCircle className="icon-md sm:icon-lg" weight="fill" /> : <div className="p-2 border rounded-full border-neutral-300" />}
        <div className="text-left">
          <p className="font-medium">{quantity} {name}</p>
          <div className="mt-0.5">
            <span className="mr-2 ">Acheter {quantity}</span>
            {discountPercentage > 0 && <span className="inline-block text-2xs sm:text-xs uppercase px-2 p-0.5 rounded-full bg-primary-500 text-primary-on">
              Obtenez {finalDiscountPercentage}% de réduction
            </span>}
          </div>
        </div>
      </div>
      <div className="text-sm sm:text-md">
        {finalDiscountPercentage > 0 && <Money data={{ amount: `${compareAtPrice}`, currencyCode: pricePerAmount.currencyCode }}
          className="line-through mb-0.5 text-neutral-900/60" />}
        <Money data={{ amount: `${finalPrice}`, currencyCode: pricePerAmount.currencyCode }} className="font-medium" />
      </div>
    </button>
  )
}

type Props = {
  className?: string;
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  discounts: Array<{
    discountPercentage: number;
    minQuantity: number;
  }>
}

export const MultipleQuantity = ({ product, selectedVariant, discounts, className }: Props) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const sortedDiscounts = useMemo(() => {
    return [{ discountPercentage: 0, minQuantity: 1 }, ...discounts].sort((a, b) => a.discountPercentage - b.discountPercentage)
  }, [discounts]);

  const maxDiscountPercentage = useMemo(() => {
    return sortedDiscounts[sortedDiscounts.length - 1].discountPercentage;
  }, [sortedDiscounts]);

  return (
    <div>
      <div className={trim(`flex flex-row items-center justify-center gap-x-2 ${className}`)}>
        <hr className="flex-grow h-1px bg-neutral-900" />
        <p>Économisez jusqu&apos;a {maxDiscountPercentage}% de plus</p>
        <hr className="flex-grow h-1px bg-neutral-900" />
      </div>
      <ul className="w-full mt-6 space-y-4">
        {sortedDiscounts.map(({ discountPercentage, minQuantity }) => (
          <li key={`${discountPercentage}-${minQuantity}`}>
            <Component
              selected={selectedQuantity === minQuantity}
              onClick={() => setSelectedQuantity(minQuantity)}
              quantity={minQuantity}
              name={product.title}
              compareAtPricePerAmount={selectedVariant?.compareAtPrice}
              pricePerAmount={selectedVariant!.price}
              discountPercentage={discountPercentage}
            />
          </li>
        ))}
      </ul>
      <AddToCartButton
        quantity={selectedQuantity}
        className={trim(`w-full lg:max-w-xl !py-3 mt-4 !rounded-xs`)}
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        showPaymentMethods={false}
        openCart={true}
        product={{
          ...product,
          name: product.title,
          brand: product.vendor,
          price: selectedVariant!.price.amount,
          productGid: product.id,
          variantGid: selectedVariant!.id
        }}
      >
        {selectedVariant?.availableForSale ? 'Ajouter au panier' : 'Rupture de stock'}
      </AddToCartButton>
    </div>
  )
}