import { AddToCartButton } from "~/tracking/components"
import { trim } from "~/ui/utils/trim"
import type { UpsellProductFragment } from "storefrontapi.generated"
import type { CartMainProps } from "../Cart";
import { Image, Money } from '@shopify/hydrogen';
import { Link } from "~/ui/atoms";
import { useState } from "react";

export function UpsellCartItem({ product, layout }: { product: UpsellProductFragment, layout: CartMainProps['layout'] }) {
  const { id, title } = product;
  const lineItemUrl = `/products/${title}`;

  const [selectedVariant, setSelectedVariant] = useState(product.variants.nodes[0]);
  const image = selectedVariant.image;


  return (
    <li key={id} className="cart-line !py-6">
      {image && (
        <Image
          alt={title}
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}
      <div>
        <Link
          prefetch="intent"
          href={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <p className="uppercase text-xs-semibold">
            {product.title}
          </p>
        </Link>
        <div className="flex flex-row items-center justify-start mt-2 text-xs">
          <Money
            data={selectedVariant.price}
          />
          {selectedVariant.compareAtPrice && <Money withoutTrailingZeros
            className='ml-2 line-through text-neutral-600'
            data={selectedVariant.compareAtPrice}
          />}
        </div>
        <div className="flex-row-center gap-x-2 [&>*]:w-full mt-2">
          {/* select component with the different options */}
          {product.variants.nodes.length > 1 && <select
            className="w-full text-sm rounded-xs"
            onChange={(e) => {
              const variant = product.variants.nodes.find((variant) => variant.id === e.target.value);
              if (variant) setSelectedVariant(variant);
            }}
          >
            {product.variants.nodes.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
              </option>
            ))}
          </select>}
          <AddToCartButton
            className={trim(`w-full !py-2.5`)}
            showPaymentMethods={false}
            openCart={false}
            product={{
              ...product,
              name: product.title,
              brand: product.vendor,
              price: selectedVariant!.price.amount,
              productGid: product.id,
              variantGid: selectedVariant!.id
            }}
          >
            Ajouter
          </AddToCartButton>
        </div>
      </div>
    </li>
  )
}