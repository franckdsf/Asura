import { Await, type FetcherWithComponents, Link } from "@remix-run/react";
import { CartForm, Money, type VariantOption, VariantSelector } from "@shopify/hydrogen";
import type { ProductFragment, ProductVariantsQuery } from "storefrontapi.generated";
import { trim } from "@ui/utils/trim";
import { Icon } from "@ui/atoms";
import { useEffect, useState } from "react";
import { type CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { useBreakpoint, useClickOutside, useScrollDirection } from "@ui/hooks";

type DefaultProps = { className?: string }

export function ProductOptions({ option, defaultOpen = false }: { option: VariantOption, defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useClickOutside(() => open && setOpen(false));

  const selectedValue = option.values.find((o) => o.isActive);

  if (option.values.length < 2) return null;

  return (
    <div className="relative flex flex-row items-center justify-start" key={option.name}>
      <h5 className="flex-shrink-0 mr-4 uppercase max-md:hidden text-2xs text-neutral-600">cliquez pour changer de {option.name}</h5>
      <button className="w-full lg:w-auto flex-row-between uppercase text-xs rounded-full px-4 py-2 md:py-2.5 text-neutral-900 border border-neutral-600
      gap-x-4"
        onClick={() => setOpen((o) => !o)}
      >
        {selectedValue?.value}
        {open ? <Icon.CaretDown className="icon-sm lg:icon-md" /> : <Icon.CaretUp className="icon-sm lg:icon-md" />}
      </button>
      {open && <div ref={ref} className={trim(`border border-neutral-300 absolute w-full bottom-16 lg:max-w-xl lg:bottom-20 bg-container-light flex flex-wrap p-4 gap-2`)}>
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          return (
            <Link
              className={trim(`uppercase text-xs rounded-full px-4 py-2 md:py-2.5
               ${isActive ? 'text-neutral-50 bg-neutral-900' : 'text-neutral-600 border border-neutral-600'}`)}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>}
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="text-md-medium lg:text-lg-semibold">
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s className="mr-1 lg:font-regular">
              <Money data={selectedVariant.compareAtPrice} />
            </s>
            <PromotionTag className="max-lg:hidden" />
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}


const PromotionTag = ({ className }: DefaultProps) => (
  <div className={trim(`text-neutral-600 flex-row-center gap-x-1 ${className}`)}>
    <Icon.SketchLogo className="icon-md" />
    <span className="uppercase text-2xs lg:text-xs">BLACK FRIDAY</span>
  </div>
)

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  className = "",
  onClick,
}: {
  className?: string;
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={trim(`text-xs md:text-md px-6 md:px-8 py-3 rounded-full bg-neutral-900 text-neutral-50 uppercase ${className}`)}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

type Props = {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
  className?: string;
}
export const ProductStickyATC = ({ className = "", selectedVariant, variants, product }: Props) => {
  const { scrolled, direction } = useScrollDirection();
  const { isGreater } = useBreakpoint(768);

  const showExtra = (!isGreater && scrolled && direction === "up") || isGreater || !scrolled;

  return (
    <div className={trim(`z-50 sticky bottom-0 w-full bg-container-light py-4 lg:py-6 border-t border-neutral-300 lg:px-10 ${className}`)}>
      <div className="flex flex-col items-stretch justify-between lg:flex-row">
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            (data.product?.variants.nodes.length || 1) <= 1 ?
              <div className="flex flex-col items-start justify-center w-full max-lg:hidden">
                <h1 className="uppercase text-md-semibold">{product.title}</h1>
              </div>
              : (
                showExtra &&
                <div className={trim(`w-full mb-4 lg:mb-0 py-1px px-4`)}>
                  <VariantSelector
                    handle={product.handle}
                    options={product.options}
                    variants={data.product?.variants.nodes || []}
                  >
                    {({ option }) => <ProductOptions key={option.name} option={option} />}
                  </VariantSelector>
                </div>)
          )}
        </Await>
        {showExtra && <div className="w-full px-4 mb-2 flex-row-between lg:hidden lg:px-10">
          <PromotionTag />
          <div className="flex-row-center">
            {Array(5).fill(0).map((_, i) => <Icon.Star className="icon-xs text-[#FBC400]" weight="fill" key={i} />)}
          </div>
        </div>}
        <div className="relative h-full mr-16 max-lg:hidden">
          <div className="absolute h-16 mr-16 -top-6 w-1px bg-neutral-300" />
        </div>
        <div className="flex flex-row items-center justify-between w-full max-lg:px-4">
          <ProductPrice selectedVariant={selectedVariant} />
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              window.location.href = window.location.href + '#cart-aside';
            }}
            lines={
              selectedVariant
                ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Ajouter au panier' : 'Rupture de stock'}
          </AddToCartButton>
        </div>
      </div>
    </div>
  )
}