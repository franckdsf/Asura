import { Await, Link } from "@remix-run/react";
import { Money, type VariantOption, VariantSelector, type ShopifyAnalyticsProduct } from "@shopify/hydrogen";
import type { ProductFragment, ProductVariantsQuery } from "storefrontapi.generated";
import { trim } from "@ui/utils/trim";
import { Icon } from "@ui/atoms";
import { type ReactNode, useState, useRef, useMemo } from "react";
import { useBreakpoint, useClickOutside, useScrollDirection, useSticky } from "@ui/hooks";
import { AddToCartButton } from "~/tracking/components";
import { JudgeMeReviewStars } from ".";

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
  promotion,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
  promotion?: string;
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
            {promotion && <PromotionTag className="max-lg:hidden">{promotion}</PromotionTag>}
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}


const PromotionTag = ({ className, children }: DefaultProps & { children: ReactNode }) => (
  <div className={trim(`text-neutral-600 flex-row-center gap-x-1 ${className}`)}>
    <Icon.SketchLogo className="icon-md" />
    <span className="uppercase text-2xs lg:text-xs">{children}</span>
  </div>
)

type Props = {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
  promotion?: string;
  className?: string;
}
export const ProductStickyATC = ({ className = "", selectedVariant, variants, product, promotion }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrolled, scrollPourcent, direction } = useScrollDirection();
  const { isGreater } = useBreakpoint(768);

  const showExtra = useMemo(() => (!isGreater && scrolled && direction === "up") || isGreater || !scrolled, [scrolled, isGreater, direction]);

  return (
    <div ref={ref} className={trim(`${scrollPourcent === 100 ? "translate-y-full" : "bottom-0"} z-50 fixed w-full bg-container-light py-4 lg:py-6 border-t border-neutral-300 lg:px-10 ${className}`)}>
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
        {!isGreater && <div className={trim(`w-full px-4 mb-2 flex-row-between ${!showExtra && 'hidden'} lg:hidden lg:px-10`)}>
          {selectedVariant?.compareAtPrice && promotion && <PromotionTag>{promotion}</PromotionTag>}
          <JudgeMeReviewStars productId={product.id} />
        </div>}
        <div className="relative h-full mr-16 max-lg:hidden">
          <div className="absolute h-16 mr-16 -top-6 w-1px bg-neutral-300" />
        </div>
        <div className="flex flex-row items-center justify-between w-full max-lg:px-4">
          <ProductPrice selectedVariant={selectedVariant} promotion={promotion} />
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
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
      </div>
    </div>
  )
}