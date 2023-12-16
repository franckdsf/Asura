import { Await } from "@remix-run/react";
import { Money } from "@shopify/hydrogen";
import type { ProductFragment, ProductVariantsQuery } from "storefrontapi.generated";
import { trim } from "@ui/utils/trim";
import { Icon } from "@ui/atoms";
import { type ReactNode, useRef, type ComponentProps } from "react";
import { useBreakpoint, useScrollDirection } from "@ui/hooks";
import { AddToCartButton } from "~/tracking/components";
import { JudgeMeReviewStars, VariantSelector } from ".";


type DefaultProps = { className?: string }

type ProductOptions = { shrink?: boolean } & ComponentProps<typeof VariantSelector>;
export function ProductOptions({ defaultOpen = false, shrink = false, options = [], handle, variants }: ProductOptions) {

  if (options.length < 2 && (options[0].values?.length || 0) < 2) return null;

  return (
    <div className="relative flex flex-col items-center justify-start md:flex-row" >
      {!shrink && <h5 className="flex-shrink-0 ml-4 mr-4 uppercase text-2xs text-neutral-600 max-md:mb-3 max-md:hidden">cliquez pour changer de {options[0].name}
        <Icon.ArrowDown className="inline ml-2 icon-sm md:hidden" />
      </h5>}
      <VariantSelector options={options} handle={handle} variants={variants} defaultOpen={defaultOpen}
        className="w-full lg:w-auto"
        popUp={{ scheme: 'light', className: `bottom-16 lg:bottom-20` }}
      />
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

  // const showExtra = useMemo(() => (!isGreater && scrolled && direction === "up") || isGreater || !scrolled, [scrolled, isGreater, direction]);
  const isMobile = !isGreater;
  const showExtra = true;

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
                <div className={trim(`w-full mb-3 lg:mb-0 py-1px px-4`)}>
                  <ProductOptions
                    shrink={!showExtra && isMobile}
                    handle={product.handle}
                    options={product.options}
                    variants={data.product?.variants.nodes || []}
                  />
                </div>)
          )}
        </Await>
        {isMobile && <div className={trim(`w-full px-4 mb-2 flex-row-between ${!showExtra && 'hidden'} lg:hidden lg:px-10`)}>
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